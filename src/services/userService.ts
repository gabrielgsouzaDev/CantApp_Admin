// src/services/userService.ts
import { db } from "../firebase";
import { User } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

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
  const userDoc = doc(db, "users", id);
  await updateDoc(userDoc, user);
};

export const deleteUser = async (id: string): Promise<void> => {
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);
};
