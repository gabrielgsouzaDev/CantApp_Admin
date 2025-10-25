import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
        >
          C
        </text>
      </svg>
      <span className="text-lg font-semibold">CTNADMIN</span>
    </div>
  );
}
