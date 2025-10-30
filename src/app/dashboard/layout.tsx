"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se o utilizador aceder à raiz da área autenticada, redirecione-o para o seu painel de controlo específico.
  if (typeof window !== 'undefined' && (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/')) {
     let dashboardRoute = '/';
     if (role === 'GlobalAdmin') dashboardRoute = '/dashboard/admin';
     if (role === 'EscolaAdmin') dashboardRoute = '/dashboard/escola';
     if (role === 'Cantineiro') dashboardRoute = '/orders';
     
     router.replace(dashboardRoute);
     return (
       <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
     );
  }

  return (
    <SidebarProvider>
        <SiteSidebar />
        <SidebarInset>
            <SiteHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
