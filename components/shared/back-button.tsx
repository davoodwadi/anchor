import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href = "/dashboard",
  label = "",
  className,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        // Layout
        "group inline-flex items-center gap-2",
        // Typography (Alan Wake Style)
        "font-heading font-bold uppercase tracking-widest text-sm",
        // Colors
        "text-muted-foreground transition-colors duration-200",
        // Hover State
        "hover:text-foreground",
        className,
      )}
    >
      {/* The Icon: slides left on hover */}
      <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />

      {/* The Label */}
      <span>{label}</span>
    </Link>
  );
}
