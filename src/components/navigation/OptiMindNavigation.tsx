'use client';

/**
 * OptiMind Navigation Component - Enterprise-Grade Navigation System
 *
 * This component provides comprehensive navigation for the OptiMind ecosystem,
 * including access to AI Agents, Enhanced AI Orchestrator, and other key systems.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Network, 
  Zap, 
  Users, 
  Settings, 
  Home,
  Activity,
  BarChart3,
  Shield,
  Database,
  Globe,
  Cpu,
  Target
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  isActive?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Main dashboard and overview',
  },
  {
    name: 'AI Agents',
    href: '/ai-agents',
    icon: Users,
    description: 'Manage and monitor AI agents',
    badge: 'New',
  },
  {
    name: 'Enhanced AI',
    href: '/enhanced-ai-orchestrator',
    icon: Brain,
    description: 'Advanced AI orchestration system',
  },
  {
    name: 'GLM Orchestrator',
    href: '/glm-orchestrator-demo',
    icon: Network,
    description: 'GLM-4.5 powered orchestration',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'System analytics and insights',
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security and compliance',
  },
  {
    name: 'Database',
    href: '/database',
    icon: Database,
    description: 'Database management',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
  },
];

export default function OptiMindNavigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={cn(
      'bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300',
      isExpanded ? 'w-64' : 'w-16'
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">OptiMind</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-auto"
            >
              <Activity className={cn(
                'h-4 w-4 transition-transform duration-300',
                isExpanded ? 'rotate-180' : ''
              )} />
            </Button>
          </div>
          {isExpanded && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              AI Ecosystem Platform
            </p>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  'hover:bg-slate-100 dark:hover:bg-slate-700',
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {isExpanded && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        {isExpanded && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-600 dark:text-slate-400">System Online</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-500 dark:text-slate-400">Agents:</div>
                <div className="text-slate-900 dark:text-slate-100 font-medium">4 Active</div>
                <div className="text-slate-500 dark:text-slate-400">Tasks:</div>
                <div className="text-slate-900 dark:text-slate-100 font-medium">12 Running</div>
                <div className="text-slate-500 dark:text-slate-400">CPU:</div>
                <div className="text-slate-900 dark:text-slate-100 font-medium">45%</div>
                <div className="text-slate-500 dark:text-slate-400">Memory:</div>
                <div className="text-slate-900 dark:text-slate-100 font-medium">62%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}