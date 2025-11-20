import { api } from "@/lib/api";
import { Product } from "@/lib/types";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<{ data: Product[] }>('/products');
  return response.data;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return api.post<Product>('/products', product);
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  return api.put<Product>(`/products/${id}`, product);
};

export const deleteProduct = async (id: number): Promise<void> => {
  return api.delete<void>(`/products/${id}`);
};
