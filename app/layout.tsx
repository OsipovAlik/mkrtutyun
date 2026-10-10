import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { formatEventDate } from "@/lib/armenian-date";
import { eventConfig } from "@/lib/event-config";
import "./globals.css";

/*
 * Fonts are self-hosted from app/fonts (variable woff2 files from Google Fonts),
 * so no request goes to Google at dev or build time.
 * Each Armenian family is split in two files — Armenian glyphs and Latin/digits —
 * and both are listed in the CSS font stack (see globals.css).
 */
const serifArmenian = localFont({
  src: "./fonts/noto-serif-armenian-armenian.woff2",
  weight: "300 500",
  variable: "--font-serif-armenian",
  display: "swap",
});
const serifLatin = localFont({
  src: "./fonts/noto-serif-armenian-latin.woff2",
  weight: "300 500",
  variable: "--font-serif-latin",
  display: "swap",
  preload: false,
});
const sansArmenian = localFont({
  src: "./fonts/noto-sans-armenian-armenian.woff2",
  weight: "300 500",
  variable: "--font-sans-armenian",
  display: "swap",
});
const sansLatin = localFont({
  src: "./fonts/noto-sans-armenian-latin.woff2",
  weight: "300 500",
  variable: "--font-sans-latin",
  display: "swap",
  preload: false,
});
/** Used only for numerals (dates, times, countdown). */
const numerals = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  weight: "300 400",
  variable: "--font-cormorant",
  display: "swap",
});

const fontVariables = [serifArmenian, serifLatin, sansArmenian, sansLatin, numerals].map((f) => f.variable).join(" ");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = `${eventConfig.childrenGenitive} Մկրտությունը`;
const description = `Սիրով հրավիրում ենք Ձեզ՝ ${formatEventDate()}։ Մայր Աթոռ Սուրբ Էջմիածին։`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "hy_AM",
    images: [{ url: "/images/hero-etchmiadzin.png", width: 1448, height: 1086, alt: "Էջմիածնի Մայր տաճարը" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/hero-etchmiadzin.png"] },
};

export const viewport: Viewport = {
  themeColor: "#faf7f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hy" className={fontVariables}>
      <body className="min-h-full">
        <noscript>
          <style>{`.reveal,.animate-rise,.animate-fade{opacity:1!important;transform:none!important}.intro-gate{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
