import { api } from "@/lib/api";

interface AssignRolePayload {
    id_user: number;
    id_role: number;
}

/**
 * Assigns a role to a user.
 * This should be called after a user is successfully created.
 */
export const assignRole = async (payload: AssignRolePayload): Promise<any> => {
  const response = await api.post<any>('/api/user-role', payload);
  return response;
};
