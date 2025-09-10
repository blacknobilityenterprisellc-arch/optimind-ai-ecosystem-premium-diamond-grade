// AI-Powered Rate Limiting Middleware for OptiMind AI Ecosystem
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  onLimitReached?: (req: NextRequest, key: string) => void; // Callback when limit is reached
  aiOptimization?: boolean; // Enable AI-powered optimization
}

interface RateLimitData {
  count: number;
  resetTime: number;
  lastRequest: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitData>();
  private config: RateLimitConfig;
  private zai: ZAI | null = null;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15 minutes default
      maxRequests: 100, // 100 requests default
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      aiOptimization: true,
      ...config
    };

    // Initialize ZAI for AI optimization
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      if (this.config.aiOptimization) {
        this.zai = await ZAI.create();
      }
    } catch (error) {
      console.warn('Failed to initialize ZAI for rate limiting:', error);
    }
  }

  private generateKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default key generation: IP + User Agent + Endpoint
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const url = req.nextUrl.pathname;
    
    return `${ip}:${userAgent}:${url}`;
  }

  private async getOptimizedLimit(key: string): Promise<number> {
    if (!this.zai || !this.config.aiOptimization) {
      return this.config.maxRequests;
    }

    try {
      // Use AI to analyze request patterns and optimize limits
      const analysis = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an AI rate limiting optimizer. Analyze request patterns and suggest optimal rate limits.'
          },
          {
            role: 'user',
            content: `Analyze rate limit key: ${key}. Current limit: ${this.config.maxRequests}. Suggest optimal limit based on typical usage patterns.`
          }
        ],
        max_tokens: 50
      });

      const suggestion = analysis.choices[0]?.message?.content;
      const match = suggestion?.match(/(\d+)/);
      
      if (match) {
        const suggestedLimit = parseInt(match[1]);
        return Math.max(10, Math.min(suggestedLimit, this.config.maxRequests * 2));
      }
    } catch (error) {
      console.warn('AI optimization failed, using default limit:', error);
    }

    return this.config.maxRequests;
  }

  private cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key);
      }
    }
  }

  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    total: number;
    key: string;
  }> {
    this.cleanupExpiredEntries();
    
    const key = this.generateKey(req);
    const now = Date.now();
    let data = this.store.get(key);

    // Initialize new entry
    if (!data || now > data.resetTime) {
      const optimizedLimit = await this.getOptimizedLimit(key);
      data = {
        count: 0,
        resetTime: now + this.config.windowMs,
        lastRequest: now
      };
      this.store.set(key, data);
    }

    // Check if limit exceeded
    const isAllowed = data.count < (await this.getOptimizedLimit(key));
    
    if (isAllowed) {
      data.count++;
      data.lastRequest = now;
      this.store.set(key, data);
    } else if (this.config.onLimitReached) {
      this.config.onLimitReached(req, key);
    }

    return {
      allowed: isAllowed,
      remaining: Math.max(0, (await this.getOptimizedLimit(key)) - data.count),
      resetTime: data.resetTime,
      total: await this.getOptimizedLimit(key),
      key
    };
  }
}

// Create rate limiter instances for different use cases
export const createRateLimiter = (config: RateLimitConfig) => new RateLimiter(config);

// Pre-configured rate limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  aiOptimization: true,
  onLimitReached: (req, key) => {
    console.warn(`Rate limit exceeded for key: ${key}`);
  }
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Strict limit for auth endpoints
  aiOptimization: false, // No AI optimization for security
  onLimitReached: (req, key) => {
    console.warn(`Auth rate limit exceeded for key: ${key}`);
  }
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // Strict limit for file uploads
  aiOptimization: true,
  onLimitReached: (req, key) => {
    console.warn(`Upload rate limit exceeded for key: ${key}`);
  }
});

// Middleware function for Next.js API routes
export const withRateLimit = (
  limiter: RateLimiter,
  options: {
    skip?: (req: NextRequest) => boolean;
    errorHandler?: (req: NextRequest, key: string) => NextResponse;
  } = {}
) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Skip if conditions met
    if (options.skip && options.skip(req)) {
      return null;
    }

    const result = await limiter.checkLimit(req);

    if (!result.allowed) {
      if (options.errorHandler) {
        return options.errorHandler(req, result.key);
      }

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          remaining: result.remaining,
          total: result.total
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.total.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', result.total.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return null; // Allow request to proceed
  };
};

// AI-powered adaptive rate limiting
export const adaptiveRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  aiOptimization: true,
  keyGenerator: (req) => {
    // Advanced key generation considering user behavior patterns
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const url = req.nextUrl.pathname;
    const method = req.method;
    const hour = new Date().getHours();
    
    return `${ip}:${userAgent}:${url}:${method}:${hour}`;
  }
});

// Export for easy usage
export default RateLimiter;