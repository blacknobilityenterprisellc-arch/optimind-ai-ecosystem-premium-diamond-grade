// Enhanced Database Connection Pool Configuration for OptiMind AI Ecosystem
import { PrismaClient } from '@prisma/client';

// Database connection pool configuration interface
interface DatabaseConfig {
  poolSize: number;
  connectionTimeout: number;
  idleTimeout: number;
  queryTimeout: number;
  maxIdleConnections: number;
  minConnections: number;
  retryAttempts: number;
  retryDelay: number;
  healthCheckInterval: number;
  enableLogging: boolean;
  enableMetrics: boolean;
}

// Default configuration optimized for production
const defaultConfig: DatabaseConfig = {
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
  connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '30000'),
  idleTimeout: 300000, // 5 minutes
  queryTimeout: 60000, // 1 minute
  maxIdleConnections: 5,
  minConnections: 2,
  retryAttempts: 3,
  retryDelay: 1000,
  healthCheckInterval: 30000, // 30 seconds
  enableLogging: process.env.NODE_ENV === 'development',
  enableMetrics: true,
};

// Database health metrics interface
interface DatabaseMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  totalQueries: number;
  failedQueries: number;
  averageQueryTime: number;
  lastHealthCheck: Date;
  uptime: number;
}

// Enhanced Prisma client with connection pooling and monitoring
class EnhancedDatabase {
  private client: PrismaClient;
  private config: DatabaseConfig;
  private metrics: DatabaseMetrics;
  private healthCheckTimer?: NodeJS.Timeout;
  private isInitialized = false;
  private connectionRetries = 0;

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.metrics = this.initializeMetrics();
    this.client = this.createPrismaClient();
  }

  private initializeMetrics(): DatabaseMetrics {
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      totalQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
      lastHealthCheck: new Date(),
      uptime: Date.now(),
    };
  }

  private createPrismaClient(): PrismaClient {
    return new PrismaClient({
      log: this.config.enableLogging ? ['query', 'info', 'warn', 'error'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db',
        },
      },
    });
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🔧 Initializing enhanced database connection pool...');
      
      // Test database connection
      await this.client.$connect();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Initialize connection pool
      await this.initializeConnectionPool();
      
      this.isInitialized = true;
      console.log('✅ Database connection pool initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize database connection pool:', error);
      
      // Retry connection if attempts remaining
      if (this.connectionRetries < this.config.retryAttempts) {
        this.connectionRetries++;
        console.log(`🔄 Retrying database connection (${this.connectionRetries}/${this.config.retryAttempts})...`);
        
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.initialize();
      }
      
      return false;
    }
  }

  private async initializeConnectionPool(): Promise<void> {
    // Warm up connection pool with initial connections
    const initialConnections = Math.min(this.config.minConnections, this.config.poolSize);
    
    const connectionPromises = Array(initialConnections).fill(0).map(async () => {
      try {
        await this.client.$executeRaw`SELECT 1`;
        this.metrics.totalConnections++;
        this.metrics.idleConnections++;
      } catch (error) {
        console.warn('Failed to create initial connection:', error);
      }
    });

    await Promise.all(connectionPromises);
    console.log(`🔗 Initialized ${initialConnections} database connections`);
  }

  private startHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Perform initial health check
    this.performHealthCheck();
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Execute simple health check query
      await this.client.$executeRaw`SELECT 1`;
      
      const queryTime = Date.now() - startTime;
      this.updateQueryMetrics(queryTime);
      
      this.metrics.lastHealthCheck = new Date();
      
      if (this.config.enableLogging) {
        console.log(`💚 Database health check passed in ${queryTime}ms`);
      }
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      this.metrics.failedQueries++;
      
      // Attempt to reconnect if health check fails
      if (this.isInitialized) {
        await this.handleConnectionFailure();
      }
    }
  }

  private updateQueryMetrics(queryTime: number): void {
    this.metrics.totalQueries++;
    
    // Update average query time
    const totalQueryTime = this.metrics.averageQueryTime * (this.metrics.totalQueries - 1) + queryTime;
    this.metrics.averageQueryTime = totalQueryTime / this.metrics.totalQueries;
  }

  private async handleConnectionFailure(): Promise<void> {
    try {
      console.log('🔄 Attempting to reconnect to database...');
      
      // Disconnect existing client
      await this.client.$disconnect();
      
      // Create new client
      this.client = this.createPrismaClient();
      
      // Reconnect
      await this.client.$connect();
      
      console.log('✅ Database reconnection successful');
    } catch (error) {
      console.error('❌ Database reconnection failed:', error);
    }
  }

  // Get database metrics
  getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  // Get database status
  async getStatus(): Promise<{
    healthy: boolean;
    connected: boolean;
    metrics: DatabaseMetrics;
    config: DatabaseConfig;
  }> {
    try {
      // Quick connection test
      await this.client.$executeRaw`SELECT 1`;
      
      return {
        healthy: true,
        connected: true,
        metrics: this.getMetrics(),
        config: this.config,
      };
    } catch (error) {
      return {
        healthy: false,
        connected: false,
        metrics: this.getMetrics(),
        config: this.config,
      };
    }
  }

  // Execute query with retry logic
  async executeQuery<T>(
    query: () => Promise<T>,
    options: {
      retries?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const { retries = this.config.retryAttempts, timeout = this.config.queryTimeout } = options;
    
    return Promise.race([
      query(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeout)
      )
    ]);

    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await query();
        const queryTime = Date.now() - startTime;
        
        this.updateQueryMetrics(queryTime);
        return result;
      } catch (error) {
        lastError = error as Error;
        this.metrics.failedQueries++;
        
        if (attempt < retries) {
          console.warn(`Query failed (attempt ${attempt}/${retries}), retrying...`, error);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    throw lastError!;
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    try {
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }

      await this.client.$disconnect();
      this.isInitialized = false;
      
      console.log('🧹 Database connection pool cleaned up');
    } catch (error) {
      console.error('❌ Error during database cleanup:', error);
    }
  }

  // Get Prisma client for direct usage
  getClient(): PrismaClient {
    return this.client;
  }

  // Add missing Prisma methods for compatibility
  get user() {
    return this.client.user;
  }

  get apiKey() {
    return this.client.apiKey;
  }

  get developerAccessKey() {
    return this.client.developerAccessKey;
  }

  // Add raw query methods
  async $queryRaw(query: string, ...params: any[]) {
    return this.client.$queryRaw(query, ...params);
  }

  async $executeRaw(query: string, ...params: any[]) {
    return this.client.$executeRaw(query, ...params);
  }

  async $transaction(callback: (tx: any) => Promise<any>) {
    return this.client.$transaction(callback);
  }

  // Add disconnect method
  async $disconnect() {
    return this.client.$disconnect();
  }

  // Check if initialized
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Global database instance
const globalForDb = globalThis as unknown as {
  enhancedDb: EnhancedDatabase | undefined;
};

