"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getDashboardRouteForRole } from "@/lib/utils";
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
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

interface AuthContextType {
  user: CtnAppUser | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (email: string, password: string, role: Role, schoolId?: string) => Promise<UserCredential>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createFirestoreUser = async (firebaseUser: FirebaseUser, assignedRole: Role, schoolId?: string): Promise<CtnAppUser> => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        console.log(`User doc for ${firebaseUser.email} already exists.`);
        return { id: docSnap.id, ...docSnap.data() } as CtnAppUser;
    }

    console.log(`Creating Firestore doc for ${firebaseUser.email} with role ${assignedRole}.`);
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
                  setRole(appUser.role);
                } else {
                   // This case can happen if a user is created in Auth but Firestore doc creation fails.
                   // Or if a user is deleted from Firestore but not Auth.
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

  const login = async (email: string, password: string, assignedRole: Role) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user state and redirecting
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, assignedRole: Role, schoolId?: string) => {
     setLoading(true);
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const firebaseUser = userCredential.user;
       
       // Create the user document in Firestore immediately after successful auth creation
       await createFirestoreUser(firebaseUser, assignedRole, schoolId);
       
       // For a better UX, sign the user out and let them log in,
       // which ensures the onAuthStateChanged logic runs cleanly.
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
    setLoading(false);
  };
  
  useEffect(() => {
    const isAuthPage = pathname.includes('/login') || pathname === '/';
    if (!loading && user && isAuthPage) {
        const dashboardRoute = getDashboardRouteForRole(role);
        router.replace(dashboardRoute);
    }
     if (!loading && !user && !isAuthPage && pathname !== '/') {
        router.replace('/');
    }
  }, [user, loading, role, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
        {children}
        <FirebaseErrorListener />
    </AuthContext.Provider>
  );
}
