import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Source_Serif_4 } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const fontHebrew = Frank_Ruhl_Libre({
  subsets: ["latin", "hebrew"],
  variable: "--font-hebrew",
  display: "swap",
});

const fontUi = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hebrew — Yeshiva",
  description:
    "A warm, structured Hebrew path (Alef–Dalet through bridge and beyond), with drills, reading, roots, and progress that stays yours in the browser.",
  appleWebApp: {
    capable: true,
    title: "Hebrew — Yeshiva",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Hebrew — Yeshiva",
    description:
      "Leveled Hebrew lessons, playful drills, reading habits, and honest review — progress saved in your browser until you choose to move it.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hebrew-icon.svg",
        width: 512,
        height: 512,
        alt: "Hebrew",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hebrew — Yeshiva",
    description:
      "Leveled Hebrew, living-language drills, and reading you can grow into — Yeshiva",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5ecd8",
  /** Lets `env(safe-area-inset-*)` apply on notched devices / installed PWA. */
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${fontHebrew.variable} ${fontUi.variable}`}>
      <body className="font-body bg-parchment-grain">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
