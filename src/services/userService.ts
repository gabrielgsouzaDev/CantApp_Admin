// src/services/userService.ts
import { db } from "../firebase";
import { User } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { errorEmitter } from "../firebase/error-emitter";
import { FirestorePermissionError } from "../firebase/errors";

const usersCollection = collection(db, "users");

export const getUsers = async (): Promise<User[]> => {
  const q = query(usersCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const addUser = async (user: Omit<User, 'id'>) => {
  return addDoc(usersCollection, user)
    .then(docRef => docRef.id)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: usersCollection.path,
        operation: 'create',
        requestResourceData: user,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const updateUser = async (id: string, user: Partial<Omit<User, 'id'>>) => {
  const userDoc = doc(db, "users", id);
  return updateDoc(userDoc, user)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDoc.path,
        operation: 'update',
        requestResourceData: user,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const deleteUser = async (id: string) => {
  const userDoc = doc(db, "users", id);
  return deleteDoc(userDoc)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};
