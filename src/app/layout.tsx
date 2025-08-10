import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tous Statisticien Academy",
  description: "Plateforme d'apprentissage et de statistiques – Tous Statisticien Academy",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen selection:bg-amber-100 selection:text-amber-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
