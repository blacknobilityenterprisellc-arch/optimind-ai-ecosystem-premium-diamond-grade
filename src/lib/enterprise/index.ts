/**
 * Premium Diamond-Grade Professional Enterprise System Entry Point
 * 
 * This module provides the main entry point for the enterprise system,
 * coordinating all enterprise components and providing a unified interface.
 * 
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 * @compliance: Enterprise Architecture Standards
 */

// Export all enterprise components
export * from './environment/EnterpriseEnvironmentConfig';
export * from './container/EnterpriseServiceContainer';
export * from './monitoring/EnterpriseHealthMonitor';
export * from './api/EnterpriseAPIManager';
export * from './EnterpriseInitializer';

// Re-export commonly used types and interfaces
export type {
  Environment,
  ConfigStatus,
  EnterpriseConfig,
} from './environment/EnterpriseEnvironmentConfig';

export type {
  ServiceLifecycle,
  ServiceScope,
  IService,
  ServiceHealth,
} from './container/EnterpriseServiceContainer';

export type {
  HealthStatus,
  AlertSeverity,
  AlertType,
  MetricType,
  SLAStatus,
} from './monitoring/EnterpriseHealthMonitor';

export type {
  APIKeyType,
  APIKeyStatus,
  RateLimitStrategy,
  APIMethod,
  APIKey,
  RateLimitConfig,
  APIRequestContext,
  APIResponseContext,
} from './api/EnterpriseAPIManager';

export type {
  EnterpriseSystemStatus,
  EnterpriseSystemMetrics,
  EnterpriseSystemState,
} from './EnterpriseInitializer';

// Convenience functions for enterprise system management
export {
  createEnterpriseConfig,
  initializeEnterpriseConfig,
  enterpriseConfig,
} from './environment/EnterpriseEnvironmentConfig';

export {
  createEnterpriseServiceContainer,
  getGlobalContainer,
  setGlobalContainer,
  Service,
  Inject,
} from './container/EnterpriseServiceContainer';

export {
  createEnterpriseHealthMonitor,
} from './monitoring/EnterpriseHealthMonitor';

export {
  createEnterpriseAPIManager,
} from './api/EnterpriseAPIManager';

export {
  createEnterpriseInitializer,
  initializeEnterpriseSystem,
  getEnterpriseInitializer,
  getEnterpriseSystemState,
  isEnterpriseSystemHealthy,
} from './EnterpriseInitializer';

// Default enterprise configuration
export const defaultEnterpriseConfig = {
  environment: {
    enableCircularDependencyCheck: true,
    enableHealthMonitoring: true,
    enableMetrics: true,
    enableGracefulShutdown: true,
    shutdownTimeout: 30000,
    healthCheckInterval: 60000,
    metricsInterval: 30000,
    maxServiceInstances: 1000,
    enableServiceDiscovery: true,
    enableEventBus: true,
  },
  monitoring: {
    enabled: true,
    checkInterval: 30000,
    metricsRetention: 86400000,
    alertRetention: 604800000,
    slaRetention: 2592000000,
    maxConcurrentChecks: 10,
    enablePredictiveAnalysis: true,
    enableAnomalyDetection: true,
    externalIntegration: {
      enabled: false,
      endpoints: [],
    },
    notification: {
      email: {
        enabled: false,
        smtp: {
          host: '',
          port: 587,
          secure: false,
          auth: {
            user: '',
            pass: '',
          },
        },
        from: '',
        to: [],
      },
      slack: {
        enabled: false,
        webhook: '',
        channel: '',
      },
      webhook: {
        enabled: false,
        endpoints: [],
      },
    },
  },
  api: {
    keyRotation: {
      enabled: true,
      defaultInterval: 2592000000,
      warningPeriod: 604800000,
      autoRotate: true,
    },
    rateLimiting: {
      defaultStrategy: 'sliding-window' as const,
      defaultWindow: 900000,
      defaultLimit: 1000,
      enableBurst: true,
      burstMultiplier: 2,
    },
    gateway: {
      enabled: true,
      port: 8080,
      host: '0.0.0.0',
      ssl: {
        enabled: false,
      },
      cors: {
        enabled: true,
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
        exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
        credentials: true,
        maxAge: 86400,
      },
      compression: {
        enabled: true,
        level: 6,
      },
      cache: {
        enabled: true,
        driver: 'memory',
        config: {},
      },
    },
    security: {
      enabled: true,
      suspiciousIPThreshold: 100,
      rateLimitThreshold: 10,
      anomalyDetection: true,
      threatIntelligence: true,
      blockMaliciousIPs: true,
      logSecurityEvents: true,
    },
    analytics: {
      enabled: true,
      retention: 2592000000,
      aggregation: {
        enabled: true,
        interval: 300000,
      },
      export: {
        enabled: false,
        format: 'json',
        destination: '',
        interval: 3600000,
      },
      dashboard: {
        enabled: true,
        refreshInterval: 30000,
      },
    },
  },
  initializer: {
    enableAutoStart: true,
    enableHealthMonitoring: true,
    enableAPIMangement: true,
    enableGracefulShutdown: true,
    shutdownTimeout: 30000,
    healthCheckInterval: 30000,
    metricsInterval: 60000,
  },
};

