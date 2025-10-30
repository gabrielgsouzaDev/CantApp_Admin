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
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import { setRole as setRoleFlow } from "@/ai/flows/llm-error-handling";

interface AuthContextType {
  user: CtnAppUser | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUserToCtnAppUser = async (firebaseUser: FirebaseUser, role: Role): Promise<CtnAppUser> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  let userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const newUser: Omit<CtnAppUser, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuário",
      role: role,
      avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
    await setDoc(userDocRef, newUser);
    userDoc = await getDoc(userDocRef);
  }
  
  const userData = userDoc.data();
  // The role from the document is the source of truth after creation.
  const finalRole = userData?.role || role;

  return { id: userDoc.id, ...userData, role: finalRole } as CtnAppUser;
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
                const claims = idTokenResult.claims;
                const userRole = claims.role as Role;
                
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                  const appUser = { id: userDoc.id, ...userDoc.data() } as CtnAppUser;
                  // The role from the token is the ultimate source of truth
                  appUser.role = userRole || appUser.role;
                  setUser(appUser);
                  setRole(appUser.role);
                } else {
                   // This might happen if Firestore doc creation failed.
                   // We can attempt to create it again.
                   const appUser = await mapFirebaseUserToCtnAppUser(firebaseUser, userRole || 'Cantineiro');
                   setUser(appUser);
                   setRole(appUser.role);
                }
            } catch (error) {
                console.error("Error during auth state change:", error);
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
      
      // Set the custom claim on the backend
      await setRoleFlow({ uid: userCredential.user.uid, role: assignedRole });

      // The onAuthStateChanged listener will handle the rest by fetching the new token
      // But we can eagerly update the UI
      const appUser = await mapFirebaseUserToCtnAppUser(userCredential.user, assignedRole);
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
       
       // Set the custom claim on the backend
       await setRoleFlow({ uid: userCredential.user.uid, role: assignedRole });
       
       // Create the user profile in Firestore
       await mapFirebaseUserToCtnAppUser(userCredential.user, assignedRole);
       
       // The onAuthStateChanged listener will pick up the new user.
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