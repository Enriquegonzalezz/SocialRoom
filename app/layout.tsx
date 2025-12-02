import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport separado para Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Social Room - Marketing Agency",
  description: "Creative marketing agency specializing in branding, web design, and digital experiences",
  keywords: ["marketing", "branding", "web design", "digital agency", "Barcelona"],
  authors: [{ name: "Social Room" }],
  openGraph: {
    title: "Social Room - Marketing Agency",
    description: "Creative marketing agency specializing in branding, web design, and digital experiences",
    type: "website",
  },
  other: {
    'format-detection': 'telephone=no', // Evita que iOS detecte números como teléfonos
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
