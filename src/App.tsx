import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  User,
  Course,
  Lesson,
  QuizQuestion,
  QuizResult,
  Certificate,
  ChatMessage,
  NotificationItem,
  DocumentFile,
  DailyMission,
  LeaderboardEntry,
  AuditLog,
  AuditActionType,
  AuditModule,
} from "./types";

import {
  onAuthChanged,
  signOutUser,
} from "./lib/firebaseAuth";

import {
  initializeDataFromFirestore,
  cleanupFirebaseOnLogout,
} from "./lib/firebaseSync";

import {
  subscribeToChat,
  subscribeToUsers,
  subscribeToUserDoc,
  subscribeToQuizResults,
  subscribeToCertificates,
  subscribeToAuditLogs,
  subscribeToNotifications,
  subscribeToDailyMissions,
  subscribeToLeaderboard,
  saveQuizResult,
  saveCertificate,
  saveNotification,
  deleteNotification,
  saveDailyMission,
  saveLeaderboardEntry,
  deleteUserDoc,
  sendChatMessage,
  markChatMessageRead,
  addAuditLog,
  updateUser,
  saveUser,
} from "./lib/firebaseFirestore";

import { apiRequest } from "./lib/api";
import { auth } from "./lib/firebase";

import {
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_NOTIFICATIONS,
  UNIT_SCHOOL_SCHEDULE,
  INITIAL_DOCUMENTS,
  INITIAL_DAILY_MISSIONS,
} from "./data/initialData";

// Components
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

// Screens ที่ใช้บ่อย / หน้าแรก โหลดทันที
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

import {
  Bell,
  CheckCircle2,
  X,
} from "lucide-react";

/* =========================================================
   LAZY SCREENS (แบ่งไฟล์ JS ให้เล็กลง โหลดเมื่อเปิดใช้งานเท่านั้น)
========================================================= */

const lazyNamed = <T extends Record<string, any>, K extends keyof T>(
  loader: () => Promise<T>,
  name: K
) =>
  lazy(() =>
    loader().then((module) => ({
      default: module[name] as React.ComponentType<any>,
    }))
  );

const UnitSchoolScreen = lazyNamed(() => import("./screens/UnitSchoolScreen"), "UnitSchoolScreen");
const CoursesScreen = lazyNamed(() => import("./screens/CoursesScreen"), "CoursesScreen");
const QuizScreen = lazyNamed(() => import("./screens/QuizScreen"), "QuizScreen");
const GamificationScreen = lazyNamed(() => import("./screens/GamificationScreen"), "GamificationScreen");
const CertificateScreen = lazyNamed(() => import("./screens/CertificateScreen"), "CertificateScreen");
const FileHubScreen = lazyNamed(() => import("./screens/FileHubScreen"), "FileHubScreen");
const AiAssistantScreen = lazyNamed(() => import("./screens/AiAssistantScreen"), "AiAssistantScreen");
const AiSearchScreen = lazyNamed(() => import("./screens/AiSearchScreen"), "AiSearchScreen");
const GmailScreen = lazyNamed(() => import("./screens/GmailScreen"), "GmailScreen");
const DriveScreen = lazyNamed(() => import("./screens/DriveScreen"), "DriveScreen");
const SheetsScreen = lazyNamed(() => import("./screens/SheetsScreen"), "SheetsScreen");
const AdminChatScreen = lazyNamed(() => import("./screens/AdminChatScreen"), "AdminChatScreen");
const AdminControlScreen = lazyNamed(() => import("./screens/AdminControlScreen"), "AdminControlScreen");

/* =========================================================
   FIREBASE DATA SYNC
   (ทุกข้อมูลจัดเก็บและซิงค์ผ่าน Cloud Firestore เท่านั้น ไม่ใช้ localStorage)
========================================================= */

// คีย์เดิมที่เคยเก็บข้อมูลสำคัญ (ผู้ใช้/รหัสผ่าน/ผลสอบ) ใน localStorage — ลบทิ้งเมื่อเปิดแอป
const LEGACY_STORAGE_KEYS = [
  "medvault_current_user",
  "medvault_users",
  "medvault_quiz_results",
  "medvault_certificates",
  "medvault_chat_messages",
  "medvault_audit_logs",
];

