"use client";

import { AuthContext } from "@/components/auth-provider";
import { Role } from "@/lib/types";
import { useContext } from "react";
import { UserCredential } from "firebase/auth";

interface AuthHook {
  user: any;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, roleHint?: Role) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<UserCredential>;
  logout: () => void;
}

export const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
