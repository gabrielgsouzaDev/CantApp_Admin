"use client";

import { AuthContext } from "@/components/auth-provider";
import { Role } from "@/lib/types";
import { useContext } from "react";

interface AuthHook {
  user: any;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
  loading: boolean;
}

export const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // Remove setRole from the returned object
  const { setRole, ...rest } = context as any;
  return rest;
};
