/**
 * secureVault.ts
 * Envelope encryption + DEK lifecycle + crypto-erase + deletion certificate generation.
 *
 * NOTE: This is an infra-agnostic starter. Replace wrapKey/unwrapKey with your cloud KMS/HSM calls.
 */
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SecureStorageResult, DeletionCertificate } from '../types/index';

// ---------- Configuration ----------
// Set these in your environment in production
const SIGNING_KEY_PEM = process.env.PRIVATE_SIGNING_KEY_PEM || ''; // PEM string of RSA/EC key or empty for dev
const KMS_KEY_ID = process.env.KEK_KEY_ID || 'kms-key-placeholder'; // for production HSM/KMS key id
const DEFAULT_BUCKET = process.env.STORAGE_BUCKET || 'ai-premium-staging';

// ---------- Helpers ----------
function nowISO(): string {
  return new Date().toISOString();
}

function base64(b: Buffer | string) {
  return Buffer.from(b).toString('base64');
}

// ---------- Abstract KMS/HSM wrappers (TODO: implement with real KMS) ----------
export interface KmsClient {
  wrapKey(kekId: string, dek: Buffer): Promise<{ wrappedKey: string; dekId?: string }>;
  unwrapKey(kekId: string, wrappedKeyB64: string): Promise<Buffer>;
  signPayload(payload: Buffer): Promise<string>; // returns base64 signature
}

/**
 * Dummy in-memory KMS implementation for dev.
 * Replace with AWS KMS / Google KMS / Azure KeyVault integration.
 */
export class DevKmsClient implements KmsClient {
  privateKeyPem?: string;
  constructor(privateKeyPem?: string) {
    this.privateKeyPem = privateKeyPem;
  }
  
  async wrapKey(_kekId: string, dek: Buffer): Promise<{ wrappedKey: string; dekId?: string }> {
    // For dev: "wrap" = base64(dek) — DO NOT use in production
    return { wrappedKey: base64(dek), dekId: `dev-dek-${uuidv4()}` };
  }
  
  async unwrapKey(_kekId: string, wrappedKeyB64: string): Promise<Buffer> {
    return Buffer.from(wrappedKeyB64, 'base64');
  }
  
  async signPayload(payload: Buffer): Promise<string> {
    if (!this.privateKeyPem) {
      // HMAC fallback in dev (not secure)
      const h = crypto.createHmac('sha256', 'dev-signing-key');
      h.update(payload);
      return base64(h.digest());
    }
    const sign = crypto.createSign('SHA256');
    sign.update(payload);
    sign.end();
    const signature = sign.sign(this.privateKeyPem);
    return base64(signature);
  }
}

// ---------- Secure Vault Implementation ----------
export class SecureVault {
  constructor(private kmsClient: KmsClient, private bucket = DEFAULT_BUCKET) {}
  
  /**
   * Create a random DEK and wrap with KMS/HSM.
   * Returns the raw dek (Buffer) plus wrapped copy for storage
   */
  async generateAndWrapDEK(): Promise<{ dek: Buffer; wrappedKey: string; dekId?: string }> {
    const dek = crypto.randomBytes(32); // AES-256 key
    const { wrappedKey, dekId } = await this.kmsClient.wrapKey(KMS_KEY_ID, dek);
    return { dek, wrappedKey, dekId };
  }
  
  /**
   * Encrypt a buffer with AES-256-GCM using a provided dek.
   * Returns ciphertext, iv, tag as base64 strings
   */
  encryptWithDEK(dek: Buffer, plaintext: Buffer): { ciphertext: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12); // 96-bit recommended
    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { ciphertext: base64(ciphertext), iv: base64(iv), tag: base64(tag) };
  }
  
  /**
   * Decrypt ciphertext using DEK (assumes base64 inputs)
   */
  decryptWithDEK(dek: Buffer, ciphertextB64: string, ivB64: string, tagB64: string): Buffer {
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const ciphertext = Buffer.from(ciphertextB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', dek, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext;
  }
  
  /**
   * Store encrypted object metadata - storage upload is abstracted (implement S3/GCS).
   * Returns a SecureStorageResult. In a real system the `objectKey` should be the storage path.
   */
  async storeEncryptedObject(params: {
    imageId: string;
    bucket?: string;
    objectKey: string;
    wrappedDEK: string;
    dekId?: string;
    ciphertextB64: string;
    ivB64: string;
    tagB64: string;
  }): Promise<SecureStorageResult> {
    // TODO: Upload ciphertext to S3 or object store using your SDK.
    // For now we return the metadata object only (caller should persist metadata in DB).
    return {
      imageId: params.imageId,
      bucket: params.bucket || this.bucket,
      objectKey: params.objectKey,
      dekWrapped: params.wrappedDEK,
      dekId: params.dekId,
      createdAt: nowISO(),
    };
  }
  
  /**
   * Crypto-erase: destroy the wrapped DEK so ciphertext is unrecoverable.
   * Real implementation: delete key material from KMS/HSM or revoke access to KEK and rotate keys.
   */
  async cryptoErase(imageId: string, wrappedDEK: string): Promise<boolean> {
    // TODO: In production call KMS to schedule key destroy or delete reference to DEK.
    // Here we simulate and log — also return true for success.
    console.log(`[SecureVault] cryptoErase invoked for imageId=${imageId}`);
    // If using envelope encryption, deleting DEK or KMS key material makes ciphertext unrecoverable.
    return true;
  }
  
  /**
   * Generate a signed deletion certificate for audit.
   * Uses KMS to sign in production; DevKmsClient signs with HMAC fallback.
   */
  async generateDeletionCertificate(imageId: string, deletedBy: string, reason?: string): Promise<DeletionCertificate> {
    const payload = {
      imageId,
      deletedBy,
      deletedAt: nowISO(),
      reason: reason || 'crypto-erase',
    };
    const payloadBuf = Buffer.from(JSON.stringify(payload));
    const signature = await this.kmsClient.signPayload(payloadBuf);
    return {
      imageId,
      deletedBy,
      deletedAt: payload.deletedAt,
      signature,
      reason: payload.reason,
    };
  }
  
  /**
   * Utility: unwrap wrapped DEK using KMS
   */
  async unwrapDEK(wrappedDEK: string): Promise<Buffer> {
    return this.kmsClient.unwrapKey(KMS_KEY_ID, wrappedDEK);
  }
}