import * as z from "zod";

export const SchoolAddressSchema = z.object({
    cep: z.string().min(8, "O CEP deve ter 8 dígitos."),
    street: z.string().min(3, "A rua é obrigatória."),
    number: z.string().min(1, "O número é obrigatório."),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, "O bairro é obrigatório."),
    city: z.string().min(3, "A cidade é obrigatória."),
    state: z.string().min(2, "O estado é obrigatório."),
});

export const SchoolSchema = z.object({
  name: z.string().min(3, "O nome da escola é obrigatório."),
  cnpj: z.string().length(18, "O CNPJ deve ter 14 dígitos."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  address: SchoolAddressSchema,
});

export const SchoolFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  address: z.string().min(10, "O endereço deve ter pelo menos 10 caracteres."),
  cnpj: z.string().length(18, "O CNPJ deve ter 14 dígitos (XX.XXX.XXX/XXXX-XX)."),
  status: z.enum(["active", "inactive"]),
});
