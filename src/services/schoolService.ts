import { api } from "@/lib/api";
import { School } from "@/lib/types";

// Helper to map backend data to frontend data
const mapSchoolData = (school: any): School => ({
  ...school,
  id: school.id,
  name: school.nome, // map 'nome' to 'name'
  address: school.endereco, // map 'endereco' to 'address'
  qtd_alunos: school.qtd_alunos,
});

export const getSchools = async (): Promise<School[]> => {
  const response = await api.get<{ data: any[] }>('escolas');
  return response.data.map(mapSchoolData);
};

export const addSchool = async (school: Partial<Omit<School, 'id' | 'name'>> & { nome: string }): Promise<School> => {
  // Map frontend `name` to backend `nome`
  const payload = { 
      nome: school.nome,
      cnpj: school.cnpj,
      id_endereco: school.id_endereco,
      status: school.status,
      qtd_alunos: school.qtd_alunos,
  };
  const response = await api.post<{ data: any }>('escolas', payload);
  return mapSchoolData(response.data);
};

export const updateSchool = async (id: number, school: Partial<Omit<School, 'id'>>): Promise<School> => {
  const payload = { ...school, nome: school.name };
  const response = await api.put<{ data: any }>(`escolas/${id}`, payload);
  return mapSchoolData(response.data);
};

export const deleteSchool = async (id: number): Promise<void> => {
  await api.delete<void>(`escolas/${id}`);
};
