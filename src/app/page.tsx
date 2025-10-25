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
            <span className="text-primary">inteligente e centralizada</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            CTNADMIN é a plataforma completa para Escolas e Cantinas que buscam otimizar a gestão de pedidos, pagamentos e produtos. Menos filas, mais controle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="text-left hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Para Escolas</CardTitle>
                <CardDescription>Coordene cantinas, acesse relatórios financeiros e tenha uma visão unificada da operação.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleLoginAs("Escola")}>
                  Entrar como Escola <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="text-left hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Para Cantinas</CardTitle>
                <CardDescription>Receba pedidos online, gerencie seu cardápio digital e simplifique seu dia a dia.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => handleLoginAs("Cantineiro")}>
                  Entrar como Cantina <ArrowRight className="ml-2" />
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
