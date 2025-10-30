import type { LucideIcon } from "lucide-react";

export const Role = {
  GlobalAdmin: "GlobalAdmin",
  EscolaAdmin: "EscolaAdmin",
  Cantineiro: "Cantineiro",
} as const;
export type Role = typeof Role[keyof typeof Role];


// This is the user type from Firebase Authentication, simplified
export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

// This is our application-specific user profile, stored in Firestore
export type CtnAppUser = {
  id: string; // Document ID from Firestore
  uid: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  avatar: string;
  role: Role;
};

// Deprecated User type, replaced by CtnAppUser
export type User = {
  id: string;
  name:string;
  email: string;
  avatar: string;
  role: Role;
}

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
  ownerUid?: string; // UID of the user who created the school
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
