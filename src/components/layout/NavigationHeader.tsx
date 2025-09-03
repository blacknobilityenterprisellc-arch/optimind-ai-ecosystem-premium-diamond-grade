"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Brain, 
  Search, 
  Target, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  Shield, 
  BarChart3, 
  Settings, 
  User, 
  Menu, 
  X, 
  Sparkles,
  Zap,
  Crown,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: BarChart3,
      description: "Overview and analytics"
    },
    {
      title: "AI Content & Creation",
      href: "/content-creation",
      icon: FileText,
      description: "Generate content, art, and media"
    },
    {
      title: "AI Optimization",
      href: "/optimization",
      icon: Target,
      description: "SEO, AEO, GEO, and performance"
    },
    {
      title: "AI Research & Analysis",
      href: "/research-analysis",
      icon: Brain,
      description: "Multi-model analysis and insights"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-6 w-6 text-primary" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-3 w-3 text-purple-500" />
              </div>
            </div>
            <span className="hidden font-bold sm:inline-block">OptiMind AI</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              Diamond
            </Badge>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive(item.href) 
                    ? "text-foreground" 
                    : "text-foreground/60"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="md:hidden flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-6 w-6 text-primary" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                </div>
              </div>
              <span className="font-bold">OptiMind AI</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                Diamond
              </Badge>
            </Link>
          </div>
          
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Premium User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@optimind.ai
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-1 border-t p-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive(item.href) 
                    ? "bg-accent text-accent-foreground" 
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <div>
                  <div>{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}