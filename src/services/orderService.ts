import { api } from "@/lib/api";
import { mockOrders } from "@/lib/mocks";
import { Order, OrderStatus } from "@/lib/types";

// For demo purposes, we'll use a mock latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In a real REST API, you'd probably poll for updates or use WebSockets.
// For the demo, we just fetch the initial mock data.
export const getOrders = async (): Promise<Order[]> => {
  console.log("Fetching orders from API...");
  // REAL: return api.get<Order[]>('/orders');
  await sleep(500);
  // sort by time
  const sortedOrders = [...mockOrders].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return Promise.resolve(sortedOrders);
};

export const getRecentSales = async (): Promise<Order[]> => {
  console.log("Fetching recent sales from API...");
  // REAL: return api.get<Order[]>('/orders?limit=5&sort=desc');
  await sleep(500);
  const sortedSales = [...mockOrders].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return Promise.resolve(sortedSales.slice(0, 5));
}

export const updateOrderStatus = async (orderId: number, newStatus: OrderStatus): Promise<Order> => {
  console.log(`Updating order ${orderId} status to ${newStatus} via API`);
  // REAL: return api.patch<Order>(`/orders/${orderId}`, { status: newStatus });
  await sleep(200);
  const index = mockOrders.findIndex(o => o.id === orderId);
  if (index > -1) {
    mockOrders[index].status = newStatus;
    return Promise.resolve(mockOrders[index]);
  }
  throw new Error("Order not found");
};
