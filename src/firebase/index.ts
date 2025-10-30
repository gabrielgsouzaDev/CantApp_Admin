// src/firebase/index.ts
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

// --- Unified App Initialization ---
// All parts of the app will use this single Firebase project.
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Legacy admin exports are removed to avoid confusion.
// All services should import `db` and `auth` from this file.
export { app, db, auth };
