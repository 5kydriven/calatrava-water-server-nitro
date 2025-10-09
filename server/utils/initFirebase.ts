import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export default function initFirebase(firebaseConfig: any) {
  let app: any;

  // Check for emulator mode (works for Firestore, Auth, etc.)
  const isEmulator = !!(
    process.env.NITRO_FIRESTORE_EMULATOR_HOST ||
    process.env.NITRO_FIREBASE_AUTH_EMULATOR_HOST
  );

  try {
    return getApp();
  } catch {
    if (isEmulator) {
      // Minimal init for emulator—no credentials needed
      console.log("Initializing Firebase Admin SDK for emulator");
      return initializeApp({
        projectId: firebaseConfig.project_id,
      });
    } else {
      // Full init for production
      console.log("Initializing Firebase Admin SDK for production");
     return initializeApp({
        credential: cert(firebaseConfig),
      });
    }
  }
}
