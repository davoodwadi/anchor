// import { Geist } from "next/font/google";
import { Oswald, Inter, Lora } from "next/font/google";

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
        className={`${heading.variable} ${body.variable} antialiased font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
