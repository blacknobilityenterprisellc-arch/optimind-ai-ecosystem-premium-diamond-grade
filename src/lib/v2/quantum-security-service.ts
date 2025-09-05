/**
 * OptiMind AI Ecosystem - Quantum Security Service v2.0
 * Premium Diamond Grade Quantum Security Service Layer
 * 
 * This service provides high-level quantum security operations with
 * enterprise-grade authentication, authorization, and audit logging.
 */

import { prisma } from '@/lib/db';

import { quantumSecurityV2, type QuantumKeyPair, type QuantumSecureMessage } from './quantum-security';

export interface QuantumSecurityRequest {
  operation: 'generate_keys' | 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'hash';
  data?: string;
  keyId?: string;
  userId: string;
  signature?: string;
  metadata?: Record<string, any>;
}

export interface QuantumSecurityResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
  operation: string;
  quantumResistant: boolean;
}

export interface QuantumKeyManagementRequest {
  userId: string;
  action: 'create' | 'rotate' | 'revoke' | 'list';
  keyId?: string;
  expiresInSeconds?: number;
}

export interface QuantumAuditRequest {
  userId: string;
  operation: string;
  resource: string;
  success: boolean;
  details?: Record<string, any>;
  startTime?: Date;
  endTime?: Date;
}

class QuantumSecurityServiceV2 {
  private readonly serviceName = 'QuantumSecurityServiceV2';
  private readonly maxKeyLifetime = 86400; // 24 hours
  private readonly maxAuditEntries = 10000;

