"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, Users, ShoppingCart, BookCopy, Store } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartView = 'revenue' | 'schools' | 'users' | 'canteens' | 'sales' | 'students';


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
  
  const AdminDashboard = () => {
    const [adminActiveChart, setAdminActiveChart] = useState<ChartView>('revenue');
    
    return (
      <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div onClick={() => setAdminActiveChart('revenue')} className={cn("rounded-lg cursor-pointer transition-all", adminActiveChart === 'revenue' && "ring-2 ring-primary")}>
                <StatsCard 
                  title="Receita Mensal"
                  value="R$45.231,89"
                  icon={DollarSign}
                  description="+20.1% do mês passado"
                />
              </div>
               <div onClick={() => setAdminActiveChart('schools')} className={cn("rounded-lg cursor-pointer transition-all", adminActiveChart === 'schools' && "ring-2 ring-primary")}>
                <StatsCard 
                  title="Escolas Ativas"
                  value="57"
                  icon={Building}
                  description="+19% do mês passado"
                />
              </div>
               <div onClick={() => setAdminActiveChart('canteens')} className={cn("rounded-lg cursor-pointer transition-all", adminActiveChart === 'canteens' && "ring-2 ring-primary")}>
                <StatsCard 
                  title="Cantinas Cadastradas"
                  value="82"
                  icon={Store}
                  description="+5 no último mês"
                />
              </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <OverviewChart activeView={adminActiveChart} />
            <RecentSales />
          </div>
      </>
    );
  }

  const EscolaDashboard = () => {
    const [escolaActiveChart, setEscolaActiveChart] = useState<ChartView>('sales');

    return (
     <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div onClick={() => setEscolaActiveChart('sales')} className={cn("rounded-lg cursor-pointer transition-all", escolaActiveChart === 'sales' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Vendas no Mês"
                value="R$12.345,67"
                icon={DollarSign}
                description="+15% do mês passado"
              />
            </div>
            <div onClick={() => setEscolaActiveChart('canteens')} className={cn("rounded-lg cursor-pointer transition-all", escolaActiveChart === 'canteens' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Cantinas Ativas"
                value="2"
                icon={BookCopy}
                description="Total de cantinas na escola"
              />
            </div>
            <div onClick={() => setEscolaActiveChart('students')} className={cn("rounded-lg cursor-pointer transition-all", escolaActiveChart === 'students' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Alunos Ativos"
                value="452"
                icon={Users}
                description="Alunos fazendo pedidos"
              />
            </div>
            <div onClick={() => setEscolaActiveChart('sales')} className={cn("rounded-lg cursor-pointer transition-all", escolaActiveChart === 'sales' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Pedidos Hoje"
                value="125"
                icon={ShoppingCart}
                description="Pedidos realizados hoje"
              />
            </div>
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <OverviewChart activeView={escolaActiveChart} />
          <RecentSales />
        </div>
    </>
    );
  };


  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Bem-vindo ao seu painel de controle." />
      {role === 'Admin' && <AdminDashboard />}
      {role === 'Escola' && <EscolaDashboard />}
    </div>
  );
}
