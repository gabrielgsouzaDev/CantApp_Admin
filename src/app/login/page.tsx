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
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@ctn.com");
  const [password, setPassword] = useState("password");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Faça login para acessar seu painel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
            <p className="text-xs text-muted-foreground">
              Use <code className="font-mono p-1 bg-muted rounded-sm">admin@ctn.com</code>, <code className="font-mono p-1 bg-muted rounded-sm">escola@ctn.com</code>, ou <code className="font-mono p-1 bg-muted rounded-sm">cantineiro@ctn.com</code> para testar.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
