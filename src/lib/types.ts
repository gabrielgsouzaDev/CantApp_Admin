import type { LucideIcon } from "lucide-react";

export const Role = {
  GlobalAdmin: "Admin",
  EscolaAdmin: "Escola",
  Cantineiro: "Cantina", // Mantém o valor "Cantina" consistente com o backend
  Responsavel: "Responsavel",
  Aluno: "Aluno",
  Funcionario: "Funcionario",
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
  ativo?: boolean;
};

export type Address = {
  id: number;
  id_endereco?: number; // PK from backend, optional on creation
  cep: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
}

export type SchoolStatus = 'ativa' | 'inativa' | 'pendente';

export type School = {
  id: number;
  id_escola?: number; // PK from backend
  name: string;
  nome: string; // from laravel
  address?: string; // This is a display-only field now
  endereco?: string; // from laravel
  cnpj: string;
  status: SchoolStatus; 
  id_endereco?: number;
  id_plano?: number;
  qtd_alunos?: number;
};

export type Product = {
  id: number;
  id_produto: number; // PK from backend
  name: string;
  nome: string; // from laravel
  price: number;
  preco: number; // from laravel
  id_cantina: number; 
  ativo: boolean;
};

export type Canteen = {
  id: number;
  id_cantina: number; // PK from backend
  name: string;
  nome: string; // from laravel
  id_escola: number;
};

export type OrderStatus = "A Fazer" | "Em Preparo" | "Pronto";
export type PaymentStatus = "Pago" | "Pendente";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
};

export type Order = {
  id: string; // id_pedido from backend
  student_name: string; 
  id_comprador: string;
  canteenId: string;
  time: string; // Keep as ISO string date from created_at
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
};

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface UserRole {
  id_role: number;
  nome: Role | string;
}
