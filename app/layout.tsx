import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", style: ["normal", "italic"] });
const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: `${site.name} · Low-tox wellness consulting`, template: `%s · ${site.name}` },
  description:
    "One-to-one consulting that finds the hidden toxins in your home and replaces them with products you can trust.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
