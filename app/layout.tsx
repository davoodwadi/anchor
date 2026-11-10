// import { Geist } from "next/font/google";
import {
  Oswald,
  Inter,
  Lora,
  Anton,
  Barlow,
  Barlow_Condensed,
  Courier_Prime,
  Covered_By_Your_Grace,
  Kalam,
} from "next/font/google";

// Alan Wake 2 type system (see docs/alan-wake-2-reference):
// Anton ~ Compacta (display), Barlow Condensed ~ Aktiv Grotesk Condensed (UI),
// Courier Prime (typed manuscript), Covered By Your Grace (short margin notes),
// Kalam (full sentences written in pen)
const display = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const ui = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600"],
  display: "swap",
});

const prose = Barlow({
  subsets: ["latin"],
  variable: "--font-prose",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const typed = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-typed",
  weight: ["400", "700"],
  display: "swap",
});

const hand = Covered_By_Your_Grace({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: "400",
  display: "swap",
});

const note = Kalam({
  subsets: ["latin"],
  variable: "--font-note",
  weight: "400",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "700",
});

const heading = Oswald({
  subsets: ["latin"],
  variable: "--font-heading", // <--- This tricks Tailwind into using it everywhere
  display: "swap",
});

const body = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  // Lora looks best with italic support for "story" elements
  style: ["normal", "italic"],
});

import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Anchor: Quiz generation with grounded LLMs",
  description:
    "Build interactive quizzes using a Large Language Model grounded on your data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${display.variable} ${ui.variable} ${prose.variable} ${typed.variable} ${hand.variable} ${note.variable} antialiased font-body antialiased relative bg-black text-white min-h-screen selection:bg-red-900 selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Background ambient glow effect */}
          {/* <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,#4a0404_0%,transparent_70%)] z-0"></div> */}

          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
