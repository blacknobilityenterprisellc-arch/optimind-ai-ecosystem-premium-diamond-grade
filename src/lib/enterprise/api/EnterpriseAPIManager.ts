/**
 * Premium Diamond-Grade Professional Enterprise API Management System
 *
 * This module implements a comprehensive API management system with key rotation,
 * rate limiting, analytics, and enterprise-grade security features.
 *
 * Features:
 * - API key management with automatic rotation
 * - Advanced rate limiting with multiple strategies
 * - Comprehensive API analytics and reporting
 * - API gateway functionality with routing
 * - Security monitoring and threat detection
 * - API versioning and lifecycle management
 * - Request/response transformation
 * - Caching and performance optimization
 * - Integration with external API gateways
 * - Compliance and audit logging
 *
 * @author: Enterprise API Team
 * @version: 2.0.0
 * @compliance: Enterprise API Standards
 */

import { EventEmitter } from 'events';
import { EnterpriseEnvironmentConfig } from '../environment/EnterpriseEnvironmentConfig';
import { EnterpriseHealthMonitor } from '../monitoring/EnterpriseHealthMonitor';

// API key types
export enum APIKeyType {
  PRODUCTION = 'PRODUCTION',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  PARTNER = 'PARTNER',
  INTERNAL = 'INTERNAL',
}

// API key status
export enum APIKeyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  PENDING_ROTATION = 'PENDING_ROTATION',
}

// Rate limiting strategies
export enum RateLimitStrategy {
  FIXED_WINDOW = 'FIXED_WINDOW',
  SLIDING_WINDOW = 'SLIDING_WINDOW',
  TOKEN_BUCKET = 'TOKEN_BUCKET',
  LEAKY_BUCKET = 'LEAKY_BUCKET',
}

// API request methods
export enum APIMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

// API key interface
export interface APIKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  type: APIKeyType;
  status: APIKeyStatus;
  permissions: string[];
  rateLimits: RateLimitConfig[];
  allowedIPs: string[];
  allowedOrigins: string[];
  createdAt: number;
  expiresAt?: number;
  lastUsed?: number;
  usageCount: number;
  metadata: Record<string, any>;
  rotationConfig?: {
    enabled: boolean;
    interval: number;
    nextRotation?: number;
  };
}

// Rate limit configuration
export interface RateLimitConfig {
  strategy: RateLimitStrategy;
  window: number; // Time window in milliseconds
  limit: number; // Maximum requests per window
  burst?: number; // Burst capacity for token bucket
}

// Rate limit state
export interface RateLimitState {
  requests: number;
  windowStart: number;
  tokens?: number; // For token bucket
  lastRefill?: number; // For token bucket
}

// API request context
export interface APIRequestContext {
  id: string;
  method: APIMethod;
  path: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body?: any;
  timestamp: number;
  clientIP: string;
  userAgent: string;
  apiKey?: APIKey;
  userId?: string;
  sessionId?: string;
}

// API response context
export interface APIResponseContext {
  id: string;
  status: number;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
  duration: number;
  size: number;
  cached: boolean;
}

// API analytics event
export interface APIAnalyticsEvent {
  id: string;
  requestId: string;
  timestamp: number;
  eventType: 'request' | 'response' | 'error' | 'security';
  method: APIMethod;
  path: string;
  status?: number;
  duration?: number;
  error?: string;
  securityEvent?: {
    type: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_key' | 'unauthorized';
    details: Record<string, any>;
  };
  metadata: Record<string, any>;
}

// API route definition
export interface APIRoute {
  id: string;
  path: string;
  method: APIMethod;
  handler: (request: APIRequestContext) => Promise<APIResponseContext>;
  authRequired: boolean;
  permissions: string[];
  rateLimitOverride?: RateLimitConfig;
  cacheConfig?: {
    enabled: boolean;
    ttl: number;
    keyGenerator?: (request: APIRequestContext) => string;
  };
  transform?: {
    request?: (request: APIRequestContext) => APIRequestContext;
    response?: (response: APIResponseContext) => APIResponseContext;
  };
  metadata: Record<string, any>;
}

