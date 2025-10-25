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
        <section id="hero" className="w-full py-20 md:py-32">
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
        
        <section id="cta" className="py-20 md:py-24 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
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
                  <div className="absolute -bottom-16 -right-12 w-48 md:w-56">
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
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Acesse de qualquer lugar.</h2>
                <p className="text-muted-foreground text-lg">Use o CTNAPP no seu computador ou baixe o aplicativo para celular e tenha a gestão da cantina sempre à mão.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button variant="outline" className="h-auto w-full sm:w-auto text-primary border-primary hover:bg-primary/5 hover:text-primary">
                        <svg className="mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.4 3.425L14.45 12 4.4 20.575V3.425ZM5.8 5.85v12.3L12.025 12 5.8 5.85Zm9.9 0v12.3H17.1V5.85h-1.4Z"/></svg>
                        <div className="text-left">
                            <span className="text-xs">Disponível no</span>
                            <p className="font-bold text-base">Google Play</p>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-auto w-full sm:w-auto text-primary border-primary hover:bg-primary/5 hover:text-primary">
                         <svg className="mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.802 18.064c.297-.433.43-1.002.43-1.572 0-.64-.176-1.185-.53-1.638-.352-.454-.833-.68-1.442-.68-.61 0-1.08.226-1.413.68-.335.453-.502 1-.502 1.638 0 .57.135 1.135.405 1.695.27.56.635.98 1.094 1.258.46.28.97.42 1.53.42.597 0 1.1-.153 1.516-.46.417-.306.74-.716.97-1.221H18.8l.002.004ZM14.93 5.467c.725-1.015 1.72-1.522 2.985-1.522 1.11 0 1.95.223 2.52.668.57.446.855 1.106.855 1.983 0 .42-.08.776-.238 1.07-.158.293-.365.52-.62.68-.255.16-.543.24-.863.24-.48 0-.895-.14-1.245-.42-.35-.28-.58-.64-.69-1.08h-3.3c-.024.46-.144.87-.36 1.23-.215.36-.506.66-.87.9-.364.24-.793.36-1.288.36-.71 0-1.28-.24-1.71-.72-.43-.48-.645-1.11-.645-1.89 0-1.08.385-1.92 1.155-2.52.77-.6 1.815-.9 3.135-.9.465 0 .9.06 1.305.18l.045.03Zm-1.125 1.83c.315-.225.56-.54.735-.945.175-.405.263-.87.263-1.395 0-.585-.16-1.04-.48-1.365-.32-.325-.79-.488-1.41-.488-.81 0-1.425.26-1.845.78-.42.52-.63 1.245-.63 2.175 0 .525.135.945.405 1.26.27.315.63.473 1.08.473.495 0 .89-.15 1.185-.45Z"/></svg>
                         <div className="text-left">
                            <span className="text-xs">Baixar na</span>
                            <p className="font-bold text-base">App Store</p>
                        </div>
                    </Button>
                </div>
                <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/login')}>Acessar via Web</Button>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-32 bg-secondary/50">
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
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-8 text-center text-sm text-muted-foreground px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} CTNAPP. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
