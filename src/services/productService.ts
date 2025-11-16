import { api } from "@/lib/api";
import { mockProducts } from "@/lib/mocks";
import { Product } from "@/lib/types";

// For demo purposes, we'll use a mock latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (): Promise<Product[]> => {
  console.log("Fetching products from API...");
  // REAL: return api.get<Product[]>('/products');
  await sleep(500);
  return Promise.resolve(mockProducts);
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  console.log("Adding product via API:", product);
  // REAL: return api.post<Product>('/products', product);
  await sleep(500);
  const newProduct: Product = { id: Math.random(), ...product };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  console.log(`Updating product ${id} via API with:`, product);
  // REAL: return api.put<Product>(`/products/${id}`, product);
  await sleep(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index > -1) {
    mockProducts[index] = { ...mockProducts[index], ...product };
    return Promise.resolve(mockProducts[index]);
  }
  throw new Error("Product not found");
};

export const deleteProduct = async (id: number): Promise<void> => {
  console.log(`Deleting product ${id} via API`);
  // REAL: return api.delete<void>(`/products/${id}`);
  await sleep(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index > -1) {
    mockProducts.splice(index, 1);
    return Promise.resolve();
  }
  throw new Error("Product not found");
};
