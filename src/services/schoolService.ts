// src/services/schoolService.ts
import { adminDb } from "@/firebase";
import { School } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const schoolsCollection = collection(adminDb, "schools");

export const getSchools = async (): Promise<School[]> => {
  const q = query(schoolsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
};

export const addSchool = async (school: Omit<School, 'id'>): Promise<string> => {
  // Ensure ownerUid is present
  if (!school.ownerUid) {
    throw new Error("ownerUid is required to create a school.");
  }
  const docRef = await addDoc(schoolsCollection, school);
  return docRef.id;
};

export const updateSchool = async (id: string, school: Partial<Omit<School, 'id' | 'ownerUid'>>): Promise<void> => {
  const schoolDoc = doc(adminDb, "schools", id);
  await updateDoc(schoolDoc, school);
};

export const deleteSchool = async (id: string): Promise<void> => {
  const schoolDoc = doc(adminDb, "schools", id);
  await deleteDoc(schoolDoc);
};

    