import { api } from "@/lib/api";
import { Canteen } from "@/lib/types";

// Helper to map backend data to frontend data
const mapCanteenData = (canteen: any): Canteen => ({
  ...canteen,
  name: canteen.nome,
});

export const getCanteens = async (schoolId: number): Promise<Canteen[]> => {
  const response = await api.get<{ data: any[] }>(`/escolas/${schoolId}/cantinas`);
  return response.data.map(mapCanteenData);
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await api.post<any>('/cantinas', payload);
  return mapCanteenData(response.data);
};

export const updateCanteen = async (id: number, canteen: Partial<Omit<Canteen, 'id'>>): Promise<Canteen> => {
  const payload = { nome: canteen.name, id_escola: canteen.id_escola };
  const response = await api.put<any>(`/cantinas/${id}`, payload);
  return mapCanteenData(response.data);
};

export const deleteCanteen = async (id: number): Promise<void> => {
  await api.delete<void>(`/cantinas/${id}`);
};
