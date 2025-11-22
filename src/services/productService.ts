import { api } from "@/lib/api";
import { Product } from "@/lib/types";

// Helper to map backend data to frontend data
const mapProductData = (product: any): Product => ({
  ...product,
  name: product.nome,
  price: parseFloat(product.preco)
});


export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<any[]>('/api/produtos');
  return response.map(mapProductData);
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const payload = {
    nome: product.name,
    preco: product.price,
    id_cantina: product.id_cantina,
    ativo: product.ativo,
  };
  const response = await api.post<any>('/api/produtos', payload);
  return mapProductData(response);
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    const payload = {
    nome: product.name,
    preco: product.price,
    id_cantina: product.id_cantina,
    ativo: product.ativo
  };
  const response = await api.put<any>(`/api/produtos/${id}`, payload);
  return mapProductData(response);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete<void>(`/api/produtos/${id}`);
};
