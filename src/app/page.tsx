
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { ArrowRight, Wallet, School, Utensils, Zap, Users, Store, BarChart, Package, Shield, Apple } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLoginAs = (role: Role) => {
    login(role);
    router.push("/dashboard");
  };

  const appLaptopImage = PlaceHolderImages.find(img => img.id === 'app-laptop');
  const appMobileImage = PlaceHolderImages.find(img => img.id === 'app-mobile');
  const adminDashboardImage = PlaceHolderImages.find(img => img.id === 'admin-dashboard');
  const parentAppImage = PlaceHolderImages.find(img => img.id === 'parent-app');

  const googlePlayIcon = (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 mr-2">
      <path d="M22.715 11.391c-.13-.23-.39-.39-.65-.39h-1.95V7.4C20.115 4.42 17.695 2 14.715 2H9.315c-2.98 0-5.4 2.42-5.4 5.4v3.6h-1.9c-.26 0-.52.16-.65.39-.13.23-.13.51 0 .74l5.35 9.25c.13.23.39.39.65.39h5.4c.26 0 .52-.16.65-.39l5.35-9.25c.13-.23.13-.51-.05-.74zM10.715 4.3c.33-.29.83-.17 1.01.29l2.53 6.41h-6.73l3.19-6.7zm-2.8 8.1h6.2l-3.1 5.37-3.1-5.37z" />
    </svg>
  );

  const appleIcon = (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 mr-2">
      <path d="M19.25 15.65c-.25.13-.5.25-.75.38-.5.25-1.01.37-1.5.37-.5 0-1.01-.12-1.5-.37s-.88-.5-1.26-.75c-.37-.25-.75-.5-1.12-.75s-.75-.5-1.13-.75c-1.12-.75-2.5-1.12-4-1.12-1.25 0-2.5.63-3.75 1.88-1.5 1.5-2.25 3.37-2.25 5.62 0 1.5.38 2.88 1.13 4.13.75 1.25 1.75 2.25 3 3 .75.5 1.5.75 2.25.75.75 0 1.38-.25 2-.75s1.25-1.12 1.87-1.87c.63-.75 1-1.5 1.13-2.25h-4.62c-.5 0-.88-.13-1.12-.37-.25-.25-.38-.63-.38-1.13s.13-.88.38-1.12c.25-.25.63-.38 1.12-.38h6.25c.25 0 .5.13.75.38.25.25.37.5.37.75 0 .75-.25 1.5-.75 2.25-.5.75-1.12 1.38-1.87 1.87-.75.5-1.63.75-2.63.75-1 0-1.87-.25-2.62-.75s-1.38-1.12-1.88-1.87c-.5-.75-.75-1.63-.75-2.63 0-1.25.37-2.37 1.12-3.37s1.62-1.5 2.62-1.5c.25 0 .5.13.75.38s.5.5.75.75c.25.25.63.5 1.13.75s1.12.5 1.87.75c.75.25 1.38.38 1.88.38.75 0 1.37-.25 1.87-.75.5-.5.75-1.13.75-1.88 0-.87-.37-1.75-1.12-2.62-.75-.88-1.75-1.37-3-1.5-1.25-.12-2.5.25-3.75 1.12-.25.13-.5.25-.75.38-.25.12-.38.12-.5 0-.13 0-.25-.13-.37-.38s0-.5.13-.75c.12-.25.37-.5.75-.75s.75-.5 1.12-.75c1.13-.75 2.5-1.12 4-1.12 1.25 0 2.5.63 3.75 1.88 1.5 1.5 2.25 3.37 2.25 5.62 0 .5-.12 1-.37 1.37z" />
    </svg>
  );

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
              <div className="relative order-last md:order-first">
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
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Acesse de qualquer lugar.</h2>
                <p className="text-muted-foreground text-lg">Use o CTNAPP no seu computador ou baixe o aplicativo para celular e tenha a gestão da cantina sempre à mão.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                   <Button variant="outline" className="h-auto text-primary border-primary hover:bg-primary/5 hover:text-primary">
                    <div className="flex items-center justify-center gap-3 px-2 py-1">
                      <div className="text-left">
                        <p className="text-xs">Disponível no</p>
                        <p className="font-bold text-base -mt-1">Google Play</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto text-primary border-primary hover:bg-primary/5 hover:text-primary">
                    <div className="flex items-center justify-center gap-3 px-2 py-1">
                      <div className="text-left">
                        <p className="text-xs">Baixar na</p>
                        <p className="font-bold text-base -mt-1">App Store</p>
                      </div>
                    </div>
                  </Button>
                </div>
                 <Button size="lg" className="w-full sm:w-auto mt-2" onClick={() => router.push('/login')}>
                  Acessar via Web
                  <ArrowRight className="ml-2" />
                </Button>
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
                <div className="flex items-center justify-center h-24 w-24 mb-4 bg-primary/10 rounded-full">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pais e Alunos</h3>
                <p className="text-muted-foreground">Consultam o cardápio, fazem pedidos e pagam online, com total segurança e comodidade.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="flex items-center justify-center h-24 w-24 mb-4 bg-primary/10 rounded-full">
                  <Store className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cantinas</h3>
                <p className="text-muted-foreground">Recebem os pedidos no sistema, preparam com antecedência e otimizam a operação, sem filas e com mais vendas.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="flex items-center justify-center h-24 w-24 mb-4 bg-primary/10 rounded-full">
                  <School className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Escolas</h3>
                <p className="text-muted-foreground">Acompanham tudo através de um painel centralizado, com relatórios financeiros e de desempenho.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="advantages" className="py-20 md:py-32 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Vantagens para Todos</h2>
              <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto">
                Descubra como o CTNAPP transforma a gestão para cada perfil.
              </p>
            </div>
            <Tabs defaultValue="admin" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Para Escolas e Cantinas</TabsTrigger>
                <TabsTrigger value="user">Para Pais e Alunos</TabsTrigger>
              </TabsList>
              <TabsContent value="admin">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <BarChart className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Controle e Visão Estratégica</h3>
                            <p className="text-muted-foreground">Acesse dashboards com dados de vendas, faturamento e desempenho em tempo real para tomar as melhores decisões.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Package className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Gestão de Produtos</h3>
                            <p className="text-muted-foreground">Crie e gerencie cardápios digitais, controle o estoque de forma inteligente e evite desperdícios.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Wallet className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Centralização Financeira</h3>
                            <p className="text-muted-foreground">Monitore todas as transações, automatize relatórios e simplifique a conciliação financeira.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                         {adminDashboardImage && (
                            <Image
                                src={adminDashboardImage.imageUrl}
                                alt={adminDashboardImage.description}
                                width={500}
                                height={400}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={adminDashboardImage.imageHint}
                            />
                         )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="user">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6">
                     <div className="grid md:grid-cols-2 gap-8 items-center">
                       <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <Zap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Adeus às Filas</h3>
                            <p className="text-muted-foreground">Compre antecipadamente pelo app e apenas retire o lanche no intervalo. Mais tempo livre para o que importa.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Pagamento Fácil e Seguro</h3>
                            <p className="text-muted-foreground">Utilize saldo pré-pago ou Pix para fazer compras de forma rápida e segura, sem precisar de dinheiro em espécie.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Apple className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">Controle Alimentar na Mão</h3>
                            <p className="text-muted-foreground">Pais podem definir limites de gastos diários e restringir produtos, garantindo uma alimentação mais saudável.</p>
                          </div>
                        </div>
                      </div>
                       <div className="flex items-center justify-center order-first md:order-last">
                         {parentAppImage && (
                            <Image
                                src={parentAppImage.imageUrl}
                                alt={parentAppImage.description}
                                width={500}
                                height={400}
                                className="rounded-lg shadow-lg"
                                data-ai-hint={parentAppImage.imageHint}
                            />
                         )}
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        <section id="faq" className="py-20 md:py-32 bg-secondary/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Dúvidas?</h2>
                <p className="text-muted-foreground text-lg">Ainda tem dúvidas? Queremos te ouvir, clique no botão abaixo e entre em contato com nossa equipe.</p>
                <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/contact')}>
                  Fale com nossa equipe
                </Button>
              </div>
              <div className="md:col-span-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como o aluno irá efetuar a compra na cantina?</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm text-muted-foreground max-w-none">
                        <p>
                          Para evitar filas, o aluno pode usar o aplicativo para reservar o pedido com antecedência e apenas retirá-lo no intervalo.
                        </p>
                        <p className="mt-2">
                          Ele também pode comprar diretamente no intervalo, pagando com Pix ou com o saldo pré-pago disponível em sua conta CTNAPP.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Como posso gerenciar a alimentação do meu filho?</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm text-muted-foreground max-w-none">
                        O CTNAPP oferece ferramentas para que você gerencie os hábitos alimentares do seu filho de forma personalizada:
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          <li><strong>Controle de Produtos:</strong> Defina quais itens do cardápio seu filho pode ou não pode consumir. Essa restrição pode ser configurada para dias específicos da semana.</li>
                          <li><strong>Limite de Gastos Diário:</strong> Estabeleça um valor máximo para as compras diárias. Se o limite for atingido, o sistema impede novas compras, ajudando no controle do orçamento.</li>
                        </ul>
                        <p className="mt-2">Você pode combinar ambos os recursos para um controle ainda mais completo.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Quero usar o CTNAPP, quanto custa?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Para pais e alunos, o aplicativo é gratuito. A escola contrata o serviço e o nosso plano básico começa em R$149,00 por mês.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
