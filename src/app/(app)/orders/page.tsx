"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Cookie, CreditCard, Loader2 } from "lucide-react";
import { useState, DragEvent, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Order, OrderStatus } from "@/lib/types";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import { onSnapshot } from "firebase/firestore";

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          draggable
          onDragStart={(e) => e.dataTransfer.setData("orderId", order.id)}
          className="mb-4 cursor-grab active:cursor-grabbing bg-card hover:bg-accent transition-colors"
        >
          <CardHeader className="p-4">
            <CardTitle className="text-base flex justify-between items-center">
              <span>{order.studentName}</span>
              <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(order.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </CardTitle>
             <div className="flex items-center justify-between pt-2">
                <Badge
                    variant={order.paymentStatus === "Pendente" ? "destructive" : "default"}
                    className={cn(order.paymentStatus === "Pago" && "bg-green-600 text-white")}
                >
                    {order.paymentStatus}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cookie className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido de {order.studentName}</DialogTitle>
          <DialogDescription>
            Recebido às {new Date(order.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status do Pedido</span>
                <Badge variant={order.status === 'Pronto' ? 'default' : 'secondary'}>
                    {order.status === 'Pronto' ? 'Pronto para Retirada' : order.status}
                </Badge>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status do Pagamento</span>
                 <Badge
                    variant={order.paymentStatus === "Pendente" ? "destructive" : "default"}
                    className={cn("flex items-center gap-1.5", order.paymentStatus === "Pago" && "bg-green-600 text-white")}
                >
                    <CreditCard className="h-3.5 w-3.5" />
                    {order.paymentStatus}
                </Badge>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold">Itens do Pedido</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {order.items.map((item, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </div>
      </DialogContent>
    </Dialog>
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
  onDrop: (e: DragEvent<HTMLDivElement>, status: OrderStatus) => void;
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
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="text-sm">
            {orders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full min-h-[200px] p-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </CardContent>
    </Card>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  useEffect(() => {
    const ordersQuery = getOrders();
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDrop = async (e: DragEvent<HTMLDivElement>, status: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    
    // Optimistic update
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    // Update Firestore
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
       console.error("Failed to update order status", err);
       // Revert optimistic update on error if necessary
       // For simplicity, we are not reverting here, but in a real app you should.
    }

    setDragOverColumn(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, status: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const columns: { title: string; status: OrderStatus }[] = [
    { title: "A Fazer", status: "A Fazer" },
    { title: "Em Preparo", status: "Em Preparo" },
    { title: "Pronto para Retirada", status: "Pronto" },
  ];

  if (loading) {
     return (
      <div className="flex h-full min-h-[calc(100vh-120px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Gerencie os pedidos em tempo real."
      />
      <div className="flex flex-1 flex-col md:flex-row gap-4 overflow-x-auto h-[calc(100vh-150px)] p-1">
        {columns.map(({ title, status }) => (
          <KanbanColumn
            key={status}
            title={title}
            status={status}
            orders={orders.filter((o) => o.status === status)}
            onDrop={handleDrop}
            isOver={dragOverColumn === status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
          />
        ))}
      </div>
    </>
  );
}
