"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChartConfig {
  title: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line';
  unit: string;
}

interface ChartDataPoint {
  name: string;
  total: number;
}

export type ChartView = 'sales' | 'students' | 'canteens' | 'orders' | 'revenue' | 'schools' | 'users';

const generateMockData = (formatter: (value: number) => number) => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      name: format(date, "MMM", { locale: ptBR }),
      total: formatter(Math.random() * 5000),
    };
  });
};

const mockData: Record<ChartView, ChartConfig> = {
  // Escola Dashboard
  sales: {
    title: "Vendas (Últimos 12 Meses)",
    data: generateMockData((v) => v * 5),
    type: 'line',
    unit: 'R$',
  },
  students: {
    title: "Alunos Ativos (Últimos 12 Meses)",
    data: generateMockData((v) => Math.floor(v / 20)),
    type: 'bar',
    unit: '',
  },
  canteens: {
    title: "Performance das Cantinas",
    data: [
        { name: "Cantina Principal", total: 4500 },
        { name: "Cantina Anexo", total: 2800 },
    ],
    type: 'bar',
    unit: 'R$'
  },
  orders: {
    title: "Pedidos Realizados (Últimos 12 Meses)",
    data: generateMockData((v) => Math.floor(v / 15)),
    type: 'bar',
    unit: ''
  },
  // Admin Dashboard
  revenue: {
    title: "Receita Mensal (Últimos 12 Meses)",
    data: generateMockData((v) => v * 10),
    type: 'line',
    unit: 'R$',
  },
  schools: {
     title: "Novas Escolas (Últimos 12 Meses)",
     data: generateMockData((v) => Math.floor(v / 100)),
     type: 'bar',
     unit: '',
  },
  users: {
     title: "Novos Usuários (Últimos 12 Meses)",
     data: generateMockData((v) => Math.floor(v / 10)),
     type: 'bar',
     unit: '',
  },
};


export function OverviewChart({ activeView }: { activeView: ChartView }) {
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);

  useEffect(() => {
    if(mockData[activeView]) {
      setChartConfig(mockData[activeView]);
    }
  }, [activeView]);

  if (!chartConfig) {
    return (
       <Card className="col-span-4">
        <CardHeader>
            <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
           <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">Selecione uma métrica para visualizar o gráfico.</div>
        </CardContent>
    </Card>
    );
  }

  const { title, data, type, unit } = chartConfig;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = unit === 'R$'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        : value.toLocaleString();

      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
              <span className="font-bold text-muted-foreground">{formattedValue}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const renderChart = () => {
      if (type === 'line') {
        return (
             <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => unit === 'R$' ? `R$${Number(value) / 1000}k` : `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
            </ResponsiveContainer>
        )
      }

      return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => unit === 'R$' ? `R$${Number(value) / 1000}k` : `${value}`}
                />
                 <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))'}} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      )
  }

  return (
     <Card className="col-span-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
           {renderChart()}
        </CardContent>
    </Card>
  )
}