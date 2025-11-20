import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/lib/types";

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<{ data: Order[] }>('/orders');
  // sort by time
  const sortedOrders = response.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return sortedOrders;
};

export const getRecentSales = async (): Promise<Order[]> => {
  // Assuming the API returns the most recent ones if we add a limit
  const response = await api.get<{ data: Order[] }>('/orders?limit=5&sort=desc'); 
  const sortedSales = response.data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return sortedSales.slice(0, 5);
}

export const updateOrderStatus = async (orderId: number, newStatus: OrderStatus): Promise<Order> => {
  return api.patch<Order>(`/orders/${orderId}`, { status: newStatus });
};
