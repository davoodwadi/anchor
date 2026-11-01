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
        display: ["var(--font-display)", "Impact", "sans-serif"],
        ui: ["var(--font-ui)", "Arial Narrow", "sans-serif"],
        prose: ["var(--font-prose)", "system-ui", "sans-serif"],
        typed: ["var(--font-typed)", "Courier New", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
      colors: {
        // Alan Wake 2 palette: sage is Saga's side, red is Alan's
        aw: {
          bg: "#0d0e0e",
          "bg-2": "#151817",
          line: "#2a2e2c",
          text: "#e4e8e5",
          "text-2": "#a3aaa5",
          "text-3": "#6d746f",
          sage: "#95a99d",
          "sage-dim": "#5c6b62",
          red: "#af2626",
          amber: "#d4ad4b",
          paper: "#a8977a",
          ink: "#1a1815",
          key: "#3a3e3c",
        },
        "neon-red": {
          50: "hsl(var(--neon-red-50))",
          100: "hsl(var(--neon-red-100))",
          200: "hsl(var(--neon-red-200))",
          300: "hsl(var(--neon-red-300))",
          400: "hsl(var(--neon-red-400))",
          500: "hsl(var(--neon-red-500))",
          600: "hsl(var(--neon-red-600))",
          700: "hsl(var(--neon-red-700))",
          800: "hsl(var(--neon-red-800))",
          900: "hsl(var(--neon-red-900))",
          950: "hsl(var(--neon-red-950))",
        },
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
