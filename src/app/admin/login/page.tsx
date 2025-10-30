"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@ctn.com"); // default for demo
  const [password, setPassword] = useState("password"); // default for demo
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); 
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: "Email ou senha inválidos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center pb-4">
             <Link href="/" className="mx-auto mb-4">
              <Logo />
            </Link>
            <div className="flex justify-center items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-headline">Acesso Restrito</CardTitle>
            </div>
            <CardDescription>
              Faça login para acessar o painel de admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="text-center pb-6">
             <Link href="/" className="text-xs text-muted-foreground hover:text-primary">
                Voltar à página inicial
            </Link>
        </div>
      </Card>
    </div>
  );
}
