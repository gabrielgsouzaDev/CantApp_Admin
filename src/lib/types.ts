import type { LucideIcon } from "lucide-react";

export const Role = {
  GlobalAdmin: "GlobalAdmin",
  EscolaAdmin: "EscolaAdmin",
  Cantineiro: "Cantineiro",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// Este é o nosso perfil de utilizador específico da aplicação, vindo da API Laravel
export type CtnAppUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  schoolId?: number; // ID da escola associada para EscolaAdmin e Cantineiro
};

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  children?: NavItem[];
};

export type School = {
  id: number;
  name: string;
  address: string;
  cnpj: string;
  status: "active" | "inactive";
  ownerUid?: string; // Mantido por compatibilidade, pode ser o ID do utilizador dono
};

export type Product = {
  id: number;
  name: string;
  price: number;
  school_id: number; 
};

export type Canteen = {
  id: number;
  name: string;
  school_id: number;
};

export type OrderStatus = "A Fazer" | "Em Preparo" | "Pronto";
export type PaymentStatus = "Pago" | "Pendente";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
};

export type Order = {
  id: number;
  student_name: string;
  time: string; // Armazenar como ISO string date
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
};
