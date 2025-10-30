// src/services/canteenService.ts
import { db } from "../firebase";
import { Canteen } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const canteensCollection = collection(db, "canteens");

export const getCanteens = async (): Promise<Canteen[]> => {
  const q = query(canteensCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Canteen));
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>): Promise<string> => {
  const docRef = await addDoc(canteensCollection, canteen);
  return docRef.id;
};

export const updateCanteen = async (id: string, canteen: Partial<Omit<Canteen, 'id'>>): Promise<void> => {
  const canteenDoc = doc(db, "canteens", id);
  await updateDoc(canteenDoc, canteen);
};

export const deleteCanteen = async (id: string): Promise<void> => {
  const canteenDoc = doc(db, "canteens", id);
  await deleteDoc(canteenDoc);
};
