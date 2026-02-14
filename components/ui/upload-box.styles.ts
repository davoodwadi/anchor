import { tv } from "tailwind-variants";

export const uploadBox = tv({
  base: `
    flex flex-col items-center justify-center
    w-full h-32
    border-2 rounded-lg
    cursor-pointer
    transition-all duration-300
  `,
  variants: {
    state: {
      empty: `
        border-dashed border-border
        hover:border-foreground
        hover:bg-muted/50
      `,
      selected: `
        border-secondary
        bg-secondary/5
        border-solid
      `,
      error: `
        border-destructive
        bg-destructive/5
      `,
    },
    size: {
      sm: "h-24",
      md: "h-32",
      lg: "h-40",
    },
  },
  defaultVariants: {
    state: "empty",
    size: "md",
  },
});
