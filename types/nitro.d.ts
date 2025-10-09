import type { Firestore, Auth } from 'firebase-admin'; // Use explicit types for better inference

declare module 'nitropack' {
  interface NitroApp {
    db?: Firestore;
    auth?: Auth;
  }
}

export {};