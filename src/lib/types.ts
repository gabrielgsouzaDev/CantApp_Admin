import type { LucideIcon } from "lucide-react";

export type Role = "Admin" | "Escola" | "Cantineiro";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
};

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  children?: NavItem[];
};

export type School = {
  id: string;
  name: string;
  city: string;
  status: "active" | "inactive";
};

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type Canteen = {
  id: string;
  name: string;
  schoolId: string;
};

export type OrderStatus = "A Fazer" | "Em Preparo" | "Pronto";
export type PaymentStatus = "Pago" | "Pendente";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
};

export type Order = {
  id: string;
  studentName: string;
  time: number; // Store as timestamp
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
};
