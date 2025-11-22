import type { LucideIcon } from "lucide-react";

export const Role = {
  GlobalAdmin: "GlobalAdmin",
  EscolaAdmin: "EscolaAdmin",
  Cantineiro: "Cantineiro",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// This is our app-specific user profile, coming from the Laravel API
export type CtnAppUser = {
  id: number;
  name: string;
  nome: string; // From laravel
  email: string;
  avatar?: string; // Avatar may not come from Laravel, so it's optional
  role: Role;
  id_escola?: number; 
  id_cantina?: number;
};

export type Address = {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export type School = {
  id: number;
  name: string;
  nome: string; // from laravel
  address?: string; // This is a display-only field now
  endereco?: string; // from laravel
  cnpj: string;
  status: "active" | "inactive";
  id_endereco?: number;
  id_plano?: number;
  qtd_alunos?: number;
};

export type Product = {
  id: number;
  name: string;
  nome: string; // from laravel
  price: number;
  preco: number; // from laravel
  id_cantina: number; 
  ativo: boolean;
};

export type Canteen = {
  id: number;
  name: string;
  nome: string; // from laravel
  id_escola: number;
};

export type OrderStatus = "A Fazer" | "Em Preparo" | "Pronto";
export type PaymentStatus = "Pago" | "Pendente";

export type OrderItem = {
  id: number;
  name: string;
  nome: string; // from laravel
  price: number;
  preco: number; // from laravel
};

export type Order = {
  id: number;
  student_name: string; // from laravel
  time: string; // Keep as ISO string date
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
};
