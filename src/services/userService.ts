// src/services/userService.ts
import { adminDb } from "@/firebase";
import { User } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Users will be stored in the admin database
const usersCollection = collection(adminDb, "users");

export const getUsers = async (): Promise<User[]> => {
  const q = query(usersCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const addUser = async (user: Omit<User, 'id'>): Promise<string> => {
  const docRef = await addDoc(usersCollection, user);
  return docRef.id;
};

export const updateUser = async (id: string, user: Partial<Omit<User, 'id'>>): Promise<void> => {
  const userDoc = doc(adminDb, "users", id);
  await updateDoc(userDoc, user);
};

export const deleteUser = async (id: string): Promise<void> => {
  const userDoc = doc(adminDb, "users", id);
  await deleteDoc(userDoc);
};
