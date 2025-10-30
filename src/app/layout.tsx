"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { Loader2 } from "lucide-react";
import { getDashboardRouteForRole } from "@/lib/utils";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

// Metadata can't be in a client component, so we keep the root layout server-side
// and wrap the content in a client component.
// export const metadata: Metadata = {
//   title: 'Bemmu. - Gestão Inteligente para Cantinas Escolares',
//   description: 'Otimize pedidos, pagamentos e estoque da sua cantina escolar. Menos filas, mais controle e segurança para pais, alunos e escolas.',
//   icons: {
//     icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22hsl(18 97% 51%)%22></rect><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-family=%22Nunito, sans-serif%22 font-size=%2260%22 font-weight=%22bold%22 fill=%22white%22>B</text></svg>',
//   },
// };


function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/escola/login') || pathname.startsWith('/cantina/login') || pathname === '/';

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/");
    }
  }, [user, loading, router, isAuthPage]);


  if (isAuthPage) {
    return <>{children}</>
  }
  
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se o usuário está na raiz da área logada, redireciona para o dashboard correto
  if (typeof window !== 'undefined' && (window.location.pathname === '/app' || window.location.pathname === '/app/')) {
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Bemmu. - Gestão Inteligente para Cantinas Escolares</title>
        <meta name="description" content="Otimize pedidos, pagamentos e estoque da sua cantina escolar. Menos filas, mais controle e segurança para pais, alunos e escolas." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22hsl(18 97% 51%)%22></rect><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-family=%22Nunito, sans-serif%22 font-size=%2260%22 font-weight=%22bold%22 fill=%22white%22>B</text></svg>" />
      </head>
      <body className={`${nunito.variable} font-body antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppContent>{children}</AppContent>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
