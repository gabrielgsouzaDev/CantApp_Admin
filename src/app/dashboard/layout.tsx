"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { Loader2 } from "lucide-react";
import { getDashboardRouteForRole } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
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

  // If the user lands on the root of the authenticated area, redirect them to their specific dashboard.
  if (typeof window !== 'undefined' && (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/')) {
     const dashboardRoute = getDashboardRouteForRole(user.role);
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