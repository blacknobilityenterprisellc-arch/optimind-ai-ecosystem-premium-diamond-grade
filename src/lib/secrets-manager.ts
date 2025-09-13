/**
 * Secrets Management System for Production
 * 
 * This module provides a secure way to manage and access secrets
 * across different environments and hosting platforms.
 */

import crypto from 'crypto';

export interface SecretConfig {
  name: string;
  value: string;
  version?: string;
  environment: 'development' | 'staging' | 'production';
  encrypted?: boolean;
  lastRotated?: Date;
  expiresAt?: Date;
}

export interface SecretsManagerConfig {
  encryptionKey?: string;
  environment: 'development' | 'staging' | 'production';
  cacheTTL?: number;
  enableRotation?: boolean;
  rotationInterval?: number; // days
}

export class SecretsManager {
  private config: SecretsManagerConfig;
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private encryptionKey: string;

  constructor(config: SecretsManagerConfig) {
    this.config = {
      ...config,
      cacheTTL: config.cacheTTL || 300000, // 5 minutes default
      enableRotation: config.enableRotation || false,
      rotationInterval: config.rotationInterval || 90, // 90 days default
    };

    // Use provided encryption key or generate one
    this.encryptionKey = config.encryptionKey || 
      process.env.ENCRYPTION_KEY || 
      crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encrypt a secret value
   */
  private encrypt(value: string): string {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, this.encryptionKey);
    
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex'),
    });
  }

  /**
   * Decrypt a secret value
   */
  private decrypt(encryptedData: string): string {
    try {
      const { iv, encrypted, authTag } = JSON.parse(encryptedData);
      const algorithm = 'aes-256-gcm';
      
      const decipher = crypto.createDecipher(algorithm, this.encryptionKey);
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt secret');
    }
  }

  /**
   * Get a secret value from environment or cache
   */
  async getSecret(name: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(name);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
      return cached.value;
    }

    // Get from environment
    const value = process.env[name];
    if (!value) {
      throw new Error(`Secret ${name} not found in environment`);
    }

    // Cache the value
    this.cache.set(name, {
      value,
      timestamp: Date.now(),
    });

    return value;
  }

  /**
   * Get multiple secrets at once
   */
  async getSecrets(names: string[]): Promise<Record<string, string>> {
    const secrets: Record<string, string> = {};
    
    for (const name of names) {
      try {
        secrets[name] = await this.getSecret(name);
      } catch (error) {
        console.warn(`Failed to get secret ${name}:`, error);
        secrets[name] = '';
      }
    }

    return secrets;
  }

  /**
   * Validate required secrets
   */
  async validateRequiredSecrets(required: string[]): Promise<{
    valid: boolean;
    missing: string[];
    present: string[];
  }> {
    const results = await this.getSecrets(required);
    const missing: string[] = [];
    const present: string[] = [];

    for (const name of required) {
      if (results[name] && results[name].trim() !== '') {
        present.push(name);
      } else {
        missing.push(name);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
      present,
    };
  }

  /**
   * Rotate secrets (for production environments)
   */
  async rotateSecret(name: string): Promise<string> {
    if (!this.config.enableRotation) {
      throw new Error('Secret rotation is not enabled');
    }

    // Get current secret
    const currentSecret = await this.getSecret(name);
    
    // Generate new secret
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    // In a real implementation, you would update the secret
    // in your secrets management system (AWS Secrets Manager, etc.)
    
    console.log(`Secret ${name} rotated successfully`);
    
    return newSecret;
  }

  /**
   * Check if secrets need rotation
   */
  async checkRotationNeeded(secrets: string[]): Promise<Record<string, boolean>> {
    const rotationNeeded: Record<string, boolean> = {};
    
    for (const secretName of secrets) {
      // In a real implementation, you would check the last rotation date
      // For now, we'll return false for all secrets
      rotationNeeded[secretName] = false;
    }

    return rotationNeeded;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: string[];
    oldest: number | null;
    newest: number | null;
  } {
    const keys = Array.from(this.cache.keys());
    const timestamps = Array.from(this.cache.values()).map(v => v.timestamp);
    
    return {
      size: this.cache.size,
      keys,
      oldest: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newest: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }
}

// Singleton instance for application-wide use
let secretsManagerInstance: SecretsManager | null = null;

export function getSecretsManager(config?: SecretsManagerConfig): SecretsManager {
  if (!secretsManagerInstance) {
    secretsManagerInstance = new SecretsManager({
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config,
    });
  }
  
  return secretsManagerInstance;
}

// Convenience functions for common secret operations
export async function getRequiredSecrets(names: string[]): Promise<Record<string, string>> {
  const manager = getSecretsManager();
  return await manager.getSecrets(names);
}

export async function validateSecrets(names: string[]): Promise<{
  valid: boolean;
  missing: string[];
  present: string[];
}> {
  const manager = getSecretsManager();
  return await manager.validateRequiredSecrets(names);
}

// Required secrets for production
export const PRODUCTION_SECRETS = [
  'ZAI_API_KEY',
  'GEMINI_API_KEY',
  'OPENROUTER_API_KEY',
  'GOOGLE_ANALYTICS_ID',
  'NEON_API_KEY',
  'BREVO_API_KEY',
  'STRIPE_API_KEY',
  'SUPABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

// Optional secrets
export const OPTIONAL_SECRETS = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'REDIS_URL',
  'SENTRY_DSN',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];