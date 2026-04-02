import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Source_Serif_4 } from "next/font/google";
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
    "Hebrew course (Alef–Dalet), drills, reading practice, library links, and saved progress.",
  appleWebApp: {
    capable: true,
    title: "Hebrew — Yeshiva",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Hebrew — Yeshiva",
    description:
      "Structured Hebrew lessons, practice drills, reading, and review — save progress in your browser.",
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
      "Structured Hebrew lessons, drills, reading, and review — Yeshiva",
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
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
