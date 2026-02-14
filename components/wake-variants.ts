import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "", // Passthrough: looks exactly like standard Shadcn
      large: [
        // Layout & Type
        "w-full h-14 md:h-16 rounded-none px-4",
        //    - 'text-base': Start smaller on mobile to fit more text.
        //    - 'sm:text-lg': Scale up on tablets.
        //    - 'md:text-xl': Full size on desktop.
        "text-base sm:text-lg md:text-xl font-black tracking-widest uppercase",
        // Borders & Colors (Sensible defaults for a primary action)
        "border-2 border-foreground bg-primary text-primary-foreground hover:bg-primary/90",

        // The Brutalist Interaction (Shadows & Movement)
        "transition-all duration-100",

        // Disabled State
        "disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const cardVariants = cva(
  "border-2 border-primary/50 bg-background rounded-none transition-all duration-500",
  {
    variants: {
      variant: {
        identity:
          "max-w-md mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-none",
        results: "max-w-lg mx-auto shadow-none animate-in fade-in zoom-in-95",
      },
    },
    defaultVariants: { variant: "identity" },
  },
);

export const optionVariants = cva(
  "flex items-center p-4 border-2 cursor-pointer transition-all duration-200 tracking-wide text-sm md:text-base font-medium relative group w-full",
  {
    variants: {
      state: {
        default:
          "border-border bg-background text-foreground hover:border-foreground hover:text-foreground",
        selected: "border-primary bg-primary/10 text-foreground",
      },
    },
    defaultVariants: { state: "default" },
  },
);

export const checkboxVariants = cva(
  "w-4 h-4 mr-4 border-2 flex-shrink-0 transition-colors",
  {
    variants: {
      state: {
        default: "border-muted-foreground",
        selected: "bg-primary border-primary",
      },
    },
    defaultVariants: { state: "default" },
  },
);
