import { initializeApp, cert, getApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";

export interface FirebaseAdmin {
  db: Firestore;
  auth: Auth;
}

export default function initFirebase(firebaseConfig: any): FirebaseAdmin {
  let app: any;

  // Check for emulator mode (works for Firestore, Auth, etc.)
  const isDev = process.env.NODE_ENV !== 'production';
  const isEmulator = isDev && process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_AUTH_EMULATOR_HOST;

  try {
    app = getApp();
  } catch {
    if (isEmulator) {
      // Minimal init for emulator—no credentials needed
      console.log("Initializing Firebase Admin SDK for emulator");
      app = initializeApp({
        projectId: firebaseConfig.project_id,
      });
    } else {
      // Full init for production
      console.log("Initializing Firebase Admin SDK for production");
      app = initializeApp({
        credential: cert(firebaseConfig),
      });
    }

    const db = getFirestore(app);
    const auth = getAuth(app);

    return {
      db,
      auth,
    };
  }
}
