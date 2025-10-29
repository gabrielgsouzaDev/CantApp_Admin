"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import { onSnapshot } from "firebase/firestore";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChartData {
  name: string;
  total: number;
}

export function OverviewChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize months with 0 total
    const months: ChartData[] = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return {
        name: format(date, "MMM", { locale: ptBR }),
        total: 0,
      };
    });

    const ordersQuery = getOrders();
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => doc.data());
      
      const processedData = months.map(month => {
        const monthTotal = ordersData.reduce((acc, order) => {
          const orderMonth = format(new Date(order.time), "MMM", { locale: ptBR });
          if(orderMonth === month.name) {
            return acc + order.total;
          }
          return acc;
        }, 0);
        return { ...month, total: monthTotal };
      });

      setData(processedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
     <Card className="col-span-4">
        <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
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
                tickFormatter={(value) => `R$${value/1000}k`}
                />
                 <Tooltip 
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                    }}
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
