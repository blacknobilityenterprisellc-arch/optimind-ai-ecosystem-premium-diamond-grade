/**
 * Developer Access Control Page
 * Main page for managing exclusive developer access with monitoring and tracking
 */

'use client';

import React, { useState } from 'react';
import { DeveloperAccessDashboard } from '@/components/developer-access/DeveloperAccessDashboard';
import { KeyGenerationForm } from '@/components/developer-access/KeyGenerationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Key,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Lock,
} from 'lucide-react';

interface GeneratedKey {
  id: string;
  keyId: string;
  userId: string;
  keyType: 'EXCLUSIVE' | 'STANDARD' | 'TEMPORARY';
  accessLevel: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  permissions: string[];
  allowedEndpoints: string[];
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

export default function DeveloperAccessPage() {
  const [recentlyGeneratedKeys, setRecentlyGeneratedKeys] = useState<GeneratedKey[]>([]);

  const handleKeyGenerated = (key: GeneratedKey) => {
    setRecentlyGeneratedKeys(prev => [key, ...prev.slice(0, 9)]); // Keep last 10 keys
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Exclusive Access Control',
      description:
        'Granular access control with multiple permission levels and endpoint restrictions',
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: 'Quantum-Secure Keys',
      description: 'Cryptographically secure key generation using quantum-resistant algorithms',
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Real-time Monitoring',
      description:
        'Live monitoring of all developer access activities with comprehensive event tracking',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Management',
      description:
        'Track and manage developer access across your organization with detailed analytics',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description:
        'Comprehensive metrics and analytics to understand usage patterns and security posture',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Security-First Design',
      description:
        'Built with security in mind, featuring audit logging, rate limiting, and threat detection',
    },
  ];

  const getAccessTypeColor = (keyType: string) => {
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Developer Access Control</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Exclusive, secure, and monitorable access control system for developers with comprehensive
          tracking and analytics
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Quantum Secure
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Real-time Monitoring
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <BarChart3 className="h-3 w-3 mr-1" />
            Advanced Analytics
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">{feature.icon}</div>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Generate Key
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Keys
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <DeveloperAccessDashboard />
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <KeyGenerationForm onKeyGenerated={handleKeyGenerated} />
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Keys</CardTitle>
              <CardDescription>
                View and manage the most recently generated developer access keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentlyGeneratedKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No keys generated yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate your first developer access key to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentlyGeneratedKeys.map((key, index) => (
                    <Card key={key.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getAccessTypeColor(key.keyType)}>{key.keyType}</Badge>
                            <Badge className={getAccessLevelColor(key.accessLevel)}>
                              {key.accessLevel}
                            </Badge>
                            {key.isActive ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                Inactive
                              </Badge>
                            )}
                          </div>

                          <div>
                            <p className="font-medium">{key.userId}</p>
                            <p className="text-sm text-muted-foreground font-mono">{key.keyId}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Expires:</span>{' '}
                              {new Date(key.expiresAt).toLocaleString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Environment:</span>{' '}
                              {key.metadata.environment?.toUpperCase()}
                            </p>
                            {key.metadata.purpose && (
                              <p className="text-sm">
                                <span className="font-medium">Purpose:</span> {key.metadata.purpose}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium">Permissions:</p>
                            <div className="flex flex-wrap gap-1">
                              {key.permissions.slice(0, 3).map(permission => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                              {key.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{key.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-sm text-muted-foreground">
                          <p>Generated</p>
                          <p>{new Date(key.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Treat access keys like passwords - never share them</li>
                <li>• Store keys securely using encrypted vaults</li>
                <li>• Rotate keys regularly and revoke unused ones</li>
                <li>• Use the minimum necessary permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All access is logged and monitored in real-time</li>
                <li>• Suspicious activities trigger immediate alerts</li>
                <li>• Rate limiting prevents abuse and attacks</li>
                <li>• Comprehensive audit trail for compliance</li>
              </ul>
            </div>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This system provides exclusive access control with
              comprehensive monitoring. Ensure you understand the security implications before
              generating keys and always follow your organization's security policies.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
