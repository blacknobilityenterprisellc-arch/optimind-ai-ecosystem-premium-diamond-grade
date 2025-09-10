import { db } from './db';

// Rate limiting interface
interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remaining: number;
  resetTime: Date;
}

// Rate limit configuration interface
interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
}

// In-memory rate limit store (for production, use Redis)
const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetTime: number;
  }
>();

// Clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export async function checkRateLimit(
  userId: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const windowStart = now - config.window;

  // Get current rate limit data
  let rateData = rateLimitStore.get(key);

  // Reset if window has expired
  if (!rateData || rateData.resetTime < now) {
    rateData = {
      count: 0,
      resetTime: now + config.window,
    };
    rateLimitStore.set(key, rateData);
  }

  // Check if limit exceeded
  if (rateData.count >= config.requests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((rateData.resetTime - now) / 1000),
      remaining: 0,
      resetTime: new Date(rateData.resetTime),
    };
  }

  // Increment count
  rateData.count++;
  rateLimitStore.set(key, rateData);

  return {
    allowed: true,
    remaining: config.requests - rateData.count,
    resetTime: new Date(rateData.resetTime),
  };
}

export async function getUserCredits(userId: string): Promise<number> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return user?.credits || 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
}

export async function deductUserCredits(userId: string, credits: number): Promise<number> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < credits) {
      throw new EnhancedError('Insufficient credits');
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: credits,
        },
      },
      select: { credits: true },
    });

    // Log credit deduction
    await db.creditTransaction.create({
      data: {
        userId,
        amount: -credits,
        type: 'CONTENT_GENERATION',
        description: `Content generation cost: ${credits} credits`,
      },
    });

    return updatedUser.credits;
  } catch (error) {
    console.error('Error deducting user credits:', error);
    throw error;
  }
}

export async function addUserCredits(
  userId: string,
  credits: number,
  description: string
): Promise<number> {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: credits,
        },
      },
      select: { credits: true },
    });

    // Log credit addition
    await db.creditTransaction.create({
      data: {
        userId,
        amount: credits,
        type: 'CREDIT_PURCHASE',
        description,
      },
    });

    return updatedUser.credits;
  } catch (error) {
    console.error('Error adding user credits:', error);
    throw error;
  }
}

// Get user's rate limit status
export async function getUserRateLimitStatus(userId: string): Promise<{
  contentGeneration: RateLimitResult;
  dailyLimit: { used: number; limit: number; resetTime: Date };
}> {
  const contentGeneration = await checkRateLimit(userId, 'content_generation', {
    requests: 100,
    window: 60 * 60 * 1000, // 1 hour
  });

  // Get daily usage
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dailyUsage = await db.contentGeneration.count({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { dailyLimit: true },
  });

  return {
    contentGeneration,
    dailyLimit: {
      used: dailyUsage,
      limit: user?.dailyLimit || 100,
      resetTime: tomorrow,
    },
  };
}

// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
