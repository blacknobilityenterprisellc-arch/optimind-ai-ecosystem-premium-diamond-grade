/**
 * Domain Repository Interface - UserRepository
 *
 * Defines the contract for user data access operations.
 * This interface abstracts the data access layer and follows the repository pattern.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { User, UserRole, Permission } from '../entities/User';
import { Email } from '../value-objects/Email';
import { Money } from '../value-objects/Money';

export interface UserRepository {
  // CRUD operations
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  delete(id: string): Promise<void>;

  // Query operations
  findAll(options?: FindAllOptions): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  findByPermission(permission: Permission): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  findLockedUsers(): Promise<User[]>;
  findUsersBySubscriptionPlan(plan: string): Promise<User[]>;

  // Count operations
  count(): Promise<number>;
  countByRole(role: UserRole): Promise<number>;
  countActiveUsers(): Promise<number>;
  countLockedUsers(): Promise<number>;

  // Pagination operations
  findPaginated(options: PaginationOptions): Promise<PaginatedResult<User>>;

  // Search operations
  search(query: SearchQuery): Promise<User[]>;

  // Subscription operations
  updateSubscription(userId: string, subscription: any): Promise<void>;
  cancelSubscription(userId: string): Promise<void>;
  reactivateSubscription(userId: string): Promise<void>;

  // Security operations
  incrementLoginAttempts(userId: string): Promise<void>;
  resetLoginAttempts(userId: string): Promise<void>;
  lockUser(userId: string, lockUntil: Date): Promise<void>;
  unlockUser(userId: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;

  // Analytics operations
  getUserAnalytics(): Promise<UserAnalytics>;
  getSubscriptionAnalytics(): Promise<SubscriptionAnalytics>;
  getUserActivity(userId: string, period: string): Promise<UserActivity[]>;
}

// Query options
export interface FindAllOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'lastLogin' | 'username';
  orderDirection?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

// Pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Pagination result
export interface PaginatedResult<T> {
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

// Search query
export interface SearchQuery {
  term: string;
  fields?: ('username' | 'email' | 'firstName' | 'lastName' | 'bio')[];
  filters?: {
    role?: UserRole;
    isActive?: boolean;
    hasSubscription?: boolean;
    subscriptionPlan?: string;
  };
  limit?: number;
  offset?: number;
}

// Analytics interfaces
export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  usersByRole: Record<UserRole, number>;
  usersBySubscriptionPlan: Record<string, number>;
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
  activityTrend: Array<{
    date: string;
    activeUsers: number;
  }>;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  subscriptionsByPlan: Record<string, number>;
  subscriptionsByBillingCycle: Record<string, number>;
  revenue: Money;
  monthlyRecurringRevenue: Money;
  churnRate: number;
  averageRevenuePerUser: Money;
  subscriptionTrend: Array<{
    date: string;
    newSubscriptions: number;
    cancelledSubscriptions: number;
    revenue: Money;
  }>;
}

export interface UserActivity {
  date: string;
  logins: number;
  aiRequests: number;
  contentCreated: number;
  actions: Array<{
    type: string;
    count: number;
  }>;
}

// Domain events that the repository can emit
export interface UserRepositoryEvents {
  userCreated: (user: User) => Promise<void>;
  userUpdated: (user: User) => Promise<void>;
  userDeleted: (userId: string) => Promise<void>;
  subscriptionUpdated: (userId: string, subscription: any) => Promise<void>;
  userLocked: (userId: string) => Promise<void>;
  userUnlocked: (userId: string) => Promise<void>;
}

// Repository interface with event support
export interface UserRepositoryWithEvents extends UserRepository {
  on(event: keyof UserRepositoryEvents, handler: any): void;
  off(event: keyof UserRepositoryEvents, handler: any): void;
}

// Cache interface for user repository
export interface CachedUserRepository extends UserRepository {
  invalidateCache(userId: string): Promise<void>;
  invalidateAllCache(): Promise<void>;
  warmCache(): Promise<void>;
}

// Transaction support
export interface UserRepositoryWithTransaction extends UserRepository {
  withTransaction<T>(operation: (repo: UserRepository) => Promise<T>): Promise<T>;
}

// Bulk operations
export interface UserRepositoryWithBulkOperations extends UserRepository {
  bulkCreate(users: User[]): Promise<void>;
  bulkUpdate(updates: Array<{ id: string; updates: Partial<User> }>): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
}

// Export all repository-related types
export {
  FindAllOptions,
  PaginationOptions,
  PaginatedResult,
  SearchQuery,
  UserAnalytics,
  SubscriptionAnalytics,
  UserActivity,
  UserRepositoryEvents,
  UserRepositoryWithEvents,
  CachedUserRepository,
  UserRepositoryWithTransaction,
  UserRepositoryWithBulkOperations,
};