// Initialize enterprise system with default configuration
export async function initializeDefaultEnterpriseSystem(): Promise<any> {
  return await initializeEnterpriseSystem(defaultEnterpriseConfig.initializer);
}

// Get enterprise system health summary
export function getEnterpriseHealthSummary(): {
  status: string;
  uptime: number;
  services: number;
  metrics: any;
  healthy: boolean;
} {
  try {
    const state = getEnterpriseSystemState();
    const metrics = state.metrics;
    
    return {
      status: state.status,
      uptime: metrics.uptime,
      services: metrics.servicesCount,
      metrics,
      healthy: isEnterpriseSystemHealthy(),
    };
  } catch (error) {
    return {
      status: 'NOT_INITIALIZED',
      uptime: 0,
      services: 0,
      metrics: {},
      healthy: false,
    };
  }
}

// Enterprise system utilities
export const enterpriseUtils = {
  /**
   * Check if enterprise system is initialized and running
   */
  isRunning: (): boolean => {
    try {
      return isEnterpriseSystemHealthy();
    } catch {
      return false;
    }
  },

  /**
   * Get enterprise system metrics
   */
  getMetrics: (): any => {
    try {
      const state = getEnterpriseSystemState();
      return state.metrics;
    } catch {
      return {};
    }
  },

  /**
   * Get enterprise system status
   */
  getStatus: (): string => {
    try {
      const state = getEnterpriseSystemState();
      return state.status;
    } catch {
      return 'NOT_INITIALIZED';
    }
  },

  /**
   * Restart enterprise system
   */
  restart: async (): Promise<void> => {
    try {
      const initializer = getEnterpriseInitializer();
      await initializer.restart();
    } catch (error) {
      console.error('Failed to restart enterprise system:', error);
      throw error;
    }
  },

  /**
   * Stop enterprise system
   */
  stop: async (): Promise<void> => {
    try {
      const initializer = getEnterpriseInitializer();
      await initializer.stop();
    } catch (error) {
      console.error('Failed to stop enterprise system:', error);
      throw error;
    }
  },

  /**
   * Start enterprise system
   */
  start: async (): Promise<void> => {
    try {
      const initializer = getEnterpriseInitializer();
      await initializer.start();
    } catch (error) {
      console.error('Failed to start enterprise system:', error);
      throw error;
    }
  },
};

// Enterprise system event handlers
export const enterpriseEvents = {
  /**
   * Subscribe to enterprise system events
   */
  on: (event: string, handler: (...args: any[]) => void): void => {
    try {
      const initializer = getEnterpriseInitializer();
      const container = initializer.getServiceContainer();
      container.on(event, handler);
    } catch (error) {
      console.warn('Could not subscribe to enterprise event:', error);
    }
  },

  /**
   * Unsubscribe from enterprise system events
   */
  off: (event: string, handler: (...args: any[]) => void): void => {
    try {
      const initializer = getEnterpriseInitializer();
      const container = initializer.getServiceContainer();
      container.off(event, handler);
    } catch (error) {
      console.warn('Could not unsubscribe from enterprise event:', error);
    }
  },

  /**
   * Emit enterprise system event
   */
  emit: (event: string, ...args: any[]): void => {
    try {
      const initializer = getEnterpriseInitializer();
      const container = initializer.getServiceContainer();
      container.emit(event, ...args);
    } catch (error) {
      console.warn('Could not emit enterprise event:', error);
    }
  },
};

// Default export for convenience
export default {
  initialize: initializeDefaultEnterpriseSystem,
  getHealthSummary: getEnterpriseHealthSummary,
  utils: enterpriseUtils,
  events: enterpriseEvents,
  ...enterpriseUtils,
};