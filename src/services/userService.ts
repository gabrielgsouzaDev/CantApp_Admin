// src/services/userService.ts
import { db } from "@/firebase";
import { CtnAppUser } from "@/lib/types"; // Alterado para CtnAppUser
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

export const getUsers = async (): Promise<CtnAppUser[]> => {
  const q = query(usersCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CtnAppUser));
};

export const addUser = async (user: Omit<CtnAppUser, 'id'>): Promise<string> => {
  const docRef = await addDoc(usersCollection, user);
  return docRef.id;
};

export const updateUser = async (id: string, user: Partial<Omit<CtnAppUser, 'id'>>): Promise<void> => {
  const userDoc = doc(db, "users", id);
  return updateDoc(userDoc, user);
};

export const deleteUser = async (id: string): Promise<void> => {
  const userDoc = doc(db, "users", id);
  return deleteDoc(userDoc);
};
