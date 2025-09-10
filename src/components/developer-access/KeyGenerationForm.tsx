/**
 * Developer Access Key Generation Form Component
 * Allows administrators to generate new developer access keys
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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

interface KeyGenerationFormProps {
  onKeyGenerated?: (key: GeneratedKey) => void;
}

export function KeyGenerationForm({ onKeyGenerated }: KeyGenerationFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    keyType: 'STANDARD' as 'EXCLUSIVE' | 'STANDARD' | 'TEMPORARY',
    accessLevel: 'INTERNAL' as
      | 'PUBLIC'
      | 'INTERNAL'
      | 'RESTRICTED'
      | 'CONFIDENTIAL'
      | 'SECRET'
      | 'TOP_SECRET',
    permissions: [] as string[],
    allowedEndpoints: [] as string[],
    expiresInSeconds: 86400 * 7, // 7 days default
    purpose: '',
    environment: 'development' as 'development' | 'staging' | 'production',
    ipRestrictions: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);

  const predefinedPermissions = [
    'api:read',
    'api:write',
    'api:delete',
    'models:access',
    'models:train',
    'data:read',
    'data:write',
    'data:delete',
    'admin:read',
    'admin:write',
  ];

  const predefinedEndpoints = [
    '/api/*',
    '/api/models/*',
    '/api/data/*',
    '/api/admin/*',
    '/api/developer-access/*',
    '/api/quantum-security/*',
  ];

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission),
    }));
  };

  const handleEndpointChange = (endpoint: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allowedEndpoints: checked
        ? [...prev.allowedEndpoints, endpoint]
        : prev.allowedEndpoints.filter(e => e !== endpoint),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/developer-access/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          metadata: {
            purpose: formData.purpose,
            environment: formData.environment,
            ipRestrictions: formData.ipRestrictions,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new EnhancedError(data.error || 'Failed to generate key');
      }

      setGeneratedKey(data.key);
      setSuccess('Developer access key generated successfully!');

      if (onKeyGenerated) {
        onKeyGenerated(data.key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const formatExpiry = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${seconds} seconds`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Generate Developer Access Key
          </CardTitle>
          <CardDescription>
            Create exclusive access keys for developers with specific permissions and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID *</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyType">Key Type *</Label>
                <Select
                  value={formData.keyType}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, keyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCLUSIVE">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessTypeColor('EXCLUSIVE')}>EXCLUSIVE</Badge>
                        <span>High privileges, long expiry</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="STANDARD">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessTypeColor('STANDARD')}>STANDARD</Badge>
                        <span>Normal privileges, medium expiry</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TEMPORARY">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessTypeColor('TEMPORARY')}>TEMPORARY</Badge>
                        <span>Limited privileges, short expiry</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level *</Label>
                <Select
                  value={formData.accessLevel}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, accessLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('PUBLIC')}>PUBLIC</Badge>
                        <span>Basic access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INTERNAL">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('INTERNAL')}>INTERNAL</Badge>
                        <span>Internal access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="RESTRICTED">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('RESTRICTED')}>RESTRICTED</Badge>
                        <span>Restricted access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="CONFIDENTIAL">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('CONFIDENTIAL')}>CONFIDENTIAL</Badge>
                        <span>Confidential access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SECRET">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('SECRET')}>SECRET</Badge>
                        <span>Secret access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TOP_SECRET">
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor('TOP_SECRET')}>TOP_SECRET</Badge>
                        <span>Top secret access</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresInSeconds">Expiry Time</Label>
                <Select
                  value={formData.expiresInSeconds.toString()}
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      expiresInSeconds: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3600">1 Hour</SelectItem>
                    <SelectItem value="14400">4 Hours</SelectItem>
                    <SelectItem value="86400">1 Day</SelectItem>
                    <SelectItem value="604800">7 Days</SelectItem>
                    <SelectItem value="2592000">30 Days</SelectItem>
                    <SelectItem value="7776000">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  placeholder="Describe the purpose of this access key"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, environment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label>Permissions *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {predefinedPermissions.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={checked =>
                        handlePermissionChange(permission, checked as boolean)
                      }
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed Endpoints */}
            <div className="space-y-3">
              <Label>Allowed Endpoints *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {predefinedEndpoints.map(endpoint => (
                  <div key={endpoint} className="flex items-center space-x-2">
                    <Checkbox
                      id={endpoint}
                      checked={formData.allowedEndpoints.includes(endpoint)}
                      onCheckedChange={checked =>
                        handleEndpointChange(endpoint, checked as boolean)
                      }
                    />
                    <Label htmlFor={endpoint} className="text-sm">
                      {endpoint}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.userId ||
                formData.permissions.length === 0 ||
                formData.allowedEndpoints.length === 0
              }
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Generate Key
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Key Display */}
      {generatedKey && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Access Key</CardTitle>
            <CardDescription>
              Your new developer access key has been created. Please save this information securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Key ID</Label>
                <p className="text-sm text-muted-foreground font-mono">{generatedKey.keyId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-sm text-muted-foreground">{generatedKey.userId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Key Type</Label>
                <Badge className={getAccessTypeColor(generatedKey.keyType)}>
                  {generatedKey.keyType}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Access Level</Label>
                <Badge className={getAccessLevelColor(generatedKey.accessLevel)}>
                  {generatedKey.accessLevel}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {generatedKey.permissions.map(permission => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Allowed Endpoints</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {generatedKey.allowedEndpoints.map(endpoint => (
                  <Badge key={endpoint} variant="outline" className="text-xs">
                    {endpoint}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Expires At</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(generatedKey.expiresAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Environment</Label>
                <p className="text-sm text-muted-foreground">
                  {generatedKey.metadata.environment?.toUpperCase()}
                </p>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save this key information securely. The key ID is
                required for all API calls and cannot be recovered if lost.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
    };
  }
}
