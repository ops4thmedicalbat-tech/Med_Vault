import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

// ─── App Initialization ───────────────────────────────────────────────────────
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// ─── Firebase App Check ──────────────────────────────────────────────────────
// Uses reCAPTCHA Enterprise Site Key from .env
//
// .env:
// VITE_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY

if (typeof window !== "undefined") {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (siteKey) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });

      console.log("[MedVault] Firebase App Check initialized ✓");
    } catch (error) {
      console.error(
        "[MedVault] Firebase App Check initialization failed:",
        error
      );
    }
  } else {
    console.warn(
      "[MedVault] Firebase App Check Site Key is not configured. " +
        "Add VITE_RECAPTCHA_SITE_KEY to .env"
    );
  }
}

// ─── Firestore ────────────────────────────────────────────────────────────────
const databaseId = (
  firebaseConfig as { firestoreDatabaseId?: string }
).firestoreDatabaseId;

// Offline persistence (API ใหม่แทน enableIndexedDbPersistence ที่กำลังจะถูกยกเลิก)
const createFirestore = () => {
  const settings = {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  };

  try {
    return databaseId
      ? initializeFirestore(app, settings, databaseId)
      : initializeFirestore(app, settings);
  } catch (error) {
    // เช่น HMR เรียกซ้ำ หรือเบราว์เซอร์ไม่รองรับ IndexedDB
    console.warn("[MedVault] Firestore persistence unavailable:", error);
    return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  }
};

export const db = createFirestore();

// ─── Authentication ───────────────────────────────────────────────────────────
export const auth = getAuth(app);

// Provider สำหรับ "เข้าสู่ระบบด้วย Google" เท่านั้น — ไม่ขอสิทธิ์ Gmail/Drive/Sheets
// (สิทธิ์ Workspace แยกไปอยู่ใน src/lib/googleAuth.ts)
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

// ─── Storage ──────────────────────────────────────────────────────────────────
export const storage = getStorage(app);

// ─── Realtime Database (Optional) ─────────────────────────────────────────────
let rtdb: import("firebase/database").Database | null = null;

const rtdbUrl = (
  firebaseConfig as { databaseURL?: string }
).databaseURL;

if (rtdbUrl) {
  import("firebase/database")
    .then(({ getDatabase }) => {
      rtdb = getDatabase(app);

      console.log(
        "[MedVault] Realtime Database connected:",
        rtdbUrl
      );
    })
    .catch((err) => {
      console.warn(
        "[MedVault] Realtime Database init failed:",
        err
      );
    });
} else {
  console.info(
    "[MedVault] Realtime Database not configured — " +
      "presence features disabled. " +
      "Add databaseURL to firebase-applet-config.json to enable."
  );
}

// ─── Firebase Exports ──────────────────────────────────────────────────────────
export { rtdb, FirebaseUser };

export {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
};

// ─── Error Handling Utilities ─────────────────────────────────────────────────
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error:
      error instanceof Error
        ? error.message
        : String(error),

    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified:
        auth.currentUser?.emailVerified,
      isAnonymous:
        auth.currentUser?.isAnonymous,
      tenantId:
        auth.currentUser?.tenantId,

      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },

    operationType,
    path,
  };

  console.error(
    "[MedVault] Firebase Error:",
    JSON.stringify(errInfo)
  );

  throw new Error(JSON.stringify(errInfo));
}

// ─── Connection Test ──────────────────────────────────────────────────────────
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(
      doc(db, "test", "connection")
    );

    console.log(
      "[MedVault] Firestore connected successfully ✓"
    );

    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("offline")
    ) {
      console.warn(
        "[MedVault] Firestore is offline — using cached data."
      );
    } else {
      console.log(
        "[MedVault] Firestore initialized " +
          "(connection test complete)."
      );
    }

    return false;
  }
}

testFirebaseConnection();