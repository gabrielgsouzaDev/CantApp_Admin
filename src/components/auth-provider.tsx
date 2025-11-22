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
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CtnAppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      
      const response = await api.post<{ data: { token: string; user: any } }>('/api/login', loginPayload);
      const { token, user: loggedInUser } = response.data;
      
      sessionToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      api.setToken(token);
      
      const finalUser: CtnAppUser = {
        id: loggedInUser.id,
        name: loggedInUser.nome,
        nome: loggedInUser.nome,
        email: loggedInUser.email,
        role: loggedInUser.role as Role,
        id_escola: loggedInUser.id_escola,
        id_cantina: loggedInUser.id_cantina,
      };
      setUser(finalUser);
      
      const dashboardRoute = finalUser.role === 'Admin' ? '/dashboard/admin' : 
                             finalUser.role === 'Escola' ? '/dashboard/escola' :
                             '/orders'; // Cantineiro goes to orders
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error; 
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
        if(sessionToken) {
            await api.post('/api/logout', {});
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
    } else if (isAuthenticated && isAuthPage && user) {
      const dashboardRoute = user.role === 'Admin' ? '/dashboard/admin' : 
                             user.role === 'Escola' ? '/dashboard/escola' :
                             '/orders';
      router.push(dashboardRoute);
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}