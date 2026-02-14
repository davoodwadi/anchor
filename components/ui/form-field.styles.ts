import { tv } from "tailwind-variants";

export const formField = tv({
  slots: {
    container: "space-y-2",
    label: `
      text-md
      font-bold
      text-foreground
    `,
    hint: `
      text-sm
      text-muted-foreground
    `,
  },
});
