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
if (!getApps().length) {
    adminApp = initializeApp({
      ...firebaseAdminConfig
    }, 'admin');
  } else {
    adminApp = getApps().find(app => app.name === 'admin')!;
  }


const adminAuth = getAuth(adminApp);

const SetRoleSchema = z.object({
  uid: z.string(),
  role: z.nativeEnum(Role),
});

export const setRoleFlow = ai.defineFlow(
  {
    name: 'setRoleFlow',
    inputSchema: SetRoleSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ uid, role }) => {
    try {
      await adminAuth.setCustomUserClaims(uid, { role });
      return { success: true };
    } catch (error) {
      console.error(`Failed to set custom claim for UID ${uid}:`, error);
      return { success: false };
    }
  }
);
