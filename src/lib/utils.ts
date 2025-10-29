import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Role } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getDashboardRouteForRole(role: Role | null) {
  switch (role) {
    case 'Admin':
      return '/dashboard/admin';
    case 'Escola':
      return '/dashboard/escola';
    case 'Cantineiro':
      return '/orders';
    default:
      return '/';
  }
}
