// src/firebase/index.ts
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { firebaseAdminConfig } from "./admin-config";

let app: FirebaseApp;
let adminApp: FirebaseApp;
let db: Firestore;
let adminDb: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  adminApp = initializeApp(firebaseAdminConfig, "adminApp");
} else {
  app = getApp();
  adminApp = getApp("adminApp");
}

db = getFirestore(app);
adminDb = getFirestore(adminApp);

export { app, db, adminApp, adminDb };
