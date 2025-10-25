import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const userAvatars = PlaceHolderImages;

const salesData = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+R$1,999.00", avatar: userAvatars.find(img => img.id === 'user-1')?.imageUrl },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+R$39.00", avatar: userAvatars.find(img => img.id === 'user-2')?.imageUrl },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+R$299.00", avatar: userAvatars.find(img => img.id === 'user-3')?.imageUrl },
    { name: "William Kim", email: "will@email.com", amount: "+R$99.00", avatar: userAvatars.find(img => img.id === 'user-4')?.imageUrl },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+R$39.00", avatar: userAvatars.find(img => img.id === 'user-5')?.imageUrl },
]


export function RecentSales() {
  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>Você fez 265 vendas este mês.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                {salesData.map((sale, index) => (
                    <div key={index} className="flex items-center">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={sale.avatar} alt="Avatar" data-ai-hint="avatar person" />
                        <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {sale.email}
                        </p>
                        </div>
                        <div className="ml-auto font-medium">{sale.amount}</div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  )
}
