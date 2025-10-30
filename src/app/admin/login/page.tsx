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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLoginPage() {
  const { login, register, loading } = useAuth();
  const [email, setEmail] = useState("admin@ctn.com"); // default for demo
  const [password, setPassword] = useState("password"); // default for demo
  
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, "GlobalAdmin");
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: "Email ou senha inválidos.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerEmail, registerPassword, "GlobalAdmin");
      toast({
        title: "Cadastro realizado!",
        description: "Agora você pode fazer o login com suas credenciais."
      });
      setActiveTab("login");
      setEmail(registerEmail);
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível realizar o cadastro.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="text-center pb-4">
             <Link href="/" className="mx-auto mb-4">
              <Logo />
            </Link>
            <div className="flex justify-center items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-headline">Acesso Restrito</CardTitle>
            </div>
            <CardDescription>
              Faça login ou cadastre-se para acessar o painel.
            </CardDescription>
          </CardHeader>
           <div className="px-6">
                 <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="register">Cadastrar (Dev)</TabsTrigger>
                </TabsList>
            </div>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
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
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="novo.admin@example.com"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    required 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Cadastrar Novo Admin"
                  )}
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