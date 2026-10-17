export type MilitaryRank =
  | "พลทหาร"
  | "สิบตรี"
  | "สิบโท"
  | "สิบเอก"
  | "จ่าสิบตรี"
  | "จ่าสิบโท"
  | "จ่าสิบเอก"
  | "ร้อยตรี"
  | "ร้อยโท"
  | "ร้อยเอก"
  | "พันตรี"
  | "พันโท"
  | "พันเอก";

export interface User {
  id: string;
  rank: MilitaryRank;
  firstName: string;
  lastName: string;
  militaryId: string; // Username (digits)
  position: string; // e.g. เสนารักษ์, นายสิบเวร, พลขับรถ
  phone: string; // 10 digits
  recoveryEmail?: string; // อีเมลสำหรับกู้คืนรหัสผ่าน
  role: "admin" | "user";
  isApproved: boolean; // ต้องได้รับการอนุมัติจากแอดมินก่อนใช้งาน
  unit: string;
  xp: number;
  level: number;
  registeredAt: string;
  password?: string;
  avatarUrl?: string;
}

export interface CourseSlideAttachment {
  id: string;
  title: string;
  sourceInstitution: string; // e.g. "โรงเรียนเสนารักษ์ กรมแพทย์ทหารบก", "วิทยาลัยพยาบาลกองทัพบก (RTANC)", "วิทยาลัยแพทยศาสตร์พระมงกุฎเกล้า (PCM)", "สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)"
  fileType: "pdf" | "ppt" | "slide";
  sizeMb: number;
  downloadUrl: string;
  previewUrl?: string;
  slidePagesCount: number;
  description: string;
  slidesContentSummary?: string[]; // Bullet topics for interactive slide previewer
}

export interface CourseAttachedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "docx" | "ppt";
  sizeMb: number;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  durationMinutes: number;
  level: "พื้นฐาน" | "ปานกลาง" | "ก้าวหน้า";
  description: string;
  thumbnailUrl: string;
  prerequisiteId?: string;
  lessonsCount: number;
  mandatory: boolean;
  tags: string[];
  slidesAttachments?: CourseSlideAttachment[];
  attachedFiles?: CourseAttachedFile[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  contentType: "video" | "pdf" | "text";
  contentUrl?: string;
  contentMarkdown?: string;
  durationMinutes: number;
  order: number;
}

export interface QuizQuestion {
  id: string;
  courseId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "ง่าย" | "ปานกลาง" | "ยาก";
}

export interface QuizResult {
  id: string;
  userId: string;
  userRank: MilitaryRank;
  userName: string;
  militaryId: string;
  courseId: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  date?: string;
}

export interface Certificate {
  id: string; // e.g. MED4-CERT-2026-0084
  userId: string;
  userRank: MilitaryRank;
  userName: string;
  militaryId: string;
  unit: string;
  courseTitle: string;
  scorePercentage: number;
  issueDate: string;
  qrCodeData: string;
  commanderName: string;
  commanderRank: string;
}

export interface ChatMessage {
  id: string;
  userUid: string; // uid ของกำลังพลเจ้าของบทสนทนา
  senderUid: string; // uid ของผู้ส่งจริง ("admin-auto" = ข้อความตอบกลับอัตโนมัติ)
  senderId: string; // "admin" หรือ militaryId ของผู้ใช้
  senderName: string;
  senderRank: string;
  receiverId: string; // "admin" หรือ militaryId ของผู้ใช้
  text: string;
  timestamp: string;
  isRead: boolean;
  isFromAdmin: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'ALL', 'ADMIN', or specific userId
  title: string;
  message: string;
  type: "approval" | "course" | "quiz" | "chat" | "system";
  read: boolean;
  timestamp: string;
}

export interface DocumentFile {
  id: string;
  title: string;
  category: string;
  fileType: "pdf" | "doc" | "ppt" | "mp4";
  sizeMb: number;
  downloadCount: number;
  uploadedDate: string;
  isOfflineSaved?: boolean;
  courseSubject?: string;
  sourceInstitution?: string;
  slidePagesCount?: number;
  slidesUrl?: string;
  slidesContentSummary?: string[];
  downloadUrl?: string;
}

export interface UnitSchoolItem {
  id: string;
  orderNumber: number;
  dateStr: string;
  isoDate: string;
  timeStr: string;
  subject: string;
  instructor: string;
  referenceDoc: string;
  location: string;
  uniform: string;
  courseId?: string;
  docId?: string;
  notes?: string;
}

export interface DailyMission {
  id: string;
  dateStr: string;
  title: string;
  instructor: string;
  rewardXp: number;
  completed: boolean;
  category: string;
  courseId?: string;
  docId?: string;
}

export type AuditActionType =
  | "LOGIN"
  | "LOGOUT"
  | "READ_LESSON"
  | "DOWNLOAD_FILE"
  | "OFFLINE_SAVE"
  | "TAKE_QUIZ"
  | "AI_CHAT"
  | "AI_SEARCH"
  | "ADMIN_CHAT"
  | "REGISTER"
  | "APPROVE_USER"
  | "REJECT_USER"
  | "EDIT_USER"
  | "SYSTEM";

export type AuditModule =
  | "เข้าสู่ระบบ"
  | "คลังบทเรียน"
  | "ระบบข้อสอบ"
  | "คลังคู่มือ/ไฟล์"
  | "หมอเสนารักษ์ AI"
  | "ค้นหา AI"
  | "ติดต่อ ฝยก."
  | "การจัดการระบบ";

export interface AuditLog {
  id: string;
  userId: string;
  userRank: MilitaryRank | string;
  userName: string;
  militaryId: string;
  unit: string;
  actionType: AuditActionType | string;
  module: AuditModule | string;
  details: string;
  sessionDurationMinutes?: number;
  ipAddress?: string;
  timestamp: string;
}

export interface UserSessionSummary {
  userId: string;
  militaryId: string;
  userRank: MilitaryRank;
  userName: string;
  unit: string;
  lastActive: string;
  totalSessionMinutes: number;
  totalLogins: number;
  lessonsReadCount: number;
  filesDownloadedCount: number;
  quizzesTakenCount: number;
  aiInteractionsCount: number;
  isOnline: boolean;
}

export interface LeaderboardEntry {
  rankPosition: number;
  userName: string;
  userRank: MilitaryRank;
  militaryId: string;
  unitCompany: string;
  xp: number;
  level: number;
  badgesCount: number;
}