// Create or get existing database instance
export const db = globalForDb.enhancedDb ?? new EnhancedDatabase();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.enhancedDb = db;
}

// Initialize database on startup
if (!db.isReady()) {
  db.initialize().catch(error => {
    console.error('Failed to initialize database on startup:', error);
  });
}

// Export for direct usage
export { EnhancedDatabase, DatabaseConfig, DatabaseMetrics };

// Export Prisma client for backward compatibility
export const prisma = db.getClient();

// Utility functions for database operations
export const DatabaseUtils = {
  // Execute transaction with retry logic
  async transaction<T>(
    callback: (tx: PrismaClient) => Promise<T>,
    options: {
      retries?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    return await db.executeQuery(async () => {
      return await db.getClient().$transaction(callback);
    }, options);
  },

  // Batch execute queries with connection pooling
  async batchExecute<T>(
    queries: Array<() => Promise<T>>,
    options: {
      concurrency?: number;
      retries?: number;
    } = {}
  ): Promise<Array<T | Error>> {
    const { concurrency = 5, retries = 2 } = options;
    
    const results: Array<T | Error> = [];
    const batches: Array<Array<() => Promise<T>>> = [];
    
    // Split queries into batches
    for (let i = 0; i < queries.length; i += concurrency) {
      batches.push(queries.slice(i, i + concurrency));
    }

    for (const batch of batches) {
      const batchResults = await Promise.allSettled(
        batch.map(query => db.executeQuery(query, { retries }))
      );
      
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : result.reason
      ));
    }

    return results;
  },

  // Health check endpoint handler
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    database: {
      connected: boolean;
      poolSize: number;
      activeConnections: number;
      totalQueries: number;
      failedQueries: number;
      averageQueryTime: number;
      uptime: number;
    };
    timestamp: string;
  }> {
    const status = await db.getStatus();
    
    return {
      status: status.healthy ? 'healthy' : 'unhealthy',
      database: {
        connected: status.connected,
        poolSize: status.config.poolSize,
        activeConnections: status.metrics.activeConnections,
        totalQueries: status.metrics.totalQueries,
        failedQueries: status.metrics.failedQueries,
        averageQueryTime: status.metrics.averageQueryTime,
        uptime: Date.now() - status.metrics.uptime,
      },
      timestamp: new Date().toISOString(),
    };
  },
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, cleaning up database connections...');
  await db.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, cleaning up database connections...');
  await db.cleanup();
  process.exit(0);
});

export default EnhancedDatabase;