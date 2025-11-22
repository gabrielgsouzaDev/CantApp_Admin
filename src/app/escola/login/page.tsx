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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>

          <CardHeader className="text-center">
            <Logo />
            <CardTitle className="text-2xl">Portal da Escola</CardTitle>
            <CardDescription>Login ou cadastro</CardDescription>
            <TabsList className="grid grid-cols-2 mt-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <Label>Email</Label>
                <Input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                <Label>Senha</Label>
                <Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={currentLoading}>
                  {currentLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)}>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="schoolName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Escola</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Cadastrar Escola</Button>
                </CardFooter>
              </form>
            </FormProvider>
          </TabsContent>

        </Tabs>
      </Card>
    </div>
  );
}
