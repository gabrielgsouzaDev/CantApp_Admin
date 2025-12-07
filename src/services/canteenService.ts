import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Canteen } from "@/lib/types";

// Helper to map backend data to frontend data
const mapCanteenData = (canteen: any): Canteen => ({
  ...canteen,
  id: canteen.id_cantina,
  name: canteen.nome,
});

export const getCanteens = async (schoolId: number): Promise<Canteen[]> => {
  const response = await apiGet<any[]>(`escolas/${schoolId}/cantinas`);
  return response.map(mapCanteenData);
};

export const getAllCanteens = async (): Promise<Canteen[]> => {
  // CRÍTICO: Alterado para uma rota pública que não exige autenticação.
  // O backend precisa de ter esta rota definida fora do middleware 'auth:sanctum'.
  const response = await apiGet<any[]>('public/cantinas');
  return response.map(mapCanteenData);
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await apiPost<any>('cantinas', payload);
  return mapCanteenData(response);
};

export const updateCanteen = async (id: number, canteen: Partial<Omit<Canteen, 'id'>>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await apiPut<any>(`cantinas/${id}`, payload);
  return mapCanteenData(response);
};

export const deleteCanteen = async (id: number): Promise<void> => {
  await apiDelete<void>(`cantinas/${id}`);
};
