"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { getRecentSales } from "@/services/orderService";
import { Loader2 } from "lucide-react";

export function RecentSales() {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchSales = async () => {
        setLoading(true);
        try {
            // This service already fetches real data
            const salesData = await getRecentSales();
            setSales(salesData);
        } catch (error) {
            console.error("Failed to fetch recent sales", error);
        } finally {
            setLoading(false);
        }
     }
    fetchSales();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>As últimas 5 vendas realizadas.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-8">
                    {sales.map((sale) => (
                        <div key={sale.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                              {/* Future: Replace with real avatar if available */}
                              <AvatarImage src={`https://avatar.vercel.sh/${sale.student_name}.png`} alt="Avatar" data-ai-hint="avatar person" />
                              <AvatarFallback>{getInitials(sale.student_name)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{sale.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                                Pedido #{sale.id}
                            </p>
                            </div>
                            <div className="ml-auto font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total)}
                            </div>
                        </div>
                    ))}
                     {sales.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-10">Nenhuma venda recente encontrada.</p>
                     )}
                </div>
            )}
        </CardContent>
    </Card>
  )
}