"use client";

import { Role, User, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getDashboardRouteForRole } from "@/lib/utils";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  Auth
} from "firebase/auth";
import { app, db, adminApp, adminDb, adminAuth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { seedOrders } from "@/services/orderService";
import { seedProducts } from "@/services/productService";
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
// The `db` instance passed determines which Firestore to check (client or admin)
const mapFirebaseUserToCtnAppUser = async (firebaseUser: FirebaseUser, role: Role, authInstance: Auth): Promise<CtnAppUser> => {
  const firestoreInstance = authInstance === adminAuth ? adminDb : db;
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
  
  return { id: userDoc.id, ...userDoc.data() } as CtnAppUser;
}

// --- Seeding logic ---
const seedUser = async (authInstance: Auth, email: string, pass: string, role: Role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
        const firebaseUser = userCredential.user;
        const userDocRef = doc(adminDb, "users", firebaseUser.uid);
        
        const newUser: Omit<CtnAppUser, 'id'> = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || role,
            role: role,
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
        };
        await setDoc(userDocRef, newUser);
        console.log(`Successfully seeded ${role} user: ${email}`);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log(`${role} user (${email}) already exists. Skipping seed.`);
        } else {
            console.error(`Error seeding ${role} user:`, error);
        }
    }
};

const runSeed = async () => {
    // Check if seeding has been done using the admin db
    const seedFlagRef = doc(adminDb, 'internal', 'seed_flag');
    try {
        const seedFlagDoc = await getDoc(seedFlagRef);

        if (!seedFlagDoc.exists()) {
            console.log("First time setup: Seeding initial data...");
            
            // Seed admin/canteen users in the ADMIN auth instance
            await seedUser(adminAuth, "admin@ctn.com", "password", "Admin");
            await seedUser(adminAuth, "cantineiro@ctn.com", "password", "Cantineiro");
            
            // Seed other data in the ADMIN database
            await seedProducts();
            await seedOrders();

            // Set flag to prevent future seeding
            await setDoc(seedFlagRef, { completed: true, timestamp: new Date() });
            console.log("Initial data seeding complete.");
        }
    } catch (e) {
      console.error("Error checking or running seed:", e);
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initialize = async () => {
      if (process.env.NODE_ENV === 'development') {
        await runSeed();
      }

      // Determine which auth instance to listen to based on the stored role
      const storedRole = localStorage.getItem("ctn-user-role") as Role | null;
      const authInstance = (storedRole === "Admin" || storedRole === "Escola" || storedRole === "Cantineiro")
        ? adminAuth
        : auth;

      const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
        if (firebaseUser) {
           if (storedRole) {
              const appUser = await mapFirebaseUserToCtnAppUser(firebaseUser, storedRole, authInstance);
              setUser(appUser);
              setRole(appUser.role);
           } else {
             // This case should ideally not happen if role is set on login
             signOut(authInstance);
             setUser(null);
             setRole(null);
           }
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = initialize();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
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
      
      setUser(appUser);
      setRole(appUser.role);
      localStorage.setItem("ctn-user-role", appUser.role);

      const dashboardRoute = getDashboardRouteForRole(appUser.role);
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
