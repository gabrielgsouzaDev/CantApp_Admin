"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
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

export function SiteSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();

  if (!role || !user) {
    return null;
  }

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
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
      <SidebarFooter>
        {/* Can be used for extra info or actions */}
      </SidebarFooter>
    </Sidebar>
  );
}
