"use client";

import { User, Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { mockUsers } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ctnadmin-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Could not parse user from localStorage", error);
      localStorage.removeItem("ctnadmin-user");
    }
    setLoading(false);
  }, []);

  const login = (role: Role) => {
    setLoading(true);
    const userToLogin = Object.values(mockUsers).find(u => u.role === role) || mockUsers.admin;
    setUser(userToLogin);
    localStorage.setItem("ctnadmin-user", JSON.stringify(userToLogin));
    if (role === "Cantineiro") {
      router.push("/orders");
    } else {
      router.push("/dashboard");
    }
    // setLoading(false) is called inside the /dashboard or /orders page after redirection.
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ctnadmin-user");
    router.push("/");
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
