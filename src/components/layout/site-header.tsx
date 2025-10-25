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
          {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          /> */}
        </div>
        <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <UserNav />
        </div>
      </div>
    </header>
  );
}
