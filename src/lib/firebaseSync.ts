import { saveUser, getUser, getAllUsers, type AppUser } from "./firebaseFirestore";
import { setupPresence, setUserOffline } from "./firebaseRTDB";

// Synchronize a local user object with Firestore
export const syncUserToFirestore = async (user: AppUser): Promise<void> => {
  try {
    await saveUser(user);
    console.log("User synchronized to Firestore:", user.id);
  } catch (error) {
    console.error("Failed to sync user to Firestore:", error);
    throw error;
  }
};

// Load a user from Firestore
export const loadUserFromFirestore = async (userId: string): Promise<AppUser | null> => {
  try {
    const user = await getUser(userId);
    if (user) {
      console.log("User loaded from Firestore:", user.id);
    } else {
      console.log("User not found in Firestore:", userId);
    }
    return user;
  } catch (error) {
    console.error("Failed to load user from Firestore:", error);
    throw error;
  }
};

// Initialize app data from Firestore on login
export const initializeDataFromFirestore = async (userId: string): Promise<AppUser | null> => {
  try {
    const user = await loadUserFromFirestore(userId);
    if (user) {
      // Setup RTDB presence once user data is confirmed
      setupPresence();
    }
    return user;
  } catch (error) {
    console.error("Failed to initialize data from Firestore:", error);
    return null;
  }
};

// Cleanup when logging out
export const cleanupFirebaseOnLogout = () => {
  setUserOffline();
};
