import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth, googleProvider, db } from "./firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

/* =========================================================
   USER ROLE
   ========================================================= */

export type UserRole = "user" | "admin";

/* =========================================================
   APP USER
   ========================================================= */

export interface AppUser {
  id: string;

  militaryId: string;

  firstName: string;
  lastName: string;

  rank: string;

  unit: string;

  position: string;

  phone: string;

  recoveryEmail?: string;

  role: UserRole;

  isApproved: boolean;

  xp: number;

  level: number;

  registeredAt: string;
}

/* =========================================================
   REGISTER
   ========================================================= */

export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: Omit<AppUser, "id" | "registeredAt">
) => {
  try {
    /* ---------------------------------------------
       Create Firebase Authentication account
       --------------------------------------------- */

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    /* ---------------------------------------------
       Set Firebase display name
       --------------------------------------------- */

    await updateProfile(user, {
      displayName:
        `${userData.rank} ${userData.firstName} ${userData.lastName}`,
    });

    /* ---------------------------------------------
       Create Firestore User
       --------------------------------------------- */

    const newUser: AppUser = {
      ...userData,

      id: user.uid,

      // บังคับค่าสิทธิ์ตั้งต้นเสมอ (Firestore Rules ก็ตรวจซ้ำอีกชั้น)
      role: "user",
      isApproved: false,
      xp: 0,
      level: 1,

      registeredAt:
        new Date().toISOString(),
    };

    /* ---------------------------------------------
       Save User → Firestore
       users/{uid}
       --------------------------------------------- */

    await setDoc(
      doc(db, "users", user.uid),
      newUser
    );

    console.log(
      "[MedVault] User registered:",
      user.uid
    );

    // บัญชีใหม่ต้องรอแอดมินอนุมัติ จึงออกจากระบบทันทีหลังลงทะเบียน
    await signOut(auth);

    return user;
  } catch (error) {
    console.error(
      "[MedVault] Error signing up:",
      error
    );

    throw error;
  }
};

/* =========================================================
   LOGIN WITH EMAIL
   ========================================================= */

/**
 * Login ด้วย Email โดยตรง
 *
 * รองรับ:
 *
 * 1. Gmail Admin
 *    ops.4thmedicalbat@gmail.com
 *
 * 2. Email ของระบบ
 *    1583800106@medvault.mil.th
 *
 * 3. Email อื่นที่สร้างใน Firebase Authentication
 */

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  try {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error(
        "กรุณาระบุ Email หรือหมายเลขประจำตัวทหาร"
      );
    }

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

    const user = userCredential.user;

    console.log(
      "[MedVault] Firebase login successful:",
      user.email
    );

    return user;
  } catch (error) {
    console.error(
      "[MedVault] Error signing in:",
      error
    );

    throw error;
  }
};

/* =========================================================
   LOGIN WITH GOOGLE
   ========================================================= */

export const signInWithGoogle = async () => {
  try {
    const userCredential =
      await signInWithPopup(
        auth,
        googleProvider
      );

    const user =
      userCredential.user;

    console.log(
      "[MedVault] Google login successful:",
      user.email
    );

    return user;
  } catch (error) {
    console.error(
      "[MedVault] Error signing in with Google:",
      error
    );

    throw error;
  }
};

/* =========================================================
   LOGOUT
   ========================================================= */

export const signOutUser = async () => {
  try {
    await signOut(auth);

    console.log(
      "[MedVault] User signed out"
    );
  } catch (error) {
    console.error(
      "[MedVault] Error signing out:",
      error
    );

    throw error;
  }
};

/* =========================================================
   AUTH STATE
   ========================================================= */

export const onAuthChanged = (
  callback: (
    user: FirebaseUser | null
  ) => void
) => {
  return onAuthStateChanged(
    auth,
    callback
  );
};

/* =========================================================
   CURRENT USER
   ========================================================= */

export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/* =========================================================
   PASSWORD RESET VIA EMAIL
   ========================================================= */

export const sendResetPasswordEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("[MedVault] Error sending password reset email:", error);
    throw error;
  }
};