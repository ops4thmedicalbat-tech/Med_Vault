import { ref, onValue, set, onDisconnect, serverTimestamp } from "firebase/database";
import { rtdb, auth } from "./firebase";

// Ensure RTDB is available before executing any presence functions
const isRTDBEnabled = () => {
  if (!rtdb) {
    console.warn("Realtime Database is not configured. Presence features are disabled.");
    return false;
  }
  return true;
};

export const setupPresence = () => {
  if (!isRTDBEnabled()) return;

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const userStatusDatabaseRef = ref(rtdb!, `/status/${uid}`);
  const connectedRef = ref(rtdb!, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    const isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: "online",
      last_changed: serverTimestamp(),
    };

    // When I disconnect, update the last time I was seen online
    onDisconnect(userStatusDatabaseRef)
      .set(isOfflineForDatabase)
      .then(() => {
        // When I'm online, update the database to show I'm online
        set(userStatusDatabaseRef, isOnlineForDatabase);
      });
  });
};

export const setUserOffline = () => {
  if (!isRTDBEnabled()) return;

  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const userStatusDatabaseRef = ref(rtdb!, `/status/${uid}`);

  const isOfflineForDatabase = {
    state: "offline",
    last_changed: serverTimestamp(),
  };

  set(userStatusDatabaseRef, isOfflineForDatabase);
};

export const subscribeToOnlineUsers = (callback: (onlineUsers: Record<string, any>) => void) => {
  if (!isRTDBEnabled()) return () => {};

  const statusRef = ref(rtdb!, "/status");
  
  const unsubscribe = onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Filter for only online users if needed, or pass the whole object
      callback(data);
    } else {
      callback({});
    }
  });

  return unsubscribe; // Return the unsubscribe function
};

// System Alerts Broadcasting (Optional RTDB feature)
export const broadcastSystemAlert = (message: string) => {
    if(!isRTDBEnabled()) return;

    const alertsRef = ref(rtdb!, "/alerts");
    set(alertsRef, {
        message,
        timestamp: serverTimestamp()
    });
};

export const subscribeToSystemAlerts = (callback: (alert: any) => void) => {
    if(!isRTDBEnabled()) return () => {};

    const alertsRef = ref(rtdb!, "/alerts");
    const unsubscribe = onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();
        if(data) callback(data);
    });

    return unsubscribe;
}
