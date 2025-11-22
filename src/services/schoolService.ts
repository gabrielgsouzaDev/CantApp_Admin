import { api } from "@/lib/api";
import { School } from "@/lib/types";


type SchoolResponse = School & {
  id_escola: number;
}

// Helper to map backend data to frontend data
const mapSchoolData = (school: any): School => ({
  ...school,
  id: school.id_escola,
  name: school.nome, // map 'nome' to 'name'
  address: school.endereco?.logradouro, // map 'endereco' to 'address'
  qtd_alunos: school.qtd_alunos,
  status: school.status,
  id_escola: school.id_escola,
});

export const getSchools = async (): Promise<School[]> => {
  const response = await api.get<any[]>('/api/escolas');
  return response.map(mapSchoolData);
};

export const addSchool = async (school: Partial<Omit<School, 'id' | 'name'>> & { nome: string }): Promise<SchoolResponse> => {
  // Map frontend `name` to backend `nome`
  const payload = { 
      nome: school.nome,
      cnpj: school.cnpj,
      id_endereco: school.id_endereco,
      status: school.status,
      qtd_alunos: school.qtd_alunos,
  };
  const response = await api.post<any>('/api/escolas', payload);
  return response; // Return raw response as it contains id_escola
};

export const updateSchool = async (id: number, school: Partial<Omit<School, 'id'>>): Promise<School> => {
  const payload = { ...school, nome: school.name };
  const response = await api.put<any>(`/api/escolas/${id}`, payload);
  return mapSchoolData(response);
};

export const deleteSchool = async (id: number): Promise<void> => {
  await api.delete<void>(`/api/escolas/${id}`);
};
