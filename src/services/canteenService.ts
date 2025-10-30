// src/services/canteenService.ts
import { db } from "@/firebase";
import { Canteen } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const canteensCollection = collection(db, "canteens");

export const getCanteens = async (): Promise<Canteen[]> => {
  const q = query(canteensCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Canteen));
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>) => {
  return addDoc(canteensCollection, canteen)
    .then(docRef => docRef.id)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: canteensCollection.path,
        operation: 'create',
        requestResourceData: canteen,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const updateCanteen = async (id: string, canteen: Partial<Omit<Canteen, 'id'>>) => {
  const canteenDoc = doc(db, "canteens", id);
  return updateDoc(canteenDoc, canteen)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: canteenDoc.path,
        operation: 'update',
        requestResourceData: canteen,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const deleteCanteen = async (id: string) => {
  const canteenDoc = doc(db, "canteens", id);
  return deleteDoc(canteenDoc)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: canteenDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};
