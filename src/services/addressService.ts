import { api } from "@/lib/api";
import { Address } from "@/lib/types";

// The backend returns an object with the primary key id_endereco
// We must ensure our Address type reflects this for responses.
type AddressResponse = Address & {
  id_endereco: number;
}

const mapAddressData = (address: any): AddressResponse => ({
  ...address,
  id: address.id_endereco, // map id_endereco to id for consistency in frontend
});

export const addAddress = async (address: Omit<Address, 'id'>): Promise<AddressResponse> => {
  const response = await api.post<{ data: any }>('/api/enderecos', address);
  return mapAddressData(response.data);
};
