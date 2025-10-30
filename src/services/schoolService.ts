// src/services/schoolService.ts
import { db } from "@/firebase";
import { School } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const schoolsCollection = collection(db, "schools");

export const getSchools = async (): Promise<School[]> => {
  const q = query(schoolsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
};

export const addSchool = async (school: Omit<School, 'id'>) => {
  if (!school.ownerUid) {
    throw new Error("ownerUid is required to create a school.");
  }
  return addDoc(schoolsCollection, school)
    .then(docRef => docRef.id)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: schoolsCollection.path,
        operation: 'create',
        requestResourceData: school,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const updateSchool = async (id: string, school: Partial<Omit<School, 'id' | 'ownerUid'>>) => {
  const schoolDoc = doc(db, "schools", id);
  return updateDoc(schoolDoc, school)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: schoolDoc.path,
        operation: 'update',
        requestResourceData: school,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const deleteSchool = async (id: string) => {
  const schoolDoc = doc(db, "schools", id);
  return deleteDoc(schoolDoc)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: schoolDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};
