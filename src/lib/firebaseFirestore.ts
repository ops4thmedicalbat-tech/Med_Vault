import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { type AppUser } from "./firebaseAuth";
import type { NotificationItem, DailyMission, LeaderboardEntry } from "../types";
export type { AppUser };

// --- Users ---
export const saveUser = async (user: AppUser) => {
  await setDoc(doc(db, "users", user.id), user);
};

export const getUser = async (id: string): Promise<AppUser | null> => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as AppUser) : null;
};

export const getAllUsers = async (): Promise<AppUser[]> => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as AppUser);
};

export const updateUser = async (id: string, data: Partial<AppUser>) => {
  await updateDoc(doc(db, "users", id), data);
};

// --- QuizResults ---
export interface QuizResult {
  id: string;
  userId: string;
  userName: string;
  militaryId: string;
  userRank: string;
  courseId: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

export const saveQuizResult = async (result: Omit<QuizResult, "id">) => {
  const newRef = doc(collection(db, "quizResults"));
  const newResult: QuizResult = { ...result, id: newRef.id };
  await setDoc(newRef, newResult);
  return newResult;
};

export const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
  const q = query(collection(db, "quizResults"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as QuizResult);
};

// --- Certificates ---
export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  militaryId: string;
  userRank: string;
  unit: string;
  courseTitle: string;
  scorePercentage: number;
  issueDate: string;
  qrCodeData: string;
  commanderName: string;
  commanderRank: string;
}

export const saveCertificate = async (cert: Omit<Certificate, "id">) => {
  const newRef = doc(collection(db, "certificates"));
  const newCert: Certificate = { ...cert, id: newRef.id };
  await setDoc(newRef, newCert);
  return newCert;
};

export const getUserCertificates = async (userId: string): Promise<Certificate[]> => {
  const q = query(collection(db, "certificates"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Certificate);
};

// --- AuditLogs ---
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  militaryId: string;
  userRank: string;
  unit: string;
  module: string;
  actionType: string;
  details: string;
  timestamp: string;
}

export const addAuditLog = async (log: Omit<AuditLog, "id" | "timestamp">) => {
  const newRef = doc(collection(db, "auditLogs"));
  const newLog: AuditLog = {
    ...log,
    id: newRef.id,
    timestamp: new Date().toISOString(),
  };
  await setDoc(newRef, newLog);
};

// --- ChatMessages ---
// โครงสร้างใหม่: ทุกข้อความผูกกับ userUid (uid ของกำลังพลเจ้าของบทสนทนา)
// - ผู้ใช้ทั่วไป: เห็นเฉพาะข้อความที่ userUid == uid ของตัวเอง
// - แอดมิน: เห็นทุกบทสนทนา และตอบกลับรายบุคคลได้
export interface ChatMessage {
  id: string;
  userUid: string;
  senderUid: string;
  senderId: string;
  senderName: string;
  senderRank: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isFromAdmin: boolean;
}

export const sendChatMessage = async (msg: Omit<ChatMessage, "id" | "timestamp">) => {
  const newRef = doc(collection(db, "chatMessages"));
  const newMsg: ChatMessage = {
    ...msg,
    id: newRef.id,
    timestamp: new Date().toISOString(),
  };
  await setDoc(newRef, newMsg);
};

export const markChatMessageRead = async (messageId: string) => {
  await updateDoc(doc(db, "chatMessages", messageId), { isRead: true });
};

const sortByTimestamp = (messages: ChatMessage[]) =>
  [...messages].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

/**
 * subscribe แชท
 * - ใช้ where เดียว (ไม่ใช้ orderBy คู่กัน) จึงไม่ต้องสร้าง composite index
 *   และสอดคล้องกับ Firestore Rules
 */
export const subscribeToChat = (
  params: { uid: string; isAdmin: boolean },
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
) => {
  const q = params.isAdmin
    ? query(collection(db, "chatMessages"))
    : query(collection(db, "chatMessages"), where("userUid", "==", params.uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs
        .map((d) => d.data() as ChatMessage)
        .filter((m) => typeof m.userUid === "string");
      callback(sortByTimestamp(messages));
    },
    (error) => {
      console.error("[CHAT] Subscription failed:", error);
      onError?.(error);
    }
  );
};

// --- Realtime subscriptions (แทนข้อมูลใน localStorage) ---

export const subscribeToUsers = (
  callback: (users: AppUser[]) => void,
  onError?: (error: Error) => void
) =>
  onSnapshot(
    collection(db, "users"),
    (snap) => callback(snap.docs.map((d) => ({ ...(d.data() as AppUser), id: d.id }))),
    (error) => {
      console.error("[USERS] Subscription failed:", error);
      onError?.(error);
    }
  );

