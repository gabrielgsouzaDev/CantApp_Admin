"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Soup, Cookie } from "lucide-react";
import { useState, DragEvent } from "react";
import { cn } from "@/lib/utils";

type OrderStatus = "A Fazer" | "Em Preparo" | "Pronto";

type OrderItem = {
  name: string;
  icon: React.ElementType;
};

type Order = {
  id: string;
  studentName: string;
  time: string;
  items: OrderItem[];
  status: OrderStatus;
};

const mockOrders: Order[] = [
  { id: "ORD001", studentName: "João Silva", time: "10:30", items: [{name: "Pão de Queijo", icon: Cookie}, {name: "Suco de Laranja", icon: Soup}], status: "A Fazer" },
  { id: "ORD002", studentName: "Maria Clara", time: "10:32", items: [{name: "Misto Quente", icon: Cookie}], status: "A Fazer" },
  { id: "ORD003", studentName: "Pedro Alves", time: "10:35", items: [{name: "Bolo de Chocolate", icon: Cookie}, {name: "Achocolatado", icon: Soup}], status: "Em Preparo" },
  { id: "ORD004", studentName: "Ana Beatriz", time: "10:38", items: [{name: "Coxinha", icon: Cookie}], status: "Em Preparo" },
  { id: "ORD005", studentName: "Lucas Costa", time: "10:40", items: [{name: "Esfirra de Carne", icon: Cookie}], status: "Pronto" },
];

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Card 
      draggable 
      onDragStart={(e) => e.dataTransfer.setData("orderId", order.id)}
      className="mb-4 cursor-grab active:cursor-grabbing bg-card"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base flex justify-between items-center">
          <span>{order.studentName}</span>
           <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
             <Clock className="h-3 w-3" />
             {order.time}
           </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
            {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({
  title,
  status,
  orders,
  onDrop,
  isOver,
  onDragOver,
  onDragLeave,
}: {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onDrop: (status: OrderStatus) => void;
  isOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
}) => {
  return (
    <Card 
      className={cn(
        "flex-1 bg-muted/40 transition-colors",
        isOver && "bg-primary/10"
      )}
      onDrop={() => onDrop(status)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="text-sm">{orders.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </CardContent>
    </Card>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  const handleDrop = (status: OrderStatus, orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    setDragOverColumn(null);
  };

  const onDrop = (status: OrderStatus) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    handleDrop(status, orderId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLDivElement;
      const status = target.dataset.status as OrderStatus;
      if (status) {
          setDragOverColumn(status);
      }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      setDragOverColumn(null);
  }

  const columns: { title: string; status: OrderStatus }[] = [
    { title: "A Fazer", status: "A Fazer" },
    { title: "Em Preparo", status: "Em Preparo" },
    { title: "Pronto para Retirada", status: "Pronto" },
  ];

  return (
    <>
      <PageHeader title="Pedidos" description="Gerencie os pedidos em tempo real." />
      <div className="flex flex-1 gap-4 overflow-x-auto h-[calc(100vh-150px)] p-1">
        {columns.map(({ title, status }) => (
          <KanbanColumn
            key={status}
            title={title}
            status={status}
            orders={orders.filter((o) => o.status === status)}
            onDrop={(droppedStatus) => {
                // This is a bit of a workaround to get the onDrop event from the card
                // We need to access the dataTransfer object which is only available in the actual drop event
                return (e: DragEvent<HTMLDivElement>) => {
                     e.preventDefault();
                    const orderId = e.dataTransfer.getData("orderId");
                    handleDrop(droppedStatus, orderId);
                }
            }}
            isOver={dragOverColumn === status}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(status);
            }}
            onDragLeave={() => setDragOverColumn(null)}
          />
        ))}
      </div>
    </>
  );
}