"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, Users, ShoppingCart, BookCopy } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "Cantineiro") {
      router.replace("/orders");
    }
  }, [role, loading, router]);

  if (loading || role === "Cantineiro") {
    return (
      <div className="flex h-full min-h-[calc(100vh-120px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const renderAdminDashboard = () => (
    <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Receita Total"
              value="R$45.231,89"
              icon={DollarSign}
              description="+20.1% do mês passado"
            />
            <StatsCard 
              title="Escolas Ativas"
              value="57"
              icon={Building}
              description="+19% do mês passado"
            />
            <StatsCard 
              title="Usuários Cadastrados"
              value="+573"
              icon={Users}
              description="+201 desde a última hora"
            />
            <StatsCard 
              title="Pedidos no Mês"
              value="+2350"
              icon={ShoppingCart}
              description="+180.1% do mês passado"
            />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <OverviewChart />
          <RecentSales />
        </div>
    </>
  );

  const renderEscolaDashboard = () => (
     <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Vendas no Mês"
              value="R$12.345,67"
              icon={DollarSign}
              description="+15% do mês passado"
            />
            <StatsCard 
              title="Cantinas Ativas"
              value="2"
              icon={BookCopy}
              description="Total de cantinas na escola"
            />
             <StatsCard 
              title="Alunos Ativos"
              value="452"
              icon={Users}
              description="Alunos fazendo pedidos"
            />
            <StatsCard 
              title="Pedidos Hoje"
              value="125"
              icon={ShoppingCart}
              description="Pedidos realizados hoje"
            />
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <OverviewChart />
          <RecentSales />
        </div>
    </>
  );


  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Bem-vindo ao seu painel de controle." />
      {role === 'Admin' && renderAdminDashboard()}
      {role === 'Escola' && renderEscolaDashboard()}
    </div>
  );
}
