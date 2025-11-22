import { api } from "@/lib/api";
import { School } from "@/lib/types";

// Helper to map backend data to frontend data
const mapSchoolData = (school: any): School => ({
  ...school,
  name: school.nome, // map 'nome' to 'name'
});

export const getSchools = async (): Promise<School[]> => {
  const response = await api.get<{ data: any[] }>('/escolas');
  return response.data.map(mapSchoolData);
};

export const addSchool = async (school: Omit<School, 'id'>): Promise<School> => {
  // Map frontend `name` to backend `nome`
  const payload = { ...school, nome: school.name };
  const response = await api.post<any>('/escolas', payload);
  return mapSchoolData(response.data);
};

export const updateSchool = async (id: number, school: Partial<Omit<School, 'id'>>): Promise<School> => {
  const payload = { ...school, nome: school.name };
  const response = await api.put<any>(`/escolas/${id}`, payload);
  return mapSchoolData(response.data);
};

export const deleteSchool = async (id: number): Promise<void> => {
  await api.delete<void>(`/escolas/${id}`);
};
