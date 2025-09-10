// AI-Powered Comprehensive Error Handling System for OptiMind AI Ecosystem
import { NextRequest, NextResponse } from 'next/server';
import { ZAI } from 'z-ai-web-dev-sdk';

// Enhanced error classification
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATABASE = 'database',
  NETWORK = 'network',
  EXTERNAL_SERVICE = 'external_service',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  SECURITY = 'security',
  RATE_LIMIT = 'rate_limit',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced error interface with AI-powered features
export interface EnhancedError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  suggestions?: string[];
  context?: Record<string, any>;
  recovery?: {
    possible: boolean;
    steps?: string[];
    estimatedTime?: string;
  };
  metrics?: {
    occurrenceCount: number;
    firstSeen: Date;
    lastSeen: Date;
    affectedUsers: number;
  };
}

// AI-powered error analysis result
export interface ErrorAnalysis {
  error: EnhancedError;
  rootCause?: string;
  impact: {
    users: number;
    systems: string[];
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
  recommendations: string[];
  prevention: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

// Error handling configuration
export interface ErrorHandlingConfig {
  enableAIAnalysis: boolean;
  enableLogging: boolean;
  enableMonitoring: boolean;
  enableRecovery: boolean;
  enableNotifications: boolean;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  excludedErrorTypes: ErrorType[];
  customHandlers: Record<ErrorType, (error: EnhancedError) => Promise<void>>;
}

// Default configuration
const defaultConfig: ErrorHandlingConfig = {
  enableAIAnalysis: true,
  enableLogging: true,
  enableMonitoring: true,
  enableRecovery: true,
  enableNotifications: true,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  excludedErrorTypes: [],
  customHandlers: {}
};

class AIErrorHandler {
  private config: ErrorHandlingConfig;
  private zai: ZAI | null = null;
  private errorStore = new Map<string, EnhancedError>();
  private errorMetrics = new Map<ErrorType, number>();

  constructor(config: Partial<ErrorHandlingConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      if (this.config.enableAIAnalysis) {
        this.zai = await ZAI.create();
      }
    } catch (error) {
      console.warn('Failed to initialize ZAI for error handling:', error);
    }
  }

  // Create enhanced error from various error sources
  createEnhancedError(
    error: Error | string | any,
    context: {
      type?: ErrorType;
      severity?: ErrorSeverity;
      endpoint?: string;
      method?: string;
      userId?: string;
      additionalContext?: Record<string, any>;
    } = {}
  ): EnhancedError {
    const errorId = this.generateErrorId();
    const timestamp = new Date();
    
    // Extract error information
    let message: string;
    let stack: string | undefined;
    let details: any;

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
      details = {
        name: error.name,
        cause: error.cause,
        ...error
      };
    } else {
      message = 'Unknown error occurred';
      details = error;
    }

    // Determine error type
    const type = context.type || this.classifyError(error, message);
    const severity = context.severity || this.determineSeverity(type, message);

    const enhancedError: EnhancedError = {
      id: errorId,
      type,
      severity,
      message,
      details,
      stack,
      timestamp,
      endpoint: context.endpoint,
      method: context.method,
      userId: context.userId,
      context: {
        ...context.additionalContext,
        userAgent: context.additionalContext?.userAgent,
        ip: context.additionalContext?.ip
      }
    };

    // Store error for metrics
    this.storeError(enhancedError);

    return enhancedError;
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private classifyError(error: any, message: string): ErrorType {
    // Classify error based on various factors
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    
    if (message.includes('authentication') || message.includes('unauthorized')) {
      return ErrorType.AUTHENTICATION;
    }
    
    if (message.includes('forbidden') || message.includes('permission')) {
      return ErrorType.AUTHORIZATION;
    }
    
    if (message.includes('database') || message.includes('connection') || message.includes('timeout')) {
      return ErrorType.DATABASE;
    }
    
    if (message.includes('network') || message.includes('ECONNREFUSED') || message.includes('ENOTFOUND')) {
      return ErrorType.NETWORK;
    }
    
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return ErrorType.RATE_LIMIT;
    }
    
    if (message.includes('security') || message.includes('csrf') || message.includes('xss')) {
      return ErrorType.SECURITY;
    }
    
    if (error?.code === 'ETIMEOUT' || message.includes('timeout')) {
      return ErrorType.TIMEOUT;
    }

    return ErrorType.UNKNOWN;
  }

