/**
 * OptiMind AI Ecosystem - SecureVault KMS Integration Interface
 * Premium Diamond Grade Key Management Service Integration for SecureVault
 *
 * This interface defines the contract for KMS integration with the SecureVault system,
 * providing enterprise-grade key management capabilities.
 */

export interface SecureStorageResult {
  imageId: string;
  bucket: string;
  objectKey: string;
  dekWrapped: string;
  dekId?: string;
  createdAt: string;
  location?: string;
  versionId?: string;
  checksum?: string;
  size?: number;
}

export interface DeletionCertificate {
  imageId: string;
  deletedBy: string;
  deletedAt: string;
  signature: string;
  reason: string;
}

export interface SecureVaultKMSIntegration {
  /**
   * Get the master key ID for this KMS integration
   */
  getMasterKeyId(): string;

  /**
   * Generate a new data encryption key (DEK) wrapped by the master key
   */
  generateDataKey(): Promise<{ wrappedKey: string; plaintextKey?: string }>;

  /**
   * Unwrap a data encryption key using the master key
   */
  unwrapDataKey(wrappedKey: string): Promise<Buffer>;

  /**
   * Sign data using the master key
   */
  signData(data: Buffer): Promise<{ signature: string; keyId: string }>;

  /**
   * Schedule key deletion for secure crypto-erase
   */
  scheduleKeyDeletion(keyId: string, pendingWindowInDays: number): Promise<void>;

  /**
   * Get health status of the KMS integration
   */
  getHealthStatus(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }>;

  /**
   * Rotate the master key
   */
  rotateMasterKey(): Promise<string>;
}

export interface KMSConfig {
  provider: 'aws' | 'azure' | 'gcp' | 'hashicorp' | 'on-premises';
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  projectId?: string;
  keyRing?: string;
  keyName?: string;
  version?: string;
  timeout?: number;
  retries?: number;
}

/**
 * Factory function to create KMS integration instance
 */
export async function getKMSIntegration(config?: KMSConfig): Promise<SecureVaultKMSIntegration> {
  // Import dynamically to avoid circular dependencies
  const { KMSIntegration, SecureVaultKMSIntegrationAdapter } = await import('./kms-integration');
  
  const kmsConfig: KMSConfig = config || {
    provider: 'aws',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock-secret-key',
  };

  const integration = new KMSIntegration(kmsConfig);
  await integration.initialize();
  await integration.integrateWithSecureVault();
  
  return new SecureVaultKMSIntegrationAdapter(integration);
}