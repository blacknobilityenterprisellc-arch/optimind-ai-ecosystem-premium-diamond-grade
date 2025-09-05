/**
 * Diamond-Grade Error Handling Middleware
 *
 * Comprehensive error handling middleware for Next.js API routes
 * with standardized error responses and proper error categorization.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { NextRequest, NextResponse } from "next/server";
import {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
} from "@/types";
import { globalErrorHandler } from "@/lib/error-handler";
import { ErrorSeverity, ErrorCategory } from "@/lib/error-handler";

// Error response interface
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
  metadata?: {
    path: string;
    method: string;
    timestamp: string;
    requestId: string;
  };
}

// Error mapping configuration
const ERROR_MAPPING = {
  [ValidationError.name]: {
    statusCode: 400,
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
  },
  [AuthenticationError.name]: {
    statusCode: 401,
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHENTICATION,
  },
  [AuthorizationError.name]: {
    statusCode: 403,
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHORIZATION,
  },
  [NotFoundError.name]: {
    statusCode: 404,
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.BUSINESS_LOGIC,
  },
  [RateLimitError.name]: {
    statusCode: 429,
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.SECURITY,
  },
  [ApplicationError.name]: {
    statusCode: 500,
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.SYSTEM,
  },
};

// Default error configuration
const DEFAULT_ERROR_CONFIG = {
  statusCode: 500,
  severity: ErrorSeverity.HIGH,
  category: ErrorCategory.SYSTEM,
};

// Error handler middleware
export class ErrorHandlerMiddleware {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || this.generateRequestId();
  }

  // Main error handling method
  async handleError(
    error: unknown,
    request: NextRequest,
  ): Promise<NextResponse> {
    const enhancedError = this.enhanceError(error);

    // Log the error with context
    await globalErrorHandler.handleError(
      enhancedError,
      this.getErrorContext(request),
    );

    // Create standardized error response
    const errorResponse = this.createErrorResponse(enhancedError, request);

    // Return appropriate HTTP response
    return NextResponse.json(errorResponse, {
      status: this.getStatusCode(enhancedError),
      headers: this.getHeaders(enhancedError),
    });
  }

  // Enhance error with additional information
  private enhanceError(error: unknown): ApplicationError {
    if (error instanceof ApplicationError) {
      return error;
    }

    // Handle standard JavaScript errors
    if (error instanceof Error) {
      return new ApplicationError(error.message, "INTERNAL_ERROR", 500, {
        stack: error.stack,
      });
    }

    // Handle unknown errors
    return new ApplicationError(
      "An unexpected error occurred",
      "UNKNOWN_ERROR",
      500,
      { originalError: error },
    );
  }

  // Get error context for logging
  private getErrorContext(request: NextRequest): any {
    return {
      requestId: this.requestId,
      path: request.nextUrl.pathname,
      method: request.method,
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress: this.getClientIP(request),
      timestamp: new Date().toISOString(),
    };
  }

  // Create standardized error response
  private createErrorResponse(
    error: ApplicationError,
    request: NextRequest,
  ): ErrorResponse {
    const errorConfig =
      ERROR_MAPPING[error.constructor.name] || DEFAULT_ERROR_CONFIG;

    return {
      success: false,
      error: {
        code: error.code,
        message: this.getUserMessage(error),
        details: this.getErrorDetails(error),
        timestamp: new Date().toISOString(),
        requestId: this.requestId,
      },
      metadata: {
        path: request.nextUrl.pathname,
        method: request.method,
        timestamp: new Date().toISOString(),
        requestId: this.requestId,
      },
    };
  }

  // Get appropriate HTTP status code
  private getStatusCode(error: ApplicationError): number {
    return (
      error.statusCode ||
      ERROR_MAPPING[error.constructor.name]?.statusCode ||
      500
    );
  }

  // Get appropriate headers
  private getHeaders(error: ApplicationError): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Request-ID": this.requestId,
      "X-Error-Code": error.code,
      "X-Error-Severity":
        ERROR_MAPPING[error.constructor.name]?.severity || ErrorSeverity.HIGH,
      "X-Error-Category":
        ERROR_MAPPING[error.constructor.name]?.category || ErrorCategory.SYSTEM,
    };

    // Add security headers for certain error types
    if (
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError
    ) {
      headers["WWW-Authenticate"] = "Bearer";
    }

    if (error instanceof RateLimitError) {
      headers["Retry-After"] = "60";
      headers["X-RateLimit-Limit"] = "100";
      headers["X-RateLimit-Remaining"] = "0";
      headers["X-RateLimit-Reset"] = Math.floor(
        Date.now() / 1000 + 60,
      ).toString();
    }

    return headers;
  }

  // Get user-friendly error message
  private getUserMessage(error: ApplicationError): string {
    // In production, return generic messages for security
    if (process.env.NODE_ENV === "production") {
      switch (error.constructor.name) {
        case ValidationError.name:
          return "Please check your input and try again.";
        case AuthenticationError.name:
          return "Authentication failed. Please check your credentials.";
        case AuthorizationError.name:
          return "You don't have permission to perform this action.";
        case NotFoundError.name:
          return "The requested resource was not found.";
        case RateLimitError.name:
          return "Too many requests. Please try again later.";
        default:
          return "An unexpected error occurred. Please try again later.";
      }
    }

    // In development, return the actual error message
    return error.message;
  }

  // Get error details (sanitized for production)
  private getErrorDetails(
    error: ApplicationError,
  ): Record<string, any> | undefined {
    if (process.env.NODE_ENV === "production") {
      // In production, only include safe details
      const safeDetails: Record<string, any> = {};

      if (error.details) {
        // Only include non-sensitive details
        Object.keys(error.details).forEach((key) => {
          if (!this.isSensitiveField(key)) {
            safeDetails[key] = error.details![key];
          }
        });
      }

      return Object.keys(safeDetails).length > 0 ? safeDetails : undefined;
    }

    // In development, include all details
    return error.details;
  }

  // Check if a field is sensitive
  private isSensitiveField(field: string): boolean {
    const sensitiveFields = [
      "password",
      "token",
      "secret",
      "key",
      "authorization",
      "credit_card",
      "ssn",
      "social_security",
      "api_key",
    ];

    return sensitiveFields.some((sensitive) =>
      field.toLowerCase().includes(sensitive),
    );
  }

  // Get client IP address
  private getClientIP(request: NextRequest): string {
    return (
      (
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "unknown"
      )
        ?.split(",")[0]
        ?.trim() || "unknown"
    );
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Factory function to create error handler middleware
export function createErrorHandler(requestId?: string) {
  const middleware = new ErrorHandlerMiddleware(requestId);

  return async (error: unknown, request: NextRequest) => {
    return await middleware.handleError(error, request);
  };
}

// Higher-order function for wrapping API route handlers
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = args[0] as NextRequest;
      const errorHandler = createErrorHandler();
      return await errorHandler.handleError(error, request);
    }
  };
}

// Error handling utility functions
export const errorUtils = {
  // Create validation error
  createValidationError: (
    message: string,
    field?: string,
    details?: Record<string, any>,
  ) => {
    return new ValidationError(message, field);
  },

  // Create authentication error
  createAuthenticationError: (message?: string) => {
    return new AuthenticationError(message);
  },

  // Create authorization error
  createAuthorizationError: (message?: string) => {
    return new AuthorizationError(message);
  },

  // Create not found error
  createNotFoundError: (resource: string) => {
    return new NotFoundError(resource);
  },

  // Create rate limit error
  createRateLimitError: (message?: string) => {
    return new RateLimitError(message);
  },

  // Create application error
  createApplicationError: (
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, any>,
  ) => {
    return new ApplicationError(message, code, statusCode, details);
  },

  // Wrap async function with error handling
  wrapAsync: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorHandler?: (error: unknown) => void,
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        if (errorHandler) {
          errorHandler(error);
        }
        throw error;
      }
    };
  },

  // Check if error is retryable
  isRetryableError: (error: unknown): boolean => {
    if (error instanceof ApplicationError) {
      return (
        error.code === "NETWORK_ERROR" ||
        error.code === "TIMEOUT_ERROR" ||
        error.code === "SERVICE_UNAVAILABLE"
      );
    }
    return false;
  },
};

// Export all error handling utilities
export {
  ErrorHandlerMiddleware,
  createErrorHandler,
  withErrorHandling,
  errorUtils,
};
