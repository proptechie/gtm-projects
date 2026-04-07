import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connect Your PMS to Claude | Conduit AI",
  description: "Step-by-step guides to connect your property management system to Claude AI via MCP. Guesty, Mews, Hostaway, Cloudbeds, Apaleo, Opera, and more.",
  openGraph: {
    title: "Connect Your PMS to Claude | Conduit AI",
    description: "Free guides to connect your hotel PMS to Claude AI. Build your own MCP server in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
