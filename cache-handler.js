// cache-handler.js - Lightning-Fast Cache Handler for OptiMind AI Ecosystem
const { IncrementalCache } = require('@next/cache');

class OptiMindCacheHandler extends IncrementalCache {
  constructor() {
    super({
      // Memory-based cache for maximum speed
      cacheMaxMemorySize: 50 * 1024 * 1024, // 50MB
      // Enable filesystem cache for persistence
      cacheDirectoryPath: '.next/cache',
      // Enable compression for reduced memory usage
      compress: true,
      // Enable revalidation for fresh content
      revalidate: 300, // 5 minutes
    });
  }

  async get(key) {
    const start = Date.now();
    try {
      const result = await super.get(key);
      const duration = Date.now() - start;
      if (duration > 10) {
        console.warn(`⚠️ Cache get took ${duration}ms for key: ${key}`);
      }
      return result;
    } catch (error) {
      console.error('❌ Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl) {
    const start = Date.now();
    try {
      const result = await super.set(key, value, ttl);
      const duration = Date.now() - start;
      if (duration > 10) {
        console.warn(`⚠️ Cache set took ${duration}ms for key: ${key}`);
      }
      return result;
    } catch (error) {
      console.error('❌ Cache set error:', error);
      return false;
    }
  }

  async revalidateTag(tag) {
    const start = Date.now();
    try {
      const result = await super.revalidateTag(tag);
      const duration = Date.now() - start;
      console.log(`🔄 Cache revalidation completed in ${duration}ms for tag: ${tag}`);
      return result;
    } catch (error) {
      console.error('❌ Cache revalidation error:', error);
      return false;
    }
  }
}

module.exports = OptiMindCacheHandler;