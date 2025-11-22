// This service is not fully implemented in the UI yet,
// but here is the structure for it.

import { api } from "@/lib/api";
import { CtnAppUser } from "@/lib/types"; 

// ✅ Agora o payload aceita 'ativo' sem quebrar o TS
type UserCreationPayload = Partial<CtnAppUser & { 
  senha?: string; 
  id_role?: number;
  ativo?: boolean;
}>;

const mapUserData = (user: any): CtnAppUser => ({
  id: user.id,
  name: user.nome,
  nome: user.nome,
  email: user.email,
  role: user.role,
  id_escola: user.id_escola,
  id_cantina: user.id_cantina,
  ativo: user.ativo,
});

export const getUsers = async (): Promise<CtnAppUser[]> => {
  const response = await api.get<{ data: any[] }>('/api/users');
  return response.data.map(mapUserData);
};

export const addUser = async (user: UserCreationPayload): Promise<CtnAppUser> => {
  const response = await api.post<{ data: any }>('/api/users', user);
  return mapUserData(response.data);
};

export const updateUser = async (
  id: number, 
  user: Partial<Omit<CtnAppUser, 'id'>>
): Promise<CtnAppUser> => {
  const response = await api.put<{ data: any }>(`/api/users/${id}`, user);
  return mapUserData(response.data);
};

export const deleteUser = async (id: number): Promise<void> => {
  return api.delete<void>(`/api/users/${id}`);
};
