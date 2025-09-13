'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Users,
  Brain,
  Network,
  BarChart3,
  Settings,
  Shield,
  Database,
  Globe,
  Cpu,
  Activity,
  Zap,
  Crown,
  Diamond,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  User,
  LogOut,
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
  Rocket,
  TestTube,
  FileText,
  Image as ImageIcon,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

const navigationGroups = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'Main dashboard overview',
        badge: 'Active'
      },
      {
        label: 'AI Agents',
        href: '/ai-agents',
        icon: Users,
        description: 'Manage AI agents and tasks',
        badge: '8 Active'
      },
      {
        label: 'Enhanced AI',
        href: '/enhanced-ai-orchestrator',
        icon: Brain,
        description: 'Quantum-enhanced AI processing',
        badge: '35+ Models'
      },
      {
        label: 'Super Agents',
        href: '/optimind-super-agents',
        icon: Brain,
        description: '8 AI agents with transparent workflow',
        badge: 'Auto-Git'
      },
      {
        label: 'GLM Orchestrator',
        href: '/glm-orchestrator-demo',
        icon: Network,
        description: 'Enterprise orchestration control',
        badge: '1.2K Ops'
      },
    ]
  },
  {
    title: 'Analytics & Testing',
    items: [
      {
        label: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        description: 'Real-time analytics and insights',
        badge: '5.2M Data'
      },
      {
        label: 'Testing',
        href: '/testing',
        icon: TestTube,
        description: 'Autonomous testing framework',
        badge: '100%'
      },
      {
        label: 'Optimization',
        href: '/optimization',
        icon: Target,
        description: 'SEO, AEO, GEO, and performance',
        badge: 'Optimized'
      },
    ]
  },
  {
    title: 'Content & Creation',
    items: [
      {
        label: 'Content Creation',
        href: '/content-creation',
        icon: FileText,
        description: 'Generate content, art, and media',
        badge: 'AI-Powered'
      },
      {
        label: 'Research & Analysis',
        href: '/research-analysis',
        icon: Brain,
        description: 'Multi-model analysis and insights',
        badge: 'Deep'
      },
    ]
  },
  {
    title: 'Enterprise',
    items: [
      {
        label: 'Security Center',
        href: '/security',
        icon: Shield,
        description: 'Military-grade security management',
        badge: 'Military'
      },
      {
        label: 'Database Manager',
        href: '/database',
        icon: Database,
        description: 'Database administration and backup',
        badge: 'Secure'
      },
      {
        label: 'System Settings',
        href: '/settings',
        icon: Settings,
        description: 'System configuration and preferences',
        badge: 'Admin'
      },
    ]
  }
];

const bottomNavItems = [
  {
    label: 'API Documentation',
    href: '/api-docs',
    icon: CircuitBoard,
    description: 'Developer API documentation'
  },
  {
    label: 'Network Monitor',
    href: '/network',
    icon: Wifi,
    description: 'Network performance and status'
  },
];

export default function SidebarNavigation() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main']);
  const pathname = usePathname();

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Diamond className="h-4 w-4 text-purple-600 fill-purple-600" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              OptiMind AI
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold text-xs px-2 py-0.5">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </Link>
      </div>

      {/* System Status */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              System Status
            </span>
            <Badge className="bg-green-100 text-green-800 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Operational
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">100% Health</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">0.8ms Latency</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">8 AI Agents</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">2.1M Req/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between" className="flex-1 overflow-y-auto p-4 space-y-4">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => toggleGroup(group.title)}
            >
              <span>{group.title}</span>
              {expandedGroups.includes(group.title) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {expandedGroups.includes(group.title) && (
              <div className="space-y-1 pl-2">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start h-9 px-3 text-sm transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                      {item.badge && (
                        <Badge className={cn(
                          "ml-2 text-xs",
                          isActive(item.href) 
                            ? "bg-white/20 text-white" 
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        )}>
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <item.icon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}