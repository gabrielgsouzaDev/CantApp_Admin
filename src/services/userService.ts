import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { CtnAppUser, UserRole } from "@/lib/types"; 

export type UserCreationPayload = {
  nome: string;
  email: string;
  senha?: string;
  id_escola?: number;
  id_cantina?: number;
  id_role: number;
  ativo: boolean;
};


const mapUserData = (user: any): CtnAppUser => ({
  id: user.id,
  name: user.nome,
  nome: user.nome,
  email: user.email,
  // The backend might return the full role object or just the name. Handle both.
  role: user.roles?.[0]?.nome || user.role,
  id_escola: user.id_escola,
  id_cantina: user.id_cantina,
  ativo: user.ativo,
});

export const getUsers = async (): Promise<CtnAppUser[]> => {
  const response = await apiGet<any[]>('users');
  return response.map(mapUserData);
};

export const addUser = async (user: UserCreationPayload): Promise<CtnAppUser> => {
  const response = await apiPost<any>('users', user);
  return mapUserData(response);
};

export const updateUser = async (
  id: number, 
  user: Partial<Omit<CtnAppUser, 'id'>> & { id_role?: number }
): Promise<CtnAppUser> => {
  const response = await apiPut<any>(`users/${id}`, user);
  return mapUserData(response);
};

export const deleteUser = async (id: number): Promise<void> => {
  return apiDelete<void>(`users/${id}`);
};


export const getUserRoles = async (): Promise<UserRole[]> => {
    const response = await apiGet<any[]>('roles');
    // Filter out roles that are not relevant for a school admin to assign
    const relevantRoles = response.filter(role => ['Escola', 'Cantina', 'Aluno', 'Responsavel', 'Funcionario'].includes(role.nome));
    return relevantRoles;
};
