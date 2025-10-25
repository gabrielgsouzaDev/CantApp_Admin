"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { ArrowRight, Wallet, School, Utensils, Zap } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Users, Store } from "lucide-react";

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
                        <svg className="mr-3 h-8 w-8" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M215.1,113.3l-96-56a16,16,0,0,0-16.2,0l-96,56A16,16,0,0,0,0,128V192a16,16,0,0,0,16,16H240a16,16,0,0,0,16-16V128A16,16,0,0,0,215.1,113.3ZM16,132.9l91.2-53.2,74.4,43.4H16ZM240,192H16V144H192v24a8,8,0,0,0,16,0V144h32Z"/><path d="M112,56a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H128a16,16,0,0,0-16,16Zm16-8h96V56H128Z"/></svg>
                        <div className="text-left">
                            <span className="text-xs">Disponível no</span>
                            <p className="font-bold text-base">Google Play</p>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-auto w-full sm:w-auto text-primary border-primary hover:bg-primary/5 hover:text-primary">
                         <svg className="mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6,3.4c-1.9-2-4.8-2.6-7.1-1.8c-2.3,0.8-4.2,2.9-4.8,5.4c-0.7,2.5-0.1,5.2,1.5,7.2c0.8,1,1.9,1.9,3.1,2.5 c1.2,0.6,2.5,0.8,3.8,0.7c0.2,0,0.3,0,0.5,0c1.2,0,2.4-0.3,3.5-0.8c0.1,0,0.1-0.1,0.2-0.1c1-0.5,1.9-1.2,2.7-2 c-1.3,0-2.6-0.5-3.5-1.5c-1-1-1.5-2.3-1.5-3.6c0-1.4,0.5-2.7,1.4-3.7c-0.1-0.1-0.3-0.2-0.4-0.3c-1.2-0.9-2.7-1.4-4.3-1.4 c-0.8,0-1.5,0.1-2.2,0.4c-0.2-1.3,0.2-2.6,1.1-3.6c0.9-1,2.2-1.6,3.6-1.6c0.5,0,1,0.1,1.5,0.3C18.1,3.2,17.8,3.3,17.6,3.4z M13.8,2.2C13.8,2.2,13.8,2.2,13.8,2.2c-0.2,0.6-0.3,1.2-0.4,1.8c-0.5-0.2-1-0.4-1.5-0.4c-1,0-1.9,0.4-2.6,1.2 c-0.6,0.7-1,1.7-0.8,2.8c0.6-0.2,1.2-0.3,1.8-0.3c2.4,0,4.6,1.1,6.2,2.8c-0.1,0.2-0.2,0.3-0.2,0.5c-0.7,0.9-1.1,2-1.1,3.2 c0,1.4,0.6,2.8,1.6,3.8c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.1,0.1,0.2,0.2c-0.7,0.6-1.5,1-2.3,1.2c-0.1,0-0.1,0-0.2,0 c-0.9,0.2-1.9,0.1-2.8-0.2c-0.9-0.3-1.8-0.9-2.4-1.6c-1.3-1.6-1.7-3.7-1.2-5.7C9,8.5,10.6,6.7,12.9,6c0.5-1,1.3-1.8,2.2-2.5 C14.6,3,14.2,2.6,13.8,2.2z"/></svg>
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
