import {
  GoogleAuthProvider,
  linkWithPopup,
  reauthenticateWithPopup,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * สิทธิ์ Google Workspace เท่าที่ระบบใช้งานจริง
 * - gmail.modify  : อ่าน / ส่ง / ย้ายไปถังขยะ / ทำเครื่องหมายอ่านแล้ว
 * - drive         : แสดงรายการ / สร้างโฟลเดอร์และไฟล์ / ย้ายไฟล์ไปถังขยะ
 * - spreadsheets  : อ่านและเขียน Google Sheets
 */
export const WORKSPACE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

// Provider แยกเฉพาะ Workspace — ไม่กระทบปุ่ม "เข้าสู่ระบบด้วย Google"
const workspaceProvider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => workspaceProvider.addScope(scope));
workspaceProvider.setCustomParameters({ prompt: "consent select_account" });

// Access token ของ Google มีอายุ ~1 ชั่วโมง; เผื่อเวลา 5 นาที
const TOKEN_LIFETIME_MS = 55 * 60 * 1000;

// เก็บในหน่วยความจำเท่านั้น (ไม่เก็บใน localStorage/sessionStorage เพื่อความปลอดภัย)
let cachedAccessToken: string | null = null;
let tokenObtainedAt = 0;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
    tokenObtainedAt = 0;
  }
});

export const getWorkspaceAccessToken = (): string | null => {
  if (cachedAccessToken && Date.now() - tokenObtainedAt > TOKEN_LIFETIME_MS) {
    // token หมดอายุ -> ให้ผู้ใช้กดเชื่อมต่อใหม่
    cachedAccessToken = null;
    tokenObtainedAt = 0;
  }
  return cachedAccessToken;
};

export const setWorkspaceAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  tokenObtainedAt = token ? Date.now() : 0;
};

/**
 * ขอสิทธิ์ Google Workspace โดย "ไม่เปลี่ยนผู้ใช้ที่ล็อกอินอยู่"
 *
 * เดิมใช้ signInWithPopup ซึ่งสลับผู้ใช้ Firebase เป็นบัญชี Google
 * ทำให้ระบบหาข้อมูลผู้ใช้ไม่เจอและเด้งออกจากระบบ
 *
 * - ถ้าบัญชีผูก Google ไว้แล้ว -> reauthenticateWithPopup
 * - ถ้ายังไม่ผูก             -> linkWithPopup (ผูก Google เข้ากับบัญชีเดิม)
 */
export const signInWithGoogleForWorkspace = async (): Promise<{
  user: FirebaseUser;
  accessToken: string;
}> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("กรุณาเข้าสู่ระบบ MedVault ก่อนเชื่อมต่อ Google Workspace");
  }

  const hasGoogleProvider = currentUser.providerData.some(
    (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  let result: UserCredential;

  try {
    result = hasGoogleProvider
      ? await reauthenticateWithPopup(currentUser, workspaceProvider)
      : await linkWithPopup(currentUser, workspaceProvider);
  } catch (error: any) {
    console.error("Google Workspace Sign-In Error:", error);

    if (error?.code === "auth/credential-already-in-use") {
      throw new Error(
        "บัญชี Google นี้ถูกผูกกับผู้ใช้ MedVault คนอื่นแล้ว กรุณาเลือกบัญชี Google อื่น"
      );
    }
    if (error?.code === "auth/user-mismatch") {
      throw new Error(
        "กรุณาเลือกบัญชี Google เดียวกับที่ผูกไว้กับผู้ใช้ MedVault นี้"
      );
    }
    throw error;
  }

  const credential = GoogleAuthProvider.credentialFromResult(result);

  if (!credential?.accessToken) {
    throw new Error("Failed to retrieve access token from Google sign-in credentials.");
  }

  setWorkspaceAccessToken(credential.accessToken);

  return { user: result.user, accessToken: credential.accessToken };
};

// Aliases for backwards compatibility
export const GMAIL_SCOPES = WORKSPACE_SCOPES;
export const getGmailAccessToken = getWorkspaceAccessToken;
export const setGmailAccessToken = setWorkspaceAccessToken;
export const signInWithGoogleForGmail = signInWithGoogleForWorkspace;
