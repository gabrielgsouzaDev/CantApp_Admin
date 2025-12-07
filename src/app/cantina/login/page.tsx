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
import { useEffect, useState } from "react";
import { Loader2, Store } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUser, UserCreationPayload } from "@/services/userService";
import { getAllCanteens } from "@/services/canteenService";
import { Canteen } from "@/lib/types";

const CanteenRegistrationSchema = z.object({
  nome: z.string().min(3, "O nome é obrigatório."),
  email: z.string().email("Email inválido."),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  id_cantina: z.coerce.number().int().positive("Selecione uma cantina."),
});

export default function CantinaLoginPage() {
  const { login, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const form = useForm<z.infer<typeof CanteenRegistrationSchema>>({
    resolver: zodResolver(CanteenRegistrationSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const data = await getAllCanteens();
        setCanteens(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar cantinas",
          description: "Não foi possível buscar a lista de cantinas.",
          variant: "destructive",
        });
      }
    };
    fetchCanteens();
  }, [toast]);

  const currentLoading = authLoading || loading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: "Email ou senha inválidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof CanteenRegistrationSchema>) => {
    setLoading(true);
    try {
      const payload: UserCreationPayload = {
        ...values,
        id_role: 3, // 3 = Cantineiro
        ativo: true,
      };
      
      await addUser(payload);

      toast({
        title: "Cadastro concluído",
        description: "Sua conta foi criada. Agora você pode fazer o login.",
      });

      setActiveTab("login");
      setLoginEmail(values.email);
      setLoginPassword("");
      form.reset();

    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Falha ao criar a conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="text-center pb-4">
            <Link href="/" className="mx-auto mb-4">
              <Logo />
            </Link>
            <div className="flex justify-center items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-headline">Portal da Cantina</CardTitle>
            </div>
            <CardDescription>
              Acesse sua conta ou cadastre-se para começar.
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cantina@escola.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={currentLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={currentLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={currentLoading}>
                  {currentLoading ? ( <Loader2 className="animate-spin" /> ) : ( "Entrar" )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)}>
                <CardContent className="space-y-4 pt-6">
                  <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input required disabled={currentLoading} placeholder="Seu nome" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" required disabled={currentLoading} placeholder="seu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="senha" render={({ field }) => (
                    <FormItem><FormLabel>Crie uma Senha</FormLabel><FormControl><Input type="password" required disabled={currentLoading} placeholder="Mínimo 6 caracteres" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="id_cantina" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Sua Cantina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                            <SelectTrigger disabled={currentLoading}>
                                <SelectValue placeholder="Selecione a cantina onde você trabalha" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {canteens.map(canteen => (
                                <SelectItem key={canteen.id} value={String(canteen.id)}>
                                {canteen.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={currentLoading}>
                    {currentLoading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
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
