"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

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
    // This function is tricky without a /me endpoint that uses the token.
    // For now, we rely on the user object from login.
    // A real implementation would verify the token with the backend.
    setLoading(false);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      sessionToken = token;
      api.setToken(token);
      setUser(JSON.parse(userJson));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginPayload = {
        email: email,
        senha: password,
        device_name: navigator.userAgent || 'unknown_device',
      };
      
      const { token, user: loggedInUser } = await api.post<{ token: string; user: CtnAppUser }>('/login', loginPayload);
      
      sessionToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
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
      throw error; 
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      // The backend `store` method expects `nome` and `senha`, not `name` and `password`.
      const registerPayload = {
        nome: data.name,
        email: data.email,
        senha: data.password,
        id_escola: data.schoolId, 
        // Any other fields required by your backend
      };
      await api.post('/users', registerPayload);
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
        if(sessionToken) {
            await api.post('/logout', {});
        }
    } catch (error) {
        console.error("Logout failed, but clearing session anyway.", error);
    } finally {
        setUser(null);
        sessionToken = null;
        api.setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('user');
        }
        router.push("/");
        setLoading(false);
    }
  };
  
  useEffect(() => {
    if (loading) {
      return;
    }
    
    const isAuthPage = ['/', '/admin/login', '/escola/login', '/cantina/login'].includes(pathname);
    const isAuthenticated = !!user && !!sessionToken;

    if (!isAuthenticated && !isAuthPage) {
      router.push('/');
    } else if (isAuthenticated && isAuthPage) {
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
