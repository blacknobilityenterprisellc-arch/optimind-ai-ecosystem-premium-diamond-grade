'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  X,
  Brain,
  Users,
  Network,
  BarChart3,
  Settings,
  Crown,
  Diamond,
  Shield,
  Zap,
  Activity,
  Database,
  Globe,
  Cpu,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  User,
  Bell,
  Search,
  Home,
  Grid3X3,
  Layers,
  Binary,
  CircuitBoard,
  Fingerprint,
  Key,
  Lock,
  Eye,
  Cloud,
  Server,
  Wifi,
  Gauge,
  TrendingUp,
  Target,
  Award,
  Star,
  Sparkles,
  Rocket,
  ArrowRight,
  LogOut,
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main dashboard overview',
  },
  {
    label: 'AI Agents',
    href: '/ai-agents',
    icon: Users,
    description: 'Manage AI agents and tasks',
    badge: '8 Active',
  },
  {
    label: 'Enhanced AI',
    href: '/enhanced-ai-orchestrator',
    icon: Brain,
    description: 'Quantum-enhanced AI processing',
    badge: '35+ Models',
  },
  {
    label: 'GLM Orchestrator',
    href: '/glm-orchestrator-demo',
    icon: Network,
    description: 'Enterprise orchestration control',
    badge: '1.2K Ops',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Real-time analytics and insights',
    badge: '5.2M Data',
  },
];

const enterpriseFeatures = [
  {
    label: 'Security Center',
    href: '/security',
    icon: Shield,
    description: 'Military-grade security management',
  },
  {
    label: 'Network Monitor',
    href: '/network',
    icon: Wifi,
    description: 'Network performance and status',
  },
  {
    label: 'Database Manager',
    href: '/database',
    icon: Database,
    description: 'Database administration and backup',
  },
  {
    label: 'System Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration and preferences',
  },
];

const mobileMenuItems = [
  ...navigationItems,
  ...enterpriseFeatures,
  {
    label: 'Device Compatibility',
    href: '/compatibility',
    icon: Smartphone,
    description: 'Cross-platform compatibility info',
  },
  {
    label: 'API Documentation',
    href: '/api-docs',
    icon: CircuitBoard,
    description: 'Developer API documentation',
  },
];

export default function OptiMindNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnterpriseMenuOpen, setIsEnterpriseMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1">
                  <Diamond className="h-3 w-3 md:h-4 md:w-4 text-purple-600 fill-purple-600" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  OptiMind AI
                </h1>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold text-xs px-2 py-0.5">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-xs px-2 py-0.5">
                    <Activity className="h-3 w-3 mr-1" />
                    100% Health
                  </Badge>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map(item => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={cn(
                    'h-9 md:h-10 px-3 md:px-4 text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}

            {/* Enterprise Features Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="h-9 md:h-10 px-3 md:px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                onClick={() => setIsEnterpriseMenuOpen(!isEnterpriseMenuOpen)}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Enterprise
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>

              {isEnterpriseMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    {enterpriseFeatures.map(item => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-10 px-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => setIsEnterpriseMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 relative"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="h-9 w-9 md:h-10 md:w-10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                      Enterprise Account
                    </div>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 px-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 px-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Button>
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 px-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {mobileMenuItems.map(item => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-12 px-4 text-left transition-all duration-200',
                      pathname === item.href
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                    {item.badge && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Mobile Status Bar */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  System Status
                </span>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">100% Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">0.8ms Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">8 AI Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">2.1M Req/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
