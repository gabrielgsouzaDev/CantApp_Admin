// src/lib/seed.ts
import { auth, db } from '../firebase';
import { CtnAppUser, Role } from './types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { seedOrders } from '../services/orderService';
import { seedProducts } from '../services/productService';

const seedUser = async (
  email: string,
  pass: string,
  role: Role
) => {
  let firebaseUser;
  try {
    // Try to sign in to see if user exists
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    firebaseUser = userCredential.user;
    console.log(`Seed: User ${email} already exists. Verifying doc.`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      // User doesn't exist, create them
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        firebaseUser = userCredential.user;
        console.log(`Seed: Successfully created user: ${email}`);
      } catch (createError: any) {
        if (createError.code === 'auth/email-already-in-use') {
          console.log(`Seed: User ${email} was created by another process. Skipping creation.`);
          // Try signing in again to get the user object
          const userCredential = await signInWithEmailAndPassword(auth, email, pass);
          firebaseUser = userCredential.user;
        } else {
          console.error(`Seed: Error creating user ${email}:`, createError);
          return;
        }
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
    // Create or update the Firestore document with the correct role
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || role,
      role: role,
      avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
    await setDoc(userDocRef, newUser, { merge: true });
    console.log(`Seed: Ensured Firestore doc for ${email} with role ${role}`);

  } catch (error) {
    console.error(`Seed: Error setting doc for ${email}:`, error);
  }
};


const runSeed = async () => {
  const seedFlagRef = doc(db, 'internal', 'seed_flag');
  try {
    const seedFlagDoc = await getDoc(seedFlagRef);

    if (seedFlagDoc.exists()) {
       console.log('Seed: Seeding has already been completed. Skipping.');
       return;
    }

    console.log('Seed: First time setup, seeding initial data...');

    await seedUser('admin@ctn.com', 'password', 'GlobalAdmin');
    await seedUser('escola@ctn.com', 'password', 'EscolaAdmin');
    await seedUser('cantineiro@ctn.com', 'password', 'Cantineiro');

    await seedProducts();
    await seedOrders();

    await setDoc(seedFlagRef, { completed: true, timestamp: new Date() });
    console.log('Seed: Initial data seeding complete.');

  } catch (e) {
    console.error('Seed: Error checking or running seed:', e);
  }
};

runSeed();
