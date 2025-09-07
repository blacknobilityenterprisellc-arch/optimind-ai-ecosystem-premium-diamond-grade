/**
 * Diamond-Grade Error Handling System
 *
 * Comprehensive error handling system with proper error types,
 * error boundaries, and error recovery mechanisms.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
} from '@/types';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  DATABASE = 'database',
  NETWORK = 'network',
  SECURITY = 'security',
  SYSTEM = 'system',
}

// Enhanced error interface
export interface EnhancedError extends Error {
  code: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
  userMessage?: string;
  internalMessage?: string;
  retryable: boolean;
}

// Error context interface
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ipAddress?: string;
  additionalData?: Record<string, any>;
}

// Error recovery strategy
export interface ErrorRecoveryStrategy {
  shouldRetry: (error: EnhancedError) => boolean;
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  onRetry?: (error: EnhancedError, attempt: number) => void;
}

// Error logging interface
export interface ErrorLogger {
  log: (error: EnhancedError, context?: ErrorContext) => Promise<void>;
  logWarning: (message: string, context?: ErrorContext) => Promise<void>;
  logInfo: (message: string, context?: ErrorContext) => Promise<void>;
}

// Error monitoring interface
export interface ErrorMonitor {
  trackError: (error: EnhancedError, context?: ErrorContext) => Promise<void>;
  trackPerformance: (metric: string, value: number, context?: ErrorContext) => Promise<void>;
  trackUserAction: (action: string, context?: ErrorContext) => Promise<void>;
}

// Error handler class
export class ErrorHandler {
  private logger: ErrorLogger;
  private monitor: ErrorMonitor;
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy>;

  constructor(logger: ErrorLogger, monitor: ErrorMonitor) {
    this.logger = logger;
    this.monitor = monitor;
    this.recoveryStrategies = new Map();
    this.initializeRecoveryStrategies();
  }

  private initializeRecoveryStrategies(): void {
    // Network errors retry strategy
    this.recoveryStrategies.set('network', {
      shouldRetry: error => error.category === ErrorCategory.NETWORK,
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      onRetry: (error, attempt) => {
        console.log(`Retrying network error (attempt ${attempt}):`, error.message);
      },
    });

    // External service errors retry strategy
    this.recoveryStrategies.set('external_service', {
      shouldRetry: error => error.category === ErrorCategory.EXTERNAL_SERVICE,
      maxRetries: 2,
      retryDelay: 2000,
      backoffMultiplier: 1.5,
      onRetry: (error, attempt) => {
        console.log(`Retrying external service error (attempt ${attempt}):`, error.message);
      },
    });

    // Database errors retry strategy
    this.recoveryStrategies.set('database', {
      shouldRetry: error => error.category === ErrorCategory.DATABASE,
      maxRetries: 1,
      retryDelay: 500,
      backoffMultiplier: 2,
      onRetry: (error, attempt) => {
        console.log(`Retrying database error (attempt ${attempt}):`, error.message);
      },
    });
  }

  // Convert standard errors to enhanced errors
  public enhanceError(error: Error | ApplicationError, context?: ErrorContext): EnhancedError {
    const enhancedError: EnhancedError = error as EnhancedError;

    // Set default values if not already set
    if (!enhancedError.code) {
      enhancedError.code = 'UNKNOWN_ERROR';
    }

    if (!enhancedError.severity) {
      enhancedError.severity = ErrorSeverity.MEDIUM;
    }

    if (!enhancedError.category) {
      enhancedError.category = ErrorCategory.SYSTEM;
    }

    if (!enhancedError.timestamp) {
      enhancedError.timestamp = new Date();
    }

    if (!enhancedError.retryable) {
      enhancedError.retryable = this.isErrorRetryable(enhancedError);
    }

    // Set user-friendly messages
    if (!enhancedError.userMessage) {
      enhancedError.userMessage = this.getUserMessage(enhancedError);
    }

    if (!enhancedError.internalMessage) {
      enhancedError.internalMessage = this.getInternalMessage(enhancedError);
    }

    // Add context
    if (context) {
      enhancedError.context = { ...enhancedError.context, ...context };
    }

    return enhancedError;
  }

  // Handle error with logging and monitoring
  public async handleError(error: Error | ApplicationError, context?: ErrorContext): Promise<void> {
    const enhancedError = this.enhanceError(error, context);

    // Log the error
    await this.logger.log(enhancedError, context);

    // Track the error for monitoring
    await this.monitor.trackError(enhancedError, context);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', enhancedError);
    }
  }

  // Execute function with error handling and retry logic
  public async executeWithRetry<T>(
    fn: () => Promise<T>,
    errorContext?: ErrorContext,
    customStrategy?: ErrorRecoveryStrategy
  ): Promise<T> {
    let lastError: EnhancedError | null = null;
    let attempt = 0;

    const strategy = customStrategy || this.getDefaultRecoveryStrategy();

    while (attempt <= strategy.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        const enhancedError = this.enhanceError(error, errorContext);
        lastError = enhancedError;

        // Check if we should retry
        if (!strategy.shouldRetry(enhancedError) || attempt === strategy.maxRetries) {
          throw enhancedError;
        }

        // Call retry callback if provided
        if (strategy.onRetry) {
          strategy.onRetry(enhancedError, attempt + 1);
        }

        // Calculate delay with exponential backoff
        const delay = strategy.retryDelay * Math.pow(strategy.backoffMultiplier, attempt);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

        attempt++;
      }
    }

    // If we get here, all retries failed
    throw lastError || new ApplicationError('Unknown error occurred');
  }

  // Create error boundaries for React components
  public createErrorBoundary() {
    return class ErrorBoundary extends React.Component<
      { children: React.ReactNode; fallback?: React.ReactNode },
      { hasError: boolean; error?: Error }
    > {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Handle the error
        void this.handleError(error, {
          additionalData: { errorInfo },
        });
      }

      async handleError(error: Error, context?: ErrorContext) {
        await this.props.onError?.(error, context);
      }

      render() {
        if (this.state.hasError) {
          return (
            this.props.fallback || (
              <div className="error-fallback">
                <h2>Something went wrong.</h2>
                <p>Please try again later.</p>
              </div>
            )
          );
        }

        return this.props.children;
      }
    };
  }

  // Get default recovery strategy
  private getDefaultRecoveryStrategy(): ErrorRecoveryStrategy {
    return {
      shouldRetry: () => false,
      maxRetries: 0,
      retryDelay: 0,
      backoffMultiplier: 1,
    };
  }

  // Check if error is retryable
  private isErrorRetryable(error: EnhancedError): boolean {
    return (
      error.category === ErrorCategory.NETWORK ||
      error.category === ErrorCategory.EXTERNAL_SERVICE ||
      error.category === ErrorCategory.DATABASE
    );
  }

  // Get user-friendly error message
  private getUserMessage(error: EnhancedError): string {
    switch (error.category) {
      case ErrorCategory.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorCategory.AUTHENTICATION:
        return 'Please sign in to continue.';
      case ErrorCategory.AUTHORIZATION:
        return "You don't have permission to perform this action.";
      case ErrorCategory.NETWORK:
        return 'Network connection error. Please check your internet connection.';
      case ErrorCategory.EXTERNAL_SERVICE:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Get internal error message
  private getInternalMessage(error: EnhancedError): string {
    return `${error.category.toUpperCase()}: ${error.message}`;
  }
}

// Console-based error logger implementation
export class ConsoleErrorLogger implements ErrorLogger {
  async log(error: EnhancedError, context?: ErrorContext): Promise<void> {
    console.error(`[${error.severity.toUpperCase()}] ${error.category}:`, {
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      context,
      stack: error.stack,
    });
  }

  async logWarning(message: string, context?: ErrorContext): Promise<void> {
    console.warn(`[WARNING] ${message}`, context);
  }

  async logInfo(message: string, context?: ErrorContext): Promise<void> {
    console.info(`[INFO] ${message}`, context);
  }
}

// Mock error monitor implementation
export class MockErrorMonitor implements ErrorMonitor {
  async trackError(error: EnhancedError, context?: ErrorContext): Promise<void> {
    // In a real implementation, this would send to monitoring service
    console.log('Tracking error:', { error, context });
  }

  async trackPerformance(metric: string, value: number, context?: ErrorContext): Promise<void> {
    console.log('Tracking performance:', { metric, value, context });
  }

  async trackUserAction(action: string, context?: ErrorContext): Promise<void> {
    console.log('Tracking user action:', { action, context });
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler(
  new ConsoleErrorLogger(),
  new MockErrorMonitor()
);

// Utility functions for error handling
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      await globalErrorHandler.handleError(error as Error, context);
      throw error;
    }
  };
};

export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  strategy?: ErrorRecoveryStrategy,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R> => {
    return await globalErrorHandler.executeWithRetry(() => fn(...args), context, strategy);
  };
};

// Error type guards
export const isValidationError = (error: any): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isAuthenticationError = (error: any): error is AuthenticationError => {
  return error instanceof AuthenticationError;
};

export const isAuthorizationError = (error: any): error is AuthorizationError => {
  return error instanceof AuthorizationError;
};

export const isNotFoundError = (error: any): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isRateLimitError = (error: any): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const isApplicationError = (error: any): error is ApplicationError => {
  return error instanceof ApplicationError;
};

// Export all error handling utilities
export {
  ErrorHandler,
  ConsoleErrorLogger,
  MockErrorMonitor,
  globalErrorHandler,
  withErrorHandling,
  withRetry,
};
