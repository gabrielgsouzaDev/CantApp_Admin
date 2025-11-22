import { api } from "@/lib/api";
import { Product } from "@/lib/types";

// Helper to map backend data to frontend data
const mapProductData = (product: any): Product => ({
  ...product,
  name: product.nome,
  price: parseFloat(product.preco)
});


export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<{ data: any[] }>('/produtos');
  return response.data.map(mapProductData);
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const payload = {
    nome: product.name,
    preco: product.price,
    id_escola: product.id_escola
  };
  const response = await api.post<any>('/produtos', payload);
  return mapProductData(response.data);
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    const payload = {
    nome: product.name,
    preco: product.price,
    id_escola: product.id_escola
  };
  const response = await api.put<any>(`/produtos/${id}`, payload);
  return mapProductData(response.data);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete<void>(`/produtos/${id}`);
};
