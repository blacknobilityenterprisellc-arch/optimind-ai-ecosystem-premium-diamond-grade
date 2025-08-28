"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Search, 
  Target, 
  Globe, 
  Zap, 
  ChevronDown,
  ArrowRight
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const products = [
    {
      name: "SEO Optimization",
      description: "Advanced search engine optimization with AI",
      icon: Search,
      href: "#seo"
    },
    {
      name: "AEO Enhancement", 
      description: "Answer Engine Optimization for voice search",
      icon: Target,
      href: "#aeo"
    },
    {
      name: "GEO Targeting",
      description: "Geographic optimization for local markets",
      icon: Globe,
      href: "#geo"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">OptiMind AI</span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              BETA
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button 
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                Products
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isProductsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-card border rounded-lg shadow-lg p-4 space-y-3"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  {products.map((product, index) => (
                    <Link 
                      key={index}
                      href={product.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <product.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground">Products</div>
                {products.map((product, index) => (
                  <Link 
                    key={index}
                    href={product.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <product.icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Link 
                  href="#features" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#pricing" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="#about" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="#contact" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
                <Button className="w-full">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}