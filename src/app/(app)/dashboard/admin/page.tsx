"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, CreditCard } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChartView = 'revenue' | 'schools' | 'subscriptions';

export default function AdminDashboardPage() {
  const [activeChart, setActiveChart] = useState<ChartView>('revenue');
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard do Admin" description="Visão geral do sistema." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => setActiveChart('revenue')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'revenue' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Receita Mensal Recorrente"
              value="R$8.493,00"
              icon={DollarSign}
              description="+R$298 no último mês"
            />
          </div>
           <div onClick={() => setActiveChart('subscriptions')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'subscriptions' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Assinaturas"
              value="57"
              icon={CreditCard}
              description="Total de escolas pagantes"
            />
          </div>
           <div onClick={() => setActiveChart('schools')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'schools' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Escolas Ativas"
              value="57"
              icon={Building}
              description="+2 no último mês"
            />
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart activeView={activeChart} />
        <RecentSales />
      </div>
    </div>
  );
}
