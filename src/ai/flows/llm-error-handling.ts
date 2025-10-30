'use server';
/**
 * @fileOverview Flow for setting user roles via custom claims.
 * This should only be called from a secure server environment.
 */

import { Role } from '@/lib/types';
import { z } from 'zod';
import { initializeApp, getApps, App, credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// --- Secure Admin App Initialization ---
let adminApp: App;

if (!getApps().length) {
    // In a production environment (like Vercel or Google Cloud),
    // GOOGLE_APPLICATION_CREDENTIALS would be set.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         adminApp = initializeApp();
    } else {
        // For local development, it falls back to a service account key
        // This part is tricky in a shared environment and should be handled with care.
        // As a fallback for local dev if env var isn't set, we assume no-credentials initialization
        // which works in some emulated/gcloud-authenticated environments.
        try {
             adminApp = initializeApp();
        } catch (e) {
            console.warn("Admin SDK initialization failed. This is expected if not in a server environment with credentials. The setRole function will not work.", e);
        }
    }
} else {
    adminApp = getApps()[0];
}


const getAdminAuth = () => {
    if (!adminApp) {
        throw new Error("Admin SDK not initialized. Cannot perform admin operations.");
    }
    return getAuth(adminApp);
}

const SetRoleSchema = z.object({
  uid: z.string(),
  role: z.nativeEnum(Role),
});

// This is no longer a Genkit flow, but a standard server-side function.
export const setRole = async (data: z.infer<typeof SetRoleSchema>) => {
    const { uid, role } = data;
    try {
        const adminAuth = getAdminAuth();
        await adminAuth.setCustomUserClaims(uid, { role });
        // Revoke tokens to force the user to re-authenticate and get the new claim.
        await adminAuth.revokeRefreshTokens(uid);
        return { success: true };
    } catch (error) {
        console.error(`Failed to set custom claim for UID ${uid}:`, error);
        return { success: false, error: (error as Error).message };
    }
};
