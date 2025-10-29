import { NavItem, Role } from "@/lib/types";
import { LayoutDashboard, Building, UtensilsCrossed, ShoppingCart, Users, FileText, Settings, BookCopy } from "lucide-react";

export const navItems: NavItem[] = [
    // Admin & Escola
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Escola"] },
    
    // Admin
    { title: "Escolas", href: "/schools", icon: Building, roles: ["Admin"] },
    
    // Escola
    { title: "Cantinas", href: "/canteens", icon: BookCopy, roles: ["Escola"] },
    { title: "Estoque", href: "/products", icon: UtensilsCrossed, roles: ["Escola"] },
    { title: "Usuários", href: "/users", icon: Users, roles: ["Admin", "Escola"] },
    
    // Cantineiro
    { title: "Pedidos", href: "/orders", icon: ShoppingCart, roles: ["Cantineiro"] },

    // Comum para Admin e Escola
    { title: "Relatórios", href: "/reports", icon: FileText, roles: ["Admin", "Escola"] },

    // Comum para todos
    { title: "Configurações", href: "/settings", icon: Settings, roles: ["Admin", "Escola", "Cantineiro"] },
];
