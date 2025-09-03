/**
 * Diamond-Grade Database Optimization System
 * 
 * Comprehensive database optimization system with connection pooling,
 * query optimization, and performance monitoring.
 * 
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

// Database configuration interface
export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  poolTimeout?: number;
  logQueries?: boolean;
  logLevel?: 'info' | 'warn' | 'error';
}

// Query metrics interface
export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
  parameters?: any[];
}

// Database health status interface
export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  connectionCount: number;
  maxConnections: number;
  errorRate: number;
  lastChecked: Date;
}

// Query optimization result interface
export interface QueryOptimization {
  originalQuery: string;
  optimizedQuery: string;
  improvement: {
    estimatedTimeReduction: number;
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
  };
}

// Database connection pool
export class DatabaseConnectionPool {
  private pool: PrismaClient;
  private config: DatabaseConfig;
  private metrics: QueryMetrics[] = [];
  private healthStatus: DatabaseHealth;
  private lastHealthCheck: Date = new Date();

  constructor(config: DatabaseConfig) {
    this.config = {
      maxConnections: 10,
      connectionTimeout: 30000,
      queryTimeout: 30000,
      poolTimeout: 60000,
      logQueries: false,
      logLevel: 'info',
      ...config
    };

    this.pool = new PrismaClient({
      datasources: {
        db: {
          url: this.config.url
        }
      },
      log: this.config.logQueries ? ['query', 'info', 'warn', 'error'] : ['warn', 'error']
    });

    this.healthStatus = {
      status: 'healthy',
      responseTime: 0,
      connectionCount: 0,
      maxConnections: this.config.maxConnections!,
      errorRate: 0,
      lastChecked: new Date()
    };

    this.startHealthMonitoring();
  }

  // Execute query with monitoring
  async executeQuery<T>(
    query: string,
    parameters: any[] = [],
    options?: {
      timeout?: number;
      retryAttempts?: number;
      cacheKey?: string;
    }
  ): Promise<T> {
    const startTime = performance.now();
    const queryMetrics: QueryMetrics = {
      query,
      duration: 0,
      timestamp: new Date(),
      success: false,
      parameters
    };

    try {
      const result = await this.withRetry(
        () => this.pool.$queryRawUnsafe(query, ...parameters),
        options?.retryAttempts || 3
      );

      queryMetrics.duration = performance.now() - startTime;
      queryMetrics.success = true;
      
      this.recordQueryMetrics(queryMetrics);
      
      return result as T;
    } catch (error) {
      queryMetrics.duration = performance.now() - startTime;
      queryMetrics.success = false;
      queryMetrics.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.recordQueryMetrics(queryMetrics);
      
      throw error;
    }
  }

  // Execute raw query with optimization
  async executeOptimizedQuery<T>(
    query: string,
    parameters: any[] = [],
    options?: {
      optimize?: boolean;
      explain?: boolean;
    }
  ): Promise<{ result: T; optimization?: QueryOptimization; explain?: any }> {
    let finalQuery = query;
    let optimization: QueryOptimization | undefined;
    let explainResult: any;

    if (options?.optimize) {
      optimization = await this.optimizeQuery(query);
      finalQuery = optimization.optimizedQuery;
    }

    if (options?.explain) {
      explainResult = await this.explainQuery(finalQuery, parameters);
    }

    const result = await this.executeQuery(finalQuery, parameters);

    return {
      result,
      optimization,
      explain: explainResult
    };
  }

  // Get database health status
  async getHealthStatus(): Promise<DatabaseHealth> {
    try {
      const startTime = performance.now();
      
      // Execute a simple health check query
      await this.pool.$queryRaw`SELECT 1`;
      
      const responseTime = performance.now() - startTime;
      
      // Get connection count (this is a simplified approach)
      const connectionCount = await this.estimateConnectionCount();
      
      // Calculate error rate from recent metrics
      const recentMetrics = this.getRecentMetrics(300000); // Last 5 minutes
      const errorRate = recentMetrics.length > 0 
        ? (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100 
        : 0;

      this.healthStatus = {
        status: this.determineHealthStatus(responseTime, errorRate, connectionCount),
        responseTime,
        connectionCount,
        maxConnections: this.config.maxConnections!,
        errorRate,
        lastChecked: new Date()
      };

      return this.healthStatus;
    } catch (error) {
      this.healthStatus = {
        status: 'unhealthy',
        responseTime: 0,
        connectionCount: 0,
        maxConnections: this.config.maxConnections!,
        errorRate: 100,
        lastChecked: new Date()
      };

      return this.healthStatus;
    }
  }

  // Get query metrics
  getQueryMetrics(options?: {
    limit?: number;
    timeRange?: number;
    successOnly?: boolean;
  }): QueryMetrics[] {
    let filteredMetrics = [...this.metrics];

    if (options?.timeRange) {
      const cutoff = new Date(Date.now() - options.timeRange);
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= cutoff);
    }

    if (options?.successOnly) {
      filteredMetrics = filteredMetrics.filter(m => m.success);
    }

    if (options?.limit) {
      filteredMetrics = filteredMetrics.slice(-options.limit);
    }

    return filteredMetrics;
  }

  // Get slow queries
  getSlowQueries(threshold: number = 1000): QueryMetrics[] {
    return this.metrics.filter(m => m.duration > threshold && m.success);
  }

  // Optimize query
  async optimizeQuery(query: string): Promise<QueryOptimization> {
    const optimizations = this.getQueryOptimizations(query);
    let optimizedQuery = query;

    // Apply optimizations
    for (const optimization of optimizations) {
      optimizedQuery = optimization.apply(optimizedQuery);
    }

    return {
      originalQuery: query,
      optimizedQuery,
      improvement: {
        estimatedTimeReduction: this.estimateTimeReduction(query, optimizedQuery),
        suggestions: optimizations.map(o => o.description),
        complexity: this.assessQueryComplexity(optimizedQuery)
      }
    };
  }

  // Explain query
  async explainQuery(query: string, parameters: any[] = []): Promise<any> {
    try {
      const explainQuery = `EXPLAIN ANALYZE ${query}`;
      return await this.executeQuery(explainQuery, parameters);
    } catch (error) {
      throw new Error(`Failed to explain query: ${error}`);
    }
  }

  // Get database statistics
  async getDatabaseStats(): Promise<{
    tableSizes: Record<string, number>;
    indexSizes: Record<string, number>;
    totalSize: number;
    activeConnections: number;
    maxConnections: number;
  }> {
    try {
      const tableSizes = await this.executeQuery<any[]>(
        `SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY size_bytes DESC`
      );

      const indexSizes = await this.executeQuery<any[]>(
        `SELECT 
          schemaname,
          tablename,
          indexname,
          pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as size,
          pg_relation_size(schemaname||'.'||indexname) as size_bytes
        FROM pg_indexes 
        WHERE schemaname = 'public'
        ORDER BY size_bytes DESC`
      );

      const connectionStats = await this.executeQuery<any[]>(
        `SELECT 
          count(*) as active_connections,
          setting as max_connections
        FROM pg_stat_activity, pg_settings 
        WHERE pg_settings.name = 'max_connections'`
      );

      const totalSize = tableSizes.reduce((sum, table) => sum + parseInt(table.size_bytes), 0);

      return {
        tableSizes: tableSizes.reduce((acc, table) => {
          acc[`${table.schemaname}.${table.tablename}`] = parseInt(table.size_bytes);
          return acc;
        }, {} as Record<string, number>),
        indexSizes: indexSizes.reduce((acc, index) => {
          acc[`${index.schemaname}.${index.tablename}.${index.indexname}`] = parseInt(index.size_bytes);
          return acc;
        }, {} as Record<string, number>),
        totalSize,
        activeConnections: parseInt(connectionStats[0]?.active_connections || '0'),
        maxConnections: parseInt(connectionStats[0]?.max_connections || '0')
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error}`);
    }
  }

  // Clean up old metrics
  cleanupMetrics(olderThan: number = 86400000): void { // 24 hours
    const cutoff = new Date(Date.now() - olderThan);
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
  }

  // Get Prisma client
  getClient(): PrismaClient {
    return this.pool;
  }

  // Disconnect from database
  async disconnect(): Promise<void> {
    await this.pool.$disconnect();
  }

  // Private methods
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw lastError!;
  }

  private recordQueryMetrics(metrics: QueryMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 10,000 metrics
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
  }

  private getRecentMetrics(timeRange: number): QueryMetrics[] {
    const cutoff = new Date(Date.now() - timeRange);
    return this.metrics.filter(m => m.timestamp >= cutoff);
  }

  private determineHealthStatus(
    responseTime: number,
    errorRate: number,
    connectionCount: number
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const maxConnections = this.config.maxConnections!;
    const connectionRatio = connectionCount / maxConnections;

    if (responseTime > 5000 || errorRate > 10 || connectionRatio > 0.9) {
      return 'unhealthy';
    }

    if (responseTime > 1000 || errorRate > 5 || connectionRatio > 0.7) {
      return 'degraded';
    }

    return 'healthy';
  }

  private async estimateConnectionCount(): Promise<number> {
    try {
      const result = await this.pool.$queryRaw<any[]>`
        SELECT count(*) as count 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;
      return parseInt(result[0]?.count || '0');
    } catch {
      return 0;
    }
  }

  private getQueryOptimizations(query: string): QueryOptimizationRule[] {
    const optimizations: QueryOptimizationRule[] = [];

    // Add SELECT * optimization
    if (query.includes('SELECT *')) {
      optimizations.push({
        description: 'Replace SELECT * with specific columns',
        apply: (q) => q.replace(/SELECT \*/g, 'SELECT id, created_at, updated_at')
      });
    }

    // Add missing WHERE clause optimization
    if (!query.includes('WHERE') && !query.includes('INSERT') && !query.includes('UPDATE') && !query.includes('DELETE')) {
      optimizations.push({
        description: 'Add WHERE clause to limit results',
        apply: (q) => q + ' WHERE 1=1 LIMIT 1000'
      });
    }

    // Add LIMIT clause optimization
    if (!query.includes('LIMIT') && !query.includes('INSERT') && !query.includes('UPDATE') && !query.includes('DELETE')) {
      optimizations.push({
        description: 'Add LIMIT clause to prevent large result sets',
        apply: (q) => q + ' LIMIT 1000'
      });
    }

    // Add index suggestion
    if (query.includes('WHERE') && !query.includes('ORDER BY')) {
      optimizations.push({
        description: 'Consider adding index on WHERE clause columns',
        apply: (q) => q // No change, just suggestion
      });
    }

    return optimizations;
  }

  private estimateTimeReduction(originalQuery: string, optimizedQuery: string): number {
    // Simple estimation based on query complexity
    const originalComplexity = this.assessQueryComplexity(originalQuery);
    const optimizedComplexity = this.assessQueryComplexity(optimizedQuery);
    
    return Math.max(0, (originalComplexity - optimizedComplexity) * 10);
  }

  private assessQueryComplexity(query: string): 'low' | 'medium' | 'high' {
    let complexity = 0;

    // Check for SELECT *
    if (query.includes('SELECT *')) complexity += 2;

    // Check for JOIN operations
    const joinCount = (query.match(/JOIN/gi) || []).length;
    complexity += joinCount * 3;

    // Check for subqueries
    const subqueryCount = (query.match(/\(SELECT/gi) || []).length;
    complexity += subqueryCount * 2;

    // Check for aggregate functions
    const aggregateCount = (query.match(/COUNT|SUM|AVG|MIN|MAX/gi) || []).length;
    complexity += aggregateCount;

    // Check for GROUP BY
    if (query.includes('GROUP BY')) complexity += 2;

    // Check for ORDER BY
    if (query.includes('ORDER BY')) complexity += 1;

    // Check for LIKE operations
    const likeCount = (query.match(/LIKE/gi) || []).length;
    complexity += likeCount;

    if (complexity <= 3) return 'low';
    if (complexity <= 8) return 'medium';
    return 'high';
  }

  private startHealthMonitoring(): void {
    // Check health every 30 seconds
    setInterval(async () => {
      await this.getHealthStatus();
    }, 30000);
  }
}

