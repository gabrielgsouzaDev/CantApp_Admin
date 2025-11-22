"use client";

import { PageHeader } from "@/components/page-header";
import { DollarSign, Users, ShoppingCart, BookCopy } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart, ChartView } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSchoolDashboardStats, SchoolDashboardStats } from "@/services/statsService";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardConfig {
  id: ChartView;
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  isClickable: boolean;
  dataKey: keyof SchoolDashboardStats;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function EscolaDashboardPage() {
    const { user } = useAuth();
    const [activeChart, setActiveChart] = useState<ChartView>('sales');
    const [stats, setStats] = useState<SchoolDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id_escola) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getSchoolDashboardStats(user.id_escola!);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível buscar as estatísticas do dashboard.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user?.id_escola]);

    const statCards: StatCardConfig[] = [
      {
        id: 'sales',
        title: "Vendas no Mês",
        value: stats ? formatCurrency(stats.monthlySales) : "R$ 0,00",
        icon: DollarSign,
        description: `${stats?.monthlySalesDelta ?? 0}% do mês passado`,
        isClickable: true,
        dataKey: 'monthlySales'
      },
      {
        id: 'canteens',
        title: "Cantinas Ativas",
        value: String(stats?.activeCanteens ?? 0),
        icon: BookCopy,
        description: "Total de cantinas na escola",
        isClickable: true,
        dataKey: 'activeCanteens'
      },
      {
        id: 'students',
        title: "Alunos Ativos",
        value: String(stats?.activeStudents ?? 0),
        icon: Users,
        description: `+${stats?.newStudentsLastMonth ?? 0} no último mês`,
        isClickable: true,
        dataKey: 'activeStudents'
      },
      {
        id: 'orders',
        title: "Pedidos Hoje",
        value: String(stats?.ordersToday ?? 0),
        icon: ShoppingCart,
        description: `${stats?.ordersTodayDelta ?? 0}% vs. ontem`,
        isClickable: true,
        dataKey: 'ordersToday'
      },
    ];
    
    if (loading) {
      return (
        <div className="flex flex-col gap-6">
          <PageHeader title="Dashboard da Escola" description="Visão geral da sua instituição." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="h-[422px] col-span-4" />
              <Skeleton className="h-[422px] col-span-3" />
          </div>
        </div>
      );
    }

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