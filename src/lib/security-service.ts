import crypto from 'crypto';
import { db } from './db';

export interface SecurityEvent {
  id: string;
  type: 'auth' | 'access' | 'scan' | 'upload' | 'delete' | 'breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  actionTaken?: string;
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  allowedOrigins: string[];
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  encryption: {
    algorithm: string;
    keyRotationDays: number;
  };
}

export class SecurityService {
  private static instance: SecurityService;
  private config: SecurityConfig;
  private loginAttempts: Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }> = new Map();
  private rateLimiter: Map<string, { count: number; resetTime: Date }> = new Map();

  private constructor() {
    this.config = {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 120,
      allowedOrigins: ['http://localhost:3000', 'https://yourdomain.com'],
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 100,
        burstLimit: 150
      },
      encryption: {
        algorithm: 'aes-256-gcm',
        keyRotationDays: 90
      }
    };
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Authentication Security
  async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const newSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, newSalt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt: newSalt };
  }

  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return newHash === hash;
  }

  async checkLoginAttempts(email: string, ipAddress: string): Promise<{ allowed: boolean; remainingAttempts: number; lockedUntil?: Date }> {
    const key = `${email}:${ipAddress}`;
    const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: new Date() };

    // Check if account is locked
    if (attempts.lockedUntil && attempts.lockedUntil > new Date()) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: attempts.lockedUntil
      };
    }

    // Reset attempts if last attempt was more than lockout duration ago
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
    if (timeSinceLastAttempt > this.config.lockoutDuration * 60 * 1000) {
      attempts.count = 0;
    }

    const remainingAttempts = Math.max(0, this.config.maxLoginAttempts - attempts.count - 1);
    
    return {
      allowed: remainingAttempts > 0,
      remainingAttempts
    };
  }

  async recordLoginAttempt(email: string, ipAddress: string, success: boolean): Promise<void> {
    const key = `${email}:${ipAddress}`;
    const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: new Date() };

    if (!success) {
      attempts.count++;
      attempts.lastAttempt = new Date();

      if (attempts.count >= this.config.maxLoginAttempts) {
        attempts.lockedUntil = new Date(Date.now() + this.config.lockoutDuration * 60 * 1000);
        
        // Log security event
        await this.logSecurityEvent({
          type: 'auth',
          severity: 'high',
          ipAddress,
          userAgent: 'Unknown',
          details: { email, reason: 'Account locked due to multiple failed attempts' },
          timestamp: new Date(),
          resolved: false
        });
      }
    } else {
      // Reset on successful login
      attempts.count = 0;
      attempts.lockedUntil = undefined;
    }

    this.loginAttempts.set(key, attempts);
  }

  // Rate Limiting
  async checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    if (!this.config.rateLimiting.enabled) {
      return { allowed: true, remaining: Infinity, resetTime: new Date(Date.now() + 60000) };
    }

    const now = new Date();
    const minuteStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    const key = `${identifier}:${minuteStart.getTime()}`;

    const record = this.rateLimiter.get(key) || { count: 0, resetTime: new Date(minuteStart.getTime() + 60000) };

    if (record.count >= this.config.rateLimiting.requestsPerMinute) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    return {
      allowed: true,
      remaining: this.config.rateLimiting.requestsPerMinute - record.count,
      resetTime: record.resetTime
    };
  }

  async incrementRateLimit(identifier: string): Promise<void> {
    if (!this.config.rateLimiting.enabled) return;

    const now = new Date();
    const minuteStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    const key = `${identifier}:${minuteStart.getTime()}`;

    const record = this.rateLimiter.get(key) || { count: 0, resetTime: new Date(minuteStart.getTime() + 60000) };
    record.count++;

    this.rateLimiter.set(key, record);
  }

  // Encryption
  encrypt(data: string, key?: string): { encrypted: string; iv: string; tag: string } {
    const encryptionKey = key || crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.config.encryption.algorithm, encryptionKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  decrypt(encryptedData: string, iv: string, tag: string, key: string): string {
    const decipher = crypto.createDecipher(this.config.encryption.algorithm, key);
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Security Event Logging
  async logSecurityEvent(event: Omit<SecurityEvent, 'id'>): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        ...event,
        id: crypto.randomUUID()
      };

      // Log to console for immediate visibility
      console.log(`[SECURITY] ${event.type.toUpperCase()} - ${event.severity.toUpperCase()}:`, {
        ...event,
        timestamp: event.timestamp.toISOString()
      });

      // Send alert for critical events
      if (event.severity === 'critical') {
        await this.sendSecurityAlert(securityEvent);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    // Implement alert sending logic (email, webhook, etc.)
    console.log('🚨 CRITICAL SECURITY ALERT:', event);
  }

  // Input Validation and Sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Session Management
  generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateSessionToken(token: string): boolean {
    // Basic validation - in production, you'd want to check against stored sessions
    return token.length === 64 && /^[a-f0-9]+$/.test(token);
  }

  // Configuration Management
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Security Health Check
  async securityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: {
      rateLimiterSize: number;
      loginAttemptsSize: number;
      recentSecurityEvents: number;
      configValidation: boolean;
    };
    recommendations: string[];
  }> {
    const checks = {
      rateLimiterSize: this.rateLimiter.size,
      loginAttemptsSize: this.loginAttempts.size,
      recentSecurityEvents: 0,
      configValidation: this.validateConfig()
    };

    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (checks.recentSecurityEvents > 5) {
      status = 'critical';
      recommendations.push('High number of critical security events detected. Immediate investigation required.');
    } else if (checks.recentSecurityEvents > 2) {
      status = 'warning';
      recommendations.push('Multiple critical security events detected. Review security logs.');
    }

    if (checks.rateLimiterSize > 10000) {
      status = status === 'critical' ? 'critical' : 'warning';
      recommendations.push('Rate limiter cache is large. Consider implementing cleanup mechanisms.');
    }

    if (!checks.configValidation) {
      status = 'critical';
      recommendations.push('Security configuration validation failed. Review configuration.');
    }

    return {
      status,
      checks,
      recommendations
    };
  }

  private validateConfig(): boolean {
    return (
      this.config.maxLoginAttempts > 0 &&
      this.config.lockoutDuration > 0 &&
      this.config.sessionTimeout > 0 &&
      this.config.allowedOrigins.length > 0 &&
      this.config.rateLimiting.requestsPerMinute > 0 &&
      this.config.encryption.algorithm.length > 0
    );
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance();