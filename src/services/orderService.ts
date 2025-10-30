// src/services/orderService.ts
import { adminDb } from "../firebase";
import { OrderStatus } from "@/lib/types";
import { collection, query, updateDoc, doc, limit, orderBy, getDocs } from "firebase/firestore";

const ordersCollection = collection(adminDb, "orders");

export const getOrders = () => {
  return query(ordersCollection, orderBy("time", "asc"));
};

export const getRecentSales = () => {
    return query(ordersCollection, orderBy("time", "desc"), limit(5));
}

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const orderRef = doc(adminDb, "orders", orderId);
  await updateDoc(orderRef, {
    status: newStatus
  });
};

// Exemplo de como você pode popular dados iniciais, se necessário.
// Pode ser chamado de um script separado ou de uma função de admin.
export const seedOrders = async () => {
    const { addDoc } = await import("firebase/firestore");
    const mockOrders = [
        { studentName: "João Silva", time: Date.now() - 500000, items: [{id: 'pao-queijo', name: "Pão de Queijo", price: 5}, {id: 'suco-laranja', name: "Suco de Laranja", price: 4}], status: "A Fazer", paymentStatus: "Pago", total: 9 },
        { studentName: "Maria Clara", time: Date.now() - 400000, items: [{id: 'misto-quente', name: "Misto Quente", price: 7}], status: "A Fazer", paymentStatus: "Pendente", total: 7 },
        { studentName: "Pedro Alves", time: Date.now() - 300000, items: [{id: 'bolo-choco', name: "Bolo de Chocolate", price: 6}, {id: 'achocolatado', name: "Achocolatado", price: 4}], status: "Em Preparo", paymentStatus: "Pago", total: 10 },
        { studentName: "Ana Beatriz", time: Date.now() - 200000, items: [{id: 'coxinha', name: "Coxinha", price: 5}], status: "Em Preparo", paymentStatus: "Pendente", total: 5 },
        { studentName: "Lucas Costa", time: Date.now() - 100000, items: [{id: 'esfirra-carne', name: "Esfirra de Carne", price: 6}], status: "Pronto", paymentStatus: "Pago", total: 6 },
    ];

    const currentOrders = await getDocs(ordersCollection);
    if (currentOrders.empty) {
      for (const order of mockOrders) {
          await addDoc(ordersCollection, order);
      }
      console.log("Seeded orders successfully!");
    } else {
      console.log("Orders collection is not empty. Skipping seed.");
    }
}
