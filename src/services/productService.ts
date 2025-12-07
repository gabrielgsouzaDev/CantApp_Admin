import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Product } from "@/lib/types";

// Helper to map backend data to frontend data
const mapProductData = (product: any): Product => ({
  ...product,
  id: product.id_produto,
  name: product.nome,
  price: parseFloat(product.preco)
});


export const getProducts = async (): Promise<Product[]> => {
  const response = await apiGet<any[]>('produtos');
  return response.map(mapProductData);
};

export const addProduct = async (product: Omit<Product, 'id' | 'id_produto'>): Promise<Product> => {
  const payload = {
    nome: product.name,
    preco: product.price,
    id_cantina: product.id_cantina,
    ativo: product.ativo,
  };
  const response = await apiPost<any>('produtos', payload);
  return mapProductData(response);
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id' | 'id_produto'>>): Promise<Product> => {
    const payload = {
    nome: product.name,
    preco: product.price,
    id_cantina: product.id_cantina,
    ativo: product.ativo
  };
  const response = await apiPut<any>(`produtos/${id}`, payload);
  return mapProductData(response);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiDelete<void>(`produtos/${id}`);
};
