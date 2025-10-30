'use server';
/**
 * @fileOverview Development-only utilities, including database seeding.
 * This file is executed by `genkit start` in development.
 */
import {config} from 'dotenv';
config();

import '@/ai/flows/llm-error-handling.ts';
import {adminAuth, adminDb} from '@/firebase';
import {CtnAppUser, Role} from '@/lib/types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {seedOrders} from '@/services/orderService';
import {seedProducts} from '@/services/productService';

// --- Seeding logic ---
const seedUser = async (
  authInstance: typeof adminAuth,
  email: string,
  pass: string,
  role: Role
) => {
  try {
    // Check if user exists by trying to sign in
    try {
      await signInWithEmailAndPassword(authInstance, email, pass);
      console.log(`${role} user (${email}) already exists. Skipping seed.`);
      return; // User exists, no need to create
    } catch (error: any) {
      // If sign-in fails with 'auth/user-not-found' or 'auth/invalid-credential', we can proceed to create the user.
      if (
        error.code !== 'auth/user-not-found' &&
        error.code !== 'auth/invalid-credential' &&
        error.code !== 'auth/wrong-password' // for older firebase versions
      ) {
        // For other errors (like network issues), log it and stop.
        console.error(
          `Error checking if ${role} user exists, aborting seed:`,
          error
        );
        return;
      }
    }

    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      pass
    );
    const firebaseUser = userCredential.user;
    const userDocRef = doc(adminDb, 'users', firebaseUser.uid);

    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || role,
      role: role,
      avatar:
        firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
    await setDoc(userDocRef, newUser);
    console.log(`Successfully seeded ${role} user: ${email}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(
        `${role} user (${email}) was created by another process. Skipping seed.`
      );
    } else {
      console.error(`Error seeding ${role} user:`, error);
    }
  }
};

const runSeed = async () => {
  // Check if seeding has been done using the admin db
  const seedFlagRef = doc(adminDb, 'internal', 'seed_flag');
  try {
    const seedFlagDoc = await getDoc(seedFlagRef);

    if (!seedFlagDoc.exists()) {
      console.log('First time setup: Seeding initial data...');

      // Seed admin/canteen users in the ADMIN auth instance
      await seedUser(adminAuth, 'admin@ctn.com', 'password', 'Admin');
      await seedUser(adminAuth, 'cantineiro@ctn.com', 'password', 'Cantineiro');

      // Seed other data in the ADMIN database
      await seedProducts();
      await seedOrders();

      // Set flag to prevent future seeding
      await setDoc(seedFlagRef, {completed: true, timestamp: new Date()});
      console.log('Initial data seeding complete.');
    } else {
      console.log('Seeding has already been completed. Skipping.');
    }
  } catch (e) {
    console.error('Error checking or running seed:', e);
  }
};

// Run the seed process when the dev server starts
if (process.env.NODE_ENV === 'development') {
  runSeed();
}
