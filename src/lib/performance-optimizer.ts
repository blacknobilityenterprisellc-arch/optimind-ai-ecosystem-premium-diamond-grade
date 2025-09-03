/**
 * Diamond-Grade Performance Optimization System
 * 
 * Comprehensive performance optimization system with caching,
 * monitoring, and optimization strategies.
 * 
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { performance } from 'perf_hooks';

// Performance metrics interface
export interface PerformanceMetrics {
  requestCount: number;
  responseTime: {
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
  };
  errorRate: number;
  throughput: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage: number;
}

// Cache interface
export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;
}

// Memory cache implementation
export class MemoryCache implements Cache {
  private cache = new Map<string, { value: any; expires: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private defaultTTL: number = 3600000) { // 1 hour default
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }
    
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

// Performance monitor
export class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>();
  private requestTimes = new Map<string, number[]>();
  private errorCounts = new Map<string, number>();
  private requestCounts = new Map<string, number>();

  constructor(private windowSize: number = 60000) { // 1 minute window
    // Start periodic cleanup
    setInterval(() => this.cleanup(), this.windowSize);
  }

  // Record request start time
  startRequest(endpoint: string): string {
    const requestId = this.generateRequestId();
    this.requestTimes.set(requestId, [performance.now(), endpoint]);
    return requestId;
  }

  // Record request end time
  endRequest(requestId: string, isError: boolean = false): void {
    const requestData = this.requestTimes.get(requestId);
    
    if (!requestData) {
      return;
    }

    const [startTime, endpoint] = requestData;
    const responseTime = performance.now() - startTime;

    // Update response times
    if (!this.requestTimes.has(endpoint)) {
      this.requestTimes.set(endpoint, []);
    }
    
    const endpointTimes = this.requestTimes.get(endpoint) as number[];
    endpointTimes.push(responseTime);

    // Update request count
    const currentCount = this.requestCounts.get(endpoint) || 0;
    this.requestCounts.set(endpoint, currentCount + 1);

    // Update error count
    if (isError) {
      const currentErrors = this.errorCounts.get(endpoint) || 0;
      this.errorCounts.set(endpoint, currentErrors + 1);
    }

    // Clean up request data
    this.requestTimes.delete(requestId);
  }

  // Get current metrics
  getMetrics(endpoint?: string): PerformanceMetrics | Record<string, PerformanceMetrics> {
    if (endpoint) {
      return this.calculateMetrics(endpoint);
    }

    const allMetrics: Record<string, PerformanceMetrics> = {};
    
    for (const [ep] of this.requestCounts) {
      allMetrics[ep] = this.calculateMetrics(ep);
    }

    return allMetrics;
  }

  // Calculate metrics for specific endpoint
  private calculateMetrics(endpoint: string): PerformanceMetrics {
    const times = this.requestTimes.get(endpoint) as number[] || [];
    const requestCount = this.requestCounts.get(endpoint) || 0;
    const errorCount = this.errorCounts.get(endpoint) || 0;

    if (times.length === 0) {
      return {
        requestCount: 0,
        responseTime: { min: 0, max: 0, avg: 0, p95: 0, p99: 0 },
        errorRate: 0,
        throughput: 0,
        memoryUsage: { used: 0, total: 0, percentage: 0 },
        cpuUsage: 0
      };
    }

    const sortedTimes = [...times].sort((a, b) => a - b);
    const min = sortedTimes[0];
    const max = sortedTimes[sortedTimes.length - 1];
    const avg = sortedTimes.reduce((sum, time) => sum + time, 0) / sortedTimes.length;
    
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);
    const p95 = sortedTimes[p95Index] || avg;
    const p99 = sortedTimes[p99Index] || avg;

    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
    const throughput = requestCount / (this.windowSize / 1000); // requests per second

    const memoryUsage = process.memoryUsage();
    const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    return {
      requestCount,
      responseTime: { min, max, avg, p95, p99 },
      errorRate,
      throughput,
      memoryUsage: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: memoryPercentage
      },
      cpuUsage: process.cpuUsage().user / 1000000 // Convert to seconds
    };
  }

  // Cleanup old metrics
  private cleanup(): void {
    const cutoffTime = performance.now() - this.windowSize;

    // Clean up old request times
    for (const [requestId, [startTime, endpoint]] of this.requestTimes.entries()) {
      if (startTime < cutoffTime) {
        this.requestTimes.delete(requestId);
      }
    }

    // Reset counters for new window
    this.requestCounts.clear();
    this.errorCounts.clear();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Cache decorator
export function cache<T>(
  keyGenerator: (...args: any[]) => string,
  ttl: number = 3600000
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheInstance = new MemoryCache(ttl);

    descriptor.value = async function (...args: any[]): Promise<T> {
      const cacheKey = keyGenerator(...args);
      
      // Try to get from cache
      const cachedResult = await cacheInstance.get<T>(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cacheInstance.set(cacheKey, result, ttl);
      
      return result;
    };

    return descriptor;
  };
}

// Performance monitoring decorator
export function monitorPerformance(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const performanceMonitor = new PerformanceMonitor();

    descriptor.value = async function (...args: any[]) {
      const requestId = performanceMonitor.startRequest(endpoint);
      
      try {
        const result = await originalMethod.apply(this, args);
        performanceMonitor.endRequest(requestId, false);
        return result;
      } catch (error) {
        performanceMonitor.endRequest(requestId, true);
        throw error;
      }
    };

    return descriptor;
  };
}

// Rate limiter
export class RateLimiter {
  private requests = new Map<string, number[]>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private windowSize: number = 60000, // 1 minute
    private maxRequests: number = 100
  ) {
    this.cleanupInterval = setInterval(() => this.cleanup(), this.windowSize);
  }

  async isAllowed(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key)!;
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);

    // Check if user has exceeded limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

// Circuit breaker
export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private nextAttemptTime = 0;

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private recoveryTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.recoveryTimeout;
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}

// Request optimizer
export class RequestOptimizer {
  private cache: Cache;
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.cache = new MemoryCache();
    this.rateLimiter = new RateLimiter();
    this.circuitBreaker = new CircuitBreaker();
    this.performanceMonitor = new PerformanceMonitor();
  }

  // Optimized request execution
  async executeRequest<T>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      cache?: boolean;
      cacheKey?: string;
      ttl?: number;
      rateLimit?: boolean;
      circuitBreaker?: boolean;
    }
  ): Promise<T> {
    const requestId = this.performanceMonitor.startRequest(key);

    try {
      // Check cache first
      if (options?.cache && options.cacheKey) {
        const cachedResult = await this.cache.get<T>(options.cacheKey);
        if (cachedResult !== null) {
          this.performanceMonitor.endRequest(requestId, false);
          return cachedResult;
        }
      }

      // Check rate limit
      if (options?.rateLimit) {
        const isAllowed = await this.rateLimiter.isAllowed(key);
        if (!isAllowed) {
          throw new Error('Rate limit exceeded');
        }
      }

      // Execute operation with circuit breaker
      let result: T;
      
      if (options?.circuitBreaker) {
        result = await this.circuitBreaker.execute(operation);
      } else {
        result = await operation();
      }

      // Cache result if needed
      if (options?.cache && options.cacheKey) {
        await this.cache.set(options.cacheKey, result, options.ttl);
      }

      this.performanceMonitor.endRequest(requestId, false);
      return result;
    } catch (error) {
      this.performanceMonitor.endRequest(requestId, true);
      throw error;
    }
  }

  // Get performance metrics
  getMetrics(endpoint?: string) {
    return this.performanceMonitor.getMetrics(endpoint);
  }

  // Clear cache
  async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  // Get circuit breaker state
  getCircuitBreakerState(): string {
    return this.circuitBreaker.getState();
  }
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function
  debounce<T extends any[]>(
    func: (...args: T) => void,
    wait: number
  ): (...args: T) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle<T extends any[]>(
    func: (...args: T) => void,
    limit: number
  ): (...args: T) => void {
    let inThrottle: boolean;
    
    return (...args: T) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Memoize function
  memoize<T extends any[], R>(
    func: (...args: T) => R,
    keyGenerator?: (...args: T) => string
  ): (...args: T) => R {
    const cache = new Map<string, R>();
    
    return (...args: T) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    };
  },

  // Lazy load function
  lazyLoad<T>(factory: () => T): () => T {
    let cached: T | null = null;
    
    return () => {
      if (cached === null) {
        cached = factory();
      }
      return cached;
    };
  },

  // Batch processor
  batchProcessor<T, R>(
    processor: (items: T[]) => Promise<R[]>,
    options: {
      batchSize?: number;
      delay?: number;
    } = {}
  ) {
    const { batchSize = 10, delay = 100 } = options;
    let queue: T[] = [];
    let timeout: NodeJS.Timeout | null = null;

    return {
      add: (item: T): Promise<R> => {
        return new Promise((resolve, reject) => {
          queue.push(item);
          
          if (queue.length >= batchSize) {
            this.flush();
          } else if (!timeout) {
            timeout = setTimeout(() => this.flush(), delay);
          }
        });
      },

      flush: async (): Promise<void> => {
        if (queue.length === 0) return;

        const itemsToProcess = queue;
        queue = [];
        
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        try {
          await processor(itemsToProcess);
        } catch (error) {
          console.error('Batch processing failed:', error);
        }
      }
    };
  }
};

// Export all performance optimization utilities
export {
  MemoryCache,
  PerformanceMonitor,
  RateLimiter,
  CircuitBreaker,
  RequestOptimizer,
  performanceUtils
};