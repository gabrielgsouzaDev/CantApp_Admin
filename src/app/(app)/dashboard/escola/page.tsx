"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Users, ShoppingCart, BookCopy } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChartView = 'sales' | 'canteens' | 'students';

export default function EscolaDashboardPage() {
    const [activeChart, setActiveChart] = useState<ChartView | null>('sales');

    return (
     <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard da Escola" description="Visão geral da sua instituição." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div onClick={() => setActiveChart('sales')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'sales' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Vendas no Mês"
                value="R$12.345,67"
                icon={DollarSign}
                description="+15% do mês passado"
              />
            </div>
            <div onClick={() => setActiveChart(null)} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'canteens' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Cantinas Ativas"
                value="2"
                icon={BookCopy}
                description="Total de cantinas na escola"
              />
            </div>
            <div onClick={() => setActiveChart('students')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'students' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Alunos Ativos"
                value="452"
                icon={Users}
                description="Alunos fazendo pedidos"
              />
            </div>
            <div onClick={() => setActiveChart('sales')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'sales' && "ring-2 ring-primary")}>
              <StatsCard 
                title="Pedidos Hoje"
                value="125"
                icon={ShoppingCart}
                description="Pedidos realizados hoje"
              />
            </div>
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {activeChart && <OverviewChart activeView={activeChart} />}
          <RecentSales />
        </div>
    </div>
    );
  }
