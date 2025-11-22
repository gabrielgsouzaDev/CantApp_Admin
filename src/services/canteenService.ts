import { api } from "@/lib/api";
import { Canteen } from "@/lib/types";

// Helper to map backend data to frontend data
const mapCanteenData = (canteen: any): Canteen => ({
  ...canteen,
  name: canteen.nome,
});

export const getCanteens = async (schoolId: number): Promise<Canteen[]> => {
  const response = await api.get<any[]>(`/api/escolas/${schoolId}/cantinas`);
  return response.map(mapCanteenData);
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await api.post<any>('/api/cantinas', payload);
  return mapCanteenData(response);
};

export const updateCanteen = async (id: number, canteen: Partial<Omit<Canteen, 'id'>>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await api.put<any>(`/api/cantinas/${id}`, payload);
  return mapCanteenData(response);
};

export const deleteCanteen = async (id: number): Promise<void> => {
  await api.delete<void>(`/api/cantinas/${id}`);
};
