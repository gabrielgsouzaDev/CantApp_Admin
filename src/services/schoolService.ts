import { api } from "@/lib/api";
import { School } from "@/lib/types";

export const getSchools = async (): Promise<School[]> => {
  const response = await api.get<{ data: School[] }>('/schools');
  return response.data;
};

export const addSchool = async (school: Omit<School, 'id'>): Promise<School> => {
  return api.post<School>('/schools', school);
};

export const updateSchool = async (id: number, school: Partial<Omit<School, 'id' | 'ownerUid'>>): Promise<School> => {
  return api.put<School>(`/schools/${id}`, school);
};

export const deleteSchool = async (id: number): Promise<void> => {
  return api.delete<void>(`/schools/${id}`);
};
