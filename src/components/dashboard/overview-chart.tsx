"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for different views
const generateMockData = (formatter: (value: number) => number, unit: string = 'R$') => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      name: format(date, "MMM", { locale: ptBR }),
      total: formatter(Math.random() * 5000),
      unit,
    };
  });
};

const mockData = {
  revenue: generateMockData((v) => v * 10, 'R$'),
  schools: generateMockData((v) => Math.floor(v / 100), ''),
  users: generateMockData((v) => Math.floor(v / 10), ''),
  canteens: generateMockData((v) => Math.floor(v / 200), ''),
  sales: generateMockData((v) => v * 5, 'R$'),
  students: generateMockData((v) => Math.floor(v / 20), ''),
};

const chartTitles: Record<string, string> = {
    revenue: "Receita Total (Últimos 12 Meses)",
    schools: "Novas Escolas (Últimos 12 Meses)",
    users: "Novos Usuários (Últimos 12 Meses)",
    canteens: "Novas Cantinas (Últimos 12 Meses)",
    sales: "Vendas (Últimos 12 Meses)",
    students: "Alunos Ativos (Últimos 12 Meses)",
}

interface ChartData {
  name: string;
  total: number;
  unit: string;
}

type ChartView = 'revenue' | 'schools' | 'users' | 'canteens' | 'sales' | 'students';

export function OverviewChart({ activeView }: { activeView: ChartView }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // In a real app, you would fetch data based on activeView
    setData(mockData[activeView]);
    setTitle(chartTitles[activeView] || "Visão Geral");
  }, [activeView]);

  return (
     <Card className="col-span-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                tickFormatter={(value) => {
                    const unit = data[0]?.unit || '';
                    if (unit === 'R$') {
                        return `R$${value/1000}k`;
                    }
                    return `${value}`;
                }}
                />
                 <Tooltip 
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                    }}
                    formatter={(value: number, name, props) => {
                        const unit = props.payload.unit || '';
                         if (unit === 'R$') {
                           return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                         }
                         return value.toLocaleString();
                    }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
