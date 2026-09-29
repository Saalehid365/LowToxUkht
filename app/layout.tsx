import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

const description =
  "Private, sister to sister wellness coaching for Muslim women at home. Calmer days, a low tox home and halal conscious guidance from the founder of a natural products brand.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${site.name}: holistic wellness for Muslim women`, template: `%s | ${site.name}` },
  description,
  openGraph: { title: site.name, description, type: "website", locale: "en_GB", siteName: site.name },
  twitter: { card: "summary", title: site.name, description },
};

export const viewport: Viewport = { themeColor: "#f5f7f3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
