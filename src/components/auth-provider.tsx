"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// This will be our in-memory "session" storage for the token.
// In a real app, you'd use localStorage or secure cookies.
let sessionToken: string | null = null;
if (typeof window !== 'undefined') {
    sessionToken = localStorage.getItem('sessionToken');
}

interface AuthContextType {
  user: CtnAppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    if (sessionToken) {
      api.setToken(sessionToken);
      try {
        const authenticatedUser = await api.get<{user: CtnAppUser}>('/me');
        setUser(authenticatedUser.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        sessionToken = null;
        api.setToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sessionToken');
        }
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: loggedInUser } = await api.post<{ token: string; user: CtnAppUser }>('/login', { email, password });
      
      sessionToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', token);
      }
      api.setToken(token);
      setUser(loggedInUser);
      
      const dashboardRoute = loggedInUser.role === 'GlobalAdmin' ? '/dashboard/admin' : 
                             loggedInUser.role === 'EscolaAdmin' ? '/dashboard/escola' :
                             '/orders';
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error; // Re-throw to be caught in the UI
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      // In a real scenario, you might log the user in automatically after registration.
      await api.post('/register', data);
    } catch (error) {
      console.error("Registration Error:", error);
      throw error; // Re-throw to be caught in the UI
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionToken = null;
    api.setToken(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionToken');
    }
    router.push("/");
  };
  
  useEffect(() => {
    if (loading) {
      return;
    }
    
    const isAuthPage = ['/', '/admin/login', '/escola/login', '/cantina/login'].includes(pathname);

    if (!user && !isAuthPage) {
      router.push('/');
    } else if (user && isAuthPage) {
      const dashboardRoute = user.role === 'GlobalAdmin' ? '/dashboard/admin' : 
                             user.role === 'EscolaAdmin' ? '/dashboard/escola' :
                             '/orders';
      router.push(dashboardRoute);
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
