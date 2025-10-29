// src/services/productService.ts
import { adminDb } from "@/firebase";
import { Product } from "@/lib/types";
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

const productsCollection = collection(adminDb, "products");

export const getProducts = async (): Promise<Product[]> => {
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> => {
  const productDoc = doc(adminDb, "products", id);
  await updateDoc(productDoc, product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const productDoc = doc(adminDb, "products", id);
  await deleteDoc(productDoc);
};

// Função para popular dados no banco de dados ADMIN
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
      console.log("Seeded products in ADMIN DB successfully!");
    } else {
        console.log("Products collection is not empty. Skipping seed.");
    }
}
