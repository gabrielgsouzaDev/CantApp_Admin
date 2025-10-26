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

export function SiteSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();

  if (!role || !user) {
    return null;
  }

  const mainNavItems = navItems.filter(
    (item) => item.roles.includes(role) && item.title !== "Configurações"
  );
  const settingsNavItem = navItems.find((item) => item.title === "Configurações" && item.roles.includes(role));


  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                >
                  <a>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
         {settingsNavItem && (
            <SidebarMenuItem>
              <Link href={settingsNavItem.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === settingsNavItem.href}
                  tooltip={settingsNavItem.title}
                >
                  <a>
                    <Settings />
                    <span>{settingsNavItem.title}</span>
                  </a>
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
