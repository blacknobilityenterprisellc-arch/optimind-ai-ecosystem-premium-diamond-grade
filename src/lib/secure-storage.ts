// Secure storage utility with encryption for sensitive data
export class SecureStorage {
  private static instance: SecureStorage;
  private encryptionKey: string | null = null;

  private constructor() {
    this.initializeEncryptionKey();
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private async initializeEncryptionKey(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Try to get existing key from sessionStorage
      let key = sessionStorage.getItem('secure_storage_key');
      
      if (!key) {
        // Generate a new key for this session
        const crypto = window.crypto || (window as any).msCrypto;
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        key = Array.from(array)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        sessionStorage.setItem('secure_storage_key', key);
      }
      
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      this.encryptionKey = null;
    }
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const keyBuffer = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
      
      // Import the key
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Generate IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        dataBuffer
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode.apply(null, Array.from(combined)));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
      
      // Import the key
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        cryptoKey,
        encrypted
      );

      // Convert back to string
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Store encrypted data
  async setItem(key: string, value: any): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const serialized = JSON.stringify(value);
      const encrypted = await this.encrypt(serialized);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error(`Failed to store encrypted data for key ${key}:`, error);
      // Fallback to unencrypted storage if encryption fails
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Retrieve and decrypt data
  async getItem<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;

    try {
      // Try encrypted storage first
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (encrypted) {
        const decrypted = await this.decrypt(encrypted);
        return JSON.parse(decrypted) as T;
      }
    } catch (error) {
      console.error(`Failed to decrypt data for key ${key}:`, error);
    }

    // Fallback to unencrypted storage
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error(`Failed to parse data for key ${key}:`, error);
    }

    return null;
  }

  // Remove item
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem(`secure_${key}`);
    localStorage.removeItem(key);
  }

  // Clear all secure storage
  clear(): void {
    if (typeof window === "undefined") return;
    
    // Remove all secure items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Check if key exists
  hasItem(key: string): boolean {
    if (typeof window === "undefined") return false;
    
    return localStorage.getItem(`secure_${key}`) !== null || localStorage.getItem(key) !== null;
  }

  // Get all keys (without secure_ prefix)
  getKeys(): string[] {
    if (typeof window === "undefined") return [];
    
    const keys: string[] = [];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (key.startsWith('secure_')) {
        keys.push(key.substring(7)); // Remove 'secure_' prefix
      } else if (!key.startsWith('secure_')) {
        // Only add non-secure keys if they don't have a secure counterpart
        if (!localStorage.getItem(`secure_${key}`)) {
          keys.push(key);
        }
      }
    });
    
    return keys;
  }
}

// Export singleton instance
export const secureStorage = SecureStorage.getInstance();

// React hook for secure storage
import { useState, useEffect } from "react";

export function useSecureStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await secureStorage.getItem<T>(key);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(`Error loading secure storage for key ${key}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await secureStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error saving secure storage for key ${key}:`, error);
    }
  };

  const removeValue = () => {
    secureStorage.removeItem(key);
    setStoredValue(initialValue);
  };

  return {
    value: storedValue,
    setValue,
    removeValue,
    loading
  };
}