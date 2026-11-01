import { cn } from "@/lib/utils";

/** Keyboard hint chip, as in the game's menus (e.g. <Key>Esc</Key>). */
export function Key({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("aw-key", className)} aria-hidden="true">
      {children}
    </span>
  );
}
