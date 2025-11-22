"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
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
    try {
      const token = localStorage.getItem('sessionToken');
      const userJson = localStorage.getItem('user');
      if (token && userJson) {
        sessionToken = token;
        api.setToken(token);
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginPayload = {
        email: email,
        senha: password,
        device_name: navigator.userAgent || 'unknown_device',
      };
      
      const response = await api.post<{ token: string; user: any }>('/api/login', loginPayload);
      const { token, user: loggedInUser } = response;
      
      sessionToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      api.setToken(token);
      
      // The backend returns roles as an array, get the first one.
      const userRole = loggedInUser.roles?.[0]?.nome as Role || 'Cantineiro';

      const finalUser: CtnAppUser = {
        id: loggedInUser.id,
        name: loggedInUser.nome,
        nome: loggedInUser.nome,
        email: loggedInUser.email,
        role: userRole,
        id_escola: loggedInUser.id_escola,
        id_cantina: loggedInUser.id_cantina,
      };
      setUser(finalUser);
      
      const dashboardRoute = finalUser.role === Role.GlobalAdmin ? '/dashboard/admin' : 
                             finalUser.role === Role.EscolaAdmin ? '/dashboard/escola' :
                             '/orders'; // Cantineiro goes to orders
      router.push(dashboardRoute);
    } catch (error) {
      console.error("Login Error:", error);
      throw error; 
    } finally {
       setLoading(false);
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
    
    const publicPaths = ['/', '/admin/login', '/escola/login', '/cantina/login'];
    const isPublicPage = publicPaths.some(p => pathname === p);
    const isAuthenticated = !!user && !!sessionToken;

    if (!isAuthenticated && !isPublicPage) {
      router.push('/');
    }
    
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