  private determineSeverity(type: ErrorType, message: string): ErrorSeverity {
    const criticalMessages = ['critical', 'fatal', 'emergency'];
    const highMessages = ['error', 'failed', 'exception'];
    
    if (criticalMessages.some(msg => message.toLowerCase().includes(msg))) {
      return ErrorSeverity.CRITICAL;
    }
    
    if (highMessages.some(msg => message.toLowerCase().includes(msg))) {
      return ErrorSeverity.HIGH;
    }

    switch (type) {
      case ErrorType.SECURITY:
      case ErrorType.DATABASE:
        return ErrorSeverity.HIGH;
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return ErrorSeverity.HIGH;
      case ErrorType.RATE_LIMIT:
      case ErrorType.TIMEOUT:
        return ErrorSeverity.MEDIUM;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  private storeError(error: EnhancedError): void {
    // Store error for tracking
    this.errorStore.set(error.id, error);
    
    // Update metrics
    const currentCount = this.errorMetrics.get(error.type) || 0;
    this.errorMetrics.set(error.type, currentCount + 1);
  }

  // AI-powered error analysis
  async analyzeError(error: EnhancedError): Promise<ErrorAnalysis> {
    if (!this.zai || !this.config.enableAIAnalysis) {
      return this.getBasicAnalysis(error);
    }

    try {
      const analysis = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI error analysis expert. Analyze the provided error and provide:
            1. Root cause analysis
            2. Impact assessment (users, systems, business impact)
            3. Specific recommendations for resolution
            4. Prevention strategies
            5. Priority assessment
            6. Confidence in analysis (0-1)
            
            Respond in JSON format with the following structure:
            {
              "rootCause": "Detailed root cause analysis",
              "impact": {
                "users": number,
                "systems": ["system1", "system2"],
                "businessImpact": "low|medium|high|critical"
              },
              "recommendations": ["rec1", "rec2"],
              "prevention": ["prev1", "prev2"],
              "priority": "low|medium|high|critical",
              "confidence": 0.8
            }`
          },
          {
            role: 'user',
            content: `Analyze this error:
            Error ID: ${error.id}
            Type: ${error.type}
            Severity: ${error.severity}
            Message: ${error.message}
            Details: ${JSON.stringify(error.details, null, 2)}
            Context: ${JSON.stringify(error.context, null, 2)}
            Stack: ${error.stack || 'No stack trace available'}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      });

      const analysisResult = JSON.parse(analysis.choices[0]?.message?.content || '{}');
      
      return {
        error,
        rootCause: analysisResult.rootCause,
        impact: analysisResult.impact,
        recommendations: analysisResult.recommendations || [],
        prevention: analysisResult.prevention || [],
        priority: analysisResult.priority || 'medium',
        confidence: analysisResult.confidence || 0.5
      };

    } catch (aiError) {
      console.warn('AI error analysis failed:', aiError);
      return this.getBasicAnalysis(error);
    }
  }

  private getBasicAnalysis(error: EnhancedError): ErrorAnalysis {
    return {
      error,
      impact: {
        users: 1,
        systems: ['unknown'],
        businessImpact: 'medium'
      },
      recommendations: [
        'Check logs for additional context',
        'Verify system configuration',
        'Contact support if issue persists'
      ],
      prevention: [
        'Implement proper error handling',
        'Add input validation',
        'Monitor system health'
      ],
      priority: 'medium',
      confidence: 0.3
    };
  }

  // Handle error with recovery attempts
  async handleError(
    error: EnhancedError,
    recoveryFunction?: () => Promise<any>
  ): Promise<{
    success: boolean;
    result?: any;
    analysis?: ErrorAnalysis;
    attempts: number;
  }> {
    let attempts = 0;
    let lastError = error;

    // Log the error
    if (this.config.enableLogging) {
      this.logError(error);
    }

    // Analyze error
    const analysis = await this.analyzeError(error);

    // Check if custom handler exists
    if (this.config.customHandlers[error.type]) {
      try {
        await this.config.customHandlers[error.type](error);
      } catch (handlerError) {
        console.error('Custom error handler failed:', handlerError);
      }
    }

    // Attempt recovery if enabled and function provided
    if (this.config.enableRecovery && recoveryFunction) {
      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        attempts = attempt;
        
        try {
          const result = await Promise.race([
            recoveryFunction(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Recovery timeout')), this.config.timeout)
            )
          ]);
          
          return {
            success: true,
            result,
            analysis,
            attempts
          };
        } catch (recoveryError) {
          lastError = this.createEnhancedError(recoveryError, {
            type: error.type,
            severity: error.severity,
            additionalContext: {
              originalError: error.id,
              recoveryAttempt: attempt
            }
          });
          
          if (attempt < this.config.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
          }
        }
      }
    }

