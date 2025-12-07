import { apiGet } from "@/lib/api";
import { Order, OrderStatus } from "@/lib/types";

const mapOrderData = (order: any): Order => ({
  ...order,
  id: order.id_pedido,
  // Ensure correct mapping if backend names differ
  student_name: order.nome_aluno || order.student_name,
  items: order.items.map((item: any) => ({
    ...item,
    id: item.id_item_pedido,
    name: item.nome,
    price: parseFloat(item.preco),
  })),
  total: parseFloat(order.total),
  time: order.created_at,
  status: order.status ?? 'A Fazer',
  payment_status: order.status_pagamento ?? 'Pendente',
});


export const getRecentSales = async (): Promise<Order[]> => {
  // Assuming the API returns the most recent ones if we add a limit
  const response = await apiGet<any[]>('pedidos?limit=5&sort=desc'); 
  const sortedSales = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return sortedSales.slice(0, 5).map(mapOrderData);
}
