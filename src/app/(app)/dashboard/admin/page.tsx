"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, Store } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChartView = 'revenue' | 'schools' | 'canteens';

export default function AdminDashboardPage() {
  const [activeChart, setActiveChart] = useState<ChartView>('revenue');
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard do Admin" description="Visão geral do sistema." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => setActiveChart('revenue')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'revenue' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Receita Mensal"
              value="R$45.231,89"
              icon={DollarSign}
              description="+20.1% do mês passado"
            />
          </div>
           <div onClick={() => setActiveChart('schools')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'schools' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Escolas Ativas"
              value="57"
              icon={Building}
              description="+19% do mês passado"
            />
          </div>
           <div onClick={() => setActiveChart('canteens')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'canteens' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Cantinas Cadastradas"
              value="82"
              icon={Store}
              description="+5 no último mês"
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