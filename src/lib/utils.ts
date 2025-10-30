import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Role } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getDashboardRouteForRole(role: Role | null) {
  // Simplified for the admin-only app.
  // Any logged in user is directed to the admin dashboard.
  if (role) {
    return '/dashboard/admin';
  }
  return '/';
}