// Query optimization rule interface
interface QueryOptimizationRule {
  description: string;
  apply: (query: string) => string;
}

// Database connection pool manager
export class DatabasePoolManager {
  private static instance: DatabasePoolManager;
  private pools: Map<string, DatabaseConnectionPool> = new Map();

  private constructor() {}

  static getInstance(): DatabasePoolManager {
    if (!DatabasePoolManager.instance) {
      DatabasePoolManager.instance = new DatabasePoolManager();
    }
    return DatabasePoolManager.instance;
  }

  // Get or create connection pool
  getPool(name: string = 'default', config?: DatabaseConfig): DatabaseConnectionPool {
    if (!this.pools.has(name)) {
      if (!config) {
        throw new Error(`Database configuration required for pool '${name}'`);
      }
      this.pools.set(name, new DatabaseConnectionPool(config));
    }
    return this.pools.get(name)!;
  }

  // Get all pools
  getAllPools(): Map<string, DatabaseConnectionPool> {
    return new Map(this.pools);
  }

  // Remove pool
  removePool(name: string): void {
    const pool = this.pools.get(name);
    if (pool) {
      pool.disconnect();
      this.pools.delete(name);
    }
  }

  // Get health status for all pools
  async getAllHealthStatuses(): Promise<Record<string, DatabaseHealth>> {
    const statuses: Record<string, DatabaseHealth> = {};

    for (const [name, pool] of this.pools) {
      statuses[name] = await pool.getHealthStatus();
    }

    return statuses;
  }

  // Clean up all pools
  async cleanup(): Promise<void> {
    for (const [name, pool] of this.pools) {
      await pool.disconnect();
    }
    this.pools.clear();
  }
}

// Export all database optimization utilities
export {
  DatabaseConnectionPool,
  DatabasePoolManager,
  type DatabaseConfig,
  type QueryMetrics,
  type DatabaseHealth,
  type QueryOptimization
};