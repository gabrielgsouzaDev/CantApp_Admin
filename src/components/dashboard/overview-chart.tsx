"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Fev", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Abr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mai", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Ago", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Set", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Out", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dez", total: Math.floor(Math.random() * 5000) + 1000 },
]

export function OverviewChart() {
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
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
