/**
 * Developer Access Dashboard Component
 * Provides comprehensive management interface for developer access control
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface DeveloperAccessKey {
  id: string;
  keyId: string;
  userId: string;
  keyType: 'EXCLUSIVE' | 'STANDARD' | 'TEMPORARY';
  accessLevel: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  permissions: string[];
  allowedEndpoints: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  expiresAt: string;
  isActive: boolean;
  metadata: {
    purpose?: string;
    environment?: 'development' | 'staging' | 'production';
    createdBy?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DeveloperAccessEvent {
  id: string;
  keyId: string;
  userId: string;
  eventType:
    | 'KEY_GENERATED'
    | 'KEY_USED'
    | 'KEY_REVOKED'
    | 'KEY_EXPIRED'
    | 'ACCESS_GRANTED'
    | 'ACCESS_DENIED'
    | 'QUOTA_EXCEEDED';
  endpoint?: string;
  method?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DeveloperAccessMetrics {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  revokedKeys: number;
  totalEvents: number;
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  averageUsagePerKey: number;
  topUsers: Array<{
    userId: string;
    keyCount: number;
    eventCount: number;
  }>;
  securityAlerts: number;
  quotaViolations: number;
}

export function DeveloperAccessDashboard() {
  const [metrics, setMetrics] = useState<DeveloperAccessMetrics | null>(null);
  const [events, setEvents] = useState<DeveloperAccessEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load metrics
      const metricsResponse = await fetch('/api/developer-access/metrics');
      const metricsData = await metricsResponse.json();

      if (!metricsData.success) {
        throw new Error(metricsData.error || 'Failed to load metrics');
      }

      setMetrics(metricsData.metrics);

      // Load recent events
      const eventsResponse = await fetch('/api/developer-access/events?limit=50');
      const eventsData = await eventsResponse.json();

      if (!eventsData.success) {
        throw new Error(eventsData.error || 'Failed to load events');
      }

      setEvents(eventsData.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKeyTypeColor = (keyType: string) => {
    switch (keyType) {
      case 'EXCLUSIVE':
        return 'bg-purple-100 text-purple-800';
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800';
      case 'TEMPORARY':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'PUBLIC':
        return 'bg-green-100 text-green-800';
      case 'INTERNAL':
        return 'bg-blue-100 text-blue-800';
      case 'RESTRICTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIDENTIAL':
        return 'bg-orange-100 text-orange-800';
      case 'SECRET':
        return 'bg-red-100 text-red-800';
      case 'TOP_SECRET':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Access Control</h1>
          <p className="text-muted-foreground">
            Monitor and manage exclusive developer access keys with comprehensive tracking
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalKeys}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeKeys} active, {metrics.expiredKeys} expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.quotaViolations} quota violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.eventsToday}</div>
            <p className="text-xs text-muted-foreground">{metrics.eventsThisWeek} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Usage/Key</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageUsagePerKey.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total events: {metrics.totalEvents}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Access Events</CardTitle>
              <CardDescription>
                Monitor real-time developer access activities and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent events found</p>
                ) : (
                  events.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                        <div>
                          <p className="font-medium">{event.eventType.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.endpoint ? `${event.method} ${event.endpoint}` : 'System event'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.ipAddress} • {formatDateTime(event.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.userId}</p>
                        <p className="text-xs text-muted-foreground">{event.keyId}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Users</CardTitle>
              <CardDescription>
                Users with the most developer access keys and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Keys</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Activity Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.topUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No user data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.topUsers.map((user, index) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium">{user.userId}</TableCell>
                        <TableCell>{user.keyCount}</TableCell>
                        <TableCell>{user.eventCount}</TableCell>
                        <TableCell>
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            {index === 0
                              ? 'Most Active'
                              : `${index + 1}${index === 1 ? 'st' : index === 2 ? 'nd' : index === 3 ? 'rd' : 'th'}`}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Keys</span>
                    <span className="font-medium">{metrics.activeKeys}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expired Keys</span>
                    <span className="font-medium">{metrics.expiredKeys}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revoked Keys</span>
                    <span className="font-medium">{metrics.revokedKeys}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Security Alerts</span>
                    <Badge variant={metrics.securityAlerts > 0 ? 'destructive' : 'default'}>
                      {metrics.securityAlerts}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Quota Violations</span>
                    <Badge variant={metrics.quotaViolations > 0 ? 'destructive' : 'default'}>
                      {metrics.quotaViolations}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Usage/Key</span>
                    <span className="font-medium">{metrics.averageUsagePerKey.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
