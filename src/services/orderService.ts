import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/lib/types";

const mapOrderData = (order: any): Order => ({
  ...order,
  // Ensure correct mapping if backend names differ
  student_name: order.nome_aluno || order.student_name,
  items: order.items.map((item: any) => ({
    ...item,
    name: item.nome,
    price: parseFloat(item.preco),
  })),
  total: parseFloat(order.total)
});


export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<{ data: Order[] }>('/api/pedidos');
  // Assuming the backend returns the correct structure, if not, mapping is needed
  const sortedOrders = response.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return sortedOrders.map(mapOrderData);
};

export const getRecentSales = async (): Promise<Order[]> => {
  // Assuming the API returns the most recent ones if we add a limit
  const response = await api.get<{ data: Order[] }>('/api/pedidos?limit=5&sort=desc'); 
  const sortedSales = response.data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return sortedSales.slice(0, 5).map(mapOrderData);
}

export const updateOrderStatus = async (orderId: number, newStatus: OrderStatus): Promise<Order> => {
  const response = await api.patch<any>(`/api/pedidos/${orderId}`, { status: newStatus });
  return mapOrderData(response.data);
};
