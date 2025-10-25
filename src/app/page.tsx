"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLoginAs = (role: Role) => {
    login(role);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="p-4 flex justify-between items-center">
        <Logo />
        <Button onClick={() => router.push('/dashboard')}>Acessar Painel</Button>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            A gestão da cantina escolar, <br />
            <span className="text-primary">simplificada</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            CTNADMIN centraliza pedidos, produtos e relatórios em uma plataforma intuitiva para administradores, escolas e cantineiros.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-left hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription>Visão completa e controle total do sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleLoginAs("Admin")}>
                  Entrar como Admin <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="text-left hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Escola</CardTitle>
                <CardDescription>Gerencie cantinas e acompanhe os dados.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleLoginAs("Escola")}>
                  Entrar como Escola <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="text-left hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Cantineiro</CardTitle>
                <CardDescription>Gerencie produtos e visualize os pedidos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleLoginAs("Cantineiro")}>
                  Entrar como Cantineiro <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CTNADMIN. Todos os direitos reservados.
      </footer>
    </div>
  );
}
