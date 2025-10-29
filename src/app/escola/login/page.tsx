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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2, School } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function EscolaLoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login("Escola");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Registering with:", email, password);
    login("Escola");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <Tabs defaultValue="login" className="w-full">
            <CardHeader className="text-center pb-4">
                <Link href="/" className="mx-auto mb-4">
                    <Logo />
                </Link>
                <div className="flex justify-center items-center gap-2">
                    <School className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-headline">Portal da Escola</CardTitle>
                </div>
                 <CardDescription>
                    Acesse sua conta ou cadastre sua instituição.
                </CardDescription>
            </CardHeader>
            <div className="px-6">
                 <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
            </div>
            
            {/* Login Tab */}
            <TabsContent value="login">
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="diretor@escola.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">Senha</Label>
                            <Input 
                                id="login-password" 
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
                            {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
                        </Button>
                    </CardFooter>
                </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-6">
                         <div className="space-y-2">
                            <Label htmlFor="register-school-name">Nome da Escola</Label>
                            <Input id="register-school-name" required disabled={loading} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="register-email">Email de Contato</Label>
                            <Input id="register-email" type="email" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-password">Crie uma Senha</Label>
                            <Input id="register-password" type="password" required disabled={loading} />
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "Cadastrar minha Escola"}
                        </Button>
                    </CardFooter>
                </form>
            </TabsContent>
        </Tabs>
        <div className="text-center pb-6">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary">
                Voltar à página inicial
            </Link>
        </div>
      </Card>
    </div>
  );
}