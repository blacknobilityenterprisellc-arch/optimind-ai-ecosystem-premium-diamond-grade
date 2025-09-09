/**
 * Premium Diamond Grade AI Capabilities Grid Component
 *
 * Enterprise-grade AI capabilities display with optimized
 * performance and interactive elements.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AICapability {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  badge?: string;
  stats: string;
  status: 'active' | 'beta' | 'coming-soon';
}

interface AICapabilitiesGridProps {
  capabilities: AICapability[];
  compact?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'beta':
      return 'bg-yellow-500';
    case 'coming-soon':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const AICapabilitiesGrid: React.FC<AICapabilitiesGridProps> = ({
  capabilities,
  compact = false,
}) => {
  const gridClass = compact
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={gridClass}>
      {capabilities.map(capability => (
        <Card key={capability.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <capability.icon className={`h-6 w-6 ${capability.color}`} />
              <div className="flex items-center gap-2">
                {capability.badge && (
                  <Badge variant="outline" className="text-xs">
                    {capability.badge}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(capability.status)} text-white border-none`}
                >
                  {capability.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            <CardTitle className={compact ? 'text-lg' : 'text-lg'}>{capability.title}</CardTitle>
            <CardDescription>{capability.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{capability.stats}</span>
              <Button variant="outline" size="sm">
                {compact ? (
                  <>
                    Launch {capability.title}
                    <Rocket className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Explore <ArrowRight className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AICapabilitiesGrid;
