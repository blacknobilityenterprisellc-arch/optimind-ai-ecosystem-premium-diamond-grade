import { NextRequest, NextResponse } from 'next/server';
import { aiRateLimiter } from './ai-rate-limiter';

interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Enhanced Rate Limiting Middleware for API Security
 * Protects against DDoS attacks and abuse
 */
export class ApiRateLimitMiddleware {
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig = {}) {
    this.config = {
      windowMs: config.windowMs || 60 * 1000, // 1 minute default
      maxRequests: config.maxRequests || 100, // 100 requests per minute
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      standardHeaders: config.standardHeaders || true,
      legacyHeaders: config.legacyHeaders || false,
    };
  }

  /**
   * Extract client identifier from request
   */
  private getClientId(request: NextRequest): string {
    // Try to get client IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    // Use the most reliable IP source
    const ip = cfConnectingIp || realIp || forwarded || 'unknown';
    
    // If forwarded contains multiple IPs, take the first one
    return ip.split(',')[0].trim();
  }

  /**
   * Generate rate limit headers
   */
  private generateHeaders(limit: number, remaining: number, reset: number): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (this.config.standardHeaders) {
      headers['X-RateLimit-Limit'] = limit.toString();
      headers['X-RateLimit-Remaining'] = remaining.toString();
      headers['X-RateLimit-Reset'] = reset.toString();
    }
    
    if (this.config.legacyHeaders) {
      headers['X-Rate-Limit-Limit'] = limit.toString();
      headers['X-Rate-Limit-Remaining'] = remaining.toString();
      headers['X-Rate-Limit-Reset'] = reset.toString();
    }
    
    return headers;
  }

  /**
   * Check if request is allowed
   */
  public async checkRateLimit(request: NextRequest): Promise<RateLimitResponse> {
    const clientId = this.getClientId(request);
    
    // Check if request is allowed
    const isAllowed = aiRateLimiter.isAllowed(clientId);
    const remaining = aiRateLimiter.getRemainingRequests(clientId);
    
    const response: RateLimitResponse = {
      success: isAllowed,
      limit: this.config.maxRequests,
      remaining,
      reset: Date.now() + this.config.windowMs,
    };
    
    if (!isAllowed) {
      response.retryAfter = Math.ceil(this.config.windowMs / 1000);
    }
    
    return response;
  }

  /**
   * Create rate limited response
   */
  public createRateLimitedResponse(rateLimitInfo: RateLimitResponse): NextResponse {
    const headers = this.generateHeaders(
      rateLimitInfo.limit,
      rateLimitInfo.remaining,
      rateLimitInfo.reset
    );
    
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitInfo.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'Retry-After': rateLimitInfo.retryAfter?.toString() || '60',
        },
      }
    );
  }

  /**
   * Middleware function for Next.js API routes
   */
  public middleware() {
    return async (request: NextRequest): Promise<NextResponse | null> => {
      try {
        const rateLimitInfo = await this.checkRateLimit(request);
        
        if (!rateLimitInfo.success) {
          return this.createRateLimitedResponse(rateLimitInfo);
        }
        
        // Add rate limit headers to successful responses
        const headers = this.generateHeaders(
          rateLimitInfo.limit,
          rateLimitInfo.remaining,
          rateLimitInfo.reset
        );
        
        // Return null to continue processing
        // The calling function should add these headers to the response
        return null;
      } catch (error) {
        console.error('Rate limiting error:', error);
        // In case of error, allow the request to proceed
        return null;
      }
    };
  }
}

// Pre-configured rate limiters for different use cases
export const strictRateLimit = new ApiRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // Strict limit for sensitive operations
});

export const standardRateLimit = new ApiRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // Standard limit for regular operations
});

export const relaxedRateLimit = new ApiRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 1000, // Relaxed limit for less sensitive operations
});

/**
 * Higher-order function to apply rate limiting to API handlers
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  rateLimiter: ApiRateLimitMiddleware = standardRateLimit
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimiter.middleware()(request);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to the response
    const rateLimitInfo = await rateLimiter.checkRateLimit(request);
    const headers = rateLimiter.generateHeaders(
      rateLimitInfo.limit,
      rateLimitInfo.remaining,
      rateLimitInfo.reset
    );
    
    // Clone the response to add headers
    const responseClone = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...headers,
      },
    });
    
    return responseClone;
  };
}