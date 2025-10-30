// src/firebase/index.ts
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";
import { firebaseAdminConfig } from "./admin-config";

// --- Client App Initialization ---
// This app is used for public-facing data and end-user authentication (parents, students)
let app: FirebaseApp;
// Ensure we're not re-initializing the 'client' app
if (!getApps().some(app => app.name === 'client')) {
  app = initializeApp(firebaseConfig, 'client');
} else {
  app = getApp('client');
}
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);


// --- Admin App Initialization ---
// This app is used for administrative tasks and data management (Admin, School, Canteen staff)
let adminApp: FirebaseApp;
// Ensure we're not re-initializing the 'admin' app
if (!getApps().some(app => app.name === 'admin')) {
  adminApp = initializeApp(firebaseAdminConfig, 'admin');
} else {
  adminApp = getApp('admin');
}
const adminDb: Firestore = getFirestore(adminApp);
const adminAuth: Auth = getAuth(adminApp);


export { app, db, auth, adminApp, adminDb, adminAuth };
