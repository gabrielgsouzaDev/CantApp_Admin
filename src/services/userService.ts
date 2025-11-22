// This service is not fully implemented in the UI yet,
// but here is the structure for it.

import { api } from "@/lib/api";
import { CtnAppUser } from "@/lib/types"; 

export const getUsers = async (): Promise<CtnAppUser[]> => {
  return api.get<CtnAppUser[]>('/api/users');
};

export const addUser = async (user: Omit<CtnAppUser, 'id'>): Promise<CtnAppUser> => {
  return api.post<CtnAppUser>('/api/users', user);
};

export const updateUser = async (id: number, user: Partial<Omit<CtnAppUser, 'id'>>): Promise<CtnAppUser> => {
  return api.put<CtnAppUser>(`/api/users/${id}`, user);
};

export const deleteUser = async (id: number): Promise<void> => {
  return api.delete<void>(`/api/users/${id}`);
};
