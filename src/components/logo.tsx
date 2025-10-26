import { cn } from "@/lib/utils";
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="text-xl font-bold text-primary">CTNAPP</span>
    </Link>
  );
}
