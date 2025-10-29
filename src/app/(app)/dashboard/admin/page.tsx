"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSubscriptions } from "@/components/dashboard/recent-subscriptions";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChartView = 'revenue' | 'schools' | 'users';

export default function AdminDashboardPage() {
  const [activeChart, setActiveChart] = useState<ChartView>('revenue');
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard do Admin" description="Visão geral do sistema." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => setActiveChart('revenue')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'revenue' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Receita Mensal"
              value="R$8.493,00"
              icon={DollarSign}
              description="+R$298 no último mês"
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
           <div onClick={() => setActiveChart('users')} className={cn("rounded-lg cursor-pointer transition-all", activeChart === 'users' && "ring-2 ring-primary")}>
            <StatsCard 
              title="Usuários Cadastrados"
              value="+1.280"
              icon={Users}
              description="+150 no último mês"
            />
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart activeView={activeChart} />
        <RecentSubscriptions />
      </div>
    </div>
  );
}
