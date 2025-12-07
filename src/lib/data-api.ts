// src/lib/data-api.ts
// Este arquivo atua como a camada de serviço (services.ts)

import { apiGet, apiPatch } from "./api";
import { 
    type Order, 
} from "@/lib/types"; 

// --- Mapeamento Básico de Dados (Para o contexto do Admin) ---

/**
 * Mapeia o objeto de Pedido recebido do Backend.
 * É CRÍTICO que esta função reflita a estrutura do Pedido Model do Laravel.
 */
const mapOrder = (order: any): Order => ({
    id: order.id_pedido?.toString() ?? order.id?.toString() ?? '',
    student_name: order.comprador?.nome ?? 'N/A', // Assuming buyer relationship
    id_comprador: order.id_comprador?.toString() ?? '',
    canteenId: order.id_cantina?.toString() ?? '',
    total: parseFloat(order.valor_total ?? 0),
    time: order.created_at,
    // Certifique-se de que o mapeamento dos itens de pedido aninhados está correto
    items: order.itens_pedido?.map((item: any) => ({
      id: item.id_item_pedido,
      name: item.produto?.nome ?? 'Item desconhecido',
      price: parseFloat(item.preco_unitario ?? 0)
    })) || [], 
    status: order.status ?? 'A Fazer',
    payment_status: order.status_pagamento ?? 'Pendente',
});


// --- Funções da API para o Cantineiro (Admin) ---

/**
 * [CRÍTICO] Lista todos os pedidos da cantina associada ao usuário logado.
 * O Backend injeta o id_cantina a partir do token do Cantineiro.
 * @param canteenId ID da Cantina (usado apenas como referência visual, o Backend confia no token)
 */
export const getOrdersByCanteen = async (canteenId: string): Promise<Order[]> => {
    if (!canteenId) return [];
    try {
        // A rota no Backend (PedidoController) é correta.
        const endpoint = `pedidos/cantina/${canteenId}`; 
        
        // Usamos api.get que já lida com o wrapper 'data' ou o objeto direto (conforme seu api.ts)
        const response = await apiGet<any[]>(endpoint); 
        
        return response.map(mapOrder);
    } catch (e) {
        console.error(`Falha ao carregar pedidos da cantina ${canteenId}:`, e);
        return []; 
    }
};

/**
 * [CRÍTICO] Atualiza o status de um pedido específico (Confirmação, Preparo, Entrega).
 * O Backend verifica a permissão do Cantineiro para a cantina do pedido.
 */
export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<Order> => {
    try {
        const payload = { status: newStatus };
        const endpoint = `pedidos/${orderId}/status`;

        // Usa api.patch que lida com o token e serialização
        const response = await apiPatch<any>(endpoint, payload);
        
        return mapOrder(response);
    } catch (e) {
        console.error(`Falha ao atualizar status do pedido ${orderId}:`, e);
        throw e;
    }
};
