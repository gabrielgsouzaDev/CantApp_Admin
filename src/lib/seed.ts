// src/lib/seed.ts
import { auth, db } from '../firebase';
import { CtnAppUser, Role } from '@/lib/types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { seedOrders } from '../services/orderService';
import { seedProducts } from '../services/productService';
import { setRole } from '../ai/flows/llm-error-handling';


const seedUser = async (
  email: string,
  pass: string,
  role: Role
) => {
  try {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      console.log(`Seed: ${role} user (${email}) already exists. Skipping.`);
      return;
    } catch (error: any) {
      if (
        error.code !== 'auth/user-not-found' &&
        error.code !== 'auth/invalid-credential'
      ) {
        console.error(
          `Seed: Error checking if ${role} user exists, aborting seed:`,
          error
        );
        return;
      }
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const firebaseUser = userCredential.user;

    // Set custom claim
    await setRole({ uid: firebaseUser.uid, role });

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || role,
      role: role,
      avatar:
        firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
    await setDoc(userDocRef, newUser);
    console.log(`Seed: Successfully seeded ${role} user: ${email}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(
        `Seed: ${role} user (${email}) was created by another process. Skipping.`
      );
    } else {
      console.error(`Seed: Error seeding ${role} user:`, error);
    }
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
