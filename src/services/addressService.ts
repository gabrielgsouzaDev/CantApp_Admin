import { api } from "@/lib/api";
import { Address } from "@/lib/types";

const mapAddressData = (address: any): Address => ({
  ...address,
});

export const addAddress = async (address: Omit<Address, 'id'>): Promise<Address> => {
  const response = await api.post<{ data: any }>('/api/enderecos', address);
  return mapAddressData(response.data);
};
