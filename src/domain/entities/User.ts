/**
 * Domain Entity - User
 * 
 * Represents a user in the system with all business rules and validations.
 * This is the core domain object that contains all user-related business logic.
 * 
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { AuditEntity } from '@/types';
import { Email } from '../value-objects/Email';
import { Money } from '../value-objects/Money';
import { ValidationError } from '@/lib/error-handler';

export interface UserProps {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  profile: UserProfile;
  subscription?: Subscription;
  security: UserSecurity;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  ANALYST = 'analyst'
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  conditions?: Record<string, any>;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
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
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
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

export interface Subscription {
  id: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  billingCycle: 'monthly' | 'yearly';
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
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
}

export interface UserSecurity {
  twoFactorEnabled: boolean;
  lastLogin: Date;
  loginAttempts: number;
  lockedUntil?: Date;
}

export class User extends AuditEntity {
  private readonly _email: Email;
  private readonly _username: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _role: UserRole;
  private readonly _permissions: Permission[];
  private readonly _profile: UserProfile;
  private _subscription?: Subscription;
  private readonly _security: UserSecurity;

  constructor(props: UserProps) {
    super();
    
    // Validate required fields
    if (!props.email || !props.username || !props.firstName || !props.lastName) {
      throw new ValidationError('All user fields are required');
    }

    // Create value objects
    this._email = new Email(props.email);
    this._username = this.validateUsername(props.username);
    this._firstName = this.validateName(props.firstName, 'First name');
    this._lastName = this.validateName(props.lastName, 'Last name');
    this._role = props.role;
    this._permissions = this.validatePermissions(props.permissions);
    this._profile = this.validateProfile(props.profile);
    this._subscription = props.subscription;
    this._security = this.validateSecurity(props.security);
  }

  // Getters
  get email(): string {
    return this._email.value;
  }

  get username(): string {
    return this._username;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get role(): UserRole {
    return this._role;
  }

  get permissions(): Permission[] {
    return [...this._permissions];
  }

  get profile(): UserProfile {
    return { ...this._profile };
  }

  get subscription(): Subscription | undefined {
    return this._subscription ? { ...this._subscription } : undefined;
  }

  get security(): UserSecurity {
    return { ...this._security };
  }

  // Business methods
  hasPermission(resource: string, action: string): boolean {
    return this._permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }

  hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  isActive(): boolean {
    return !this.isDeleted && this._security.loginAttempts < 5;
  }

  isLocked(): boolean {
    return this._security.lockedUntil ? new Date() < this._security.lockedUntil : false;
  }

  canUseAI(model: string): boolean {
    if (this.isAdmin()) return true;
    
    const subscription = this._subscription;
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    // Check if model is allowed by subscription plan
    const modelLimits = subscription.features.find(f => f.name === 'ai_models')?.limits;
    if (!modelLimits) return false;

    return modelLimits[model] > 0;
  }

  hasStorageSpace(size: number): boolean {
    if (this.isAdmin()) return true;
    
    const subscription = this._subscription;
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    return (subscription.usage.storageUsed + size) <= subscription.usage.storageLimit;
  }

  updateProfile(profile: Partial<UserProfile>): void {
    this._profile = { ...this._profile, ...profile };
    this.updatedAt = new Date();
  }

  updateSecurity(security: Partial<UserSecurity>): void {
    this._security = { ...this._security, ...security };
    this.updatedAt = new Date();
  }

  updateSubscription(subscription: Subscription): void {
    this._subscription = { ...subscription };
    this.updatedAt = new Date();
  }

  recordLogin(): void {
    this._security.lastLogin = new Date();
    this._security.loginAttempts = 0;
    this._security.lockedUntil = undefined;
    this.updatedAt = new Date();
  }

  recordFailedLogin(): void {
    this._security.loginAttempts += 1;
    
    // Lock account after 5 failed attempts
    if (this._security.loginAttempts >= 5) {
      this._security.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }
    
    this.updatedAt = new Date();
  }

  unlockAccount(): void {
    this._security.loginAttempts = 0;
    this._security.lockedUntil = undefined;
    this.updatedAt = new Date();
  }

  // Validation methods
  private validateUsername(username: string): string {
    if (username.length < 3 || username.length > 20) {
      throw new ValidationError('Username must be between 3 and 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new ValidationError('Username can only contain letters, numbers, and underscores');
    }
    
    return username;
  }

  private validateName(name: string, fieldName: string): string {
    if (name.length < 1 || name.length > 50) {
      throw new ValidationError(`${fieldName} must be between 1 and 50 characters`);
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      throw new ValidationError(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
    
    return name.trim();
  }

  private validatePermissions(permissions: Permission[]): Permission[] {
    if (!permissions || permissions.length === 0) {
      throw new ValidationError('User must have at least one permission');
    }
    
    return permissions.map(permission => ({
      resource: permission.resource,
      action: permission.action,
      conditions: permission.conditions || {}
    }));
  }

  private validateProfile(profile: UserProfile): UserProfile {
    if (!profile.preferences) {
      throw new ValidationError('User profile must include preferences');
    }
    
    if (!profile.settings) {
      throw new ValidationError('User profile must include settings');
    }
    
    return {
      avatar: profile.avatar,
      bio: profile.bio,
      preferences: profile.preferences,
      settings: profile.settings
    };
  }

  private validateSecurity(security: UserSecurity): UserSecurity {
    if (!security.lastLogin) {
      throw new ValidationError('User security must include last login date');
    }
    
    if (security.loginAttempts < 0) {
      throw new ValidationError('Login attempts cannot be negative');
    }
    
    return {
      twoFactorEnabled: security.twoFactorEnabled,
      lastLogin: security.lastLogin,
      loginAttempts: security.loginAttempts,
      lockedUntil: security.lockedUntil
    };
  }

  // Domain events
  getDomainEvents(): DomainEvent[] {
    return [];
  }

  clearDomainEvents(): void {
    // Clear domain events
  }
}

export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  payload: any;
  timestamp: Date;
  version: number;
}