import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LayoutLines } from "./components/LayoutLines";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "MarginX - Turn Market Volatility into 100x Returns",
  description: "Buy with upto 100x leverage, because 10x ain't enough",
  openGraph: {
    title: "MarginX - Turn Market Volatility into 100x Returns",
    description: "Buy with upto 100x leverage, because 10x ain't enough",
    images: [
      {
        url: "/images/OG.png",
        width: 1200,
        height: 630,
        alt: "MarginX - Turn Market Volatility into 100x Returns",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarginX - Turn Market Volatility into 100x Returns",
    description: "Buy with upto 100x leverage, because 10x ain't enough",
    images: ["/images/OG.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} antialiased`}
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <LayoutLines />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
