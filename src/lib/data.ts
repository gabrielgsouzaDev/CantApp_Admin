import { NavItem } from "@/lib/types";
import { LayoutDashboard, Building, UtensilsCrossed, ShoppingCart, Users, FileText, Settings, BookCopy } from "lucide-react";

export const navItems: NavItem[] = [
    // Admin & Escola
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["GlobalAdmin", "EscolaAdmin"] },
    
    // Admin
    { title: "Escolas", href: "/schools", icon: Building, roles: ["GlobalAdmin"] },
    
    // Escola
    { title: "Cantinas", href: "/canteens", icon: BookCopy, roles: ["EscolaAdmin"] },
    { title: "Produtos", href: "/products", icon: UtensilsCrossed, roles: ["EscolaAdmin"] },
    { title: "Usuários", href: "/users", icon: Users, roles: ["GlobalAdmin", "EscolaAdmin"] },
    
    // Cantineiro
    { title: "Pedidos", href: "/orders", icon: ShoppingCart, roles: ["Cantineiro"] },

    // Comum para Admin e Escola
    { title: "Relatórios", href: "/reports", icon: FileText, roles: ["GlobalAdmin", "EscolaAdmin"] },

    // Comum para todos
    { title: "Configurações", href: "/settings", icon: Settings, roles: ["GlobalAdmin", "EscolaAdmin", "Cantineiro"] },
];
