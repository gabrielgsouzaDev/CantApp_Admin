// src/lib/seed.ts
import { auth, db } from '@/firebase';
import { CtnAppUser, Role } from './types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { setRole } from '@/ai/flows/llm-error-handling';


const createFirestoreUserWithRole = async (
  email: string,
  pass: string,
  role: Role,
  schoolId?: string
) => {
  let firebaseUser;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    firebaseUser = userCredential.user;
    console.log(`Seed: User ${email} already exists.`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        firebaseUser = userCredential.user;
        console.log(`Seed: Successfully created user: ${email}`);
      } catch (createError: any) {
         console.error(`Seed: Error creating user ${email}:`, createError);
         return;
      }
    } else {
      console.error(`Seed: Error signing in user ${email}:`, error);
      return;
    }
  }

  if (!firebaseUser) {
    console.error(`Seed: Could not get user object for ${email}`);
    return;
  }

  try {
    // Set custom claim
    await setRole({ uid: firebaseUser.uid, role });
    console.log(`Seed: Set custom claim for ${email} to ${role}`);

    // Create Firestore document
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: role,
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      ...(schoolId && { schoolId }),
    };
    await setDoc(userDocRef, newUser, { merge: true });
    console.log(`Seed: Ensured Firestore doc for ${email}`);

  } catch (error) {
    console.error(`Seed: Error setting role or doc for ${email}:`, error);
  }
};


const runSeed = async () => {
  // This seeding logic is disabled by default to prevent accidental runs.
  // It should be run manually via a secure backend environment if needed.
  const shouldRunSeed = process.env.RUN_SEED === 'true';
  if (!shouldRunSeed) {
    // console.log('Seed: Seeding is disabled. Set RUN_SEED=true to enable.');
    return;
  }

  console.log('Seed: Seeding initial data...');
  
  await createFirestoreUserWithRole('admin@ctn.com', 'password', 'GlobalAdmin');
  await createFirestoreUserWithRole('escola@ctn.com', 'password', 'EscolaAdmin', 'default_school_id');
  await createFirestoreUserWithRole('cantineiro@ctn.com', 'password', 'Cantineiro', 'default_school_id');

  console.log('Seed: Initial data seeding complete.');
};

// We don't want to run this automatically on every dev server start.
// It should be run manually if needed.
// runSeed();
