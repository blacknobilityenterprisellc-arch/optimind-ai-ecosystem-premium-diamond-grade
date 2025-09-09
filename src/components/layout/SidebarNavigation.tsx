'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  FileText,
  Target,
  Brain,
  Image as ImageIcon,
  Settings,
  Shield,
  Users,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Crown,
  Activity,
  Database,
  Globe,
  Search,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart3,
    description: 'System overview and analytics',
  },
  {
    title: 'AI Content & Creation',
    href: '/content-creation',
    icon: FileText,
    badge: 'New',
    children: [
      {
        title: 'Content Generator',
        href: '/content-creation/generator',
        icon: FileText,
        description: 'AI-powered content creation',
      },
      {
        title: 'Art Generator',
        href: '/content-creation/art',
        icon: ImageIcon,
        description: 'Create AI images and media',
      },
      {
        title: 'Premium Editor',
        href: '/content-creation/editor',
        icon: FileText,
        description: 'Advanced AI editing tools',
      },
    ],
  },
  {
    title: 'AI Optimization',
    href: '/optimization',
    icon: Target,
    badge: 'Pro',
    children: [
      {
        title: 'SEO Analysis',
        href: '/optimization/seo',
        icon: Search,
        description: 'Search engine optimization',
      },
      {
        title: 'AEO Enhancement',
        href: '/optimization/aeo',
        icon: Target,
        description: 'Answer engine optimization',
      },
      {
        title: 'GEO Targeting',
        href: '/optimization/geo',
        icon: Globe,
        description: 'Global engine optimization',
      },
      {
        title: 'Performance',
        href: '/optimization/performance',
        icon: Activity,
        description: 'System performance analysis',
      },
    ],
  },
  {
    title: 'AI Research & Analysis',
    href: '/research-analysis',
    icon: Brain,
    badge: 'Beta',
    children: [
      {
        title: 'Multi-Model Analysis',
        href: '/research-analysis/multi-model',
        icon: Brain,
        description: 'Compare AI models',
      },
      {
        title: 'Data Insights',
        href: '/research-analysis/insights',
        icon: Database,
        description: 'Data-driven insights',
      },
      {
        title: 'Brand Tracking',
        href: '/research-analysis/brand',
        icon: Target,
        description: 'Brand mention analysis',
      },
    ],
  },
  {
    title: 'Security & Admin',
    href: '/admin',
    icon: Shield,
    children: [
      {
        title: 'Security Dashboard',
        href: '/admin/security',
        icon: Shield,
        description: 'System security monitoring',
      },
      {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
        description: 'Manage user access',
      },
      {
        title: 'API Settings',
        href: '/admin/api',
        icon: Settings,
        description: 'API configuration',
      },
    ],
  },
];

export default function SidebarNavigation() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: SidebarItem[]) => {
    return children?.some(child => isActive(child.href));
  };

  return (
    <aside className="w-48 sm:w-56 md:w-64 bg-background border-r border-border/40 h-screen sticky top-0 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-border/40">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <img src="/logo.svg" alt="OptiMind AI Logo" className="w-full h-full" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-lg">OptiMind AI</span>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs px-1 py-0.5">
                  Diamond
                </Badge>
                <Crown className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500" />
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {sidebarItems.map(item => (
            <div key={item.href}>
              <Link
                href={item.children ? '#' : item.href}
                onClick={
                  item.children
                    ? e => {
                        e.preventDefault();
                        toggleExpanded(item.href);
                      }
                    : undefined
                }
                className={cn(
                  'flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive(item.href) && 'bg-accent text-accent-foreground',
                  isChildActive(item.children) && 'bg-accent/50 text-accent-foreground'
                )}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{item.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge variant="outline" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.children &&
                    (expandedItems.includes(item.href) ? (
                      <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                    ) : (
                      <ChevronRight className="h-2 w-2 sm:h-3 sm:w-3" />
                    ))}
                </div>
              </Link>

              {/* Sub-items */}
              {item.children && expandedItems.includes(item.href) && (
                <div className="ml-2 sm:ml-4 mt-1 space-y-1">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                        isActive(child.href) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <child.icon className="h-2 w-2 sm:h-3 sm:w-3" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 sm:p-3 md:p-4 border-t border-border/40">
          <div className="space-y-2 sm:space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Settings className="h-3 w-3 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>OptiMind AI</span>
              <span>v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
