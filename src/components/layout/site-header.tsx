import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="relative ml-auto flex flex-1 md:grow-0">
          {/* This is a placeholder for global search */}
        </div>
        <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <UserNav />
        </div>
      </div>
    </header>
  );
}
