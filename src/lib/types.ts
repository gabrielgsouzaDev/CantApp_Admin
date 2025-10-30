import type { LucideIcon } from "lucide-react";

export const Role = {
  GlobalAdmin: "GlobalAdmin",
  EscolaAdmin: "EscolaAdmin",
  Cantineiro: "Cantineiro",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// Este é o tipo de utilizador da Autenticação do Firebase, simplificado
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

// Este é o nosso perfil de utilizador específico da aplicação, armazenado no Firestore
export type CtnAppUser = {
  id: string; // ID do Documento do Firestore
  uid: string; // Corresponde ao UID da Autenticação do Firebase
  name: string;
  email: string;
  avatar: string;
  role: Role;
  schoolId?: string; // Escola associada para EscolaAdmin e Cantineiro
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
  address: string;
  cnpj: string;
  status: "active" | "inactive";
  ownerUid?: string; // UID do utilizador que criou a escola
};

export type Product = {
  id: string;
  name: string;
  price: number;
  schoolId: string; // Todos os produtos pertencem a uma escola
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
  time: number; // Armazenar como timestamp
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
};

// Removemos a referência ao User genérico para evitar confusão com CtnAppUser
// export type User = CtnAppUser;
