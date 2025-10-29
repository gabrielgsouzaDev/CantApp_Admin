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
  const docRef = await addDoc(schoolsCollection, school);
  return docRef.id;
};

export const updateSchool = async (id: string, school: Partial<Omit<School, 'id'>>): Promise<void> => {
  const schoolDoc = doc(adminDb, "schools", id);
  await updateDoc(schoolDoc, school);
};

export const deleteSchool = async (id: string): Promise<void> => {
  const schoolDoc = doc(adminDb, "schools", id);
  await deleteDoc(schoolDoc);
};


// Função para popular dados no banco de dados ADMIN
export const seedSchools = async () => {
    const mockSchools: Omit<School, 'id'>[] = [
        { name: "Escola Primária Central", city: "São Paulo", status: "active" },
        { name: "Colégio Estadual Norte", city: "Rio de Janeiro", status: "active" },
        { name: "Escola Secundária Sul", city: "Belo Horizonte", status: "inactive" },
        { name: "Instituto de Educação Oeste", city: "Porto Alegre", status: "active" },
        { name: "Centro Educacional Leste", city: "Salvador", status: "active" },
    ];
    
    const currentSchools = await getDocs(schoolsCollection);
    if (currentSchools.empty) {
      for (const school of mockSchools) {
          await addDoc(schoolsCollection, school);
      }
      console.log("Seeded schools in ADMIN DB successfully!");
    } else {
        console.log("Schools collection is not empty. Skipping seed.");
    }
}