    return {
      success: false,
      analysis,
      attempts
    };
  }

  private logError(error: EnhancedError): void {
    const logEntry = {
      id: error.id,
      type: error.type,
      severity: error.severity,
      message: error.message,
      timestamp: error.timestamp.toISOString(),
      endpoint: error.endpoint,
      method: error.method,
      userId: error.userId,
      context: error.context
    };

    // Log based on severity
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', logEntry);
        break;
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH ERROR:', logEntry);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️  MEDIUM ERROR:', logEntry);
        break;
      case ErrorSeverity.LOW:
        console.info('ℹ️  LOW ERROR:', logEntry);
        break;
    }
  }

  // Create Next.js error response
  createErrorResponse(
    error: EnhancedError,
    analysis?: ErrorAnalysis,
    options: {
      includeStack?: boolean;
      includeDetails?: boolean;
      includeSuggestions?: boolean;
    } = {}
  ): NextResponse {
    const {
      includeStack = process.env.NODE_ENV === 'development',
      includeDetails = process.env.NODE_ENV === 'development',
      includeSuggestions = true
    } = options;

    const response: any = {
      error: {
        id: error.id,
        type: error.type,
        severity: error.severity,
        message: error.message,
        timestamp: error.timestamp.toISOString()
      }
    };

    if (includeSuggestions && analysis?.recommendations) {
      response.error.suggestions = analysis.recommendations;
    }

    if (includeDetails && error.details) {
      response.error.details = error.details;
    }

    if (includeStack && error.stack) {
      response.error.stack = error.stack;
    }

    // Determine HTTP status code
    let statusCode = 500;
    switch (error.type) {
      case ErrorType.VALIDATION:
        statusCode = 400;
        break;
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        statusCode = 401;
        break;
      case ErrorType.RATE_LIMIT:
        statusCode = 429;
        break;
      case ErrorType.NOT_FOUND:
        statusCode = 404;
        break;
      default:
        statusCode = 500;
    }

    return NextResponse.json(response, { status: statusCode });
  }

  // Get error metrics
  getMetrics(): {
    totalErrors: number;
    errorByType: Record<ErrorType, number>;
    errorBySeverity: Record<ErrorSeverity, number>;
    recentErrors: EnhancedError[];
  } {
    const errorByType: Record<ErrorType, number> = {} as any;
    const errorBySeverity: Record<ErrorSeverity, number> = {} as any;
    
    // Initialize counters
    Object.values(ErrorType).forEach(type => {
      errorByType[type] = 0;
    });
    
    Object.values(ErrorSeverity).forEach(severity => {
      errorBySeverity[severity] = 0;
    });

    // Count errors
    this.errorStore.forEach(error => {
      errorByType[error.type]++;
      errorBySeverity[error.severity]++;
    });

    // Get recent errors (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentErrors = Array.from(this.errorStore.values())
      .filter(error => error.timestamp > oneHourAgo)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalErrors: this.errorStore.size,
      errorByType,
      errorBySeverity,
      recentErrors
    };
  }

  // Clear old errors (prevent memory leaks)
  cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    
    for (const [id, error] of this.errorStore.entries()) {
      if (error.timestamp < cutoff) {
        this.errorStore.delete(id);
      }
    }
  }
}

// Global error handler instance
const globalErrorHandler = new AIErrorHandler();

// Middleware for Next.js API routes
export const withErrorHandling = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    recoveryFunction?: () => Promise<any>;
    customHandlers?: Record<ErrorType, (error: EnhancedError) => Promise<void>>;
  } = {}
) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      // Create enhanced error
      const enhancedError = globalErrorHandler.createEnhancedError(error, {
        endpoint: req.nextUrl.pathname,
        method: req.method,
        additionalContext: {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.ip
        }
      });

      // Handle error with recovery
      const result = await globalErrorHandler.handleError(
        enhancedError,
        options.recoveryFunction
      );

      // If recovery succeeded, return the result
      if (result.success && result.result) {
        return result.result;
      }

      // Return error response
      return globalErrorHandler.createErrorResponse(
        enhancedError,
        result.analysis
      );
    }
  };
};

// Utility functions for common error scenarios
export const ErrorUtils = {
  // Create validation error
  createValidationError(message: string, details?: any): EnhancedError {
    return globalErrorHandler.createEnhancedError(message, {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.MEDIUM
    });
  },

  // Create authentication error
  createAuthenticationError(message: string, details?: any): EnhancedError {
    return globalErrorHandler.createEnhancedError(message, {
      type: ErrorType.AUTHENTICATION,
      severity: ErrorSeverity.HIGH
    });
  },

  // Create authorization error
  createAuthorizationError(message: string, details?: any): EnhancedError {
    return globalErrorHandler.createEnhancedError(message, {
      type: ErrorType.AUTHORIZATION,
      severity: ErrorSeverity.HIGH
    });
  },

  // Create database error
  createDatabaseError(message: string, details?: any): EnhancedError {
    return globalErrorHandler.createEnhancedError(message, {
      type: ErrorType.DATABASE,
      severity: ErrorSeverity.HIGH
    });
  },

  // Create network error
  createNetworkError(message: string, details?: any): EnhancedError {
    return globalErrorHandler.createEnhancedError(message, {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM
    });
  },

  // Wrap async functions with error handling
  wrapAsync: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: {
      recoveryFunction?: () => Promise<R>;
      customHandlers?: Record<ErrorType, (error: EnhancedError) => Promise<void>>;
    } = {}
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        const enhancedError = globalErrorHandler.createEnhancedError(error);
        
        const result = await globalErrorHandler.handleError(
          enhancedError,
          options.recoveryFunction
        );

        if (result.success && result.result) {
          return result.result;
        }

        throw error;
      }
    };
  }
};

// Export for direct usage
export { AIErrorHandler, ErrorType, ErrorSeverity };
export default globalErrorHandler;