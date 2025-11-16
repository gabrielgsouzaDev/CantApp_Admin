"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { getRecentSales } from "@/services/orderService";

const mockUsers: { [key: string]: { avatar: string } } = {
  joao: { avatar: "https://i.pravatar.cc/150?u=joao" },
  maria: { avatar: "https://i.pravatar.cc/150?u=maria" },
  pedro: { avatar: "https://i.pravatar.cc/150?u=pedro" },
  ana: { avatar: "https://i.pravatar.cc/150?u=ana" },
  lucas: { avatar: "https://i.pravatar.cc/150?u=lucas" },
};

export function RecentSales() {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchSales = async () => {
        try {
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

  const getAvatarForStudent = (studentName: string) => {
    // Simple logic to assign avatars for demo purposes
    const userKey = studentName.split(' ')[0].toLowerCase();
    return mockUsers[userKey]?.avatar || PlaceHolderImages.find(img => img.id === 'user-6')?.imageUrl || '';
  };

  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>As últimas 5 vendas realizadas.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p>Carregando vendas...</p>
            ) : (
                <div className="space-y-8">
                    {sales.map((sale) => (
                        <div key={sale.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={getAvatarForStudent(sale.student_name)} alt="Avatar" data-ai-hint="avatar person" />
                            <AvatarFallback>{sale.student_name.charAt(0)}</AvatarFallback>
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
                </div>
            )}
        </CardContent>
    </Card>
  )
}
