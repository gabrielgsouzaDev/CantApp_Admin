import { NavItem, Role, School, User } from "@/lib/types";
import { LayoutDashboard, Building, UtensilsCrossed, ShoppingCart, Users, FileText, Settings, BookCopy } from "lucide-react";
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const userAvatars = PlaceHolderImages;

export const mockUsers: Record<string, User> = {
    admin: { id: "1", name: "Admin User", email: "admin@ctn.com", role: "Admin", avatar: userAvatars.find(img => img.id === 'user-1')?.imageUrl || '' },
    escola: { id: "2", name: "Escola User", email: "escola@ctn.com", role: "Escola", avatar: userAvatars.find(img => img.id === 'user-2')?.imageUrl || '' },
    cantineiro: { id: "3", name: "Cantineiro User", email: "cantineiro@ctn.com", role: "Cantineiro", avatar: userAvatars.find(img => img.id === 'user-3')?.imageUrl || '' },
};


export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Escola", "Cantineiro"] },
    { title: "Escolas", href: "/schools", icon: Building, roles: ["Admin"] },
    { title: "Cantinas", href: "/canteens", icon: BookCopy, roles: ["Admin", "Escola"] },
    { title: "Produtos", href: "/products", icon: UtensilsCrossed, roles: ["Admin", "Escola", "Cantineiro"] },
    { title: "Pedidos", href: "/orders", icon: ShoppingCart, roles: ["Admin", "Escola", "Cantineiro"] },
    { title: "Usuários", href: "/users", icon: Users, roles: ["Admin"] },
    { title: "Relatórios", href: "/reports", icon: FileText, roles: ["Admin", "Escola"] },
    { title: "Configurações", href: "/settings", icon: Settings, roles: ["Admin", "Escola", "Cantineiro"] },
];

export const mockSchools: School[] = [
    { id: "SCH001", name: "Escola Primária Central", city: "São Paulo", status: "active" },
    { id: "SCH002", name: "Colégio Estadual Norte", city: "Rio de Janeiro", status: "active" },
    { id: "SCH003", name: "Escola Secundária Sul", city: "Belo Horizonte", status: "inactive" },
    { id: "SCH004", name: "Instituto de Educação Oeste", city: "Porto Alegre", status: "active" },
    { id: "SCH005", name: "Centro Educacional Leste", city: "Salvador", status: "active" },
    { id: "SCH006", name: "Error School", city: "Curitiba", status: "active" },
];
