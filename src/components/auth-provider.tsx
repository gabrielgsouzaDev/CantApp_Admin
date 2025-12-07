"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

let sessionToken: string | null = null;
if (typeof window !== 'undefined') {
    sessionToken = localStorage.getItem('authToken');
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
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('user');
      if (token && userJson) {
        sessionToken = token;
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('authToken');
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
        password: password, 
        device_name: navigator.userAgent || 'unknown_device',
      };
      
      const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify(loginPayload),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Erro de login");
      }

      const { token, user: apiUser } = responseData.data;
      
      if (!token || !apiUser) {
        console.error("Resposta da API de Login Incompleta:", responseData);
        throw new Error("Resposta de login inválida: token ou usuário não encontrado.");
      }
      
      sessionToken = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(apiUser));
      }
      
      const userRole = apiUser.role as Role;

      const finalUser: CtnAppUser = {
        id: apiUser.id,
        name: apiUser.nome,
        nome: apiUser.nome,
        email: apiUser.email,
        role: userRole,
        id_escola: apiUser.id_escola,
        id_cantina: apiUser.id_cantina,
        ativo: apiUser.ativo,
      };
      setUser(finalUser);
      
      const dashboardRoute = finalUser.role === Role.GlobalAdmin ? '/dashboard/admin' : 
                             finalUser.role === Role.EscolaAdmin ? '/dashboard/escola' :
                             '/orders';
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
             await fetch(`${API_BASE_URL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                    'Accept': 'application/json',
                }
             });
        }
    } catch (error) {
        console.error("Logout failed, but clearing session anyway.", error);
    } finally {
        setUser(null);
        sessionToken = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
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
