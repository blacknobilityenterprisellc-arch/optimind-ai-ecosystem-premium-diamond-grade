// Caching utilities for API responses and static assets

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  maxSize?: number; // Maximum number of items in cache
  key?: string; // Custom cache key
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  private generateKey(url: string, options?: CacheOptions): string {
    return options?.key || url;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl * 1000;
  }

  private cleanup(): void {
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }

    // Remove oldest entries if cache is too large
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  async get<T>(url: string, options?: CacheOptions): Promise<T | null> {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  async set<T>(url: string, data: T, options: CacheOptions = {}): Promise<void> {
    const key = this.generateKey(url, options);
    const ttl = options.ttl || 300; // Default 5 minutes

    this.cleanup();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  invalidate(url: string, options?: CacheOptions): void {
    const key = this.generateKey(url, options);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// API response caching utility
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheManager.get<T>(url, cacheOptions);
  if (cached) {
    return cached;
  }

  // If not in cache, make the request
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Cache-Control': 'public, max-age=300',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Store in cache
  await cacheManager.set(url, data, cacheOptions);

  return data;
}

// React hook for cached data
import { useState, useEffect } from 'react';

export function useCachedData<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: CacheOptions = {},
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await cachedFetch<T>(url, options, cacheOptions);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Invalidate cache and refetch
      cacheManager.invalidate(url, cacheOptions);
      const result = await cachedFetch<T>(url, options, cacheOptions);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Image caching utility
export class ImageCache {
  private cache = new Map<string, string>();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  async loadImage(url: string): Promise<string> {
    // Check if image is already cached
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Load and cache the image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Cleanup if cache is too large
        if (this.cache.size >= this.maxSize) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) {
            this.cache.delete(firstKey);
          }
        }
        
        this.cache.set(url, url);
        resolve(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  preloadImages(urls: string[]): Promise<string[]> {
    return Promise.all(urls.map(url => this.loadImage(url)));
  }

  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

// Service Worker registration for offline caching
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Generate cache headers for API responses
export function getCacheHeaders(ttl: number = 300): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${ttl}`,
    'ETag': `W/"${Date.now()}"`,
    'Last-Modified': new Date().toUTCString(),
  };
}

// Cache busting utility
export function addCacheBust(url: string): string {
  const bust = Date.now().toString(36);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${bust}`;
}