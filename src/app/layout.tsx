import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/theme-provider";
import NavigationHeader from "@/components/layout/NavigationHeader";
import SidebarNavigation from "@/components/layout/SidebarNavigation";
import ErrorBoundary from "@/components/ui/error-boundary";
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Z.ai Code Scaffold - AI-Powered Development",
  description: "Modern Next.js scaffold optimized for AI-powered development with Z.ai. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Z.ai Team" }],
  openGraph: {
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
=======
  title: "OptiMind AI Ecosystem - Premium Diamond Grade AI Platform",
  description: "Advanced AI-powered optimization platform with SEO, AEO, GEO, and content creation tools. Diamond-grade AI ecosystem for enterprise optimization.",
  keywords: ["OptiMind AI", "SEO", "AEO", "GEO", "AI optimization", "content creation", "enterprise AI", "diamond grade"],
  authors: [{ name: "OptiMind AI Team" }],
  openGraph: {
    title: "OptiMind AI Ecosystem",
    description: "Premium diamond-grade AI optimization platform",
    url: "https://optimind.ai",
    siteName: "OptiMind AI",
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
<<<<<<< HEAD
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
=======
    title: "OptiMind AI Ecosystem",
    description: "Premium diamond-grade AI optimization platform",
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
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
<<<<<<< HEAD
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
=======
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
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
      </body>
    </html>
  );
}
