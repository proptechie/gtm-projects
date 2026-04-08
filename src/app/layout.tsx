import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connect Your PMS to Claude | Conduit AI",
  description: "Step-by-step guides to connect your property management system to Claude AI via MCP. Free setup guides for Guesty, Mews, Hostaway, Cloudbeds, Apaleo, Opera, and more.",
  openGraph: {
    title: "Connect Your PMS to Claude | Conduit AI",
    description: "Free guides to connect your hotel PMS to Claude AI. Build your own MCP server in minutes.",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
