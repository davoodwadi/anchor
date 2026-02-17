import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Add custom animations for the "glitch" or "flicker" effect
      animation: {
        // Slow down the cycle to 8 seconds so it's not constantly strobing
        flicker: "flicker 8s infinite",
        "travel-snap": "travel 2.4s steps(1) infinite",
      },
      keyframes: {
        flicker: {
          // 0% to 90%: Perfectly stable (The Calm)
          "0%, 89.999%": {
            opacity: "1",
          },
          // 90% to 95%: Violent flickering (The Event)
          "90%, 92%, 94%": {
            opacity: "0.2",
          },
          "91%, 93%, 95%": {
            opacity: "1",
          },
          // 95.1% to 100%: Back to stable
          "95.001%, 100%": {
            opacity: "1",
          },
        },
        travel: {
          "0%": { opacity: "0.2" }, // Start Solid (Black)
          "66.66%, 100%": { opacity: "1.0" }, // Snap to Pale at 1/3rd of the time
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
