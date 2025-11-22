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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2, School as SchoolIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { SchoolRegistrationSchema } from "@/lib/schemas";
import { addSchool } from "@/services/schoolService";
import { addAddress } from "@/services/addressService";
import { addUser } from "@/services/userService";

export default function EscolaLoginPage() {
  const { login, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("escola@ctn.com");
  const [loginPassword, setLoginPassword] = useState("password");

  const form = useForm<z.infer<typeof SchoolRegistrationSchema>>({
    resolver: zodResolver(SchoolRegistrationSchema),
    defaultValues: {
      schoolName: "",
      cnpj: "",
      schoolQtdAlunos: 0,
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      address: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    },
  });

  const currentLoading = authLoading || loading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: error.message || "Email ou senha inválidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof SchoolRegistrationSchema>) => {
    setLoading(true);
    try {
      const newAddress = await addAddress(values.address);
      if (!newAddress?.id_endereco) throw new Error("Endereço não criado.");

      const newSchool = await addSchool({
        nome: values.schoolName,
        cnpj: values.cnpj,
        id_endereco: newAddress.id_endereco,
        status: "ativa",
        qtd_alunos: values.schoolQtdAlunos,
      });

      if (!newSchool?.id_escola) throw new Error("Escola não criada.");

      const newUser = await addUser({
        nome: values.adminName,
        email: values.adminEmail,
        senha: values.adminPassword,
        id_escola: newSchool.id_escola,
        id_role: 5,
        ativo: true,
      });

      if (!newUser?.id) throw new Error("Usuário admin não criado.");

      toast({
        title: "Cadastro concluído",
        description: "Agora é só logar.",
      });

      setActiveTab("login");
      setLoginEmail(values.adminEmail);
      setLoginPassword("");
    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Falha geral no cadastro.",
        variant: "destructive",
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
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
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
      form.setValue("address.logradouro", data.logradouro);
      form.setValue("address.bairro", data.bairro);
      form.setValue("address.cidade", data.localidade);
      form.setValue("address.estado", data.uf);
      form.setFocus("address.numero");

    } catch (error) {
      toast({ title: "Erro ao buscar CEP", description: "Não foi possível encontrar o endereço. Verifique o CEP.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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

            <TabsContent value="register">
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(handleRegister)}>
                      <CardContent className="space-y-4 pt-6 max-h-[60vh] overflow-y-auto pr-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Dados da Escola</h3>
                            <FormField control={form.control} name="schoolName" render={({ field }) => (
                              <FormItem><FormLabel>Nome da Escola</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                              <FormItem><FormLabel>CNPJ</FormLabel><FormControl><Input required disabled={currentLoading} {...field} onChange={handleCnpjChange} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="schoolQtdAlunos" render={({ field }) => (
                              <FormItem><FormLabel>Quantidade de Alunos</FormLabel><FormControl><Input type="number" required disabled={currentLoading} {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>

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
                                <FormField control={form.control} name="address.logradouro" render={({ field }) => (
                                    <FormItem><FormLabel>Rua</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="address.numero" render={({ field }) => (
                                        <FormItem><FormLabel>Número</FormLabel><FormControl><Input disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.complemento" render={({ field }) => (
                                        <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input disabled={currentLoading} {...field} /></FormControl><FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="address.bairro" render={({ field }) => (
                                    <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-3 gap-4">
                                     <FormField control={form.control} name="address.cidade" render={({ field }) => (
                                        <FormItem className="col-span-2"><FormLabel>Cidade</FormLabel><FormControl><Input required disabled={currentLoading} {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.estado" render={({ field }) => (
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
