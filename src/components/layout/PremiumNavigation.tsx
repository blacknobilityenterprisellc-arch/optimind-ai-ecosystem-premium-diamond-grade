'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  Network, 
  Zap, 
  Activity, 
  BarChart3,
  Settings,
  Shield,
  Crown,
  Diamond,
  Menu,
  X,
  Home,
  Database,
  Cloud,
  Cpu,
  Globe,
  Lock,
  Key,
  Fingerprint,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Gauge,
  Layers,
  Grid3X3,
  Binary,
  CircuitBoard,
  TrendingUp,
  Target,
  Star,
  Sparkles,
  Rocket,
  Server,
  SecurityScan,
  Atom,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main dashboard overview'
  },
  {
    name: 'AI Agents',
    href: '/ai-agents',
    icon: Users,
    description: 'Manage AI agents',
    badge: '12 Active'
  },
  {
    name: 'Enhanced AI',
    href: '/enhanced-ai-orchestrator',
    icon: Brain,
    description: 'Enhanced AI orchestration',
    badge: '35 Models'
  },
  {
    name: 'GLM Orchestrator',
    href: '/glm-orchestrator-demo',
    icon: Network,
    description: 'GLM-4.5 orchestration',
    badge: 'Active'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Real-time analytics'
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security & compliance'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System settings'
  }
];

export default function PremiumNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-600" />
              <Diamond className="h-3 w-3 text-purple-600 fill-purple-600 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OptiMind
            </span>
          </Link>
          
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-2 py-1 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Diamond Grade
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "relative h-9 px-3 text-sm font-medium transition-all duration-200",
                  pathname === item.href 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
                {item.badge && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">100%</span>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs">
              System Healthy
            </Badge>
          </div>
          
          <Button variant="outline" size="sm" className="border-gray-300">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-6 w-6 text-blue-600" />
                <Diamond className="h-2 w-2 text-purple-600 fill-purple-600 absolute -top-1 -right-1" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OptiMind
              </span>
            </Link>
            
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-2 py-1 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Diamond
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">100%</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 px-3 text-sm font-medium transition-all duration-200",
                      pathname === item.href 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}