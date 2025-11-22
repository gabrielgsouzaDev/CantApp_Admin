"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Users, ShoppingCart, BookCopy } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart, ChartView } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// Define a structure for our stat cards to make the code cleaner
interface StatCardConfig {
  id: ChartView;
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  isClickable: boolean;
}

const statCards: StatCardConfig[] = [
  {
    id: 'sales',
    title: "Vendas no Mês",
    value: "R$12.345,67",
    icon: DollarSign,
    description: "+15% do mês passado",
    isClickable: true,
  },
  {
    id: 'canteens',
    title: "Cantinas Ativas",
    value: "2",
    icon: BookCopy,
    description: "Total de cantinas na escola",
    isClickable: true,
  },
  {
    id: 'students',
    title: "Alunos Ativos",
    value: "452",
    icon: Users,
    description: "+28 no último mês",
    isClickable: true,
  },
  {
    id: 'orders',
    title: "Pedidos Hoje",
    value: "125",
    icon: ShoppingCart,
    description: "+12% vs. ontem",
    isClickable: true,
  },
];

export default function EscolaDashboardPage() {
    const [activeChart, setActiveChart] = useState<ChartView>('sales');

    return (
     <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard da Escola" description="Visão geral da sua instituição." />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div 
                key={card.id}
                onClick={() => card.isClickable && setActiveChart(card.id)} 
                className={cn(
                  "rounded-lg transition-all", 
                  card.isClickable && "cursor-pointer",
                  activeChart === card.id && "ring-2 ring-primary"
                )}
              >
                <StatsCard 
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  description={card.description}
                />
              </div>
            ))}
        </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <OverviewChart activeView={activeChart} />
          <RecentSales />
        </div>
    </div>
    );
  }