'use server';
/**
 * @fileOverview Flow for setting user roles via custom claims.
 * This should only be called from a secure server environment.
 */
import { initializeApp, getApps, App, credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Role } from '@/lib/types';
import serviceAccount from '../../../service-account-key.json';

// --- Secure Admin App Initialization ---
let adminApp: App;

if (!getApps().length) {
    try {
        adminApp = initializeApp({
            credential: credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error("ERRO CRÍTICO ao inicializar Admin SDK:", e);
    }
} else {
    adminApp = getApps()[0];
}


const getAdminAuth = () => {
    if (!adminApp) {
        throw new Error("Admin SDK não inicializado. Não é possível realizar operações de administrador.");
    }
    return getAuth(adminApp);
}

interface SetRoleData {
  uid: string;
  role: Role;
}

// This is no longer a Genkit flow, but a standard server-side function.
export const setRole = async (data: SetRoleData) => {
    const { uid, role } = data;
    try {
        const adminAuth = getAdminAuth();
        await adminAuth.setCustomUserClaims(uid, { role });
        // Revoke tokens to force the user to re-authenticate and get the new claim.
        await adminAuth.revokeRefreshTokens(uid);
        return { success: true };
    } catch (error) {
        console.error(`Falha ao definir custom claim para UID ${uid}:`, error);
        return { success: false, error: (error as Error).message };
    }
};
