// src/firebase/index.ts
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";
import { firebaseAdminConfig } from "./admin-config";

let app: FirebaseApp;
let adminApp: FirebaseApp;
let db: Firestore;
let adminDb: Firestore;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  adminApp = initializeApp(firebaseAdminConfig, "adminApp");
} else {
  app = getApp();
  adminApp = getApp("adminApp");
}

db = getFirestore(app);
adminDb = getFirestore(adminApp);
auth = getAuth(app);


export { app, db, adminApp, adminDb, auth };
