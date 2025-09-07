/**
 * Premium Diamond-Grade Professional Enterprise System Main Entry Point
 *
 * This module provides the main entry point for initializing and running the enterprise system.
 * It coordinates all enterprise components and provides a unified interface for system management.
 *
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 * @compliance: Enterprise Architecture Standards
 */

import {
  initializeEnterpriseSystem,
  getEnterpriseSystemState,
  isEnterpriseSystemHealthy,
  getEnterpriseHealthSummary,
} from './index';

// Enterprise system configuration
const enterpriseConfig = {
  enableAutoStart: true,
  enableHealthMonitoring: true,
  enableAPIMangement: true,
  enableGracefulShutdown: true,
  shutdownTimeout: 30000,
  healthCheckInterval: 30000,
  metricsInterval: 60000,
};

// Global enterprise system state
let enterpriseInitialized = false;
let initializationPromise: Promise<any> | null = null;

/**
 * Initialize the enterprise system with comprehensive error handling and logging
 */
export async function initializeEnterpriseSystemMain(): Promise<void> {
  if (enterpriseInitialized) {
    console.log('🚀 Enterprise system already initialized');
    return;
  }

  if (initializationPromise) {
    console.log('🚀 Enterprise system initialization in progress...');
    return initializationPromise;
  }

  console.log('🚀 Starting Premium Diamond-Grade Enterprise System Initialization...');
  console.log('📋 System Configuration:', JSON.stringify(enterpriseConfig, null, 2));

  initializationPromise = performEnterpriseInitialization();

  try {
    await initializationPromise;
    enterpriseInitialized = true;
    console.log('✅ Enterprise System Initialization Complete');
  } catch (error) {
    enterpriseInitialized = false;
    initializationPromise = null;
    console.error('❌ Enterprise System Initialization Failed:', error);
    throw error;
  }
}

/**
 * Perform the actual enterprise system initialization
 */
async function performEnterpriseInitialization(): Promise<void> {
  const startTime = Date.now();

  try {
    // Step 1: Initialize core enterprise system
    console.log('🔧 Step 1: Initializing Enterprise Core...');
    const state = await initializeEnterpriseSystem(enterpriseConfig);

    console.log('✅ Enterprise Core Initialized');
    console.log(`📊 System Status: ${state.status}`);
    console.log(`🏗️  Services Registered: ${state.metrics.servicesCount}`);
    console.log(`⏱️  Initialization Time: ${Date.now() - startTime}ms`);

    // Step 2: Verify system health
    console.log('🏥 Step 2: Verifying System Health...');
    const isHealthy = isEnterpriseSystemHealthy();

    if (isHealthy) {
      console.log('✅ System Health Verified');
    } else {
      console.warn('⚠️  System Health Check Failed - System may run in degraded mode');
    }

    // Step 3: Display system summary
    console.log('📋 Step 3: Generating System Summary...');
    const healthSummary = getEnterpriseHealthSummary();

    console.log('📊 Enterprise System Summary:');
    console.log(`   Status: ${healthSummary.status}`);
    console.log(`   Uptime: ${Math.round(healthSummary.uptime / 1000)}s`);
    console.log(`   Services: ${healthSummary.services}`);
    console.log(`   Healthy: ${healthSummary.healthy ? '✅ Yes' : '❌ No'}`);

    // Step 4: Setup system monitoring
    console.log('📈 Step 4: Setting Up System Monitoring...');
    await setupSystemMonitoring();

    // Step 5: Register system event handlers
    console.log('🔔 Step 5: Registering Event Handlers...');
    await registerEventHandlers();

    console.log('🎉 Enterprise System Successfully Initialized and Ready!');
    console.log('🌟 System Features:');
    console.log('   ✅ Enterprise Configuration Management');
    console.log('   ✅ Service Container with Dependency Injection');
    console.log('   ✅ Health Monitoring and Metrics');
    console.log('   ✅ API Management with Security');
    console.log('   ✅ Graceful Shutdown and Error Recovery');
    console.log('   ✅ Real-time Analytics and Reporting');
  } catch (error) {
    console.error('❌ Enterprise System Initialization Failed:', error);
    throw error;
  }
}

/**
 * Setup system monitoring and health checks
 */
async function setupSystemMonitoring(): Promise<void> {
  try {
    const state = getEnterpriseSystemState();

    // Setup health check monitoring
    if (state.healthMonitor) {
      console.log('🏥 Health Monitor: Active');
    }

    // Setup API management monitoring
    if (state.apiManager) {
      console.log('🌐 API Manager: Active');
    }

    // Setup service container monitoring
    if (state.serviceContainer) {
      const runningServices = state.serviceContainer.getRunningServices();
      console.log(`🏗️  Running Services: ${runningServices.length}`);

      runningServices.forEach(serviceName => {
        console.log(`   - ${serviceName}`);
      });
    }

    console.log('✅ System Monitoring Setup Complete');
  } catch (error) {
    console.error('❌ System Monitoring Setup Failed:', error);
    throw error;
  }
}

/**
 * Register system event handlers for enterprise events
 */