export const subscribeToQuizResults = (
  params: { uid: string; isAdmin: boolean },
  callback: (results: QuizResult[]) => void
) => {
  const q = params.isAdmin
    ? query(collection(db, "quizResults"))
    : query(collection(db, "quizResults"), where("userId", "==", params.uid));

  return onSnapshot(
    q,
    (snap) => {
      const results = snap.docs.map((d) => d.data() as QuizResult);
      results.sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));
      callback(results);
    },
    (error) => console.error("[QUIZ] Subscription failed:", error)
  );
};

export const subscribeToCertificates = (
  params: { uid: string; isAdmin: boolean },
  callback: (certs: Certificate[]) => void
) => {
  const q = params.isAdmin
    ? query(collection(db, "certificates"))
    : query(collection(db, "certificates"), where("userId", "==", params.uid));

  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => d.data() as Certificate)),
    (error) => console.error("[CERT] Subscription failed:", error)
  );
};

export const subscribeToAuditLogs = (
  callback: (logs: AuditLog[]) => void,
  maxItems = 500
) =>
  onSnapshot(
    query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(maxItems)),
    (snap) =>
      callback(
        snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            ...data,
            id: d.id,
            // รองรับ log ที่บันทึกจากเซิร์ฟเวอร์
            actionType: data.actionType || data.action || "SYSTEM",
            details: data.details || data.description || "",
            timestamp: typeof data.timestamp === "string" ? data.timestamp : "",
          } as AuditLog;
        })
      ),
    (error) => console.error("[AUDIT] Subscription failed:", error)
  );

// ติดตามข้อมูลผู้ใช้ปัจจุบันแบบ realtime (เช่น XP หลังทำข้อสอบ, การถูกยกเลิกอนุมัติ)
export const subscribeToUserDoc = (
  uid: string,
  callback: (user: AppUser | null) => void
) =>
  onSnapshot(
    doc(db, "users", uid),
    (snap) => callback(snap.exists() ? ({ ...(snap.data() as AppUser), id: snap.id }) : null),
    (error) => console.error("[USER] Subscription failed:", error)
  );

// --- Notifications (Firestore) ---
export const saveNotification = async (notif: NotificationItem) => {
  const notifRef = doc(db, "notifications", notif.id);
  await setDoc(notifRef, notif);
};

export const deleteNotification = async (notifId: string) => {
  await deleteDoc(doc(db, "notifications", notifId));
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notifs: NotificationItem[]) => void
) => {
  const q = query(collection(db, "notifications"), where("userId", "in", [userId, "ALL"]));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => d.data() as NotificationItem);
      items.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
      callback(items);
    },
    (error) => console.error("[NOTIF] Subscription failed:", error)
  );
};

// --- Daily Missions (Firestore) ---
export const saveDailyMission = async (mission: DailyMission & { userId: string }) => {
  const missionRef = doc(db, "dailyMissions", `${mission.userId}_${mission.id}`);
  await setDoc(missionRef, mission);
};

export const subscribeToDailyMissions = (
  userId: string,
  callback: (missions: DailyMission[]) => void
) => {
  const q = query(collection(db, "dailyMissions"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => d.data() as DailyMission);
      callback(items);
    },
    (error) => console.error("[MISSIONS] Subscription failed:", error)
  );
};

// --- Leaderboard (Firestore) ---
export const saveLeaderboardEntry = async (entry: LeaderboardEntry & { id: string }) => {
  const ref = doc(db, "leaderboard", entry.id);
  await setDoc(ref, { ...entry, userId: entry.id });
};

export const subscribeToLeaderboard = (
  callback: (entries: LeaderboardEntry[]) => void
) => {
  const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => d.data() as LeaderboardEntry & { role?: string })
        .filter((entry) => {
          // ไม่เอาคะแนนและชื่อของแอดมินขึ้นในกระดานคะแนนหรือตารางลำดับใดๆ
          if (entry.role === "admin") return false;
          if (entry.militaryId === "1583800101" || entry.militaryId === "1583800106") return false;
          const name = String(entry.userName || "");
          if (name.includes("สมชาย") && name.includes("ใจภักดี")) return false;
          if (entry.userRank === "พันเอก" || name.includes("พ.อ.") || name.includes("พันเอก")) return false;
          return true;
        })
        .map((d, index) => ({
          ...d,
          rankPosition: index + 1,
        }));
      callback(items);
    },
    (error) => console.error("[LEADERBOARD] Subscription failed:", error)
  );
};

export const deleteUserDoc = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

