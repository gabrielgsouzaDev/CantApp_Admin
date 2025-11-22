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
import { Loader2, School as SchoolIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SchoolRegistrationSchema } from "@/lib/schemas";
import { addSchool } from "@/services/schoolService";


export default function EscolaLoginPage() {
  const { login, register, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("escola@ctn.com");
  const [loginPassword, setLoginPassword] = useState("password");

  const form = useForm<z.infer<typeof SchoolRegistrationSchema>>({
    resolver: zodResolver(SchoolRegistrationSchema),
    defaultValues: {
      schoolName: "",
      cnpj: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      address: {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      }
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: error.message || "Email ou senha inválidos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof SchoolRegistrationSchema>) => {
    setLoading(true);
    try {
      // 1. Create the School
      const schoolPayload = {
        name: values.schoolName,
        cnpj: values.cnpj,
        address: `${values.address.street}, ${values.address.number}`, // Simplified address for now
        status: 'active',
        qtd_alunos: 0, // Default value
      };
      
      const newSchool = await addSchool(schoolPayload);

      if (!newSchool || !newSchool.id) {
        throw new Error("Falha ao criar a escola. O ID não foi retornado.");
      }

      // 2. Register the Admin User for that School
      const userPayload = {
        name: values.adminName,
        email: values.adminEmail,
        password: values.adminPassword,
        id_escola: newSchool.id,
        role: "EscolaAdmin" // Backend should handle assigning role based on logic
      };
      
      await register(userPayload);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua escola e seu usuário admin foram criados. Agora você pode fazer o login."
      })
      setActiveTab("login");
      setLoginEmail(values.adminEmail);
      setLoginPassword("");

    } catch (error: any)
     {
      let errorMessage = "Não foi possível completar o cadastro.";
      if (error.code === 'auth/email-already-in-use' || (error.message && error.message.includes('unique'))) {
        errorMessage = "Este email já está em uso. Tente outro.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Erro no Cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    form.setValue("cnpj", value.substring(0, 18));
  };
  
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    form.setValue("address.cep", value.substring(0, 9));
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error("CEP não encontrado");
      }
      const data = await response.json();
      if (data.erro) {
        toast({ title: "CEP não encontrado", variant: "destructive" });
        return;
      }
      form.setValue("address.street", data.logradouro);
      form.setValue("address.neighborhood", data.bairro);
      form.setValue("address.city", data.localidade);
      form.setValue("address.state", data.uf);
      form.setFocus("address.number");

    } catch (error) {
      toast({ title: "Erro ao buscar CEP", description: "Não foi possível encontrar o endereço. Verifique o CEP.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const currentLoading = authLoading || loading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="text-center pb-4">
                <Link href="/" className="mx-auto mb-4">
                    <Logo />
                </Link>
                <div className="flex justify-center items-center gap-2">
                    <SchoolIcon className="h-6 w-6 text-primary" />
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
                                disabled={currentLoading}
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
                                disabled={currentLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={currentLoading}>
                            {currentLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
                        </Button>
                    </CardFooter>
                </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(handleRegister)}>
                      <CardContent className="space-y-4 pt-6 max-h-[60vh] overflow-y-auto pr-4">
                          {/* School Details */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Dados da Escola</h3>
                            <FormField control={form.control} name="schoolName" render={({ field }) => (
                              <FormItem><FormLabel>Nome da Escola</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                              <FormItem><FormLabel>CNPJ</FormLabel><FormControl><Input required disabled={currentLoading} {...field} onChange={handleCnpjChange} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>

                          {/* Admin User Details */}
                           <div className="space-y-2 pt-4">
                             <h3 className="text-sm font-medium">Dados do Administrador da Escola</h3>
                              <FormField control={form.control} name="adminName" render={({ field }) => (
                                <FormItem><FormLabel>Nome Completo do Admin</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="adminEmail" render={({ field }) => (
                                <FormItem><FormLabel>Email do Admin</FormLabel><FormControl><Input type="email" required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="adminPassword" render={({ field }) => (
                                <FormItem><FormLabel>Crie uma Senha para o Admin</FormLabel><FormControl><Input type="password" required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                           </div>

                           {/* Address Details */}
                           <div className="space-y-2 pt-4">
                             <h3 className="text-sm font-medium">Endereço da Escola</h3>
                              <div className="grid grid-cols-1 gap-4">
                                <FormField control={form.control} name="address.cep" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input required disabled={currentLoading} {...field} onChange={handleCepChange} onBlur={handleCepBlur} />
                                                {loading && !authLoading && <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2" />}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="address.street" render={({ field }) => (
                                    <FormItem><FormLabel>Rua</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="address.number" render={({ field }) => (
                                        <FormItem><FormLabel>Número</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.complement" render={({ field }) => (
                                        <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="address.neighborhood" render={({ field }) => (
                                    <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-3 gap-4">
                                     <FormField control={form.control} name="address.city" render={({ field }) => (
                                        <FormItem className="col-span-2"><FormLabel>Cidade</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.state" render={({ field }) => (
                                        <FormItem><FormLabel>Estado</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                           </div>
                      </CardContent>
                       <CardFooter>
                          <Button type="submit" className="w-full" disabled={currentLoading}>
                              {currentLoading ? <Loader2 className="animate-spin" /> : "Cadastrar minha Escola"}
                          </Button>
                      </CardFooter>
                  </form>
                </FormProvider>
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
