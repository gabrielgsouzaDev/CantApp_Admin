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
  loading: boolean;
  login: (email: string, password: string, roleHint?: Role) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<UserCredential>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createFirestoreUser = async (firebaseUser: FirebaseUser, assignedRole: Role): Promise<CtnAppUser> => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CtnAppUser;
    }

    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      role: assignedRole,
      avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
    await setDoc(userDocRef, newUser);
    
    return { id: userDocRef.id, ...newUser } as CtnAppUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setUser({ id: userDoc.id, ...userDoc.data() } as CtnAppUser);
            } else {
              // For a standalone admin app, if the user exists in auth but not firestore,
              // we can create them with a default role or log them out.
              // For simplicity, we'll log them out.
              await signOut(auth);
              setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user state
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: Role) => {
     setLoading(true);
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       await createFirestoreUser(userCredential.user, role);
       // After registration, signOut to force them to log in.
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
    router.push("/");
  };
  
  useEffect(() => {
    const isAuthPage = pathname.includes('/login') || pathname === '/';
    // For a simple admin app, anyone logged in goes to the main dashboard.
    // The firestore.rules will handle permissions.
    const dashboardRoute = '/dashboard/admin';

    if (!loading && user && isAuthPage) {
        router.replace(dashboardRoute);
    }
     if (!loading && !user && !isAuthPage) {
        router.replace('/');
    }
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
}