  /**
   * Execute quantum security operation
   */
  async executeOperation(request: QuantumSecurityRequest): Promise<QuantumSecurityResponse> {
    const startTime = Date.now();
    
    try {
      // Validate user authentication
      await this.validateUser(request.userId);
      
      // Execute operation
      let result: any;
      const operationSuccess = true;
      
      switch (request.operation) {
        case 'generate_keys':
          result = await this.handleKeyGeneration(request);
          break;
        case 'encrypt':
          result = await this.handleEncryption(request);
          break;
        case 'decrypt':
          result = await this.handleDecryption(request);
          break;
        case 'sign':
          result = await this.handleSigning(request);
          break;
        case 'verify':
          result = await this.handleVerification(request);
          break;
        case 'hash':
          result = await this.handleHashing(request);
          break;
        default:
          throw new Error(`Unsupported operation: ${request.operation}`);
      }

      // Log successful operation
      await this.logAudit({
        userId: request.userId,
        operation: request.operation,
        resource: 'quantum_security',
        success: true,
        details: {
          ...request.metadata,
          executionTime: Date.now() - startTime,
          result: typeof result === 'object' ? 'success' : result
        }
      });

      return {
        success: true,
        data: result,
        timestamp: new Date(),
        operation: request.operation,
        quantumResistant: true
      };

    } catch (error) {
      // Log failed operation
      await this.logAudit({
        userId: request.userId,
        operation: request.operation,
        resource: 'quantum_security',
        success: false,
        details: {
          ...request.metadata,
          error: error.message,
          executionTime: Date.now() - startTime
        }
      });

      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
        operation: request.operation,
        quantumResistant: true
      };
    }
  }

  /**
   * Handle key generation
   */
  private async handleKeyGeneration(request: QuantumSecurityRequest): Promise<QuantumKeyPair> {
    const keyPair = await quantumSecurityV2.generateQuantumKeyPair(
      request.userId,
      request.metadata?.expiresInSeconds || this.maxKeyLifetime
    );

    // Store key metadata in database
    await prisma.securityKey.create({
      data: {
        userId: request.userId,
        keyId: keyPair.keyId,
        keyType: 'QUANTUM',
        publicKey: keyPair.publicKey,
        expiresAt: keyPair.expiresAt,
        metadata: {
          algorithm: 'lattice-based',
          strength: '256-bit',
          ...request.metadata
        }
      }
    });

    return keyPair;
  }

  /**
   * Handle encryption
   */
  private async handleEncryption(request: QuantumSecurityRequest): Promise<QuantumSecureMessage> {
    if (!request.data) {
      throw new Error('Data is required for encryption');
    }
    
    if (!request.keyId) {
      throw new Error('Key ID is required for encryption');
    }

    // Validate key exists and belongs to user
    await this.validateKeyOwnership(request.keyId, request.userId);

    const secureMessage = await quantumSecurityV2.encryptQuantumSecure(
      request.data,
      request.keyId,
      request.userId
    );

    return secureMessage;
  }

  /**
   * Handle decryption
   */
  private async handleDecryption(request: QuantumSecurityRequest): Promise<string> {
    if (!request.data) {
      throw new Error('Encrypted data is required for decryption');
    }

    const secureMessage: QuantumSecureMessage = typeof request.data === 'string' 
      ? JSON.parse(request.data) 
      : request.data;

    // Validate key exists and belongs to user
    await this.validateKeyOwnership(secureMessage.keyId, request.userId);

    const decrypted = await quantumSecurityV2.decryptQuantumSecure(
      secureMessage,
      request.userId
    );

    return decrypted;
  }

  /**
   * Handle signing
   */
  private async handleSigning(request: QuantumSecurityRequest): Promise<string> {
    if (!request.data) {
      throw new Error('Data is required for signing');
    }
    
    if (!request.keyId) {
      throw new Error('Key ID is required for signing');
    }

    // Validate key exists and belongs to user
    await this.validateKeyOwnership(request.keyId, request.userId);

    const signature = await quantumSecurityV2.quantumSign(
      request.data,
      request.keyId,
      request.userId
    );

    return signature;
  }

  /**
   * Handle verification
   */
  private async handleVerification(request: QuantumSecurityRequest): Promise<boolean> {
    if (!request.data) {
      throw new Error('Data is required for verification');
    }
    
    if (!request.signature) {
      throw new Error('Signature is required for verification');
    }
    
    if (!request.keyId) {
      throw new Error('Key ID is required for verification');
    }

    // Validate key exists and belongs to user
    await this.validateKeyOwnership(request.keyId, request.userId);

    const isValid = await quantumSecurityV2.quantumVerifySignature(
      request.data,
      request.signature,
      request.keyId,
      request.userId
    );

    return isValid;
  }

  /**
   * Handle hashing
   */
  private async handleHashing(request: QuantumSecurityRequest): Promise<{ hash: string; salt: string }> {
    if (!request.data) {
      throw new Error('Data is required for hashing');
    }

    const hashResult = await quantumSecurityV2.quantumHash(
      request.data,
      request.metadata?.salt
    );

    return hashResult;
  }

  /**
   * Key management operations
   */
  async manageKeys(request: QuantumKeyManagementRequest): Promise<{
    success: boolean;
    keys?: QuantumKeyPair[];
    message?: string;
    error?: string;
  }> {
    try {
      // Validate user authentication
      await this.validateUser(request.userId);

      switch (request.action) {
        case 'create':
          const newKey = await quantumSecurityV2.generateQuantumKeyPair(
            request.userId,
            request.expiresInSeconds || this.maxKeyLifetime
          );
          
          // Store in database
          await prisma.securityKey.create({
            data: {
              userId: request.userId,
              keyId: newKey.keyId,
              keyType: 'QUANTUM',
              publicKey: newKey.publicKey,
              expiresAt: newKey.expiresAt,
              metadata: {
                algorithm: 'lattice-based',
                strength: '256-bit',
                action: 'create'
              }
            }
          });

          return {
            success: true,
            keys: [newKey],
            message: 'Quantum key pair created successfully'
          };

        case 'rotate':
          // Revoke old key and create new one
          if (request.keyId) {
            await this.revokeKey(request.keyId, request.userId);
          }
          
          const rotatedKey = await quantumSecurityV2.generateQuantumKeyPair(
            request.userId,
            request.expiresInSeconds || this.maxKeyLifetime
          );
          
          // Store new key in database
          await prisma.securityKey.create({
            data: {
              userId: request.userId,
              keyId: rotatedKey.keyId,
              keyType: 'QUANTUM',
              publicKey: rotatedKey.publicKey,
              expiresAt: rotatedKey.expiresAt,
              metadata: {
                algorithm: 'lattice-based',
                strength: '256-bit',
                action: 'rotate',
                oldKeyId: request.keyId
              }
            }
          });

          return {
            success: true,
            keys: [rotatedKey],
            message: 'Quantum key pair rotated successfully'
          };

        case 'revoke':
          if (!request.keyId) {
            throw new Error('Key ID is required for revocation');
          }
          
          await this.revokeKey(request.keyId, request.userId);
          
          return {
            success: true,
            message: 'Quantum key pair revoked successfully'
          };

        case 'list':
          const userKeys = await prisma.securityKey.findMany({
            where: {
              userId: request.userId,
              keyType: 'QUANTUM',
              isActive: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          });

          // Convert to QuantumKeyPair format (without private keys)
          const keyPairs: QuantumKeyPair[] = userKeys.map(key => ({
            publicKey: key.publicKey,
            privateKey: '[REDACTED]',
            keyId: key.keyId,
            createdAt: key.createdAt,
            expiresAt: key.expiresAt
          }));

          return {
            success: true,
            keys: keyPairs,
            message: `Found ${keyPairs.length} quantum key pairs`
          };

        default:
          throw new Error(`Unsupported key management action: ${request.action}`);
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Revoke a quantum key
   */
  private async revokeKey(keyId: string, userId: string): Promise<void> {
    await prisma.securityKey.updateMany({
      where: {
        keyId,
        userId,
        isActive: true
      },
      data: {
        isActive: false,
        metadata: {
          revokedAt: new Date(),
          reason: 'user_revocation'
        }
      }
    });
  }

  /**
   * Get quantum security audit log
   */
  async getAuditLog(userId?: string, limit: number = 100): Promise<{
    success: boolean;
    audits?: any[];
    total: number;
    error?: string;
  }> {
    try {
      // Validate user if provided
      if (userId) {
        await this.validateUser(userId);
      }

      const audits = await prisma.auditLog.findMany({
        where: userId ? { userId } : {},
        orderBy: {
          timestamp: 'desc'
        },
        take: limit
      });

      return {
        success: true,
        audits: audits.map(audit => ({
          id: audit.id,
          operation: audit.operation,
          userId: audit.userId,
          resource: audit.resource,
          timestamp: audit.timestamp,
          success: audit.success,
          details: audit.details,
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent
        })),
        total: audits.length
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get quantum security metrics
   */
  async getSecurityMetrics(userId?: string): Promise<{
    success: boolean;
    metrics?: {
      activeKeys: number;
      totalOperations: number;
      successRate: number;
      quantumResistance: boolean;
      averageResponseTime: number;
    };
    error?: string;
  }> {
    try {
      // Validate user if provided
      if (userId) {
        await this.validateUser(userId);
      }

      // Get quantum security metrics
      const quantumMetrics = quantumSecurityV2.getSecurityMetrics();
      
      // Get database metrics
      const [totalKeys, totalOperations, successfulOperations] = await Promise.all([
        prisma.securityKey.count({
          where: {
            ...(userId && { userId }),
            keyType: 'QUANTUM',
            isActive: true
          }
        }),
        prisma.auditLog.count({
          where: {
            ...(userId && { userId }),
            operation: { startsWith: 'quantum_' }
          }
        }),
        prisma.auditLog.count({
          where: {
            ...(userId && { userId }),
            operation: { startsWith: 'quantum_' },
            success: true
          }
        })
      ]);

      const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;

      return {
        success: true,
        metrics: {
          activeKeys: userId ? totalKeys : quantumMetrics.activeKeys,
          totalOperations,
          successRate,
          quantumResistance: quantumMetrics.quantumResistance,
          averageResponseTime: 0 // Would need to calculate from audit logs
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Perform quantum security health check
   */
  async healthCheck(): Promise<{
    success: boolean;
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks?: {
      keyGeneration: boolean;
      encryption: boolean;
      hashing: boolean;
      signature: boolean;
      audit: boolean;
    };
    metrics?: any;
    error?: string;
  }> {
    try {
      const healthCheck = await quantumSecurityV2.healthCheck();

      return {
        success: true,
        status: healthCheck.status,
        checks: healthCheck.checks,
        metrics: healthCheck.metrics
      };

    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Generate user key pair (convenience method)
   */
  async generateUserKeyPair(userId: string, algorithm?: string, keySize?: number): Promise<QuantumKeyPair> {
    try {
      // Validate user exists
      await this.validateUser(userId);
      
      // Generate key pair using the key management system
      const result = await this.manageKeys({
        userId,
        action: 'create',
        expiresInSeconds: this.maxKeyLifetime
      });
      
      if (!result.success || !result.keys || result.keys.length === 0) {
        throw new Error(result.error || 'Failed to generate quantum key pair');
      }
      
      return result.keys[0];
    } catch (error) {
      throw new Error(`Failed to generate user key pair: ${error.message}`);
    }
  }

  /**
   * Validate user exists and is active
   */
  private async validateUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is not active');
    }
  }

  /**
   * Validate key ownership
   */
  private async validateKeyOwnership(keyId: string, userId: string): Promise<void> {
    const key = await prisma.securityKey.findFirst({
      where: {
        keyId,
        userId,
        keyType: 'QUANTUM',
        isActive: true
      }
    });

    if (!key) {
      throw new Error('Quantum key not found or access denied');
    }

    if (new Date() > key.expiresAt) {
      throw new Error('Quantum key has expired');
    }
  }

  /**
   * Log audit event
   */
  private async logAudit(audit: QuantumAuditRequest): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          operation: audit.operation,
          userId: audit.userId,
          resource: audit.resource,
          success: audit.success,
          details: audit.details || {},
          timestamp: audit.startTime || new Date(),
          ipAddress: '127.0.0.1', // Would get from request context
          userAgent: 'QuantumSecurityService/2.0'
        }
      });

      // Clean up old audit entries if needed
      const totalAudits = await prisma.auditLog.count();
      if (totalAudits > this.maxAuditEntries) {
        await prisma.auditLog.deleteMany({
          where: {
            timestamp: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Keep last 30 days
            }
          }
        });
      }

    } catch (error) {
      console.error('Failed to log quantum security audit:', error);
    }
  }

  /**
   * Cleanup expired keys
   */
  async cleanupExpiredKeys(): Promise<{
    success: boolean;
    cleanedKeys: number;
    error?: string;
  }> {
    try {
      const result = await prisma.securityKey.updateMany({
        where: {
          expiresAt: {
            lt: new Date()
          },
          isActive: true
        },
        data: {
          isActive: false,
          metadata: {
            cleanedAt: new Date(),
            reason: 'expired'
          }
        }
      });

      // Also cleanup in-memory keys
      quantumSecurityV2.cleanupExpiredKeys();

      return {
        success: true,
        cleanedKeys: result.count
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const quantumSecurityServiceV2 = new QuantumSecurityServiceV2();

// Export types and utilities
export type { 
  QuantumSecurityRequest, 
  QuantumSecurityResponse, 
  QuantumKeyManagementRequest, 
  QuantumAuditRequest 
};

// Export utility functions
export const createQuantumSecurityService = () => {
  return new QuantumSecurityServiceV2();
};

export default QuantumSecurityServiceV2;