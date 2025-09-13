
// AI-Generated Rate Limiting
export class AIRateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier);

    if (!userRequests) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > userRequests.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userRequests.count >= this.maxRequests) {
      return false;
    }

    userRequests.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier);
    if (!userRequests) return this.maxRequests;
    
    if (Date.now() > userRequests.resetTime) return this.maxRequests;
    
    return Math.max(0, this.maxRequests - userRequests.count);
  }
}

export const aiRateLimiter = new AIRateLimiter();

// Export the missing functions that are being imported
export const authRateLimiter = new AIRateLimiter(10, 60000); // 10 requests per minute for auth

export const withRateLimit = (handler: any, options: { maxRequests?: number; windowMs?: number } = {}) => {
  const limiter = new AIRateLimiter(options.maxRequests || 100, options.windowMs || 60000);
  
  return async (req: any, res: any, ...args: any[]) => {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!limiter.isAllowed(identifier)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    return handler(req, res, ...args);
  };
};
