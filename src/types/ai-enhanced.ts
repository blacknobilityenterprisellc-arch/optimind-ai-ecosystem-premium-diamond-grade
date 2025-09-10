
// AI-Enhanced Type Definitions
import { z } from 'zod';

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User extends BaseEntity {
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  credits: number;
  dailyLimit: number;
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

// API types
export interface ApiKey extends BaseEntity {
  key: string;
  userId: string;
  permissions: string[];
  lastUsed?: Date;
  expiresAt?: Date;
}

// AI Service types
export interface AIService extends BaseEntity {
  name: string;
  description: string;
  endpoint: string;
  model: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

// Validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean(),
  credits: z.number().min(0),
  dailyLimit: z.number().min(1)
});

export const apiKeySchema = z.object({
  key: z.string().min(32),
  userId: z.string().cuid(),
  permissions: z.array(z.string()),
  expiresAt: z.date().optional()
});

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types
export interface SystemEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
}

export interface UserEvent extends SystemEvent {
  type: 'user_action';
  userId: string;
  action: string;
  resource: string;
}

// Error types
export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Configuration types
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  database: {
    url: string;
    poolSize: number;
  };
  ai: {
    models: string[];
    apiKey: string;
  };
  security: {
    jwtSecret: string;
    bcryptRounds: number;
  };
}

// Hook types
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseMutationResult<T, V = any> {
  mutate: (variables: V) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'bars';
}

export interface ErrorProps extends BaseComponentProps {
  error: Error;
  retry?: () => void;
}

// Service types
export interface ServiceConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ServiceResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

// Utility functions
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error && 'code' in error;
};

export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> => ({
  success,
  data,
  error,
  message
});

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => ({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});