try {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
} catch {
  // localStorage ใช้งานไม่ได้ (เช่น private mode) — ไม่เป็นไร
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const nowStamp = () =>
  new Date().toISOString().replace("T", " ").substring(0, 16);

/* =========================================================
   APP
========================================================= */

export const App: React.FC = () => {
  /* =======================================================
     1. GLOBAL STATE
  ======================================================= */

  // ผู้ใช้ปัจจุบันมาจาก Firebase Auth + Firestore เท่านั้น (ไม่อ่านจาก localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // ข้อมูลจาก Firestore
  const [users, setUsers] = useState<User[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [lessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [quizQuestions] = useState<QuizQuestion[]>(INITIAL_QUIZ_QUESTIONS);
  const [documents] = useState<DocumentFile[]>(INITIAL_DOCUMENTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(INITIAL_DAILY_MISSIONS);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // ให้บันทึก LOGIN เฉพาะเมื่อผู้ใช้กดเข้าสู่ระบบจริง (ไม่ใช่ทุกครั้งที่รีเฟรชหน้า)
  const pendingLoginLogRef = useRef(false);
  const currentUserRef = useRef<User | null>(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // กำหนดแท็บที่อนุญาตเฉพาะตำแหน่งแอดมินเท่านั้นถึงจะมองเห็นและเข้าถึงได้
  const ADMIN_ONLY_TABS = ["admin", "ai-assistant", "ai-search", "gmail", "drive", "sheets"];

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin" && ADMIN_ONLY_TABS.includes(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, currentUser]);

  // ตารางอันดับเกียรติยศ: กรองแอดมินออก 100% และดึงคะแนนของกำลังพลทั้งหมด
  const activeLeaderboard: LeaderboardEntry[] = useMemo(() => {
    const isSpecialAdmin = (mid?: string, role?: string, name?: string) => {
      if (role === "admin") return true;
      if (mid === "1583800101" || mid === "1583800106") return true;
      if (name && (name.includes("สมชาย ใจภักดี") || name.includes("สุวเมธา สิงหวีระสมร") || name.includes("พันเอก") || name.includes("พ.อ."))) return true;
      return false;
    };

    if (leaderboard.length > 0) {
      return leaderboard
        .filter((entry) => !isSpecialAdmin(entry.militaryId, (entry as any).role, entry.userName))
        .map((entry, index) => ({
          ...entry,
          rankPosition: index + 1,
        }));
    }

    // กรณีคอลเลกชัน leaderboard ยังไม่มีข้อมูล ให้คำนวณจากคะแนน XP ของกำลังพลใน users
    return users
      .filter((u) => !isSpecialAdmin(u.militaryId, u.role, `${u.rank} ${u.firstName} ${u.lastName}`))
      .map((u) => ({
        id: u.id,
        rankPosition: 0,
        userName: `${u.rank} ${u.firstName} ${u.lastName}`.trim(),
        userRank: u.rank as any,
        militaryId: u.militaryId,
        unitCompany: u.unit || "บก.พัน",
        xp: Number(u.xp) || 0,
        level: Number(u.level) || 1,
        badgesCount: 0,
      }))
      .sort((a, b) => b.xp - a.xp)
      .map((entry, idx) => ({ ...entry, rankPosition: idx + 1 }));
  }, [leaderboard, users]);

  /* =======================================================
     2. AUDIT LOG
  ======================================================= */

  const logActivity = async (
    actionType: AuditActionType,
    module: AuditModule,
    details: string,
    auditUser?: User | null
  ): Promise<void> => {
    const userForLog = auditUser ?? currentUserRef.current;

    if (!userForLog) {
      console.warn("[AUDIT] No current user. Log skipped.");
      return;
    }

    const userName = [userForLog.rank, userForLog.firstName, userForLog.lastName]
      .filter(Boolean)
      .join(" ");

    try {
      await addAuditLog({
        userId: userForLog.id,
        userRank: userForLog.rank,
        userName,
        militaryId: userForLog.militaryId,
        unit: userForLog.unit,
        actionType,
        module,
        details,
      });
    } catch (error) {
      console.error("[AUDIT] Failed to send to Firestore:", error);
    }
  };

  /* =======================================================
     3. FIREBASE AUTH + REALTIME SUBSCRIPTIONS
  ======================================================= */

  useEffect(() => {
    let isMounted = true;
    let unsubscribers: Array<() => void> = [];

    const clearSubscriptions = () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribers = [];
    };

    const resetUserData = () => {
      setCurrentUser(null);
      setUsers([]);
      setQuizResults([]);
      setCertificates([]);
      setChatMessages([]);
      setAuditLogs([]);
      setLeaderboard([]);
      setActiveTab("dashboard");
      setSelectedCourse(null);
      setShowNotificationsModal(false);
    };

    const unsubscribeAuth = onAuthChanged(async (firebaseUser) => {
      if (!isMounted) return;

      clearSubscriptions();

      try {
        if (!firebaseUser) {
          resetUserData();
          return;
        }

        // ลองโหลดข้อมูลผู้ใช้ซ้ำหลายครั้ง
        // (กรณีลงทะเบียนใหม่ เอกสาร users อาจยังบันทึกไม่เสร็จ)
        let appUser = null;
        for (let attempt = 0; attempt < 6; attempt++) {
          appUser = await initializeDataFromFirestore(firebaseUser.uid);
          if (appUser || !isMounted) break;
          await sleep(700);
          if (auth.currentUser?.uid !== firebaseUser.uid) return;
        }

        if (!isMounted) return;

        if (!appUser) {
          const isPrimaryAdmin =
            firebaseUser.uid === "KHkABkJ7mLOWMqHvxwP5VDnmqdZ2" ||
            firebaseUser.email === "1583800101@medvault.mil.th" ||
            firebaseUser.email === "1583800106@medvault.mil.th" ||
            firebaseUser.email?.toLowerCase().startsWith("admin@");

          if (isPrimaryAdmin) {
            const adminUser: User = {
              id: firebaseUser.uid,
              militaryId: "1583800101",
              rank: "พันเอก",
              firstName: "สมชาย",
              lastName: "ใจภักดี",
              unit: "กองบังคับการกองพันเสนารักษ์ที่ 4",
              position: "ผู้บังคับกองพัน / ผู้ดูแลระบบ",
              phone: "0812345678",
              role: "admin",
              isApproved: true,
              xp: 2500,
              level: 5,
              registeredAt: new Date().toISOString(),
              recoveryEmail: firebaseUser.email || "1583800101@medvault.mil.th",
            };
            try {
              await saveUser(adminUser as any);
            } catch (err) {
              console.warn("[MedVault] Could not save admin profile to Firestore:", err);
            }
            appUser = adminUser;
          } else {
            pendingLoginLogRef.current = false;
            setAuthNotice(
              "ไม่พบข้อมูลกำลังพลของบัญชีนี้ในระบบ กรุณาลงทะเบียนก่อนเข้าใช้งาน หรือติดต่อ ฝยก.ฯ"
            );
            resetUserData();
            await signOutUser();
            return;
          }
        }

        const user = { ...appUser, id: firebaseUser.uid } as User;
        const isAdmin = user.role === "admin";

        if (!user.isApproved && !isAdmin) {
          pendingLoginLogRef.current = false;
          setAuthNotice(
            "บัญชีของท่านอยู่ระหว่างรอ ฝยก.ฯ อนุมัติ กรุณาติดต่อเจ้าหน้าที่หรือรอการอนุมัติ"
          );
          resetUserData();
          await signOutUser();
          return;
        }

        setAuthNotice(null);
        setCurrentUser(user);
        setAuthMode("login");

        const scope = { uid: user.id, isAdmin };

        unsubscribers.push(
          // ข้อมูลตัวเองแบบ realtime (XP/Level, ถูกยกเลิกอนุมัติ)
          subscribeToUserDoc(user.id, (fresh) => {
            if (!isMounted) return;
            if (fresh) {
              if (!fresh.isApproved && fresh.role !== "admin") {
                setAuthNotice("บัญชีของท่านถูกระงับหรือยกเลิกการอนุมัติ กรุณาติดต่อ ฝยก.ฯ");
                void signOutUser();
                return;
              }
              setCurrentUser({ ...(fresh as User), id: user.id });
            }
          }),
          subscribeToQuizResults(scope, (results) => isMounted && setQuizResults(results as QuizResult[])),
          subscribeToCertificates(scope, (certs) => isMounted && setCertificates(certs as Certificate[])),
          subscribeToChat(scope, (messages) => isMounted && setChatMessages(messages as ChatMessage[])),
          subscribeToNotifications(user.id, (notifs) => {
            if (!isMounted) return;
            setNotifications(notifs);
          }),
          subscribeToDailyMissions(user.id, (missions) => {
            if (!isMounted) return;
            if (missions.length === 0) {
              INITIAL_DAILY_MISSIONS.forEach((m) => {
                void saveDailyMission({ ...m, userId: user.id });
              });
              setDailyMissions(INITIAL_DAILY_MISSIONS);
            } else {
              setDailyMissions(missions);
            }
          }),
          subscribeToLeaderboard((board) => {
            if (!isMounted) return;
            setLeaderboard(board);
          })
        );

        if (isAdmin) {
          unsubscribers.push(
            subscribeToUsers((list) => isMounted && setUsers(list as User[])),
            subscribeToAuditLogs((logs) => isMounted && setAuditLogs(logs))
          );
        }

        if (pendingLoginLogRef.current) {
          pendingLoginLogRef.current = false;
          void logActivity("LOGIN", "เข้าสู่ระบบ", "เข้าสู่ระบบสำเร็จ", user);
        }
      } catch (error) {
        console.error("[AUTH] Failed to initialize user:", error);
        if (isMounted) resetUserData();
      } finally {
        if (isMounted) setIsFirebaseLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
      clearSubscriptions();
    };
  }, []);

  /* =======================================================
     4. LOGIN / LOGOUT / REGISTER
  ======================================================= */

  const handleLoginSuccess = (): void => {
    setAuthNotice(null);
    pendingLoginLogRef.current = true;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      if (currentUser) {
        await logActivity("LOGOUT", "เข้าสู่ระบบ", "ออกจากระบบสำเร็จ", currentUser);
      }

      cleanupFirebaseOnLogout();
      await signOutUser();

      setAuthMode("login");
    } catch (error) {
      console.error("[AUTH] Logout failed:", error);
      alert("ไม่สามารถออกจากระบบได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleRegisterSuccess = (newUser: User): void => {
    // บัญชีใหม่ต้องรออนุมัติ (ระบบออกจากระบบให้อัตโนมัติแล้ว)
    setAuthNotice(
      `ลงทะเบียน ${newUser.rank} ${newUser.firstName} ${newUser.lastName} สำเร็จ — กรุณารอ ฝยก.ฯ อนุมัติบัญชีก่อนเข้าสู่ระบบ`
    );
  };

  /* =======================================================
     5. QUIZ (บันทึกผลสอบ, XP, ใบประกาศ ตรงเข้า Cloud Firestore)
  ======================================================= */

  const handleFinishQuiz = async (result: QuizResult): Promise<void> => {
    if (!currentUser) return;

    try {
      const percentage = Math.round((result.score / result.totalQuestions) * 100);
      const passed = percentage >= 80;
      const xpGain = passed ? 150 : 30;
      const XP_PER_LEVEL = 500;
      const currentXp = Number(currentUser.xp) || 0;
      const newXp = currentXp + xpGain;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const completedAt = new Date().toISOString();

      // 1. บันทึกผลสอบเข้า Cloud Firestore
      await saveQuizResult({
        userId: currentUser.id,
        userName: `${currentUser.rank} ${currentUser.firstName} ${currentUser.lastName}`.trim(),
        militaryId: currentUser.militaryId,
        userRank: currentUser.rank,
        courseId: result.courseId,
        courseTitle: result.courseTitle,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage,
        passed,
        completedAt,
      });

      // 2. อัปเดต XP และ Level เข้า Firestore
      await updateUser(currentUser.id, { xp: newXp, level: newLevel });
      setCurrentUser((prev) =>
        prev ? { ...prev, xp: newXp, level: newLevel } : null
      );

      // 3. อัปเดตอันดับใน Leaderboard เข้า Firestore (เฉพาะกำลังพลทั่วไป ไม่บันทึกแอดมินขึ้นกระดานคะแนนหรือตารางลำดับ)
      if (currentUser.role !== "admin") {
        await saveLeaderboardEntry({
          id: currentUser.id,
          rankPosition: 0,
          userName: `${currentUser.rank} ${currentUser.firstName} ${currentUser.lastName}`.trim(),
          userRank: currentUser.rank as any,
          militaryId: currentUser.militaryId,
          unitCompany: currentUser.unit || "บก.พัน",
          xp: newXp,
          level: newLevel,
          badgesCount: certificates.length + (passed ? 1 : 0),
        });
      }

      // 4. กรณีสอบผ่าน: ออกใบประกาศนียบัตรและบันทึกการแจ้งเตือนลง Firestore
      if (passed) {
        const year = new Date().getFullYear();
        const code = `MED4-CERT-${year}-` + Math.floor(1000 + Math.random() * 9000);
        await saveCertificate({
          userId: currentUser.id,
          userName: `${currentUser.rank} ${currentUser.firstName} ${currentUser.lastName}`.trim(),
          militaryId: currentUser.militaryId,
          userRank: currentUser.rank as any,
          unit: currentUser.unit || "",
          courseTitle: result.courseTitle,
          scorePercentage: percentage,
          issueDate: completedAt.split("T")[0],
          qrCodeData: `https://medvault.4thmedbat.rtarf.mi.th/verify/${code}`,
          commanderName: "พันเอก สมชาย ใจภักดี",
          commanderRank: "พันเอก",
        });

        const certNotif: NotificationItem = {
          id: "notif-cert-" + Date.now().toString(),
          userId: currentUser.id,
          title: "ได้รับใบประกาศนียบัตรใหม่!",
          message: `ขอแสดงความยินดี! ท่านผ่านการทดสอบหลักสูตร "${result.courseTitle}" ด้วยคะแนน ${percentage}% และได้รับใบประกาศนียบัตรดิจิทัลแล้ว`,
          type: "quiz",
          read: false,
          timestamp: completedAt,
        };
        await saveNotification(certNotif);
      }

      // 5. บันทึกประวัติกิจกรรมลง Audit Log ใน Firestore
      void logActivity(
        "TAKE_QUIZ",
        "ระบบข้อสอบ",
        `ทำแบบทดสอบวิชา "${result.courseTitle}" ได้คะแนน ${result.score}/${result.totalQuestions} (${percentage}%) - ${passed ? "ผ่าน" : "ไม่ผ่าน"}`
      );
    } catch (error) {
      console.error("[QUIZ] Failed to save result to Firestore:", error);
      throw error;
    }
  };

  /* =======================================================
     8. ADMIN - USER MANAGEMENT (Firestore + Admin API)
  ======================================================= */

  const handleApproveUser = async (userId: string): Promise<void> => {
    if (currentUser?.role !== "admin") {
      console.warn("[ADMIN] Unauthorized approve attempt.");
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    try {
      await updateUser(userId, { isApproved: true });
      await saveNotification({
        id: "notif-appr-" + Date.now().toString(),
        userId,
        title: "บัญชีได้รับการอนุมัติแล้ว",
        message: "ฝยก.ฯ ได้อนุมัติบัญชีของท่านแล้ว สามารถเข้าศึกษาและทดสอบความรู้ได้ทันที",
        type: "approval",
        read: false,
        timestamp: new Date().toISOString(),
      });

      void logActivity(
        "APPROVE_USER",
        "การจัดการระบบ",
        "อนุมัติการใช้งานกำลังพล: " +
          targetUser.rank + " " + targetUser.firstName + " " + targetUser.lastName +
          " (ID: " + targetUser.militaryId + ")"
      );
    } catch (error) {
      console.error("[ADMIN] Approve failed:", error);
      alert("อนุมัติบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleRejectUser = async (userId: string): Promise<void> => {
    if (currentUser?.role !== "admin") {
      console.warn("[ADMIN] Unauthorized reject attempt.");
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const confirmed = window.confirm(
      `ยืนยันปฏิเสธ/ลบบัญชี ${targetUser.rank} ${targetUser.firstName} ${targetUser.lastName} ?\n\nบัญชีเข้าสู่ระบบและข้อมูลผู้ใช้จะถูกลบถาวร`
    );
    if (!confirmed) return;

    try {
      await deleteUserDoc(userId);
      try {
        await apiRequest(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "DELETE",
        });
      } catch {
        // Ignored if server API is unavailable in local dev
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      void logActivity(
        "REJECT_USER",
        "การจัดการระบบ",
        "ปฏิเสธ/ลบบัญชีกำลังพล: " +
          targetUser.rank + " " + targetUser.firstName + " " + targetUser.lastName
      );
    } catch (error) {
      console.error("[ADMIN] Reject failed:", error);
      alert("ลบบัญชีไม่สำเร็จ: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleUpdateUser = async (updatedUser: User): Promise<void> => {
    if (currentUser?.role !== "admin") {
      console.warn("[ADMIN] Unauthorized update attempt.");
      return;
    }

    const original = users.find((u) => u.id === updatedUser.id);
    const { password, id, ...profileFields } = updatedUser;

    try {
      // 1) รหัสผ่าน / Username เปลี่ยนที่ Firebase Authentication ผ่านเซิร์ฟเวอร์
      //    (ไม่เก็บรหัสผ่านใน Firestore หรือ localStorage)
      const militaryIdChanged = original && original.militaryId !== updatedUser.militaryId;

      if ((password && password.trim()) || militaryIdChanged) {
        await apiRequest(`/api/admin/users/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: {
            password: password ? password.trim() : "",
            militaryId: militaryIdChanged ? updatedUser.militaryId : undefined,
          },
        });
      }

      // 2) ข้อมูลโปรไฟล์ใน Firestore
      await updateUser(id, profileFields as any);

      void logActivity(
        "EDIT_USER",
        "การจัดการระบบ",
        "แก้ไขข้อมูลกำลังพล: " +
          updatedUser.rank + " " + updatedUser.firstName + " " + updatedUser.lastName +
          (password ? " (เปลี่ยนรหัสผ่าน)" : "")
      );
    } catch (error) {
      console.error("[ADMIN] Update failed:", error);
      alert("บันทึกข้อมูลไม่สำเร็จ: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  /* =======================================================
     9. RESET LOCAL DATA
  ======================================================= */

  const handleResetData = (): void => {
    if (currentUser?.role !== "admin") {
      alert("เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถรีเซ็ตข้อมูลได้");
      return;
    }

    setNotifications([]);
    setDailyMissions([...INITIAL_DAILY_MISSIONS]);
    setSelectedCourse(null);
    setShowNotificationsModal(false);

    alert("รีเซ็ตสถานะหน้าจอสำเร็จ");
  };

  /* =======================================================
     10. CHAT
  ======================================================= */

  const handleSendMessage = async (
    msgText: string,
    targetUserUid?: string
  ): Promise<void> => {
    if (!currentUser) return;

    const cleanMessage = msgText.trim();
    if (!cleanMessage) return;

    const isAdmin = currentUser.role === "admin";
    const senderName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

    try {
      if (isAdmin) {
        const target = users.find((u) => u.id === targetUserUid);
        if (!target) {
          alert("กรุณาเลือกกำลังพลที่ต้องการตอบกลับ");
          return;
        }

        await sendChatMessage({
          userUid: target.id,
          senderUid: currentUser.id,
          senderId: "admin",
          senderName,
          senderRank: currentUser.rank,
          receiverId: target.militaryId,
          text: cleanMessage,
          isRead: false,
          isFromAdmin: true,
        });
      } else {
        await sendChatMessage({
          userUid: currentUser.id,
          senderUid: currentUser.id,
          senderId: currentUser.militaryId,
          senderName,
          senderRank: currentUser.rank,
          receiverId: "admin",
          text: cleanMessage,
          isRead: false,
          isFromAdmin: false,
        });

        // ข้อความตอบกลับอัตโนมัติสร้างโดยเซิร์ฟเวอร์ (ผู้ใช้ปลอมเป็นแอดมินไม่ได้)
        apiRequest("/api/chat/auto-reply", { body: {} }).catch((error) =>
          console.warn("[CHAT] Auto reply failed:", error)
        );
      }

      void logActivity(
        "ADMIN_CHAT",
        "ติดต่อ ฝยก.",
        "ส่งข้อความ: \"" +
          cleanMessage.slice(0, 40) +
          (cleanMessage.length > 40 ? "..." : "") +
          "\""
      );
    } catch (error) {
      console.error("[CHAT] Failed to send:", error);
      alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleMarkMessagesRead = (messageIds: string[]): void => {
    messageIds.forEach((messageId) => {
      markChatMessageRead(messageId).catch((error) =>
        console.warn("[CHAT] Mark read failed:", error)
      );
    });
  };

  /* =======================================================
     11. FILTERED NOTIFICATIONS
  ======================================================= */

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];

    return notifications.filter(
      (notification) =>
        notification.userId === currentUser.id ||
        notification.userId === "ALL"
    );
  }, [notifications, currentUser]);

  /* =======================================================
     12. COUNTERS
  ======================================================= */

  const unreadNotifsCount = userNotifications.filter(
    (notification) => !notification.read
  ).length;

  const unreadMessagesCount = currentUser
    ? chatMessages.filter((message) =>
        !message.isRead &&
        (currentUser.role === "admin" ? !message.isFromAdmin : message.isFromAdmin)
      ).length
    : 0;

  const pendingApprovalsCount =
    currentUser?.role === "admin"
      ? users.filter((u) => !u.isApproved && u.role !== "admin").length
      : 0;

  /* =======================================================
     13. NAVIGATION HANDLER
  ======================================================= */

  const handleNavigateTab = (tab: string): void => {
    if (tab === "notifications") {
      setShowNotificationsModal(true);
      return;
    }

    if (tab === "admin" && currentUser?.role !== "admin") {
      console.warn("[NAV] Unauthorized admin navigation.");
      return;
    }

    setActiveTab(tab);
  };

  /* =======================================================
     14. FIREBASE LOADING
  ======================================================= */

  if (isFirebaseLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#556B2F]" />
          <p className="text-sm text-stone-500">
            กำลังเชื่อมต่อ MedVault...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     15. AUTH SCREENS
  ======================================================= */

  if (!currentUser) {
    if (authMode === "register") {
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => setAuthMode("login")}
        />
      );
    }

    return (
      <LoginScreen
        authNotice={authNotice}
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => {
          setAuthNotice(null);
          setAuthMode("register");
        }}
      />
    );
  }

  /* =======================================================
     16. MAIN APPLICATION
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between text-stone-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        currentUser={
          currentUser
        }

        onLogout={
          handleLogout
        }

        onNavigateTab={
          handleNavigateTab
        }

        unreadNotifsCount={
          unreadNotifsCount
        }

        unreadMessagesCount={
          unreadMessagesCount
        }
      />

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <Navigation
        activeTab={
          activeTab
        }

        onSelectTab={
          handleNavigateTab
        }

        isAdmin={
          currentUser.role ===
          "admin"
        }

        pendingApprovalsCount={
          pendingApprovalsCount
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#556B2F]" />
            </div>
          }
        >

        {/* ===============================================
            DASHBOARD
        ================================================ */}

        {activeTab ===
          "dashboard" && (
          <DashboardScreen
            currentUser={
              currentUser
            }

            courses={
              courses
            }

            quizResults={
              quizResults
            }

            dailyMissions={
              dailyMissions
            }

            onNavigateTab={
              handleNavigateTab
            }

            onSelectCourse={
              (course) => {
                setSelectedCourse(
                  course
                );

                setActiveTab(
                  "courses"
                );
              }
            }
          />
        )}

        {/* ===============================================
            UNIT SCHOOL
        ================================================ */}

        {activeTab ===
          "unit-school" && (
          <UnitSchoolScreen
            schedule={
              UNIT_SCHOOL_SCHEDULE
            }

            courses={
              courses
            }

            documents={
              documents
            }

            onSelectCourse={
              (course) => {
                setSelectedCourse(
                  course
                );

                setActiveTab(
                  "courses"
                );
              }
            }

            onSelectDocument={() =>
              setActiveTab(
                "files"
              )
            }

            onNavigateTab={
              handleNavigateTab
            }
          />
        )}

        {/* ===============================================
            COURSES
        ================================================ */}

        {activeTab ===
          "courses" && (
          <CoursesScreen
            courses={
              courses
            }

            lessons={
              lessons
            }

            selectedCourse={
              selectedCourse
            }

            onSelectCourse={
              setSelectedCourse
            }

            onStartQuizForCourse={
              (course) => {
                setSelectedCourse(
                  course
                );

                setActiveTab(
                  "quizzes"
                );
              }
            }

            onLogActivity={
              logActivity
            }
          />
        )}

        {/* ===============================================
            QUIZ
        ================================================ */}

        {activeTab ===
          "quizzes" && (
          <QuizScreen
            currentUser={
              currentUser
            }

            courses={
              courses
            }

            quizQuestions={
              quizQuestions
            }

            onFinishQuiz={
              handleFinishQuiz
            }

            onNavigateTab={
              handleNavigateTab
            }
          />
        )}

        {/* ===============================================
            GAMIFICATION
        ================================================ */}

        {activeTab ===
          "gamification" && (
          <GamificationScreen
            currentUser={
              currentUser
            }

            dailyMissions={
              dailyMissions
            }

            leaderboard={
              activeLeaderboard
            }
          />
        )}

        {/* ===============================================
            CERTIFICATES
        ================================================ */}

        {activeTab ===
          "certificates" && (
          <CertificateScreen
            certificates={
              certificates.filter(
                (
                  certificate
                ) =>
                  currentUser.role ===
                    "admin" ||
                  certificate.userId ===
                    currentUser.id ||
                  certificate.militaryId ===
                    currentUser.militaryId
              )
            }
          />
        )}

        {/* ===============================================
            FILES
        ================================================ */}

        {activeTab ===
          "files" && (
          <FileHubScreen
            documents={
              documents
            }

            onLogActivity={
              logActivity
            }
          />
        )}

        {/* ===============================================
            AI ASSISTANT
        ================================================ */}

        {activeTab ===
          "ai-assistant" &&
          currentUser.role === "admin" && (
          <AiAssistantScreen
            currentUser={
              currentUser
            }

            onLogActivity={
              logActivity
            }
          />
        )}

        {/* ===============================================
            AI SEARCH
        ================================================ */}

        {activeTab ===
          "ai-search" &&
          currentUser.role === "admin" && (
          <AiSearchScreen
            onLogActivity={
              logActivity
            }
          />
        )}

        {/* ===============================================
            GMAIL
        ================================================ */}

        {activeTab ===
          "gmail" &&
          currentUser.role === "admin" && (
          <GmailScreen
            currentUser={
              currentUser
            }
          />
        )}

        {/* ===============================================
            DRIVE
        ================================================ */}

        {activeTab ===
          "drive" &&
          currentUser.role === "admin" && (
          <DriveScreen
            currentUser={
              currentUser
            }
          />
        )}

        {/* ===============================================
            SHEETS
        ================================================ */}

        {activeTab ===
          "sheets" &&
          currentUser.role === "admin" && (
          <SheetsScreen
            currentUser={
              currentUser
            }
          />
        )}

        {/* ===============================================
            CHAT
        ================================================ */}

        {activeTab ===
          "chat" && (
          <AdminChatScreen
            currentUser={
              currentUser
            }

            chatMessages={
              chatMessages
            }

            users={
              users
            }

            onSendMessage={
              handleSendMessage
            }

            onMarkRead={
              handleMarkMessagesRead
            }
          />
        )}

        {/* ===============================================
            ADMIN
        ================================================ */}

        {activeTab ===
          "admin" &&
          currentUser.role ===
            "admin" && (
          <AdminControlScreen
            currentUser={
              currentUser
            }

            users={
              users
            }

            courses={
              courses
            }

            quizResults={
              quizResults
            }

            auditLogs={
              auditLogs
            }

            onApproveUser={
              handleApproveUser
            }

            onRejectUser={
              handleRejectUser
            }

            onUpdateUser={
              handleUpdateUser
            }

            onResetData={
              handleResetData
            }
          />
        )}

        </Suspense>
      </main>

      {/* =================================================
          NOTIFICATION MODAL
      ================================================= */}

      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-[#556B2F] overflow-hidden flex flex-col max-h-[85vh]">

            {/* -------------------------------------------
                MODAL HEADER
            -------------------------------------------- */}

            <div className="bg-[#3B4823] p-4 text-white flex items-center justify-between">

              <div className="flex items-center space-x-2">

                <Bell className="w-5 h-5 text-amber-300" />

                <h3 className="font-bold text-sm">
                  การแจ้งเตือนประจำหน่วย (
                  {
                    userNotifications.length
                  }
                  )
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowNotificationsModal(
                    false
                  )
                }
                className="p-1 rounded-lg hover:bg-white/10 text-stone-200"
                aria-label="ปิดการแจ้งเตือน"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* -------------------------------------------
                NOTIFICATION LIST
            -------------------------------------------- */}

            <div className="p-4 overflow-y-auto space-y-3 flex-grow">

              {userNotifications.length ===
              0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  ไม่มีการแจ้งเตือนในขณะนี้
                </div>
              ) : (
                userNotifications.map(
                  (notif) => (
                    <div
                      key={
                        notif.id
                      }
                      className={
                        "p-3.5 rounded-xl border transition-all " +
                        (
                          notif.read
                            ? "bg-stone-50 border-stone-200 text-stone-600"
                            : "bg-amber-50/70 border-amber-300 text-stone-900 shadow-sm"
                        )
                      }
                    >

                      <div className="flex items-start justify-between gap-2">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2">

                            <h4 className="font-bold text-xs text-[#2D3A1B]">
                              {
                                notif.title
                              }
                            </h4>

                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            )}

                          </div>

                          <p className="text-xs text-stone-700 leading-relaxed">
                            {
                              notif.message
                            }
                          </p>

                          <p className="text-[10px] text-stone-400">
                            {
                              notif.timestamp
                            }
                          </p>

                        </div>

                        {!notif.read && (
                          <button
                            type="button"
                            onClick={() => {
                              void saveNotification({ ...notif, read: true });
                            }}
                            className="text-[11px] text-[#556B2F] font-bold hover:underline shrink-0 p-1"
                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                            aria-label="ทำเครื่องหมายว่าอ่านแล้ว"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </button>
                        )}

                      </div>

                    </div>
                  )
                )
              )}

            </div>

            {/* -------------------------------------------
                MODAL FOOTER
            -------------------------------------------- */}

            <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs">

              <button
                type="button"
                onClick={() => {
                  if (!currentUser) return;
                  notifications.forEach((n) => {
                    if ((n.userId === currentUser.id || n.userId === "ALL") && !n.read) {
                      void saveNotification({ ...n, read: true });
                    }
                  });
                }}
                className="text-[#4B5320] font-semibold hover:underline"
              >
                อ่านทั้งหมดแล้ว
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowNotificationsModal(
                    false
                  )
                }
                className="px-4 py-1.5 bg-[#3B4823] text-white rounded-lg font-bold hover:bg-[#4B5320]"
              >
                ปิด
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
};

export default App;