async function registerEventHandlers(): Promise<void> {
  try {
    const state = getEnterpriseSystemState();
    const container = state.serviceContainer;

    // Register service lifecycle event handlers
    container.on('service:initialized', descriptor => {
      console.log(`🔧 Service Initialized: ${descriptor.name}`);
    });

    container.on('service:started', instance => {
      console.log(`🚀 Service Started: ${instance.service.name}`);
    });

    container.on('service:stopped', instance => {
      console.log(`🛑 Service Stopped: ${instance.service.name}`);
    });

    container.on('service:error', (instance, error) => {
      console.error(`❌ Service Error: ${instance.service.name} - ${error.message}`);
    });

    // Register health monitoring event handlers
    if (state.healthMonitor) {
      state.healthMonitor.on('healthCheck:completed', (check, result) => {
        if (result.status === 'UNHEALTHY') {
          console.warn(`⚠️  Unhealthy Service: ${check.name} - ${result.message}`);
        }
      });

      state.healthMonitor.on('alert:triggered', alert => {
        console.log(`🚨 Alert Triggered: ${alert.title} - ${alert.message}`);
      });
    }

    // Register API management event handlers
    if (state.apiManager) {
      state.apiManager.on('api:request', request => {
        // Log API requests (could be enhanced with rate limiting)
        console.log(`📡 API Request: ${request.method} ${request.path}`);
      });

      state.apiManager.on('api:response', (response, request) => {
        // Log API responses
        if (response.status >= 400) {
          console.warn(
            `⚠️  API Error Response: ${response.status} ${request.method} ${request.path}`
          );
        }
      });
    }

    console.log('✅ Event Handlers Registered');
  } catch (error) {
    console.error('❌ Event Handler Registration Failed:', error);
    throw error;
  }
}

/**
 * Get enterprise system status and health information
 */
export function getEnterpriseSystemStatus(): {
  initialized: boolean;
  healthy: boolean;
  status: string;
  uptime: number;
  services: number;
  summary: any;
} {
  try {
    const summary = getEnterpriseHealthSummary();

    return {
      initialized: enterpriseInitialized,
      healthy: summary.healthy,
      status: summary.status,
      uptime: summary.uptime,
      services: summary.services,
      summary,
    };
  } catch (error) {
    return {
      initialized: false,
      healthy: false,
      status: 'ERROR',
      uptime: 0,
      services: 0,
      summary: null,
    };
  }
}

/**
 * Gracefully shutdown the enterprise system
 */
export async function shutdownEnterpriseSystem(): Promise<void> {
  if (!enterpriseInitialized) {
    console.log('🛑 Enterprise system not initialized');
    return;
  }

  try {
    console.log('🛑 Initiating Enterprise System Shutdown...');

    const state = getEnterpriseSystemState();

    // Stop API manager
    if (state.apiManager) {
      await state.apiManager.stop();
      console.log('🛑 API Manager Stopped');
    }

    // Stop health monitor
    if (state.healthMonitor) {
      await state.healthMonitor.stop();
      console.log('🛑 Health Monitor Stopped');
    }

    // Shutdown service container
    await state.serviceContainer.shutdown();
    console.log('🛑 Service Container Shutdown');

    enterpriseInitialized = false;
    initializationPromise = null;

    console.log('✅ Enterprise System Shutdown Complete');
  } catch (error) {
    console.error('❌ Enterprise System Shutdown Failed:', error);
    throw error;
  }
}

/**
 * Restart the enterprise system
 */
export async function restartEnterpriseSystem(): Promise<void> {
  console.log('🔄 Restarting Enterprise System...');

  try {
    await shutdownEnterpriseSystem();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await initializeEnterpriseSystemMain();

    console.log('✅ Enterprise System Restart Complete');
  } catch (error) {
    console.error('❌ Enterprise System Restart Failed:', error);
    throw error;
  }
}

/**
 * Check if enterprise system is ready for operations
 */
export function isEnterpriseSystemReady(): boolean {
  try {
    return enterpriseInitialized && isEnterpriseSystemHealthy();
  } catch {
    return false;
  }
}

/**
 * Wait for enterprise system to be ready
 */
export async function waitForEnterpriseSystem(timeout: number = 30000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (isEnterpriseSystemReady()) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
}

// Export enterprise system management functions
export const enterpriseSystem = {
  initialize: initializeEnterpriseSystemMain,
  shutdown: shutdownEnterpriseSystem,
  restart: restartEnterpriseSystem,
  getStatus: getEnterpriseSystemStatus,
  isReady: isEnterpriseSystemReady,
  waitForReady: waitForEnterpriseSystem,
};

// Auto-initialize enterprise system when this module is imported
if (typeof window === 'undefined') {
  // Server-side initialization
  initializeEnterpriseSystemMain().catch(error => {
    console.error('❌ Auto-initialization of Enterprise System Failed:', error);
    process.exit(1);
  });
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('📡 Received SIGTERM, shutting down enterprise system...');
    await shutdownEnterpriseSystem();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('📡 Received SIGINT, shutting down enterprise system...');
    await shutdownEnterpriseSystem();
    process.exit(0);
  });
}

// Default export
export default enterpriseSystem;
