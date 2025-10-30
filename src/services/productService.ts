// src/services/productService.ts
import { db } from "../firebase";
import { Product } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { errorEmitter } from "../firebase/error-emitter";
import { FirestorePermissionError } from "../firebase/errors";

const productsCollection = collection(db, "products");

export const getProducts = async (): Promise<Product[]> => {
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  return addDoc(productsCollection, product)
    .then(docRef => docRef.id)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: productsCollection.path,
        operation: 'create',
        requestResourceData: product,
      });
      errorEmitter.emit('permission-error', permissionError);
      // We still throw the original error for other potential consumers,
      // but the UI will primarily react to the emitted event.
      throw serverError;
    });
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id'>>) => {
  const productDoc = doc(db, "products", id);
  return updateDoc(productDoc, product)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: productDoc.path,
        operation: 'update',
        requestResourceData: product,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};

export const deleteProduct = async (id: string) => {
  const productDoc = doc(db, "products", id);
  return deleteDoc(productDoc)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: productDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
    });
};


// Função para popular dados no banco de dados
export const seedProducts = async () => {
    const mockProducts: Omit<Product, 'id'>[] = [
        { name: "Pão de Queijo", price: 5.00 },
        { name: "Suco de Laranja", price: 4.00 },
        { name: "Misto Quente", price: 7.00 },
        { name: "Bolo de Chocolate", price: 6.00 },
        { name: "Achocolatado", price: 4.50 },
        { name: "Coxinha", price: 5.50 },
        { name: "Esfirra de Carne", price: 6.50 },
    ];
    
    const currentProducts = await getDocs(productsCollection);
    if (currentProducts.empty) {
      for (const product of mockProducts) {
          await addDoc(productsCollection, product);
      }
      console.log("Seeded products in DB successfully!");
    } else {
        console.log("Products collection is not empty. Skipping seed.");
    }
}
