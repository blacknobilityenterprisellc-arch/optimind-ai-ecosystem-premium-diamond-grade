
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
