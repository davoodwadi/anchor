"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- 1. DEFINE VARIANTS FOR EACH PART ---

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow", // Default Shadcn
  {
    variants: {
      variant: {
        default: "",
        wake: "rounded-none border-2 border-border bg-zinc-950 shadow-sm", // Brutalist
      },
    },
    defaultVariants: { variant: "wake" },
  },
);

const headerVariants = cva("flex flex-col space-y-1.5 p-6", {
  variants: {
    variant: {
      default: "",
      wake: "border-b border-border bg-muted/20 pb-4", // Brutalist Header
    },
  },
  defaultVariants: { variant: "wake" },
});

const titleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    variant: {
      default: "",
      wake: "uppercase tracking-wide font-heading text-xl", // Brutalist Title
    },
  },
  defaultVariants: { variant: "wake" },
});

const contentVariants = cva("p-6", {
  variants: {
    variant: {
      default: "pt-0",
      wake: "pt-6", // Brutalist Content (needs more breathing room from the border)
    },
  },
  defaultVariants: { variant: "wake" },
});

// --- 2. CREATE CONTEXT ---
// This allows the children to know which variant the parent is using.
type CardContextValue = VariantProps<typeof cardVariants>;
const CardContext = React.createContext<CardContextValue>({
  variant: "wake",
});

// --- 3. BUILD COMPONENTS ---

interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "wake", ...props }, ref) => (
    <CardContext.Provider value={{ variant }}>
      <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      />
    </CardContext.Provider>
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);
  return (
    <div
      ref={ref}
      className={cn(headerVariants({ variant }), className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);
  return (
    <h3
      ref={ref}
      className={cn(titleVariants({ variant }), className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);
  return (
    <div
      ref={ref}
      className={cn(contentVariants({ variant }), className)}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

// These don't need special variants for now, just pass through
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
