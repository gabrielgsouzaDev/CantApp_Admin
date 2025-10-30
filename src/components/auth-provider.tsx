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
  register: (email: string, password: string, role: Role) => Promise<UserCredential>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
                   // This can happen on first registration if createFirestoreUser hasn't completed.
                   // The login/register functions will handle creating it.
                }
            } catch (error) {
                console.error("Error during auth state change:", error);
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

  const createFirestoreUser = async (firebaseUser: FirebaseUser, assignedRole: Role): Promise<CtnAppUser> => {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      
      const newUser: Omit<CtnAppUser, 'id'> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
        role: assignedRole,
        avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      };
      await setDoc(userDocRef, newUser, { merge: true });
      
      return { id: userDocRef.id, ...newUser } as CtnAppUser;
  }


  const login = async (email: string, password: string, assignedRole: Role) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const appUser = await createFirestoreUser(firebaseUser, assignedRole);
      
      setUser(appUser);
      setRole(appUser.role);

      const dashboardRoute = getDashboardRouteForRole(appUser.role);
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, assignedRole: Role) => {
     setLoading(true);
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const firebaseUser = userCredential.user;
       
       await createFirestoreUser(firebaseUser, assignedRole);
       // The onAuthStateChanged listener will pick up the new user and set state.
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
    const isAuthPage = pathname.includes('/login');
    if (!loading && user && isAuthPage) {
        const dashboardRoute = getDashboardRouteForRole(role);
        router.replace(dashboardRoute);
    }
  }, [user, loading, role, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
        {children}
        <FirebaseErrorListener />
    </AuthContext.Provider>
  );
}
