"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { ArrowRight, Wallet, School, Store, BarChart, Package, Shield, Apple, Settings, Zap, ClipboardList, Smartphone, ShoppingBag, CreditCard, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AdvantageView = 'admin' | 'user';


export default function LandingPage() {
  const router = useRouter();
  const [advantageView, setAdvantageView] = useState<AdvantageView>('admin');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-4 flex">
            <Logo />
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Começar Agora</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/escola/login")}>
                  <School className="mr-2 h-4 w-4" />
                  <span>Sou uma Escola</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/cantina/login")}>
                   <Store className="mr-2 h-4 w-4" />
                  <span>Sou uma Cantina</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/admin/login")}>
                   <Shield className="mr-2 h-4 w-4" />
                   <span>Sou Admin</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
             <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="text-left border-primary/20">
                    <CardHeader>
                        <CardTitle>Área Administrativa</CardTitle>
                        <CardDescription>Gerencie sua operação, cardápios e finanças.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <Button asChild className="justify-center">
                          <Link href="/escola/login"><School />Acessar como Escola</Link>
                        </Button>
                        <Button asChild className="justify-center">
                          <Link href="/cantina/login"><Store />Acessar como Cantina</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="text-left border-border">
                    <CardHeader>
                        <CardTitle>Portal do Usuário</CardTitle>
                        <CardDescription>Faça pedidos, recargas e acompanhe o consumo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button variant="outline" className="w-full justify-center">
                            Acessar como Aluno ou Responsável
                        </Button>
                    </CardContent>
                </Card>
             </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32">
            <div className="container px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Recursos para Transformar sua Gestão</h2>
                    <p className="text-muted-foreground text-lg mt-2 max-w-3xl mx-auto">Ferramentas poderosas para uma operação mais eficiente e lucrativa.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-0 max-w-6xl mx-auto">
                    <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:z-10 rounded-lg">
                        <CardHeader className="text-center items-center">
                            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
                                <Zap className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Otimização Total</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">Reduza filas com pedidos antecipados, agilize o atendimento com cardápio digital e modernize pagamentos com Pix e saldo pré-pago.</p>
                        </CardContent>
                    </Card>

                    <Card className="transform transition-transform duration-300 md:-translate-y-8 hover:-translate-y-10 hover:shadow-2xl hover:z-20 rounded-lg bg-card border-2 border-primary shadow-lg">
                         <CardHeader className="text-center items-center">
                            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
                                <Settings className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Controle Centralizado</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">Monitore vendas, faturamento e estoque em tempo real. Acesse relatórios completos e tome decisões baseadas em dados para escalar seu negócio.</p>
                        </CardContent>
                    </Card>

                    <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:z-10 rounded-lg">
                         <CardHeader className="text-center items-center">
                            <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>Segurança e Autonomia</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">Dê aos pais o poder de gerenciar o consumo dos filhos com restrições de produtos e limites de gastos diários, promovendo uma alimentação mais saudável.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-32 bg-secondary/50">
          <div className="container px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Como Funciona?</h2>
            <p className="text-muted-foreground text-lg mt-2 max-w-3xl mx-auto mb-8">
              Uma jornada simples e conectada, do cadastro à gestão diária. Clique para ver o passo a passo.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">Veja o Passo a Passo</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">A Jornada do Pedido no CTNAPP</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                  <div className="relative py-8">
                    {/* Timeline Line */}
                    <div className="absolute left-6 h-full w-0.5 bg-border -translate-x-1/2"></div>

                    {/* Timeline Items */}
                    <div className="space-y-12">
                      
                      {/* Step 1 */}
                      <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                          <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="w-full pl-20">
                            <h3 className="font-semibold text-lg mb-1 text-left">1. Cadastro e Estoque</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              A Escola e a Cantina se cadastram, montam o cardápio digital e adicionam a quantidade inicial de cada produto no estoque.
                            </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                       <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                          <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                            <CreditCard className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="w-full pl-20">
                            <h3 className="font-semibold text-lg mb-1 text-left">2. Recarga dos Pais</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              Os pais acessam a plataforma, associam seus filhos e adicionam créditos na carteira digital via Pix ou cartão.
                            </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                          <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                            <Smartphone className="h-5 w-5" />
                          </div>
                        </div>
                         <div className="w-full pl-20">
                            <h3 className="font-semibold text-lg mb-1 text-left">3. Pedido Antecipado</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              O aluno, pelo app, escolhe o lanche com antecedência, garantindo o produto e agilizando o intervalo.
                            </p>
                          </div>
                      </div>

                       {/* Step 4 */}
                      <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                            <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="w-full pl-20">
                             <h3 className="font-semibold text-lg mb-1 text-left">4. Preparo e Baixa no Estoque</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              A cantina recebe o pedido, prepara o lanche e o sistema automaticamente dá baixa no item do estoque.
                            </p>
                          </div>
                      </div>

                      {/* Step 5 */}
                      <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                           <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                              <ShoppingBag className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="w-full pl-20">
                             <h3 className="font-semibold text-lg mb-1 text-left">5. Retirada Rápida</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              No intervalo, o aluno apenas retira o pedido no balcão, sem filas e sem manusear dinheiro, usando um QR code.
                            </p>
                          </div>
                      </div>
                      
                      {/* Step 6 */}
                      <div className="relative">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-border z-10">
                           <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full text-primary">
                              <BarChart className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="w-full pl-20">
                            <h3 className="font-semibold text-lg mb-1 text-left">6. Gestão e Análise</h3>
                            <p className="text-sm text-muted-foreground text-left">
                              A Escola e a Cantina acompanham vendas, estoque e faturamento em tempo real, com relatórios completos para otimização.
                            </p>
                          </div>
                      </div>

                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        
        <section id="advantages" className="py-20 md:py-32 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Vantagens para Todos</h2>
                <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
                  Descubra como o CTNAPP transforma a gestão para cada perfil.
                </p>
              </div>
               <Select value={advantageView} onValueChange={(value) => setAdvantageView(value as AdvantageView)}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Para a Área Administrativa</SelectItem>
                  <SelectItem value="user">Para o Portal do Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {advantageView === 'admin' && (
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
            )}
            {advantageView === 'user' && (
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
            )}
          </div>
        </section>

        <section id="cta" className="py-20 md:py-24 bg-secondary/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div></div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Acesse de qualquer lugar.</h2>
                <p className="text-muted-foreground text-lg">Use o CTNAPP no seu computador ou baixe o aplicativo para celular e tenha a gestão da cantina sempre à mão.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                   <Button asChild variant="outline" className="h-auto justify-center p-0 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2">
                       <div className="flex flex-col text-left">
                         <span className="text-xs">Disponível no</span>
                         <span className="font-bold text-base -mt-1">Google Play</span>
                      </div>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto justify-center p-0 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2">
                       <div className="flex flex-col text-left">
                         <span className="text-xs">Baixar na</span>
                         <span className="font-bold text-base -mt-1">App Store</span>
                      </div>
                    </a>
                  </Button>
                </div>
                 <Button size="lg" className="w-full sm:w-auto mt-2" onClick={() => router.push('/escola/login')}>
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
                <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push('/escola/login')}>
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
