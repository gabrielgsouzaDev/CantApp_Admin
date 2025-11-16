"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "../logo";
import { Separator } from "../ui/separator";
import { LogOutConfirmationDialog } from "./logout-confirmation-dialog";
import { Settings, LogOut } from "lucide-react";
import { Role } from "@/lib/types";

export function SiteSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }
  
  const role: Role = user.role;

  const filterNavItems = (userRole: Role) => {
    // If GlobalAdmin, show all navs except 'Pedidos'
    if (userRole === 'GlobalAdmin') {
        return navItems.filter(item => item.roles.includes(userRole));
    }
    // For other roles, show only their specific navs
    return navItems.filter(item => item.roles.includes(userRole));
  };
  
  const getDashboardRouteForRole = (userRole: Role | null) => {
    if (userRole === 'GlobalAdmin') return '/dashboard/admin';
    if (userRole === 'EscolaAdmin') return '/dashboard/escola';
    return '/';
  }

  const availableNavs = filterNavItems(role);
  const mainNavs = availableNavs.filter(item => item.title !== "Configurações");
  const settingsNav = availableNavs.find(item => item.title === "Configurações");
  const dashboardRoute = getDashboardRouteForRole(role);


  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={dashboardRoute}>
          <Logo />
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {mainNavs.map((item) => {
            const href = item.href;
            return (
                <SidebarMenuItem key={item.href}>
                <Link href={href}>
                    <SidebarMenuButton
                    isActive={pathname === href}
                    tooltip={item.title}
                    >
                    <item.icon />
                    <span>{item.title}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
         {settingsNav && (
            <SidebarMenuItem>
              <Link href={settingsNav.href}>
                <SidebarMenuButton
                  isActive={pathname === settingsNav.href}
                  tooltip={settingsNav.title}
                >
                  <Settings />
                  <span>{settingsNav.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
           <SidebarMenuItem>
                <LogOutConfirmationDialog>
                    <SidebarMenuButton asChild tooltip="Sair">
                        <button className="w-full">
                            <LogOut />
                            <span>Sair</span>
                        </button>
                    </SidebarMenuButton>
                </LogOutConfirmationDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
