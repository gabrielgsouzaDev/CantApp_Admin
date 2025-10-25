import { PageHeader } from "@/components/page-header";
import { DollarSign, Building, Users, ShoppingCart } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentSales } from "@/components/dashboard/recent-sales";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Bem-vindo ao seu painel de controle." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Receita Total"
          value="R$45.231,89"
          icon={DollarSign}
          description="+20.1% do mês passado"
        />
        <StatsCard 
          title="Pedidos"
          value="+2350"
          icon={ShoppingCart}
          description="+180.1% do mês passado"
        />
        <StatsCard 
          title="Escolas Ativas"
          value="57"
          icon={Building}
          description="+19% do mês passado"
        />
        <StatsCard 
          title="Novos Usuários"
          value="+573"
          icon={Users}
          description="+201 desde a última hora"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart />
        <RecentSales />
      </div>
    </div>
  );
}
