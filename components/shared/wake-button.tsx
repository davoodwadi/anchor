import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface WakeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  asChild?: boolean;
  href?: string;
}

export const WakeButton = React.forwardRef<HTMLButtonElement, WakeButtonProps>(
  (
    {
      className,
      variant = "primary",
      asChild = false,
      href,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative px-8 py-4 uppercase tracking-widest text-sm font-bold transition-all duration-300 w-full sm:w-auto overflow-hidden text-center inline-flex items-center justify-center";

    const variants = {
      primary:
        "bg-neon-red-900 text-white border border-red-700 hover:bg-neon-red-800 hover:border-red-500 group",
      secondary:
        "bg-zinc-950 text-zinc-300 border border-zinc-700 hover:text-white hover:border-zinc-500",
    };

    // If href is provided, render as a Link instead of a button
    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, variants[variant], className)}
        >
          {variant === "primary" && (
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
          <span className="relative z-10">{children}</span>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {variant === "primary" && (
          <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
        <span className="relative z-10 pointer-events-none">{children}</span>
      </button>
    );
  },
);

WakeButton.displayName = "WakeButton";
