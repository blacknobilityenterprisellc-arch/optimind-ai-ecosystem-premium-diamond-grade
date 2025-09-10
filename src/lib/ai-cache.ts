
// AI-Generated Cache Utility
export class AICache {
  private cache = new Map<string, { value: any; expiry: number }>();
  private defaultTTL = 300000; // 5 minutes

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return getRealData();
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return getRealData();
    }
    
    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new AICache();