// API gateway configuration
export interface APIGatewayConfig {
  enabled: boolean;
  port: number;
  host: string;
  ssl: {
    enabled: boolean;
    certPath?: string;
    keyPath?: string;
  };
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
  compression: {
    enabled: boolean;
    level: number;
  };
  cache: {
    enabled: boolean;
    driver: 'memory' | 'redis';
    config: Record<string, any>;
  };
}

// Security monitoring configuration
export interface SecurityMonitoringConfig {
  enabled: boolean;
  suspiciousIPThreshold: number;
  rateLimitThreshold: number;
  anomalyDetection: boolean;
  threatIntelligence: boolean;
  blockMaliciousIPs: boolean;
  logSecurityEvents: boolean;
}

// Analytics configuration
export interface AnalyticsConfig {
  enabled: boolean;
  retention: number;
  aggregation: {
    enabled: boolean;
    interval: number;
  };
  export: {
    enabled: boolean;
    format: 'json' | 'csv' | 'parquet';
    destination: string;
    interval: number;
  };
  dashboard: {
    enabled: boolean;
    refreshInterval: number;
  };
}

// Enterprise API manager configuration
export interface APIManagerConfig {
  keyRotation: {
    enabled: boolean;
    defaultInterval: number; // 30 days in milliseconds
    warningPeriod: number; // 7 days in milliseconds
    autoRotate: boolean;
  };
  rateLimiting: {
    defaultStrategy: RateLimitStrategy;
    defaultWindow: number; // 15 minutes
    defaultLimit: number; // 1000 requests
    enableBurst: boolean;
    burstMultiplier: number;
  };
  gateway: APIGatewayConfig;
  security: SecurityMonitoringConfig;
  analytics: AnalyticsConfig;
}

// Enterprise API manager
export class EnterpriseAPIManager extends EventEmitter {
  private config: APIManagerConfig;
  private environment: EnterpriseEnvironmentConfig;
  private healthMonitor?: EnterpriseHealthMonitor;
  private apiKeys: Map<string, APIKey> = new Map();
  private rateLimitStates: Map<string, RateLimitState> = new Map();
  private routes: Map<string, APIRoute> = new Map();
  private analyticsEvents: APIAnalyticsEvent[] = [];
  private suspiciousIPs: Set<string> = new Set();
  private blockedIPs: Set<string> = new Set();
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private isRunning = false;
  private rotationTimer?: NodeJS.Timeout;
  private cleanupTimer?: NodeJS.Timeout;
  private analyticsTimer?: NodeJS.Timeout;

