"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSchools } from "@/lib/data";
import { School } from "@/lib/types";
import { useEffect, useState } from "react";

const getRecentSubscriptions = (): (School & { planValue: number })[] => {
  return mockSchools.slice(0, 5).map((school, index) => ({
    ...school,
    planValue: [149, 299, 149, 149, 499][index] || 149,
  }));
};

export function RecentSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<(School & { planValue: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your subscriptions collection in Firestore.
    const subsData = getRecentSubscriptions();
    setSubscriptions(subsData);
    setLoading(false);
  }, []);

  const getAvatarForSchool = (schoolName: string) => {
    // Simple hashing for placeholder images, can be replaced with real school logos
    const hash = schoolName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarId = (hash % 6) + 1; // user-1 to user-6
    return `https://picsum.photos/seed/${avatarId}/40/40`;
  };

  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Assinaturas Recentes</CardTitle>
            <CardDescription>As últimas 5 escolas que assinaram um plano.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p>Carregando assinaturas...</p>
            ) : (
                <div className="space-y-8">
                    {subscriptions.map((sub) => (
                        <div key={sub.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={getAvatarForSchool(sub.name)} alt="Avatar" data-ai-hint="building logo" />
                            <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{sub.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {sub.address}
                            </p>
                            </div>
                            <div className="ml-auto font-medium">
                                +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sub.planValue)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
  )
}
