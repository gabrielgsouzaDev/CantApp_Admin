"use client";

import { User, Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { mockUsers } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user in local storage
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

  const login = (email: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundUser = Object.values(mockUsers).find(u => u.email === email);
      const userToLogin = foundUser || mockUsers.admin;
      setUser(userToLogin);
      localStorage.setItem("ctnadmin-user", JSON.stringify(userToLogin));
      router.push("/dashboard");
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ctnadmin-user");
    router.push("/login");
  };

  const setRole = (role: Role) => {
    if (user) {
      const newUser = { ...user, role };
      setUser(newUser);
      localStorage.setItem("ctnadmin-user", JSON.stringify(newUser));
    }
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, role, login, logout, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
