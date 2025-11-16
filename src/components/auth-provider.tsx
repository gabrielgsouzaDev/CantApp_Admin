"use client";

import { Role, CtnAppUser } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { mockUsers } from "@/lib/mocks";

// This will be our in-memory "session" storage for the token.
// In a real app, you'd use localStorage or secure cookies.
let sessionToken: string | null = null;

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
        // In a real app, you would call a /me or /user endpoint
        // const authenticatedUser = await api.get<CtnAppUser>('/me');
        
        // MOCK: Find the user from mock data based on the token.
        // This is insecure and for demo purposes only.
        const userEmail = Object.keys(mockUsers).find(email => sessionToken?.includes(email.split('@')[0]));
        if (userEmail) {
            setUser(mockUsers[userEmail]);
        } else {
            // Invalid token
            sessionToken = null;
            api.setToken(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        sessionToken = null;
        api.setToken(null);
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
      // REAL API CALL:
      // const { token, user } = await api.post<{ token: string; user: CtnAppUser }>('/login', { email, password });
      
      // MOCK IMPLEMENTATION:
      if (mockUsers[email] && password === 'password') {
        const loggedInUser = mockUsers[email];
        const token = `mock-jwt-token-for-${loggedInUser.email.split('@')[0]}`;
        
        sessionToken = token;
        api.setToken(token);
        setUser(loggedInUser);
        
        const dashboardRoute = loggedInUser.role === 'GlobalAdmin' ? '/dashboard/admin' : 
                               loggedInUser.role === 'EscolaAdmin' ? '/dashboard/escola' :
                               '/orders';
        router.push(dashboardRoute);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      throw error; // Re-throw to be caught in the UI
    }
    // No need to set loading to false here, as page navigation will happen
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      // REAL API CALL:
      // const { user, token } = await api.post<{ user: CtnAppUser, token: string }>('/register', data);
      
      // MOCK IMPLEMENTATION:
      console.log("Registering user with data:", data);
      // In a real scenario, you might log the user in automatically after registration.
      // For this demo, we'll just log success and let them log in manually.
      
      // We don't log them in, just simulate success.
      await new Promise(resolve => setTimeout(resolve, 500)); 

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
    router.push("/");
  };
  
  // This effect handles redirection logic
  useEffect(() => {
    if (loading) {
      return; // Don't do anything while loading
    }
    
    const isAuthPage = ['/', '/admin/login', '/escola/login', '/cantina/login'].includes(pathname);

    if (!user && !isAuthPage) {
      // If user is not logged in and not on an auth page, redirect to home
      router.push('/');
    } else if (user && isAuthPage) {
      // If user is logged in and on an auth page, redirect to their dashboard
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
