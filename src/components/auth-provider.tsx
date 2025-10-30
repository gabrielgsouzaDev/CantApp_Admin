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
  Auth
} from "firebase/auth";
import { auth, adminDb, adminAuth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";


interface AuthContextType {
  user: CtnAppUser | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This function maps a Firebase User to our app's user type and assigns a role.
const mapFirebaseUserToCtnAppUser = async (firebaseUser: FirebaseUser, role: Role, authInstance: Auth): Promise<CtnAppUser> => {
  // Always read/write user profile from the adminDB for consistency
  const firestoreInstance = adminDb;
  const userDocRef = doc(firestoreInstance, "users", firebaseUser.uid);
  let userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // If user doc doesn't exist, create it.
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
  // Ensure the role from the document is used, as it's the source of truth
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
    // Determine which auth instance to listen to based on the stored role
    const storedRole = localStorage.getItem("ctn-user-role") as Role | null;
    const authInstance = (storedRole === "Admin" || storedRole === "Escola" || storedRole === "Cantineiro")
      ? adminAuth
      : auth;

    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser && storedRole) {
          try {
            const appUser = await mapFirebaseUserToCtnAppUser(firebaseUser, storedRole, authInstance);
            setUser(appUser);
            setRole(appUser.role);
          } catch (error) {
            console.error("Error mapping user, signing out:", error);
            // If mapping fails, sign out to prevent inconsistent state
            await signOut(authInstance);
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
    // Use adminAuth for Admin, School, and Canteen staff, and client auth for others
    const authInstance = (assignedRole === "Admin" || assignedRole === "Escola" || assignedRole === "Cantineiro")
        ? adminAuth
        : auth;

    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const appUser = await mapFirebaseUserToCtnAppUser(userCredential.user, assignedRole, authInstance);
      
      // Use the role from the DB as the source of truth
      const finalRole = appUser.role;

      setUser(appUser);
      setRole(finalRole);
      localStorage.setItem("ctn-user-role", finalRole);

      const dashboardRoute = getDashboardRouteForRole(finalRole);
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
     setLoading(true);
     try {
       // Registration for schools happens on the admin auth instance
       const userCredential = await createUserWithEmailAndPassword(adminAuth, email, password);
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
    // Log out from the correct auth instance
    const authInstance = (role === "Admin" || role === "Escola" || role === "Cantineiro") ? adminAuth : auth;
    await signOut(authInstance);
    localStorage.removeItem("ctn-user-role");
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
