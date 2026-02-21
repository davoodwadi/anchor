"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "", className }: BackButtonProps) {
  const pathname = usePathname();

  // Default behavior: Go up one level in the URL hierarchy
  const parentPath = pathname?.split("/").slice(0, -1).join("/") || "/";
  const targetHref = href || parentPath;

  return (
    <Link
      href={targetHref}
      className={cn(
        // Layout
        "group inline-flex items-center gap-2",
        // Typography
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
