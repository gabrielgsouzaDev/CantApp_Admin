
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { ArrowRight, Wallet, School, Utensils, Zap, Users, Store, BarChart, Package, Shield, Apple, FileDigit, UtensilsCrossed } from "lucide-react";
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

        <section id="features" className="py-20 md:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Recursos Principais</h2>
                <p className="text-muted-foreground text-lg mt-2 max-w-3xl mx-auto">Uma plataforma completa com as ferramentas certas para modernizar a cantina escolar.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-primary/10 rounded-lg">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <span>Pagamentos Rápidos e Seguros</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Modernize as transações com a carteira digital pré-paga do CTNAPP ou pagamentos via Pix. Os pais carregam créditos de forma segura e os alunos compram sem precisar de dinheiro, agilizando o atendimento e aumentando a segurança.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                 <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                     <div className="flex items-center justify-center h-12 w-12 bg-primary/10 rounded-lg">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                     </div>
                     <span>Cardápio Digital</span>
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <CardDescription>
                    Alunos e pais podem consultar o cardápio, reservar lanches com antecedência pelo app e acabar com as filas. Menos tempo de espera, mais tempo para o intervalo.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                     <div className="flex items-center justify-center h-12 w-12 bg-primary/10 rounded-lg">
                      <FileDigit className="h-6 w-6 text-primary" />
                     </div>
                     <span>Controle e Relatórios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <CardDescription>
                    Painel administrativo completo para escolas e cantinas acompanharem vendas, estoque e faturamento em tempo real, gerando insights para decisões mais inteligentes.
                  </CardDescription>
                </CardContent>
              </Card>
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
            <Tabs defaultValue="admin" className="w-full max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Para Escolas e Cantinas</TabsTrigger>
                <TabsTrigger value="user">Para Pais e Alunos</TabsTrigger>
              </TabsList>
              <TabsContent value="admin">
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center gap-2">
                    <BarChart className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Controle e Visão Estratégica</h3>
                    <p className="text-muted-foreground text-sm">Acesse dashboards com dados de vendas, faturamento e desempenho em tempo real para tomar as melhores decisões.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Package className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Gestão de Produtos</h3>
                    <p className="text-muted-foreground text-sm">Crie e gerencie cardápios digitais, controle o estoque de forma inteligente e evite desperdícios.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Wallet className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Centralização Financeira</h3>
                    <p className="text-muted-foreground text-sm">Monitore todas as transações, automatize relatórios e simplifique a conciliação financeira.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="user">
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Zap className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Adeus às Filas</h3>
                    <p className="text-muted-foreground text-sm">Compre antecipadamente pelo app e apenas retire o lanche no intervalo. Mais tempo livre para o que importa.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Pagamento Fácil e Seguro</h3>
                    <p className="text-muted-foreground text-sm">Utilize saldo pré-pago ou Pix para fazer compras de forma rápida e segura, sem precisar de dinheiro em espécie.</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Apple className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-lg mt-2">Controle Alimentar na Mão</h3>
                    <p className="text-muted-foreground text-sm">Pais podem definir limites de gastos diários e restringir produtos, garantindo uma alimentação mais saudável.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="cta" className="py-20 md:py-24 bg-secondary/50">
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
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Acesse de qualquer lugar.</h2>
                <p className="text-muted-foreground text-lg">Use o CTNAPP no seu computador ou baixe o aplicativo para celular e tenha a gestão da cantina sempre à mão.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                  <Button asChild variant="outline" className="h-auto justify-center p-0">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2">
                       <div className="flex flex-col text-left">
                         <span className="text-xs">Disponível no</span>
                         <span className="font-bold text-base -mt-1">Google Play</span>
                      </div>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto justify-center p-0">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2">
                       <div className="flex flex-col text-left">
                         <span className="text-xs">Baixar na</span>
                         <span className="font-bold text-base -mt-1">App Store</span>
                      </div>
                    </a>
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
        
        <section id="faq" className="py-20 md:py-32 bg-background">
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

    

    