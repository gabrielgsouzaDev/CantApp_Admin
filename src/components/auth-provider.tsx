"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDashboardRouteForRole } from "@/lib/utils";

interface AuthContextType {
  user: CtnAppUser | null;
  role: Role | null; // Manter para navegação, mas não para segurança
  loading: boolean;
  login: (email: string, password: string, roleHint?: Role) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<UserCredential>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função auxiliar para criar/atualizar o documento do utilizador no Firestore
const createFirestoreUser = async (firebaseUser: FirebaseUser, assignedRole: Role, schoolId?: string): Promise<CtnAppUser> => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        const existingUser = { id: docSnap.id, ...docSnap.data() } as CtnAppUser;
        // Se o papel for diferente, atualize-o. Isso pode acontecer se o mesmo email for usado para diferentes portais.
        if (existingUser.role !== assignedRole) {
            await setDoc(userDocRef, { role: assignedRole }, { merge: true });
            existingUser.role = assignedRole;
        }
        return existingUser;
    }

    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      role: assignedRole,
      avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      ...(schoolId && { schoolId }),
    };
    await setDoc(userDocRef, newUser, { merge: true });
    
    return { id: userDocRef.id, ...newUser } as CtnAppUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                  const appUser = { id: userDoc.id, ...userDoc.data() } as CtnAppUser;
                  setUser(appUser);
                  setRole(appUser.role); // O papel vem do Firestore
                } else {
                   // Utilizador existe no Auth mas não no Firestore. Provavelmente um registo interrompido.
                   // Vamos tentar criar o documento. Se não tivermos um papel, deslogamos.
                   console.warn(`User ${firebaseUser.uid} exists in Auth but not in Firestore. Logging out.`);
                   await signOut(auth);
                   setUser(null);
                   setRole(null);
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
                await signOut(auth);
                setUser(null);
                setRole(null);
            }
        } else {
            setUser(null);
            setRole(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, roleHint: Role = 'Cantineiro') => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Após o login, onAuthStateChanged vai buscar os dados do Firestore e definir o estado
      // Podemos forçar uma verificação do documento do Firestore aqui se necessário, mas onAuthStateChanged deve ser suficiente
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if(userDoc.exists()) {
        const appUser = {id: userDoc.id, ...userDoc.data()} as CtnAppUser;
        // Opcional: Se o papel estiver errado (ex: logou no portal admin com conta de cantineiro), podemos forçar uma atualização
        if (appUser.role !== roleHint && (roleHint === 'GlobalAdmin' || roleHint === 'EscolaAdmin' || roleHint === 'Cantineiro')) {
            await setDoc(userDocRef, { role: roleHint }, { merge: true });
            appUser.role = roleHint;
        }
        setUser(appUser);
        setRole(appUser.role);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error;
    }
    // setLoading(false) é chamado no useEffect de onAuthStateChanged
  };

  const register = async (email: string, password: string, assignedRole: Role) => {
     setLoading(true);
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const firebaseUser = userCredential.user;
       
       await createFirestoreUser(firebaseUser, assignedRole);
       
       await signOut(auth);
       
       return userCredential;
     } catch (error) {
        console.error("Registration Error:", error);
        throw error;
     } finally {
        setLoading(false);
     }
  }

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole(null);
    router.push("/");
    // setLoading(false) é chamado no useEffect
  };
  
  useEffect(() => {
    const isAuthPage = pathname.includes('/login') || pathname === '/';
    if (!loading && user && isAuthPage) {
        const dashboardRoute = getDashboardRouteForRole(role);
        router.replace(dashboardRoute);
    }
     if (!loading && !user && !isAuthPage) {
        router.replace('/');
    }
  }, [user, loading, role, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
}
