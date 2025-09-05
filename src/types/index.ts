/**
 * Diamond-Grade Type Definitions for OptiMind AI Ecosystem
 *
 * This file contains comprehensive type definitions that ensure
 * type safety across the entire application with strict typing
 * and proper validation.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface AuditEntity extends BaseEntity {
  createdBy: string;
  updatedBy: string;
  deletedAt?: Date;
  isDeleted: boolean;
}

// AI Service Types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  cost: number;
  category: "premium" | "balanced" | "fast" | "specialized";
  status: "active" | "beta" | "deprecated" | "coming-soon";
  description?: string;
  parameters?: Record<string, any>;
}

export interface AIRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
    metadata?: Record<string, any>;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  stop?: string[];
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  finishReason: "stop" | "length" | "content_filter" | "tool_calls";
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Content Management Types
export interface Content extends AuditEntity {
  title: string;
  description: string;
  body: string;
  type:
    | "blog"
    | "article"
    | "product-description"
    | "social-media"
    | "email"
    | "documentation";
  status: "draft" | "published" | "archived" | "deleted";
  author: string;
  tags: string[];
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    readingTime?: number;
    wordCount?: number;
    language?: string;
    targetAudience?: string;
  };
  optimization: {
    score: number;
    readability: number;
    seoScore: number;
    lastOptimized: Date;
  };
  analytics?: {
    views: number;
    engagement: number;
    shares: number;
    conversions: number;
  };
}

// User Management Types
export interface User extends AuditEntity {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "moderator" | "analyst";
  permissions: Permission[];
  profile: {
    avatar?: string;
    bio?: string;
    preferences: UserPreferences;
    settings: UserSettings;
  };
  subscription?: Subscription;
  security: {
    twoFactorEnabled: boolean;
    lastLogin: Date;
    loginAttempts: number;
    lockedUntil?: Date;
  };
}

export interface Permission {
  resource: string;
  action: "create" | "read" | "update" | "delete" | "execute";
  conditions?: Record<string, any>;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface UserSettings {
  ai: AISettings;
  content: ContentSettings;
  security: SecuritySettings;
  analytics: AnalyticsSettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: "immediate" | "daily" | "weekly" | "monthly";
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface AISettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  autoSave: boolean;
  suggestions: boolean;
}

export interface ContentSettings {
  autoSave: boolean;
  autoOptimize: boolean;
  plagiarismCheck: boolean;
  grammarCheck: boolean;
}

export interface SecuritySettings {
  sessionTimeout: number;
  twoFactor: boolean;
  loginNotifications: boolean;
  dataEncryption: boolean;
}

export interface AnalyticsSettings {
  tracking: boolean;
  personalized: boolean;
  sharing: boolean;
}

// Subscription Types
export interface Subscription extends AuditEntity {
  userId: string;
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "cancelled" | "expired" | "suspended";
  billingCycle: "monthly" | "yearly";
  currentPeriod: {
    start: Date;
    end: Date;
  };
  features: SubscriptionFeature[];
  usage: SubscriptionUsage;
  paymentMethod?: PaymentMethod;
}

export interface SubscriptionFeature {
  name: string;
  description: string;
  enabled: boolean;
  limits?: Record<string, number>;
}

export interface SubscriptionUsage {
  aiRequests: number;
  aiRequestsLimit: number;
  storageUsed: number;
  storageLimit: number;
  bandwidthUsed: number;
  bandwidthLimit: number;
  apiCalls: number;
  apiCallsLimit: number;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "paypal" | "bank_transfer";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
}

// Analytics Types
export interface AnalyticsData {
  timestamp: Date;
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversionRate: number;
  };
  content: {
    totalContent: number;
    publishedContent: number;
    averageOptimizationScore: number;
    topPerformingContent: string[];
  };
  ai: {
    totalRequests: number;
    averageResponseTime: number;
    cost: number;
    topModels: string[];
  };
  user: {
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    satisfaction: number;
  };
}

// Security Types
export interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_login"
    | "password_change"
    | "permission_change"
    | "data_access";
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SecurityAlert {
  id: string;
  type:
    | "suspicious_activity"
    | "brute_force"
    | "data_breach"
    | "malware"
    | "phishing";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedResources: string[];
  timestamp: Date;
  status: "open" | "investigating" | "resolved" | "false_positive";
  actions: SecurityAction[];
}

export interface SecurityAction {
  id: string;
  type:
    | "block_ip"
    | "lock_account"
    | "force_logout"
    | "notify_admin"
    | "quarantine_data";
  timestamp: Date;
  executed: boolean;
  result?: string;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  id: string;
}

export interface RealTimeUpdate {
  type: "content" | "analytics" | "security" | "system";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: Date;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ApiHandler<T = any> = (
  req: Request,
  res: Response,
) => Promise<ApiResponse<T>>;

export type EventHandler<T = any> = (event: T) => Promise<void> | void;

// Error Types
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400, { field });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string = "Authorization failed") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND_ERROR", 404, { resource });
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
}

// Configuration Types
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: "development" | "staging" | "production";
    debug: boolean;
  };
  database: {
    url: string;
    maxConnections: number;
    ssl: boolean;
  };
  redis: {
    url: string;
    maxConnections: number;
  };
  ai: {
    defaultModel: string;
    timeout: number;
    retryAttempts: number;
  };
  security: {
    jwtSecret: string;
    bcryptRounds: number;
    sessionTimeout: number;
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
  monitoring: {
    enabled: boolean;
    serviceName: string;
    version: string;
  };
}

// Export all types for easy importing
export * from "./utils";
export * from "./hooks";
export * from "./services";
