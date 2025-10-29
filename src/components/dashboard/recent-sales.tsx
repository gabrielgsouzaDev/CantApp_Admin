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
import { onSnapshot } from "firebase/firestore";
import { mockUsers } from "@/lib/data";

export function RecentSales() {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salesQuery = getRecentSales();
    const unsubscribe = onSnapshot(salesQuery, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setSales(salesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recent sales: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getAvatarForStudent = (studentName: string) => {
    // Simple logic to assign avatars for demo purposes
    const userKeys = Object.keys(mockUsers);
    const hash = studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const userKey = userKeys[hash % userKeys.length];
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
                            <AvatarImage src={getAvatarForStudent(sale.studentName)} alt="Avatar" data-ai-hint="avatar person" />
                            <AvatarFallback>{sale.studentName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{sale.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                                {sale.id}
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
