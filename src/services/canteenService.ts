// This service is not fully implemented in the UI yet,
// but here is the structure for it.

import { api } from "@/lib/api";
import { Canteen } from "@/lib/types";

export const getCanteens = async (schoolId: number): Promise<Canteen[]> => {
  // return api.get<Canteen[]>(`/schools/${schoolId}/canteens`);
  return Promise.resolve([
    { id: 1, name: 'Cantina Principal', school_id: 1 },
    { id: 2, name: 'Cantina Anexo', school_id: 1 },
  ]);
};

export const addCanteen = async (canteen: Omit<Canteen, 'id'>): Promise<Canteen> => {
  return api.post<Canteen>('/canteens', canteen);
};

export const updateCanteen = async (id: number, canteen: Partial<Omit<Canteen, 'id'>>): Promise<Canteen> => {
  return api.put<Canteen>(`/canteens/${id}`, canteen);
};

export const deleteCanteen = async (id: number): Promise<void> => {
  return api.delete<void>(`/canteens/${id}`);
};
