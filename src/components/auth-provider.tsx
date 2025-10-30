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
const mapFirebaseUserToCtnAppUser = async (firebaseUser: FirebaseUser, role: Role): Promise<CtnAppUser> => {
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

const getAuthInstanceByRole = (role: Role | null): Auth => {
    return (role === "Admin" || role === "Escola" || role === "Cantineiro")
      ? adminAuth
      : auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We need to check both auth instances
    const listenToAuth = (authInstance: Auth, roleScope: Role[] | null) => {
        return onAuthStateChanged(authInstance, async (firebaseUser) => {
            const storedRole = localStorage.getItem("ctn-user-role") as Role | null;

            // Only proceed if the user exists and the stored role is in the scope of this auth instance
            if (firebaseUser && storedRole && (roleScope === null || roleScope.includes(storedRole))) {
                try {
                    const appUser = await mapFirebaseUserToCtnAppUser(firebaseUser, storedRole);
                    setUser(appUser);
                    setRole(appUser.role);
                } catch (error) {
                    console.error("Error mapping user, signing out:", error);
                    await signOut(authInstance);
                    setUser(null);
                    setRole(null);
                }
            }
            setLoading(false);
        });
    };

    const adminRoles: Role[] = ["Admin", "Escola", "Cantineiro"];
    
    // Unsubscribe functions
    const unsubAdmin = listenToAuth(adminAuth, adminRoles);
    const unsubClient = listenToAuth(auth, null); // Client auth handles any other roles or public users

    // On component unmount, unsubscribe from both listeners
    return () => {
        unsubAdmin();
        unsubClient();
    };
}, []);


  const login = async (email: string, password: string, assignedRole: Role) => {
    setLoading(true);
    const authInstance = getAuthInstanceByRole(assignedRole);

    try {
      // Sign out from all instances first to prevent conflicts
      await signOut(auth);
      await signOut(adminAuth);

      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const appUser = await mapFirebaseUserToCtnAppUser(userCredential.user, assignedRole);
      
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
    const authInstance = getAuthInstanceByRole(role);
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
