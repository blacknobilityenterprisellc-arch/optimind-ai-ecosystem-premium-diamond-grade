/**
 * Exclusive Developer Access Control Service
 * Provides secure, trackable, and monitorable access control for developers
 * with exclusive key management and comprehensive audit logging
 */

import { prisma } from '@/lib/db';
import { securityService } from '@/lib/security-service';
import { quantumSecurityV2 } from './v2/quantum-security';

export interface DeveloperAccessKey {
  id: string;
  keyId: string;
  userId: string;
  keyType: 'EXCLUSIVE' | 'STANDARD' | 'TEMPORARY';
  accessLevel: 'READONLY' | 'WRITE' | 'ADMIN' | 'SUPER_ADMIN';
  permissions: string[];
  allowedEndpoints: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  expiresAt: Date;
  isActive: boolean;
  metadata: {
    createdBy?: string;
    purpose?: string;
    environment?: 'development' | 'staging' | 'production';
    ipRestrictions?: string[];
    timeRestrictions?: {
      allowedHours: number[];
      allowedDays: number[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DeveloperAccessRequest {
  userId: string;
  keyType: 'EXCLUSIVE' | 'STANDARD' | 'TEMPORARY';
  accessLevel: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  permissions: string[];
  allowedEndpoints: string[];
  expiresInSeconds?: number;
  metadata?: {
    purpose?: string;
    environment?: 'development' | 'staging' | 'production';
    ipRestrictions?: string[];
    timeRestrictions?: {
      allowedHours: number[];
      allowedDays: number[];
    };
  };
}

export interface DeveloperAccessValidation {
  isValid: boolean;
  keyId: string;
  userId: string;
  accessLevel: string;
  permissions: string[];
  remainingQuota: {
    minute: number;
    hour: number;
    day: number;
  };
  restrictions?: {
    ipValid?: boolean;
    timeValid?: boolean;
    endpointValid?: boolean;
  };
}

export interface DeveloperAccessEvent {
  id: string;
  keyId: string;
  userId: string;
  eventType: 'KEY_GENERATED' | 'KEY_USED' | 'KEY_REVOKED' | 'KEY_EXPIRED' | 'ACCESS_GRANTED' | 'ACCESS_DENIED' | 'QUOTA_EXCEEDED';
  endpoint?: string;
  method?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DeveloperAccessMetrics {
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

class ExclusiveDeveloperAccessService {
  private static instance: ExclusiveDeveloperAccessService;
  private readonly serviceName = 'ExclusiveDeveloperAccessService';
  private readonly defaultRateLimits = {
    EXCLUSIVE: { requestsPerMinute: 1000, requestsPerHour: 10000, requestsPerDay: 50000 },
    STANDARD: { requestsPerMinute: 100, requestsPerHour: 1000, requestsPerDay: 5000 },
    TEMPORARY: { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 500 }
  };
  private readonly defaultExpiry = {
    EXCLUSIVE: 86400 * 30, // 30 days
    STANDARD: 86400 * 7,   // 7 days
    TEMPORARY: 3600 * 4    // 4 hours
  };

  private constructor() {
    this.initializeMonitoring();
  }

  static getInstance(): ExclusiveDeveloperAccessService {
    if (!ExclusiveDeveloperAccessService.instance) {
      ExclusiveDeveloperAccessService.instance = new ExclusiveDeveloperAccessService();
    }
    return ExclusiveDeveloperAccessService.instance;
  }

  /**
   * Generate a new exclusive developer access key
   */
  async generateAccessKey(request: DeveloperAccessRequest): Promise<{
    success: boolean;
    key?: DeveloperAccessKey;
    error?: string;
  }> {
    try {
      // Validate user exists and has appropriate role
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== 'DEVELOPER' && user.role !== 'ADMIN') {
        throw new Error('User does not have developer privileges');
      }

      // Generate quantum-secure key pair
      const quantumKeyPair = await quantumSecurityV2.generateQuantumKeyPair(
        request.userId,
        request.expiresInSeconds || this.defaultExpiry[request.keyType]
      );

      // Create access key record
      const accessKey = await prisma.developerAccessKey.create({
        data: {
          userId: request.userId,
          keyId: quantumKeyPair.keyId,
          keyType: request.keyType,
          accessLevel: request.accessLevel || 'INTERNAL',
          permissions: request.permissions,
          allowedEndpoints: request.allowedEndpoints,
          rateLimit: this.defaultRateLimits[request.keyType],
          expiresAt: quantumKeyPair.expiresAt,
          isActive: true,
          metadata: {
            createdBy: 'system',
            purpose: request.metadata?.purpose || 'Developer access',
            environment: request.metadata?.environment || 'development',
            ipRestrictions: request.metadata?.ipRestrictions || [],
            timeRestrictions: request.metadata?.timeRestrictions
          }
        }
      });

      // Log key generation event
      await this.logAccessEvent({
        keyId: quantumKeyPair.keyId,
        userId: request.userId,
        eventType: 'KEY_GENERATED',
        ipAddress: '127.0.0.1',
        userAgent: 'system',
        details: {
          keyType: request.keyType,
          accessLevel: request.accessLevel || 'INTERNAL',
          permissions: request.permissions,
          allowedEndpoints: request.allowedEndpoints
        },
        severity: 'medium'
      });

      return {
        success: true,
        key: {
          ...accessKey,
          id: accessKey.id,
          createdAt: accessKey.createdAt,
          updatedAt: accessKey.updatedAt
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate developer access key
   */
  async validateAccessKey(
    keyId: string,
    request: {
      endpoint: string;
      method: string;
      ipAddress: string;
      userAgent: string;
    }
  ): Promise<DeveloperAccessValidation> {
    const startTime = Date.now();

    try {
      // Get access key from database
      const accessKey = await prisma.developerAccessKey.findUnique({
        where: { keyId }
      });

      if (!accessKey) {
        await this.logAccessEvent({
          keyId,
          userId: 'unknown',
          eventType: 'ACCESS_DENIED',
          endpoint: request.endpoint,
          method: request.method,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: { reason: 'Key not found' },
          severity: 'high'
        });
        return this.createInvalidValidation(keyId, 'unknown');
      }

      if (!accessKey.isActive) {
        await this.logAccessEvent({
          keyId,
          userId: accessKey.userId,
          eventType: 'ACCESS_DENIED',
          endpoint: request.endpoint,
          method: request.method,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: { reason: 'Key is inactive' },
          severity: 'medium'
        });
        return this.createInvalidValidation(keyId, accessKey.userId);
      }

      if (new Date() > accessKey.expiresAt) {
        // Mark key as expired
        await prisma.developerAccessKey.update({
          where: { id: accessKey.id },
          data: { isActive: false }
        });

        await this.logAccessEvent({
          keyId,
          userId: accessKey.userId,
          eventType: 'KEY_EXPIRED',
          endpoint: request.endpoint,
          method: request.method,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: { reason: 'Key has expired' },
          severity: 'medium'
        });
        return this.createInvalidValidation(keyId, accessKey.userId);
      }

      // Check endpoint permissions
      const endpointAllowed = accessKey.allowedEndpoints.includes('*') || 
                            accessKey.allowedEndpoints.includes(request.endpoint);

      if (!endpointAllowed) {
        await this.logAccessEvent({
          keyId,
          userId: accessKey.userId,
          eventType: 'ACCESS_DENIED',
          endpoint: request.endpoint,
          method: request.method,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: { reason: 'Endpoint not allowed' },
          severity: 'medium'
        });
        return this.createInvalidValidation(keyId, accessKey.userId, {
          endpointValid: false
        });
      }

      // Check rate limits
      const rateLimitCheck = await this.checkRateLimits(accessKey, request.ipAddress);
      if (!rateLimitCheck.allowed) {
        await this.logAccessEvent({
          keyId,
          userId: accessKey.userId,
          eventType: 'QUOTA_EXCEEDED',
          endpoint: request.endpoint,
          method: request.method,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: { 
            reason: 'Rate limit exceeded',
            limit: rateLimitCheck.limit,
            current: rateLimitCheck.current
          },
          severity: 'high'
        });
        return this.createInvalidValidation(keyId, accessKey.userId);
      }

      // Log successful access
      await this.logAccessEvent({
        keyId,
        userId: accessKey.userId,
        eventType: 'KEY_USED',
        endpoint: request.endpoint,
        method: request.method,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        details: {
          processingTime: Date.now() - startTime,
          rateLimitRemaining: rateLimitCheck.remaining
        },
        severity: 'low'
      });

      return {
        isValid: true,
        keyId: accessKey.keyId,
        userId: accessKey.userId,
        accessLevel: accessKey.accessLevel,
        permissions: accessKey.permissions,
        remainingQuota: rateLimitCheck.remaining
      };

    } catch (error) {
      await this.logAccessEvent({
        keyId,
        userId: 'unknown',
        eventType: 'ACCESS_DENIED',
        endpoint: request.endpoint,
        method: request.method,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        details: { error: error.message },
        severity: 'high'
      });
      return this.createInvalidValidation(keyId, 'unknown');
    }
  }

  /**
   * Revoke developer access key
   */
  async revokeAccessKey(keyId: string, revokedBy: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const accessKey = await prisma.developerAccessKey.findUnique({
        where: { keyId }
      });

      if (!accessKey) {
        throw new Error('Access key not found');
      }

      await prisma.developerAccessKey.update({
        where: { id: accessKey.id },
        data: {
          isActive: false,
          metadata: {
            ...accessKey.metadata,
            revokedBy,
            revokedAt: new Date()
          }
        }
      });

      await this.logAccessEvent({
        keyId,
        userId: accessKey.userId,
        eventType: 'KEY_REVOKED',
        ipAddress: '127.0.0.1',
        userAgent: 'system',
        details: { revokedBy },
        severity: 'medium'
      });

      return {
        success: true,
        message: 'Access key revoked successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get developer access metrics
   */
  async getAccessMetrics(userId?: string): Promise<{
    success: boolean;
    metrics?: DeveloperAccessMetrics;
    error?: string;
  }> {
    try {
      const whereClause = userId ? { userId } : {};

      const [totalKeys, activeKeys, expiredKeys, revokedKeys, totalEvents] = await Promise.all([
        prisma.developerAccessKey.count({ where: whereClause }),
        prisma.developerAccessKey.count({ 
          where: { ...whereClause, isActive: true } 
        }),
        prisma.developerAccessKey.count({ 
          where: { ...whereClause, isActive: false, expiresAt: { lt: new Date() } }
        }),
        prisma.developerAccessKey.count({ 
          where: { ...whereClause, isActive: false, metadata: { path: ['revokedAt'], not: null } }
        }),
        prisma.developerAccessEvent.count({ where: whereClause })
      ]);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [eventsToday, eventsThisWeek, eventsThisMonth] = await Promise.all([
        prisma.developerAccessEvent.count({ 
          where: { ...whereClause, timestamp: { gte: today } }
        }),
        prisma.developerAccessEvent.count({ 
          where: { ...whereClause, timestamp: { gte: weekAgo } }
        }),
        prisma.developerAccessEvent.count({ 
          where: { ...whereClause, timestamp: { gte: monthAgo } }
        })
      ]);

      const [quotaViolations, securityAlerts] = await Promise.all([
        prisma.developerAccessEvent.count({ 
          where: { ...whereClause, eventType: 'QUOTA_EXCEEDED' }
        }),
        prisma.developerAccessEvent.count({ 
          where: { ...whereClause, severity: { in: ['high', 'critical'] } }
        })
      ]);

      const topUsers = await prisma.developerAccessKey.groupBy({
        by: ['userId'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      });

      const averageUsagePerKey = totalKeys > 0 ? totalEvents / totalKeys : 0;

      const metrics: DeveloperAccessMetrics = {
        totalKeys,
        activeKeys,
        expiredKeys,
        revokedKeys,
        totalEvents,
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        averageUsagePerKey,
        topUsers: topUsers.map(user => ({
          userId: user.userId,
          keyCount: user._count.id,
          eventCount: 0 // Would need to calculate separately
        })),
        securityAlerts,
        quotaViolations
      };

      return {
        success: true,
        metrics
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get access events for monitoring
   */
  async getAccessEvents(
    userId?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{
    success: boolean;
    events?: DeveloperAccessEvent[];
    total: number;
    error?: string;
  }> {
    try {
      const whereClause = userId ? { userId } : {};

      const [events, total] = await Promise.all([
        prisma.developerAccessEvent.findMany({
          where: whereClause,
          orderBy: { timestamp: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.developerAccessEvent.count({ where: whereClause })
      ]);

      return {
        success: true,
        events: events.map(event => ({
          id: event.id,
          keyId: event.keyId,
          userId: event.userId,
          eventType: event.eventType as any,
          endpoint: event.endpoint,
          method: event.method,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          details: event.details,
          timestamp: event.timestamp,
          severity: event.severity as any
        })),
        total
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check rate limits for a key
   */
  private async checkRateLimits(
    accessKey: any,
    ipAddress: string
  ): Promise<{
    allowed: boolean;
    remaining: {
      minute: number;
      hour: number;
      day: number;
    };
    limit: {
      minute: number;
      hour: number;
      day: number;
    };
    current: {
      minute: number;
      hour: number;
      day: number;
    };
  }> {
    const now = new Date();
    const minuteAgo = new Date(now.getTime() - 60 * 1000);
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [minuteCount, hourCount, dayCount] = await Promise.all([
      prisma.developerAccessEvent.count({
        where: {
          keyId: accessKey.keyId,
          eventType: 'KEY_USED',
          timestamp: { gte: minuteAgo }
        }
      }),
      prisma.developerAccessEvent.count({
        where: {
          keyId: accessKey.keyId,
          eventType: 'KEY_USED',
          timestamp: { gte: hourAgo }
        }
      }),
      prisma.developerAccessEvent.count({
        where: {
          keyId: accessKey.keyId,
          eventType: 'KEY_USED',
          timestamp: { gte: dayAgo }
        }
      })
    ]);

    const rateLimit = accessKey.rateLimit;

    const allowed = 
      minuteCount < rateLimit.requestsPerMinute &&
      hourCount < rateLimit.requestsPerHour &&
      dayCount < rateLimit.requestsPerDay;

    return {
      allowed,
      remaining: {
        minute: Math.max(0, rateLimit.requestsPerMinute - minuteCount),
        hour: Math.max(0, rateLimit.requestsPerHour - hourCount),
        day: Math.max(0, rateLimit.requestsPerDay - dayCount)
      },
      limit: {
        minute: rateLimit.requestsPerMinute,
        hour: rateLimit.requestsPerHour,
        day: rateLimit.requestsPerDay
      },
      current: {
        minute: minuteCount,
        hour: hourCount,
        day: dayCount
      }
    };
  }

  /**
   * Create invalid validation response
   */
  private createInvalidValidation(
    keyId: string,
    userId: string,
    restrictions?: {
      ipValid?: boolean;
      timeValid?: boolean;
      endpointValid?: boolean;
    }
  ): DeveloperAccessValidation {
    return {
      isValid: false,
      keyId,
      userId,
      accessLevel: 'NONE',
      permissions: [],
      remainingQuota: { minute: 0, hour: 0, day: 0 },
      restrictions
    };
  }

  /**
   * Log access event
   */
  private async logAccessEvent(event: Omit<DeveloperAccessEvent, 'id' | 'timestamp'>): Promise<void> {
    await prisma.developerAccessEvent.create({
      data: {
        keyId: event.keyId,
        userId: event.userId,
        eventType: event.eventType,
        endpoint: event.endpoint,
        method: event.method,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        details: event.details,
        severity: event.severity,
        timestamp: new Date()
      }
    });
  }

  /**
   * Initialize monitoring and cleanup
   */
  private initializeMonitoring(): void {
    // Cleanup expired keys every hour
    setInterval(async () => {
      try {
        await this.cleanupExpiredKeys();
      } catch (error) {
        console.error('Failed to cleanup expired keys:', error);
      }
    }, 60 * 60 * 1000);

    // Archive old events daily
    setInterval(async () => {
      try {
        await this.archiveOldEvents();
      } catch (error) {
        console.error('Failed to archive old events:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Cleanup expired keys
   */
  private async cleanupExpiredKeys(): Promise<void> {
    const expiredKeys = await prisma.developerAccessKey.findMany({
      where: {
        isActive: true,
        expiresAt: { lt: new Date() }
      }
    });

    for (const key of expiredKeys) {
      await prisma.developerAccessKey.update({
        where: { id: key.id },
        data: { isActive: false }
      });

      await this.logAccessEvent({
        keyId: key.keyId,
        userId: key.userId,
        eventType: 'KEY_EXPIRED',
        ipAddress: '127.0.0.1',
        userAgent: 'system',
        details: { reason: 'Automatic cleanup' },
        severity: 'low'
      });
    }
  }

  /**
   * Archive old events
   */
  private async archiveOldEvents(): Promise<void> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // This would typically move events to an archive table
    // For now, we'll just log the action
    const oldEvents = await prisma.developerAccessEvent.count({
      where: {
        timestamp: { lt: oneMonthAgo }
      }
    });

    if (oldEvents > 0) {
      console.log(`Archiving ${oldEvents} old developer access events`);
    }
  }
}

export const exclusiveDeveloperAccessService = ExclusiveDeveloperAccessService.getInstance();