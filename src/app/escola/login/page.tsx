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
import { useToast } from "@/hooks/use-toast";
import { addSchool } from "@/services/schoolService";

export default function EscolaLoginPage() {
  const { login, register, loading } = useAuth();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [registerSchoolName, setRegisterSchoolName] = useState("");
  const [registerCnpj, setRegisterCnpj] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword, "Escola");
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: error.message || "Email ou senha inválidos.",
        variant: "destructive"
      })
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await register(registerEmail, registerPassword);
      const user = userCredential.user;
      
      const schoolData = {
        name: registerSchoolName,
        cnpj: registerCnpj,
        address: registerAddress,
        status: "active" as "active" | "inactive",
        ownerUid: user.uid, // Link school to the authenticated user
      };
      
      await addSchool(schoolData);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua escola foi cadastrada. Você já pode fazer o login."
      })
      // Ideally, switch to login tab and pre-fill email
    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível completar o cadastro.",
        variant: "destructive"
      });
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    setRegisterCnpj(value.substring(0, 18));
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
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">Senha</Label>
                            <Input 
                                id="login-password" 
                                type="password" 
                                required 
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
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
                            <Input id="register-school-name" required disabled={loading} value={registerSchoolName} onChange={e => setRegisterSchoolName(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-cnpj">CNPJ</Label>
                            <Input id="register-cnpj" required disabled={loading} value={registerCnpj} onChange={handleCnpjChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="register-address">Endereço</Label>
                            <Input id="register-address" required disabled={loading} value={registerAddress} onChange={e => setRegisterAddress(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="register-email">Email de Contato</Label>
                            <Input id="register-email" type="email" required disabled={loading} value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-password">Crie uma Senha</Label>
                            <Input id="register-password" type="password" required disabled={loading} value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
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
