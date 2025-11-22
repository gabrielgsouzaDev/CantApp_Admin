import { api } from "@/lib/api";

interface UserRolePayload {
  id_user: number;
  id_role: number;
}

export const assignRole = async (payload: UserRolePayload): Promise<any> => {
  // Your backend's UserRoleController@store expects this payload.
  const response = await api.post<any>('/api/user-roles', payload);
  return response;
};