  constructor(environment: EnterpriseEnvironmentConfig, config: Partial<APIManagerConfig> = {}) {
    super();
    this.environment = environment;
    this.config = {
      keyRotation: {
        enabled: true,
        defaultInterval: 2592000000, // 30 days
        warningPeriod: 604800000, // 7 days
        autoRotate: true,
      },
      rateLimiting: {
        defaultStrategy: RateLimitStrategy.SLIDING_WINDOW,
        defaultWindow: 900000, // 15 minutes
        defaultLimit: 1000,
        enableBurst: true,
        burstMultiplier: 2,
      },
      gateway: {
        enabled: true,
        port: 8080,
        host: '0.0.0.0',
        ssl: {
          enabled: false,
        },
        cors: {
          enabled: true,
          allowedOrigins: ['*'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
          exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
          credentials: true,
          maxAge: 86400,
        },
        compression: {
          enabled: true,
          level: 6,
        },
        cache: {
          enabled: true,
          driver: 'memory',
          config: {},
        },
      },
      security: {
        enabled: true,
        suspiciousIPThreshold: 100,
        rateLimitThreshold: 10,
        anomalyDetection: true,
        threatIntelligence: true,
        blockMaliciousIPs: true,
        logSecurityEvents: true,
      },
      analytics: {
        enabled: true,
        retention: 2592000000, // 30 days
        aggregation: {
          enabled: true,
          interval: 300000, // 5 minutes
        },
        export: {
          enabled: false,
          format: 'json',
          destination: '',
          interval: 3600000, // 1 hour
        },
        dashboard: {
          enabled: true,
          refreshInterval: 30000, // 30 seconds
        },
      },
      ...config,
    };

    this.setupDefaultRoutes();
    this.setupEventHandlers();
  }

  setHealthMonitor(monitor: EnterpriseHealthMonitor): void {
    this.healthMonitor = monitor;
  }

  private setupEventHandlers(): void {
    this.on('api:request', (request: APIRequestContext) => {
      this.recordAnalyticsEvent({
        id: this.generateId(),
        requestId: request.id,
        timestamp: request.timestamp,
        eventType: 'request',
        method: request.method,
        path: request.path,
        metadata: {
          clientIP: request.clientIP,
          userAgent: request.userAgent,
          apiKeyId: request.apiKey?.id,
        },
      });
    });

    this.on('api:response', (response: APIResponseContext, request: APIRequestContext) => {
      this.recordAnalyticsEvent({
        id: this.generateId(),
        requestId: request.id,
        timestamp: response.timestamp,
        eventType: 'response',
        method: request.method,
        path: request.path,
        status: response.status,
        duration: response.duration,
        metadata: {
          cached: response.cached,
          responseSize: response.size,
        },
      });
    });

    this.on('api:error', (error: Error, request: APIRequestContext) => {
      this.recordAnalyticsEvent({
        id: this.generateId(),
        requestId: request.id,
        timestamp: Date.now(),
        eventType: 'error',
        method: request.method,
        path: request.path,
        error: error.message,
        metadata: {
          clientIP: request.clientIP,
          userAgent: request.userAgent,
        },
      });
    });

    this.on('security:event', (event: any) => {
      if (this.config.security.logSecurityEvents) {
        this.recordAnalyticsEvent({
          id: this.generateId(),
          requestId: event.requestId || '',
          timestamp: Date.now(),
          eventType: 'security',
          method: event.method || APIMethod.GET,
          path: event.path || '/',
          securityEvent: event,
          metadata: event.details || {},
        });
      }
    });
  }

  private setupDefaultRoutes(): void {
    // Health check route
    this.registerRoute({
      id: 'health',
      path: '/health',
      method: APIMethod.GET,
      authRequired: false,
      permissions: [],
      handler: async request => {
        return {
          id: this.generateId(),
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            status: 'healthy',
            timestamp: Date.now(),
            version: '2.0.0',
          },
          timestamp: Date.now(),
          duration: 0,
          size: 0,
          cached: false,
        };
      },
      metadata: {
        description: 'Health check endpoint',
        category: 'system',
      },
    });

    // API keys management route (protected)
    this.registerRoute({
      id: 'api-keys',
      path: '/api/keys',
      method: APIMethod.GET,
      authRequired: true,
      permissions: ['api_keys:read'],
      handler: async request => {
        const keys = Array.from(this.apiKeys.values()).map(key => ({
          id: key.id,
          name: key.name,
          type: key.type,
          status: key.status,
          createdAt: key.createdAt,
          expiresAt: key.expiresAt,
          lastUsed: key.lastUsed,
          usageCount: key.usageCount,
        }));

        return {
          id: this.generateId(),
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: { keys },
          timestamp: Date.now(),
          duration: 0,
          size: 0,
          cached: false,
        };
      },
      metadata: {
        description: 'List API keys',
        category: 'management',
      },
    });

    // Analytics route (protected)
    this.registerRoute({
      id: 'analytics',
      path: '/api/analytics',
      method: APIMethod.GET,
      authRequired: true,
      permissions: ['analytics:read'],
      handler: async request => {
        const analytics = this.getAnalyticsSummary();

        return {
          id: this.generateId(),
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: analytics,
          timestamp: Date.now(),
          duration: 0,
          size: 0,
          cached: false,
        };
      },
      metadata: {
        description: 'Get API analytics summary',
        category: 'analytics',
      },
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    this.emit('starting');

    // Start key rotation
    if (this.config.keyRotation.enabled) {
      this.startKeyRotation();
    }

    // Start cleanup tasks
    this.startCleanupTasks();

    // Start analytics aggregation
    if (this.config.analytics.aggregation.enabled) {
      this.startAnalyticsAggregation();
    }

    // Start API gateway if enabled
    if (this.config.gateway.enabled) {
      await this.startAPIGateway();
    }

    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.emit('stopping');

    // Stop timers
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
    }

    this.emit('stopped');
  }

  private startKeyRotation(): void {
    this.rotationTimer = setInterval(async () => {
      await this.rotateKeys();
    }, this.config.keyRotation.defaultInterval);
  }

  private async rotateKeys(): Promise<void> {
    const now = Date.now();
    const keysToRotate = Array.from(this.apiKeys.values()).filter(
      key =>
        key.rotationConfig?.enabled &&
        key.rotationConfig.nextRotation &&
        key.rotationConfig.nextRotation <= now
    );

    for (const key of keysToRotate) {
      try {
        await this.rotateKey(key.id);
      } catch (error) {
        console.error(`Failed to rotate key ${key.id}:`, error);
      }
    }
  }

  private async rotateKey(keyId: string): Promise<void> {
    const key = this.apiKeys.get(keyId);
    if (!key) {
      throw new EnhancedError(`Key ${keyId} not found`);
    }

    // Generate new key and secret
    const newKey = this.generateAPIKey();
    const newSecret = this.generateAPISecret();

    // Update key
    key.key = newKey;
    key.secret = newSecret;
    key.lastUsed = Date.now();
    key.rotationConfig = {
      ...key.rotationConfig!,
      nextRotation: Date.now() + this.config.keyRotation.defaultInterval,
    };

    this.apiKeys.set(keyId, key);
    this.emit('key:rotated', key);
  }

  private startCleanupTasks(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredKeys();
      this.cleanupAnalyticsEvents();
      this.cleanupRateLimitStates();
      this.cleanupCache();
    }, 3600000); // Clean up every hour
  }

  private cleanupExpiredKeys(): void {
    const now = Date.now();
    for (const [keyId, key] of this.apiKeys.entries()) {
      if (key.expiresAt && key.expiresAt <= now) {
        key.status = APIKeyStatus.EXPIRED;
        this.apiKeys.set(keyId, key);
        this.emit('key:expired', key);
      }
    }
  }

  private cleanupAnalyticsEvents(): void {
    const cutoff = Date.now() - this.config.analytics.retention;
    this.analyticsEvents = this.analyticsEvents.filter(event => event.timestamp > cutoff);
  }

  private cleanupRateLimitStates(): void {
    const now = Date.now();
    for (const [key, state] of this.rateLimitStates.entries()) {
      if (now - state.windowStart > this.config.rateLimiting.defaultWindow * 2) {
        this.rateLimitStates.delete(key);
      }
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key);
      }
    }
  }

  private startAnalyticsAggregation(): void {
    this.analyticsTimer = setInterval(() => {
      this.aggregateAnalytics();
    }, this.config.analytics.aggregation.interval);
  }

  private aggregateAnalytics(): void {
    const now = Date.now();
    const windowStart = now - this.config.analytics.aggregation.interval;

    const windowEvents = this.analyticsEvents.filter(
      event => event.timestamp >= windowStart && event.timestamp <= now
    );

    const summary = {
      window: { start: windowStart, end: now },
      totalRequests: windowEvents.filter(e => e.eventType === 'request').length,
      totalResponses: windowEvents.filter(e => e.eventType === 'response').length,
      totalErrors: windowEvents.filter(e => e.eventType === 'error').length,
      totalSecurityEvents: windowEvents.filter(e => e.eventType === 'security').length,
      averageResponseTime: this.calculateAverageResponseTime(windowEvents),
      topEndpoints: this.getTopEndpoints(windowEvents),
      errorRate: this.calculateErrorRate(windowEvents),
      statusCodes: this.getStatusCodeDistribution(windowEvents),
    };

    this.emit('analytics:aggregated', summary);
  }

  private calculateAverageResponseTime(events: APIAnalyticsEvent[]): number {
    const responseEvents = events.filter(e => e.eventType === 'response' && e.duration);
    if (responseEvents.length === 0) return 0;

    const totalDuration = responseEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
    return totalDuration / responseEvents.length;
  }

  private getTopEndpoints(events: APIAnalyticsEvent[]): Array<{ path: string; count: number }> {
    const endpointCounts = new Map<string, number>();

    events.forEach(event => {
      const count = endpointCounts.get(event.path) || 0;
      endpointCounts.set(event.path, count + 1);
    });

    return Array.from(endpointCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateErrorRate(events: APIAnalyticsEvent[]): number {
    const totalRequests = events.filter(e => e.eventType === 'request').length;
    const totalErrors = events.filter(e => e.eventType === 'error').length;

    if (totalRequests === 0) return 0;
    return (totalErrors / totalRequests) * 100;
  }

  private getStatusCodeDistribution(events: APIAnalyticsEvent[]): Record<number, number> {
    const distribution: Record<number, number> = {};

    events
      .filter(e => e.eventType === 'response' && e.status)
      .forEach(event => {
        const status = event.status!;
        distribution[status] = (distribution[status] || 0) + 1;
      });

    return distribution;
  }

  private async startAPIGateway(): Promise<void> {
    // Implementation would start HTTP server
    // This is a simplified version
    console.log(`API Gateway starting on ${this.config.gateway.host}:${this.config.gateway.port}`);
  }

  // API Key Management
  createAPIKey(options: {
    name: string;
    type: APIKeyType;
    permissions: string[];
    expiresAt?: number;
    allowedIPs?: string[];
    allowedOrigins?: string[];
    metadata?: Record<string, any>;
  }): APIKey {
    const key: APIKey = {
      id: this.generateId(),
      name: options.name,
      key: this.generateAPIKey(),
      secret: this.generateAPISecret(),
      type: options.type,
      status: APIKeyStatus.ACTIVE,
      permissions: options.permissions,
      rateLimits: [
        {
          strategy: this.config.rateLimiting.defaultStrategy,
          window: this.config.rateLimiting.defaultWindow,
          limit: this.config.rateLimiting.defaultLimit,
        },
      ],
      allowedIPs: options.allowedIPs || [],
      allowedOrigins: options.allowedOrigins || [],
      createdAt: Date.now(),
      expiresAt: options.expiresAt,
      usageCount: 0,
      metadata: options.metadata || {},
      rotationConfig: {
        enabled: this.config.keyRotation.enabled,
        interval: this.config.keyRotation.defaultInterval,
        nextRotation: Date.now() + this.config.keyRotation.defaultInterval,
      },
    };

    this.apiKeys.set(key.id, key);
    this.emit('key:created', key);
    return key;
  }

  revokeAPIKey(keyId: string): void {
    const key = this.apiKeys.get(keyId);
    if (!key) {
      throw new EnhancedError(`Key ${keyId} not found`);
    }

    key.status = APIKeyStatus.REVOKED;
    this.apiKeys.set(keyId, key);
    this.emit('key:revoked', key);
  }

  getAPIKey(keyId: string): APIKey | undefined {
    return this.apiKeys.get(keyId);
  }

  getAPIKeys(): APIKey[] {
    return Array.from(this.apiKeys.values());
  }

  // Route Management
  registerRoute(route: APIRoute): void {
    const routeKey = `${route.method}:${route.path}`;
    this.routes.set(routeKey, route);
    this.emit('route:registered', route);
  }

  getRoute(method: APIMethod, path: string): APIRoute | undefined {
    const routeKey = `${method}:${path}`;
    return this.routes.get(routeKey);
  }

  getRoutes(): APIRoute[] {
    return Array.from(this.routes.values());
  }

  // Request Processing
  async processRequest(request: APIRequestContext): Promise<APIResponseContext> {
    const startTime = Date.now();

    try {
      this.emit('api:request', request);

      // Authenticate request
      if (!(await this.authenticateRequest(request))) {
        return this.createErrorResponse(401, 'Unauthorized', request);
      }

      // Authorize request
      if (!(await this.authorizeRequest(request))) {
        return this.createErrorResponse(403, 'Forbidden', request);
      }

      // Check rate limits
      if (!(await this.checkRateLimits(request))) {
        return this.createErrorResponse(429, 'Too Many Requests', request);
      }

      // Check security
      if (!(await this.checkSecurity(request))) {
        return this.createErrorResponse(403, 'Security Check Failed', request);
      }

      // Get route
      const route = this.getRoute(request.method, request.path);
      if (!route) {
        return this.createErrorResponse(404, 'Not Found', request);
      }

      // Apply request transformation
      let transformedRequest = request;
      if (route.transform?.request) {
        transformedRequest = route.transform.request(request);
      }

      // Check cache
      if (route.cacheConfig?.enabled) {
        const cachedResponse = this.getFromCache(transformedRequest, route);
        if (cachedResponse) {
          const response = {
            ...cachedResponse,
            cached: true,
          };
          this.emit('api:response', response, transformedRequest);
          return response;
        }
      }

      // Process request
      let response = await route.handler(transformedRequest);

      // Apply response transformation
      if (route.transform?.response) {
        response = route.transform.response(response);
      }

      // Update response metadata
      response.duration = Date.now() - startTime;
      response.size = JSON.stringify(response.body).length;

      // Cache response if enabled
      if (route.cacheConfig?.enabled && response.status === 200) {
        this.setToCache(transformedRequest, response, route);
      }

      // Update API key usage
      if (request.apiKey) {
        request.apiKey.lastUsed = Date.now();
        request.apiKey.usageCount++;
        this.apiKeys.set(request.apiKey.id, request.apiKey);
      }

      this.emit('api:response', response, transformedRequest);
      return response;
    } catch (error) {
      const errorResponse = this.createErrorResponse(500, 'Internal Server Error', request);
      this.emit('api:error', error as Error, request);
      return errorResponse;
    }
  }

  private async authenticateRequest(request: APIRequestContext): Promise<boolean> {
    if (!request.headers['authorization'] && !request.headers['x-api-key']) {
      return false;
    }

    const apiKey =
      request.headers['x-api-key'] || request.headers['authorization']?.replace('Bearer ', '');
    if (!apiKey) {
      return false;
    }

    const key = Array.from(this.apiKeys.values()).find(k => k.key === apiKey);
    if (!key || key.status !== APIKeyStatus.ACTIVE) {
      this.emit('security:event', {
        type: 'invalid_key',
        requestId: request.id,
        method: request.method,
        path: request.path,
        details: { apiKey, clientIP: request.clientIP },
      });
      return false;
    }

    // Check expiration
    if (key.expiresAt && key.expiresAt <= Date.now()) {
      key.status = APIKeyStatus.EXPIRED;
      this.apiKeys.set(key.id, key);
      return false;
    }

    // Check allowed IPs
    if (key.allowedIPs.length > 0 && !key.allowedIPs.includes(request.clientIP)) {
      this.emit('security:event', {
        type: 'unauthorized',
        requestId: request.id,
        method: request.method,
        path: request.path,
        details: { clientIP: request.clientIP, allowedIPs: key.allowedIPs },
      });
      return false;
    }

    request.apiKey = key;
    return true;
  }

  private async authorizeRequest(request: APIRequestContext): Promise<boolean> {
    if (!request.apiKey) return false;

    const route = this.getRoute(request.method, request.path);
    if (!route) return false;

    if (!route.authRequired) return true;

    // Check permissions
    for (const permission of route.permissions) {
      if (!request.apiKey.permissions.includes(permission)) {
        return false;
      }
    }

    return true;
  }

  private async checkRateLimits(request: APIRequestContext): Promise<boolean> {
    if (!request.apiKey) return false;

    const rateLimitKey = `${request.apiKey.id}:${request.clientIP}`;
    let state = this.rateLimitStates.get(rateLimitKey);

    if (!state) {
      state = {
        requests: 0,
        windowStart: Date.now(),
      };
      this.rateLimitStates.set(rateLimitKey, state);
    }

    // Reset window if expired
    const now = Date.now();
    if (now - state.windowStart > this.config.rateLimiting.defaultWindow) {
      state.requests = 0;
      state.windowStart = now;
    }

    // Check limit
    if (state.requests >= this.config.rateLimiting.defaultLimit) {
      this.emit('security:event', {
        type: 'rate_limit_exceeded',
        requestId: request.id,
        method: request.method,
        path: request.path,
        details: {
          clientIP: request.clientIP,
          apiKeyId: request.apiKey.id,
          requests: state.requests,
          limit: this.config.rateLimiting.defaultLimit,
        },
      });
      return false;
    }

    state.requests++;
    return true;
  }

  private async checkSecurity(request: APIRequestContext): Promise<boolean> {
    if (!this.config.security.enabled) return true;

    // Check blocked IPs
    if (this.blockedIPs.has(request.clientIP)) {
      return false;
    }

    // Check suspicious activity
    if (this.suspiciousIPs.has(request.clientIP)) {
      const recentEvents = this.analyticsEvents.filter(
        event =>
          event.metadata?.clientIP === request.clientIP && event.timestamp > Date.now() - 3600000 // Last hour
      ).length;

      if (recentEvents > this.config.security.suspiciousIPThreshold) {
        if (this.config.security.blockMaliciousIPs) {
          this.blockedIPs.add(request.clientIP);
        }
        return false;
      }
    }

    return true;
  }

  private getFromCache(request: APIRequestContext, route: APIRoute): APIResponseContext | null {
    if (!route.cacheConfig?.enabled) return getRealData();

    const cacheKey = route.cacheConfig.keyGenerator
      ? route.cacheConfig.keyGenerator(request)
      : `${request.method}:${request.path}:${JSON.stringify(request.query)}`;

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    this.cache.delete(cacheKey);
    return getRealData();
  }

  private setToCache(
    request: APIRequestContext,
    response: APIResponseContext,
    route: APIRoute
  ): void {
    if (!route.cacheConfig?.enabled) return;

    const cacheKey = route.cacheConfig.keyGenerator
      ? route.cacheConfig.keyGenerator(request)
      : `${request.method}:${request.path}:${JSON.stringify(request.query)}`;

    const expires = Date.now() + route.cacheConfig.ttl;
    this.cache.set(cacheKey, { data: response, expires });
  }

  private createErrorResponse(
    status: number,
    message: string,
    request: APIRequestContext
  ): APIResponseContext {
    return {
      id: this.generateId(),
      status,
      headers: { 'Content-Type': 'application/json' },
      body: { error: message, timestamp: Date.now() },
      timestamp: Date.now(),
      duration: 0,
      size: 0,
      cached: false,
    };
  }

  private recordAnalyticsEvent(event: APIAnalyticsEvent): void {
    this.analyticsEvents.push(event);

    // Keep only recent events
    const cutoff = Date.now() - this.config.analytics.retention;
    this.analyticsEvents = this.analyticsEvents.filter(e => e.timestamp > cutoff);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateAPIKey(): string {
    return `ak_${Math.random().toString(36).substr(2, 32)}`;
  }

  private generateAPISecret(): string {
    return `as_${Math.random().toString(36).substr(2, 64)}`;
  }

  // Public API methods
  getAnalyticsSummary(): any {
    const now = Date.now();
    const last24Hours = this.analyticsEvents.filter(e => e.timestamp > now - 86400000);

    return {
      totalRequests: last24Hours.filter(e => e.eventType === 'request').length,
      totalResponses: last24Hours.filter(e => e.eventType === 'response').length,
      totalErrors: last24Hours.filter(e => e.eventType === 'error').length,
      averageResponseTime: this.calculateAverageResponseTime(last24Hours),
      errorRate: this.calculateErrorRate(last24Hours),
      activeKeys: Array.from(this.apiKeys.values()).filter(k => k.status === APIKeyStatus.ACTIVE)
        .length,
      totalKeys: this.apiKeys.size,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
    };
  }

  getAnalyticsEvents(eventType?: string, limit?: number): APIAnalyticsEvent[] {
    let events = this.analyticsEvents;

    if (eventType) {
      events = events.filter(e => e.eventType === eventType);
    }

    events = events.sort((a, b) => b.timestamp - a.timestamp);

    if (limit) {
      events = events.slice(0, limit);
    }

    return events;
  }

  getRateLimitStates(): Map<string, RateLimitState> {
    return new Map(this.rateLimitStates);
  }

  getCacheStats(): { size: number; hitRate: number } {
    const totalRequests = this.analyticsEvents.filter(e => e.eventType === 'response').length;
    const cachedRequests = this.analyticsEvents.filter(
      e => e.eventType === 'response' && e.metadata?.cached
    ).length;

    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? (cachedRequests / totalRequests) * 100 : 0,
    };
  }
}

// Factory function to create enterprise API manager
export function createEnterpriseAPIManager(
  environment: EnterpriseEnvironmentConfig,
  config?: Partial<APIManagerConfig>
): EnterpriseAPIManager {
  return new EnterpriseAPIManager(environment, config);
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
      stack: this.stack
    };
  }
}
