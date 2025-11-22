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

// Schema for the combined school + admin registration form
export const SchoolRegistrationSchema = z.object({
  schoolName: z.string().min(3, "O nome da escola é obrigatório."),
  cnpj: z.string().length(18, "O CNPJ deve ter 14 dígitos."),
  adminName: z.string().min(3, "O nome do administrador é obrigatório."),
  adminEmail: z.string().email("Email do administrador inválido."),
  adminPassword: z.string().min(6, "A senha do administrador deve ter no mínimo 6 caracteres."),
  address: SchoolAddressSchema,
});


// Schema for the form used to edit/create a school from the admin dashboard
export const SchoolFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  address: z.string().min(10, "O endereço deve ter pelo menos 10 caracteres."),
  cnpj: z.string().length(18, "O CNPJ deve ter 14 dígitos (XX.XXX.XXX/XXXX-XX)."),
  status: z.enum(["active", "inactive"]),
  qtd_alunos: z.coerce.number().int().min(0, "A quantidade de alunos deve ser um número positivo.").optional(),
});
