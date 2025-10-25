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
