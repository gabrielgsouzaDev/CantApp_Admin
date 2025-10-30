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
  User as FirebaseUser
} from "firebase/auth";
import { app, db, adminDb } from "@/firebase";
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

const auth = getAuth(app);

// This function maps a Firebase User to our app's user type and assigns a role.
// In a real app, this role would likely come from a custom claim or a 'roles' collection in Firestore.
const mapFirebaseUserToCtnAppUser = async (firebaseUser: FirebaseUser, role: Role): Promise<CtnAppUser> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
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
const seedUser = async (email: string, pass: string, role: Role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const firebaseUser = userCredential.user;
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
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
    // Check if seeding has been done using the adminDb
    const seedFlagRef = doc(adminDb, 'internal', 'seed_flag');
    try {
        const seedFlagDoc = await getDoc(seedFlagRef);

        if (!seedFlagDoc.exists()) {
            console.log("First time setup: Seeding initial data...");
            
            // Seed users
            await seedUser("admin@ctn.com", "password", "Admin");
            await seedUser("cantineiro@ctn.com", "password", "Cantineiro");
            
            // Seed other data
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
      // Run seed only in development
      if (process.env.NODE_ENV === 'development') {
        await runSeed();
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const storedRole = localStorage.getItem("ctn-user-role") as Role | null;
          if (storedRole) {
              const appUser = await mapFirebaseUserToCtnAppUser(firebaseUser, storedRole);
              setUser(appUser);
              setRole(appUser.role);
          } else {
             signOut(auth);
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const appUser = await mapFirebaseUserToCtnAppUser(userCredential.user, assignedRole);
      
      setUser(appUser);
      setRole(appUser.role);
      localStorage.setItem("ctn-user-role", appUser.role); // Store role for session persistence

      const dashboardRoute = getDashboardRouteForRole(appUser.role);
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error; // Rethrow to be caught by the UI
    }
  };

  const register = async (email: string, password: string) => {
     setLoading(true);
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       // The user profile will be created by `mapFirebaseUserToCtnAppUser` on first login
       // or can be created here if needed.
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
    localStorage.removeItem("ctn-user-role");
    setUser(null);
    setRole(null);
    router.push("/");
    setLoading(false);
  };
  
  // This effect handles the case where a logged-in user tries to access a login page
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
