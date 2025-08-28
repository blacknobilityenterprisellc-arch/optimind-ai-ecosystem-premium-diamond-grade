import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhotoGuard Pro - AI-Powered Photo Security & Organization",
  description: "Advanced AI-powered photo security, content analysis, and intelligent organization. Protect your privacy with cutting-edge technology.",
  keywords: ["photo security", "AI content detection", "privacy protection", "photo organization", "artificial intelligence", "Next.js", "GLM-4.5"],
  authors: [{ name: "PhotoGuard Pro Team" }],
  creator: "PhotoGuard Pro",
  publisher: "PhotoGuard Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://photoguard-pro.vercel.app'),
  openGraph: {
    title: "PhotoGuard Pro - AI-Powered Photo Security",
    description: "Advanced AI-powered photo security, content analysis, and intelligent organization. Protect your privacy with cutting-edge technology.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://photoguard-pro.vercel.app',
    siteName: "PhotoGuard Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PhotoGuard Pro - AI-Powered Photo Security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoGuard Pro - AI-Powered Photo Security",
    description: "Advanced AI-powered photo security, content analysis, and intelligent organization.",
    images: ["/og-image.png"],
    creator: "@PhotoGuardPro",
    site: "@PhotoGuardPro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  manifest: '/manifest.json',
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
