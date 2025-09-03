import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NavigationHeader from "@/components/layout/NavigationHeader";
import SidebarNavigation from "@/components/layout/SidebarNavigation";
import ErrorBoundary from "@/components/ui/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiMind AI Ecosystem - Premium Diamond Grade AI Platform",
  description: "Advanced AI-powered optimization platform with SEO, AEO, GEO, and content creation tools. Diamond-grade AI ecosystem for enterprise optimization.",
  keywords: ["OptiMind AI", "SEO", "AEO", "GEO", "AI optimization", "content creation", "enterprise AI", "diamond grade"],
  authors: [{ name: "OptiMind AI Team" }],
  openGraph: {
    title: "OptiMind AI Ecosystem",
    description: "Premium diamond-grade AI optimization platform",
    url: "https://optimind.ai",
    siteName: "OptiMind AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptiMind AI Ecosystem",
    description: "Premium diamond-grade AI optimization platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground premium-bg premium-scrollbar`}
      >
        <ThemeProvider defaultTheme="dark">
          <ErrorBoundary>
            <div className="flex h-screen">
              <SidebarNavigation />
              <div className="flex-1 flex flex-col overflow-hidden">
                <NavigationHeader />
                <main className="flex-1 overflow-y-auto premium-scrollbar">
                  {children}
                </main>
              </div>
            </div>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}