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
import { setRole as setRoleOnBackend } from "@/ai/flows/llm-error-handling";

interface AuthContextType {
  user: CtnAppUser | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<UserCredential>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createFirestoreUser = async (firebaseUser: FirebaseUser, assignedRole: Role, schoolId?: string): Promise<CtnAppUser> => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const existingUser = { id: docSnap.id, ...docSnap.data() } as CtnAppUser;
        if (existingUser.role !== assignedRole) {
            console.warn(`User ${firebaseUser.email} exists with role ${existingUser.role}, but is logging in as ${assignedRole}. Role will be updated in Firestore.`);
        } else {
             console.log(`User doc for ${firebaseUser.email} already exists with correct role.`);
             return existingUser;
        }
    }

    console.log(`Creating/Updating Firestore doc for ${firebaseUser.email} with role ${assignedRole}.`);
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
                // Force refresh the token to get custom claims
                const idTokenResult = await firebaseUser.getIdTokenResult(true);
                const userRole = idTokenResult.claims.role as Role;

                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                  const appUser = { id: userDoc.id, ...userDoc.data() } as CtnAppUser;
                  // Ensure the role in the doc matches the claim
                  if (appUser.role !== userRole) {
                     console.warn(`Role mismatch for ${appUser.email}. Token says ${userRole}, DB says ${appUser.role}. Re-logging to fix.`);
                     await signOut(auth);
                     setUser(null);
                     setRole(null);
                  } else {
                    setUser(appUser);
                    setRole(appUser.role);
                  }
                } else {
                   console.warn(`User ${firebaseUser.uid} exists in Auth but not in Firestore. Logging out.`);
                   await signOut(auth);
                   setUser(null);
                   setRole(null);
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

  const login = async (email: string, password: string, assignedRole: Role) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Set the custom claim BEFORE creating the firestore user or navigating
      const roleResult = await setRoleOnBackend({ uid: firebaseUser.uid, role: assignedRole });
      if (!roleResult.success) {
        throw new Error(roleResult.error || "Failed to set user role on the backend.");
      }

      // Force a token refresh to get the new claim on the client
      await firebaseUser.getIdTokenResult(true);

      const appUser = await createFirestoreUser(firebaseUser, assignedRole, 'default_school_id');
      
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

       // Set the custom claim on the backend
       const roleResult = await setRoleOnBackend({ uid: firebaseUser.uid, role: assignedRole });
       if (!roleResult.success) {
           // This is a critical failure. We should probably delete the user or handle this case.
           throw new Error(roleResult.error || "Failed to set user role after registration.");
       }
       
       await createFirestoreUser(firebaseUser, assignedRole, 'default_school_id');
       
       // The onAuthStateChanged listener will handle setting user state after re-login
       // Forcing a sign out to ensure a clean login with the new token
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
  }, [user, loading, role, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, loading }}>
        {children}
        <FirebaseErrorListener />
    </AuthContext.Provider>
  );
}
