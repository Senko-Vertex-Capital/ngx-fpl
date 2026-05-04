import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The Fund Manager League | Elite NGX Simulation",
  description: "A high-stakes virtual stock market simulation. Manage ₦250M, allocate NGX assets, and chase the Alpha to become Nigeria's top fund manager.",
  keywords: ["NGX", "Nigerian Stock Exchange", "Stock Market Simulator", "Fund Management", "Virtual Trading"],
  openGraph: {
    title: "The Fund Manager League",
    description: "₦250,000,000 is waiting. Do you have the conviction to deliver maximum returns?",
    type: "website",
    locale: "en_NG",
    siteName: "The Fund Manager League",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fund Manager League",
    description: "Elite virtual fund management simulation for the Nigerian market.",
  },
  verification: {
    google: "nBfNNDk3t8g5Mcvt0978oklhOlA7A1lJbA_Slkv_YQE",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased dark overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-body selection:bg-pitch selection:text-purple stadium-grid overflow-x-hidden"
        suppressHydrationWarning
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
