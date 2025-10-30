'use server';
/**
 * @fileOverview Flow for setting user roles via custom claims.
 * This flow is currently NOT USED in the main authentication flow
 * but is kept for potential future use with a secure backend environment.
 */

import { ai } from '@/ai/genkit';
import { Role } from '@/lib/types';
import { z } from 'zod';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig } from '@/firebase/admin-config';

// --- Admin App Initialization ---
// This initializes the Firebase Admin SDK. It's safe to run multiple times.
let adminApp: App;
try {
  if (!getApps().some(app => app.name === 'admin')) {
    adminApp = initializeApp({
      ...firebaseAdminConfig
    }, 'admin');
  } else {
    adminApp = getApps().find(app => app.name === 'admin')!;
  }
} catch (e) {
  console.error("Admin App initialization failed", e);
}


const adminAuth = getAuth(adminApp);

const SetRoleSchema = z.object({
  uid: z.string(),
  role: z.nativeEnum(Role),
});

export const setRole = ai.defineFlow(
  {
    name: 'setRole',
    inputSchema: SetRoleSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ uid, role }) => {
    // This flow is not actively called by the AuthProvider anymore,
    // but the logic is kept here for reference.
    try {
      await adminAuth.setCustomUserClaims(uid, { role });
      return { success: true };
    } catch (error) {
      console.error(`Failed to set custom claim for UID ${uid}:`, error);
      return { success: false };
    }
  }
);
