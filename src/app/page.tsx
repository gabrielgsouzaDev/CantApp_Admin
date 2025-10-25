"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { ArrowRight, Wallet, School, Utensils, Zap, Users, Store } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLoginAs = (role: Role) => {
    login(role);
    router.push("/dashboard");
  };

  const appLaptopImage = PlaceHolderImages.find(img => img.id === 'app-laptop');
  const appMobileImage = PlaceHolderImages.find(img => img.id === 'app-mobile');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
          <div className="mr-4 flex">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" onClick={() => router.push('/login')}>Entrar</Button>
            <Button onClick={() => router.push('/login')}>Começar Agora</Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="w-full py-20 md:py-32">
          <div className="container flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 max-w-4xl">
              A gestão da cantina escolar, <br />
              <span className="text-primary">inteligente e centralizada</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">
              CTNAPP é a plataforma completa para Escolas e Cantinas que buscam otimizar a gestão de pedidos, pagamentos e produtos. Menos filas, mais controle e resultados para todos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
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
        </section>

        <section id="features" className="w-full bg-secondary/50 py-20 md:py-24">
           <div className="container px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Chega de filas e preocupações. O futuro da cantina é digital.</h2>
                        <p className="text-muted-foreground text-lg">Com o CTNAPP, a rotina da cantina se torna mais simples e eficiente, e a gestão escolar ganha um poderoso aliado.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                            <Utensils className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Cardápio Digital</CardTitle>
                            <CardDescription>Apresente seus produtos de forma atraente e facilite a escolha.</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                            <Zap className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Pedidos Online</CardTitle>
                            <CardDescription>Os alunos pedem e pagam pelo app, retirando na cantina sem filas.</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                            <Wallet className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Controle Financeiro</CardTitle>
                            <CardDescription>Visão clara das vendas, faturamento e relatórios completos.</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                            <School className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Gestão Escolar</CardTitle>
                            <CardDescription>Acompanhe o desempenho das cantinas parceiras em tempo real.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Como Funciona?</h2>
              <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">Simples para todos os envolvidos, da matrícula ao lanche.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-24 w-24 mb-4 bg-accent/20 rounded-full">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pais e Alunos</h3>
                <p className="text-muted-foreground">Consultam o cardápio, fazem pedidos e pagam online, com total segurança e comodidade.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="flex items-center justify-center h-24 w-24 mb-4 bg-accent/20 rounded-full">
                  <Store className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cantinas</h3>
                <p className="text-muted-foreground">Recebem os pedidos no sistema, preparam com antecedência e otimizam a operação, sem filas e com mais vendas.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="flex items-center justify-center h-24 w-24 mb-4 bg-accent/20 rounded-full">
                  <School className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Escolas</h3>
                <p className="text-muted-foreground">Acompanham tudo através de um painel centralizado, com relatórios financeiros e de desempenho.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="py-20 md:py-24 bg-secondary/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                {appLaptopImage && (
                  <Image
                    src={appLaptopImage.imageUrl}
                    alt={appLaptopImage.description}
                    width={1024}
                    height={768}
                    className="rounded-lg shadow-2xl"
                    data-ai-hint={appLaptopImage.imageHint}
                  />
                )}
                {appMobileImage && (
                  <div className="absolute -bottom-12 -right-12 w-48 md:w-56">
                    <Image
                      src={appMobileImage.imageUrl}
                      alt={appMobileImage.description}
                      width={300}
                      height={600}
                      className="rounded-lg shadow-2xl border-4 border-background"
                      data-ai-hint={appMobileImage.imageHint}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Sua escola já usa o CTNAPP?</h2>
                <p className="text-muted-foreground text-lg">Cadastre agora mesmo ou faça o login caso já tenha acesso.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button variant="outline" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 hover:text-white">
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-79.9 60.1zM470.6 278.6c0 24.3-15.6 45.6-39.9 51.4l-280.8-161.2-60.1 80 161.2 280.8c5.8 24.3-27.1 45.6-51.4 39.9L13.1 278.6c-24.3-5.8-24.3-45.6 0-51.4l457.5-161.2c24.3-5.8 51.4 15.6 51.4 39.9v172.8z"></path></svg>
                        <span>Disponível no <br/> <b>Google Play</b></span>
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 hover:text-white">
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 3-64.4 20.7-84.7 14.8-16.5 47.9-24.8 72.9-25.7-1.1 34.2-13.7 61.2-33.3 80.9-16.4 16.4-37.4 25.4-59.3 25.4 .1 0 .1 0 0 0zM224 0c-72.6 0-134.4 59.2-134.4 131.9 0 62.8 40.2 116.8 97.2 130.3-57.5 48.6-97.2 118.3-97.2 195.1 0 4.2 3.4 7.6 7.6 7.6h151.2c4.2 0 7.6-3.4 7.6-7.6 0-76.8-39.7-146.5-97.2-195.1 57-13.5 97.2-67.5 97.2-130.3 0-72.7-61.8-131.9-134.4-131.9z"></path></svg>
                        <span>Baixar na <br/> <b>App Store</b></span>
                    </Button>
                </div>
                <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/login')}>Acessar via Web</Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="border-t">
        <div className="container mx-auto py-8 text-center text-sm text-muted-foreground px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} CTNAPP. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
