/**
 * Access Control and Credential Management System
 * 
 * Provides role-based access control, API key management,
 * and credential rotation for production environments.
 */

import { getSecretsManager } from './secrets-manager';
import { PrismaClient } from '@prisma/client';

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  usageCount: number;
  rateLimit: number;
  ipWhitelist?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessPolicy {
  id: string;
  name: string;
  resource: string;
  actions: string[];
  effect: 'allow' | 'deny';
  conditions?: Record<string, any>;
  priority: number;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'blocked';
  details?: Record<string, any>;
  timestamp: Date;
}

export class AccessControlManager {
  private prisma: PrismaClient;
  private secretsManager = getSecretsManager();

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Check if user has permission for a specific action
   */
  async hasPermission(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get user with roles and permissions
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
          permissions: true,
        },
      });

      if (!user) {
        return false;
      }

      // Check direct user permissions
      const hasDirectPermission = user.permissions.some(
        (perm) => perm.resource === resource && perm.action === action
      );

      if (hasDirectPermission) {
        return true;
      }

      // Check role-based permissions
      for (const role of user.roles) {
        const hasRolePermission = role.permissions.some(
          (perm) => perm.resource === resource && perm.action === action
        );

        if (hasRolePermission) {
          // Check additional conditions if provided
          if (context && role.name === 'admin') {
            return true; // Admins have all permissions
          }

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Validate API key and check permissions
   */
  async validateApiKey(
    apiKey: string,
    resource: string,
    action: string,
    ipAddress?: string
  ): Promise<{
    valid: boolean;
    apiKey?: ApiKey;
    error?: string;
  }> {
    try {
      // Find API key
      const keyRecord = await this.prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  permissions: true,
                },
              },
              permissions: true,
            },
          },
        },
      });

      if (!keyRecord) {
        return { valid: false, error: 'Invalid API key' };
      }

      // Check if key is active
      if (!keyRecord.isActive) {
        return { valid: false, error: 'API key is inactive' };
      }

      // Check expiration
      if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
        return { valid: false, error: 'API key has expired' };
      }

      // Check IP whitelist if configured
      if (keyRecord.ipWhitelist && ipAddress) {
        const whitelistedIPs = JSON.parse(keyRecord.ipWhitelist);
        if (!whitelistedIPs.includes(ipAddress)) {
          return { valid: false, error: 'IP address not whitelisted' };
        }
      }

      // Check permissions
      const hasPermission = await this.hasPermission(
        keyRecord.userId,
        resource,
        action
      );

      if (!hasPermission) {
        return { valid: false, error: 'Insufficient permissions' };
      }

      // Update usage statistics
      await this.prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: {
          usageCount: keyRecord.usageCount + 1,
          lastUsedAt: new Date(),
        },
      });

      // Log successful access
      await this.logAccess({
        userId: keyRecord.userId,
        action: 'api_access',
        resource,
        resourceId: keyRecord.id,
        ipAddress,
        status: 'success',
        details: { apiKey: keyRecord.name },
      });

      return {
        valid: true,
        apiKey: {
          id: keyRecord.id,
          name: keyRecord.name,
          key: keyRecord.key,
          secret: '', // Never return the secret
          permissions: keyRecord.permissions || [],
          lastUsedAt: keyRecord.lastUsedAt,
          expiresAt: keyRecord.expiresAt,
          isActive: keyRecord.isActive,
          usageCount: keyRecord.usageCount,
          rateLimit: keyRecord.rateLimit,
          ipWhitelist: keyRecord.ipWhitelist ? JSON.parse(keyRecord.ipWhitelist) : undefined,
          createdAt: keyRecord.createdAt,
          updatedAt: keyRecord.updatedAt,
        },
      };
    } catch (error) {
      console.error('API key validation failed:', error);
      return { valid: false, error: 'Internal server error' };
    }
  }

  /**
   * Create new API key for user
   */
  async createApiKey(
    userId: string,
    name: string,
    permissions: string[],
    options?: {
      expiresAt?: Date;
      rateLimit?: number;
      ipWhitelist?: string[];
    }
  ): Promise<ApiKey> {
    try {
      // Generate secure API key and secret
      const key = `optimind_${crypto.randomUUID().replace(/-/g, '')}`;
      const secret = crypto.randomBytes(32).toString('hex');

      // Create API key record
      const apiKeyRecord = await this.prisma.apiKey.create({
        data: {
          userId,
          name,
          key,
          secret,
          permissions: JSON.stringify(permissions),
          expiresAt: options?.expiresAt,
          rateLimit: options?.rateLimit || 1000,
          ipWhitelist: options?.ipWhitelist ? JSON.stringify(options.ipWhitelist) : null,
          isActive: true,
          usageCount: 0,
        },
      });

      // Log API key creation
      await this.logAccess({
        userId,
        action: 'api_key_created',
        resource: 'api_key',
        resourceId: apiKeyRecord.id,
        status: 'success',
        details: { name, permissions },
      });

      return {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        key: apiKeyRecord.key,
        secret, // Return secret only on creation
        permissions,
        expiresAt: apiKeyRecord.expiresAt,
        isActive: apiKeyRecord.isActive,
        usageCount: apiKeyRecord.usageCount,
        rateLimit: apiKeyRecord.rateLimit,
        ipWhitelist: options?.ipWhitelist,
        createdAt: apiKeyRecord.createdAt,
        updatedAt: apiKeyRecord.updatedAt,
      };
    } catch (error) {
      console.error('API key creation failed:', error);
      throw new Error('Failed to create API key');
    }
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(apiKeyId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.apiKey.update({
        where: { id: apiKeyKeyId },
        data: { isActive: false },
      });

      // Log API key revocation
      await this.logAccess({
        userId,
        action: 'api_key_revoked',
        resource: 'api_key',
        resourceId: apiKeyKeyId,
        status: 'success',
      });

      return true;
    } catch (error) {
      console.error('API key revocation failed:', error);
      return false;
    }
  }

  /**
   * Rotate API key (generate new secret)
   */
  async rotateApiKey(apiKeyId: string, userId: string): Promise<{ newSecret: string }> {
    try {
      const newSecret = crypto.randomBytes(32).toString('hex');

      await this.prisma.apiKey.update({
        where: { id: apiKeyKeyId },
        data: { secret: newSecret },
      });

      // Log API key rotation
      await this.logAccess({
        userId,
        action: 'api_key_rotated',
        resource: 'api_key',
        resourceId: apiKeyKeyId,
        status: 'success',
      });

      return { newSecret };
    } catch (error) {
      console.error('API key rotation failed:', error);
      throw new Error('Failed to rotate API key');
    }
  }

  /**
   * Log access attempts
   */
  private async logAccess(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          ...log,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log access:', error);
    }
  }

  /**
   * Get access logs for user
   */
  async getAccessLogs(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<AuditLog[]> {
    try {
      const where: any = { userId };

      if (options?.startDate || options?.endDate) {
        where.timestamp = {};
        if (options.startDate) where.timestamp.gte = options.startDate;
        if (options.endDate) where.timestamp.lte = options.endDate;
      }

      const logs = await this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      });

      return logs.map(log => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        status: log.status as 'success' | 'failed' | 'blocked',
        details: log.details as Record<string, any> | undefined,
        timestamp: log.timestamp,
      }));
    } catch (error) {
      console.error('Failed to get access logs:', error);
      return [];
    }
  }

  /**
   * Check rate limit for API key
   */
  async checkRateLimit(apiKeyId: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime?: Date;
  }> {
    try {
      const apiKey = await this.prisma.apiKey.findUnique({
        where: { id: apiKeyKeyId },
      });

      if (!apiKey) {
        return { allowed: false, remaining: 0 };
      }

      // Simple rate limiting - in production, use Redis
      const now = new Date();
      const windowStart = new Date(now.getTime() - 60000); // 1 minute window

      const recentRequests = await this.prisma.auditLog.count({
        where: {
          resourceId: apiKeyKeyId,
          action: 'api_access',
          timestamp: {
            gte: windowStart,
          },
          status: 'success',
        },
      });

      const remaining = Math.max(0, apiKey.rateLimit - recentRequests);

      return {
        allowed: remaining > 0,
        remaining,
        resetTime: new Date(windowStart.getTime() + 60000),
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true, remaining: 999 }; // Fail open
    }
  }

  /**
   * Cleanup old access logs
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.prisma.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      return result.count;
    } catch (error) {
      console.error('Log cleanup failed:', error);
      return 0;
    }
  }
}

// Singleton instance
let accessControlInstance: AccessControlManager | null = null;

export function getAccessControlManager(): AccessControlManager {
  if (!accessControlInstance) {
    accessControlInstance = new AccessControlManager();
  }
  return accessControlInstance;
}

// Middleware for API key validation
export function withApiKeyValidation(handler: any) {
  return async (req: any, res: any) => {
    const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
    const resource = req.route?.path || req.url;
    const action = req.method.toLowerCase();
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const accessControl = getAccessControlManager();
    const validation = await accessControl.validateApiKey(apiKey, resource, action, ipAddress);

    if (!validation.valid) {
      return res.status(401).json({ error: validation.error });
    }

    // Add API key info to request for downstream use
    req.apiKey = validation.apiKey;
    
    return handler(req, res);
  };
}