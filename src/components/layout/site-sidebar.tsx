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

  // In a standalone admin app, we can assume the role is always GlobalAdmin for navigation purposes.
  const role: Role = "GlobalAdmin";

  if (!user) {
    return null;
  }

  const filterNavItems = (userRole: Role) => {
    const allNavs = navItems.filter(item => item.roles.includes(userRole));
    const mainNavs = allNavs.filter(item => item.title !== "Configurações");
    const settingsNav = allNavs.find(item => item.title === "Configurações");
    return { mainNavs, settingsNav };
  };

  const { mainNavs, settingsNav } = filterNavItems(role);
  const dashboardRoute = "/dashboard/admin";


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
            const href = item.href.includes('/dashboard') ? dashboardRoute : item.href;
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
