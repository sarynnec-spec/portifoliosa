import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { profile, summary } from "@/content/profile";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
  display: "swap",
});

const title = `${profile.firstName} ${profile.lastName} — ${profile.role}`;

export const metadata: Metadata = {
  title,
  description: summary,
  authors: [{ name: profile.fullName }],
  keywords: [
    "Sarynne Ferreira",
    "design gráfico",
    "UX/UI",
    "multimédia",
    "social media",
    "tráfego pago",
    "Aveiro",
    "Portugal",
  ],
  openGraph: {
    title,
    description: summary,
    locale: "pt_PT",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#14130f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${serif.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
