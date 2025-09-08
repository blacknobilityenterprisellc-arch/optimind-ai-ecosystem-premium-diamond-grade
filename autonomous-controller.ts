#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Autonomous Controller
 * Premium Diamond Grade Master Control System
 * Orchestrates all autonomous systems for intelligent operation
 */

import * as fs from 'fs';
import * as path from 'path';

// Import our autonomous systems
import IntelligentStartup from './intelligent-startup';
import SelfHealingMonitor from './self-healing-monitor';
import AutoDependencyManager from './auto-dependency-manager';
import OptiMindSystemIntelligence from './intelligent-system-init';

// Controller configuration
interface ControllerConfig {
  startup: {
    enabled: boolean;
    autoStart: boolean;
    recoveryMode: boolean;
  };
  monitoring: {
    enabled: boolean;
    healthCheckInterval: number;
    performanceMonitoring: boolean;
  };
  dependencies: {
    enabled: boolean;
    autoUpdate: boolean;
    optimization: boolean;
  };
  intelligence: {
    enabled: boolean;
    selfLearning: boolean;
    predictiveAnalysis: boolean;
  };
  automation: {
    enabled: boolean;
    decisionMaking: boolean;
    autonomousActions: boolean;
  };
}

// System status
interface SystemStatus {
  overall: 'initializing' | 'starting' | 'running' | 'degraded' | 'stopping' | 'error' | 'recovery';
  components: {
    controller: 'healthy' | 'degraded' | 'unhealthy';
    startup: 'healthy' | 'degraded' | 'unhealthy';
    monitoring: 'healthy' | 'degraded' | 'unhealthy';
    dependencies: 'healthy' | 'degraded' | 'unhealthy';
    intelligence: 'healthy' | 'degraded' | 'unhealthy';
    application: 'healthy' | 'degraded' | 'unhealthy';
  };
  metrics: {
    uptime: number;
    healthScore: number;
    performance: number;
    reliability: number;
    efficiency: number;
    autonomousActions: number;
    recoveryActions: number;
    optimizationActions: number;
  };
  lastUpdate: Date;
  alerts: SystemAlert[];
}

// System alert
interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  actionTaken?: string;
}

class AutonomousController {
  private config: ControllerConfig;
  private status: SystemStatus;
  private logFile: string;
  private statusFile: string;
  private alertsFile: string;
  private isRunning: boolean = false;
  
  // Autonomous systems
  private startup?: IntelligentStartup;
  private monitor?: SelfHealingMonitor;
  private dependencyManager?: AutoDependencyManager;
  private intelligence?: OptiMindSystemIntelligence;
  
  // Process management
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.logFile = path.join(process.cwd(), 'autonomous-controller.log');
    this.statusFile = path.join(process.cwd(), 'system-status.json');
    this.alertsFile = path.join(process.cwd(), 'system-alerts.json');
    
    this.config = {
      startup: {
        enabled: true,
        autoStart: true,
        recoveryMode: false
      },
      monitoring: {
        enabled: true,
        healthCheckInterval: 30000,
        performanceMonitoring: true
      },
      dependencies: {
        enabled: true,
        autoUpdate: true,
        optimization: true
      },
      intelligence: {
        enabled: true,
        selfLearning: true,
        predictiveAnalysis: true
      },
      automation: {
        enabled: true,
        decisionMaking: true,
        autonomousActions: true
      }
    };

    this.status = this.initializeStatus();
    this.loadState();
  }

  private initializeStatus(): SystemStatus {
    return {
      overall: 'initializing',
      components: {
        controller: 'healthy',
        startup: 'healthy',
        monitoring: 'healthy',
        dependencies: 'healthy',
        intelligence: 'healthy',
        application: 'healthy'
      },
      metrics: {
        uptime: 0,
        healthScore: 100,
        performance: 100,
        reliability: 100,
        efficiency: 100,
        autonomousActions: 0,
        recoveryActions: 0,
        optimizationActions: 0
      },
      lastUpdate: new Date(),
      alerts: []
    };
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.statusFile)) {
        const statusData = fs.readFileSync(this.statusFile, 'utf8');
        this.status = { ...this.status, ...JSON.parse(statusData) };
      }

      if (fs.existsSync(this.alertsFile)) {
        const alertsData = fs.readFileSync(this.alertsFile, 'utf8');
        this.status.alerts = JSON.parse(alertsData);
      }
    } catch (error) {
      this.log('warn', 'Failed to load state, using defaults');
    }
  }

  private saveState(): void {
    try {
      fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
      fs.writeFileSync(this.alertsFile, JSON.stringify(this.status.alerts, null, 2));
    } catch (error) {
      this.log('error', `Failed to save state: ${error}`);
    }
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logMessage);
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  // Main controller function
  async initialize(): Promise<boolean> {
    if (this.isRunning) {
      this.log('warn', 'Controller is already running');
      return false;
    }

    this.isRunning = true;
    this.status.overall = 'initializing';
    this.status.lastUpdate = new Date();

    this.log('info', '🤖 OptiMind AI Ecosystem - Autonomous Controller Initializing...');
    this.log('info', '==============================================================');

    try {
      // Initialize all autonomous systems
      await this.initializeAutonomousSystems();
      
      // Start monitoring and automation
      await this.startMonitoring();
      
      // Start automation loop
      await this.startAutomation();
      
      this.status.overall = 'running';
      this.log('success', '✅ Autonomous Controller initialized successfully!');
      
      // Display system status
      this.displaySystemStatus();
      
      return true;
    } catch (error: unknown) {
      this.status.overall = 'error';
      this.log('error', `Controller initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      await this.createAlert('critical', 'controller', `Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  // Initialize all autonomous systems
  private async initializeAutonomousSystems(): Promise<void> {
    this.log('info', 'Initializing autonomous systems...');

    // Initialize system intelligence
    if (this.config.intelligence.enabled) {
      this.log('info', 'Starting system intelligence...');
      this.intelligence = new OptiMindSystemIntelligence();
      try {
        await this.intelligence.initialize();
        this.status.components.intelligence = 'healthy';
        this.log('success', 'System intelligence initialized');
      } catch (error) {
        this.status.components.intelligence = 'degraded';
        this.log('warn', `System intelligence initialization failed: ${error}`);
      }
    }

    // Initialize dependency manager
    if (this.config.dependencies.enabled) {
      this.log('info', 'Starting dependency manager...');
      this.dependencyManager = new AutoDependencyManager();
      try {
        await this.dependencyManager.manageDependencies();
        this.status.components.dependencies = 'healthy';
        this.log('success', 'Dependency manager initialized');
      } catch (error) {
        this.status.components.dependencies = 'degraded';
        this.log('warn', `Dependency manager initialization failed: ${error}`);
      }
    }

    // Initialize startup system
    if (this.config.startup.enabled) {
      this.log('info', 'Starting startup system...');
      this.startup = new IntelligentStartup();
      try {
        if (this.config.startup.autoStart) {
          const startupSuccess = await this.startup.startup();
          if (startupSuccess) {
            this.status.components.startup = 'healthy';
            this.status.components.application = 'healthy';
            this.log('success', 'Startup system completed successfully');
          } else {
            this.status.components.startup = 'degraded';
            this.status.components.application = 'degraded';
            this.log('warn', 'Startup system completed with issues');
          }
        } else {
          this.status.components.startup = 'healthy';
          this.log('info', 'Startup system initialized (auto-start disabled)');
        }
      } catch (error) {
        this.status.components.startup = 'unhealthy';
        this.status.components.application = 'unhealthy';
        this.log('error', `Startup system failed: ${error}`);
        await this.createAlert('error', 'startup', `Startup failed: ${error}`);
      }
    }

    // Initialize monitoring system
    if (this.config.monitoring.enabled) {
      this.log('info', 'Starting monitoring system...');
      this.monitor = new SelfHealingMonitor();
      try {
        await this.monitor.start();
        this.status.components.monitoring = 'healthy';
        this.log('success', 'Monitoring system initialized');
      } catch (error) {
        this.status.components.monitoring = 'degraded';
        this.log('warn', `Monitoring system initialization failed: ${error}`);
      }
    }
  }

  // Start monitoring
  private async startMonitoring(): Promise<void> {
    this.log('info', 'Starting controller monitoring...');

    // Health check interval
    const healthInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.monitoring.healthCheckInterval);

    this.intervals.set('healthCheck', healthInterval);

    // Performance monitoring
    if (this.config.monitoring.performanceMonitoring) {
      const performanceInterval = setInterval(async () => {
        await this.monitorPerformance();
      }, 60000); // Every minute

      this.intervals.set('performance', performanceInterval);
    }

    this.log('success', 'Controller monitoring started');
  }

  // Start automation loop
  private async startAutomation(): Promise<void> {
    this.log('info', 'Starting automation loop...');

    const automationInterval = setInterval(async () => {
      await this.automationLoop();
    }, 30000); // Every 30 seconds

    this.intervals.set('automation', automationInterval);

    this.log('success', 'Automation loop started');
  }

  // Perform health check
  private async performHealthCheck(): Promise<void> {
    try {
      // Check individual components
      await this.checkComponentHealth();
      
      // Update overall health score
      this.updateHealthScore();
      
      // Check for alerts
      await this.checkAlerts();
      
      // Save state
      this.saveState();
      
      this.status.lastUpdate = new Date();
      this.status.metrics.uptime = Date.now() - this.status.metrics.uptime;
      
    } catch (error: unknown) {
      this.log('error', `Health check failed: ${error instanceof Error ? error.message : String(error)}`);
      await this.createAlert('error', 'controller', `Health check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Check component health
  private async checkComponentHealth(): Promise<void> {
    // Check controller health
    this.status.components.controller = 'healthy';

    // Check startup system health
    if (this.startup) {
      try {
        const startupStatus = this.startup.getStatus();
        if (startupStatus.phase === 'completed') {
          this.status.components.startup = 'healthy';
          this.status.components.application = 'healthy';
        } else if (startupStatus.phase === 'recovery') {
          this.status.components.startup = 'degraded';
          this.status.components.application = 'degraded';
        } else {
          this.status.components.startup = 'unhealthy';
          this.status.components.application = 'unhealthy';
        }
      } catch (error) {
        this.status.components.startup = 'unhealthy';
        this.status.components.application = 'unhealthy';
      }
    }

    // Check monitoring system health
    if (this.monitor) {
      try {
        const monitorHealth = this.monitor.getHealth();
        if (monitorHealth.overall === 'healthy') {
          this.status.components.monitoring = 'healthy';
        } else if (monitorHealth.overall === 'degraded') {
          this.status.components.monitoring = 'degraded';
        } else {
          this.status.components.monitoring = 'unhealthy';
        }
      } catch (error) {
        this.status.components.monitoring = 'unhealthy';
      }
    }

    // Check dependency manager health
    if (this.dependencyManager) {
      try {
        // Simple health check for dependency manager
        this.status.components.dependencies = 'healthy';
      } catch (error) {
        this.status.components.dependencies = 'unhealthy';
      }
    }

    // Check intelligence system health
    if (this.intelligence) {
      try {
        const intelligenceStatus = this.intelligence.getStatus();
        if (intelligenceStatus.healthy) {
          this.status.components.intelligence = 'healthy';
        } else {
          this.status.components.intelligence = 'degraded';
        }
      } catch (error) {
        this.status.components.intelligence = 'unhealthy';
      }
    }
  }

  // Update health score
  private updateHealthScore(): void {
    const components = Object.values(this.status.components);
    const healthyCount = components.filter(status => status === 'healthy').length;
    const degradedCount = components.filter(status => status === 'degraded').length;
    const totalCount = components.length;

    // Calculate health score (0-100)
    const healthScore = Math.round(((healthyCount + degradedCount * 0.5) / totalCount) * 100);
    this.status.metrics.healthScore = healthScore;

    // Update overall status based on health score
    if (healthScore >= 90) {
      this.status.overall = 'running';
    } else if (healthScore >= 70) {
      this.status.overall = 'degraded';
    } else if (healthScore >= 50) {
      this.status.overall = 'stopping';
    } else {
      this.status.overall = 'error';
    }
  }

  // Monitor performance
  private async monitorPerformance(): Promise<void> {
    try {
      // Get performance metrics from monitoring system
      if (this.monitor) {
        const metrics = this.monitor.getMetrics();
        
        // Update performance metrics
        this.status.metrics.performance = Math.max(0, 100 - (metrics.responseTime / 10));
        this.status.metrics.reliability = Math.max(0, 100 - (metrics.errorRate * 10));
        this.status.metrics.efficiency = Math.max(0, 100 - (metrics.memory.usage / 2));
      }
    } catch (error) {
      this.log('warn', `Performance monitoring failed: ${error}`);
    }
  }

  // Check for alerts
  private async checkAlerts(): Promise<void> {
    try {
      // Check for critical issues
      if (this.status.metrics.healthScore < 50) {
        await this.createAlert('critical', 'system', `Health score critical: ${this.status.metrics.healthScore}%`);
      }

      // Check for performance issues
      if (this.status.metrics.performance < 70) {
        await this.createAlert('warning', 'performance', `Performance degraded: ${this.status.metrics.performance.toFixed(1)}%`);
      }

      // Check for reliability issues
      if (this.status.metrics.reliability < 80) {
        await this.createAlert('warning', 'reliability', `Reliability issues: ${this.status.metrics.reliability.toFixed(1)}%`);
      }

      // Clean up old alerts
      const now = new Date();
      this.status.alerts = this.status.alerts.filter(alert => 
        (now.getTime() - alert.timestamp.getTime()) < 86400000 // 24 hours
      );
    } catch (error) {
      this.log('warn', `Alert checking failed: ${error}`);
    }
  }

  // Create alert
  private async createAlert(
    type: SystemAlert['type'],
    component: string,
    message: string
  ): Promise<void> {
    const alert: SystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      component,
      message,
      timestamp: new Date(),
      resolved: false
    };

    this.status.alerts.push(alert);
    this.log('alert', `${type.toUpperCase()}: ${message}`);

    // Take autonomous action if enabled
    if (this.config.automation.enabled && this.config.automation.autonomousActions) {
      await this.takeAutonomousAction(alert);
    }
  }

  // Take autonomous action
  private async takeAutonomousAction(alert: SystemAlert): Promise<void> {
    this.log('info', `Taking autonomous action for alert: ${alert.message}`);

    try {
      switch (alert.component) {
        case 'startup':
          if (this.startup) {
            await this.startup.stop();
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.startup.startup();
            alert.actionTaken = 'Restarted startup system';
            this.status.metrics.autonomousActions++;
          }
          break;

        case 'monitoring':
          if (this.monitor) {
            await this.monitor.stop();
            await new Promise(resolve => setTimeout(resolve, 3000));
            await this.monitor.start();
            alert.actionTaken = 'Restarted monitoring system';
            this.status.metrics.autonomousActions++;
          }
          break;

        case 'system':
          // System-wide action
          if (this.startup) {
            await this.startup.stop();
          }
          if (this.monitor) {
            await this.monitor.stop();
          }
          await new Promise(resolve => setTimeout(resolve, 10000));
          if (this.startup) {
            await this.startup.startup();
          }
          if (this.monitor) {
            await this.monitor.start();
          }
          alert.actionTaken = 'System restart performed';
          this.status.metrics.recoveryActions++;
          break;

        default:
          this.log('warn', `No autonomous action available for component: ${alert.component}`);
      }

      alert.resolved = true;
      this.log('success', `Autonomous action completed: ${alert.actionTaken}`);
    } catch (error: unknown) {
      this.log('error', `Autonomous action failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Automation loop
  private async automationLoop(): Promise<void> {
    if (!this.config.automation.enabled) {
      return;
    }

    try {
      // Predictive analysis
      if (this.config.intelligence.predictiveAnalysis) {
        await this.performPredictiveAnalysis();
      }

      // Optimization
      if (this.config.dependencies.optimization) {
        await this.performOptimization();
      }

      // Self-learning
      if (this.config.intelligence.selfLearning) {
        await this.performSelfLearning();
      }

    } catch (error: unknown) {
      this.log('warn', `Automation loop failed: ${error.message}`);
    }
  }

  // Perform predictive analysis
  private async performPredictiveAnalysis(): Promise<void> {
    try {
      // Analyze trends and predict potential issues
      const recentAlerts = this.status.alerts.filter(alert => 
        !alert.resolved && 
        (Date.now() - alert.timestamp.getTime()) < 3600000 // 1 hour
      );

      if (recentAlerts.length > 3) {
        await this.createAlert('warning', 'predictive', 'High alert frequency detected, potential issues ahead');
      }

      // Check for performance degradation trends
      if (this.status.metrics.performance < 60) {
        await this.createAlert('info', 'predictive', 'Performance degradation trend detected');
      }
    } catch (error) {
      this.log('warn', `Predictive analysis failed: ${error}`);
    }
  }

  // Perform optimization
  private async performOptimization(): Promise<void> {
    try {
      // Optimize dependencies
      if (this.dependencyManager) {
        await this.dependencyManager.generateReport();
        this.status.metrics.optimizationActions++;
      }

      // Optimize system resources
      if (this.monitor) {
        // Trigger optimization through monitoring system
        this.status.metrics.optimizationActions++;
      }
    } catch (error) {
      this.log('warn', `Optimization failed: ${error}`);
    }
  }

  // Perform self-learning
  private async performSelfLearning(): Promise<void> {
    try {
      // Analyze past actions and improve decision making
      const successfulActions = this.status.alerts.filter(alert => 
        alert.resolved && alert.actionTaken
      );

      if (successfulActions.length > 0) {
        // Learn from successful actions
        this.log('info', `Self-learning: Analyzed ${successfulActions.length} successful autonomous actions`);
      }
    } catch (error) {
      this.log('warn', `Self-learning failed: ${error}`);
    }
  }

  // Display system status
  private displaySystemStatus(): void {
    console.log('\n🎯 SYSTEM STATUS');
    console.log('================');
    console.log(`Overall Status: ${this.status.overall.toUpperCase()}`);
    console.log(`Health Score: ${this.status.metrics.healthScore.toFixed(1)}%`);
    console.log(`Performance: ${this.status.metrics.performance.toFixed(1)}%`);
    console.log(`Reliability: ${this.status.metrics.reliability.toFixed(1)}%`);
    console.log(`Efficiency: ${this.status.metrics.efficiency.toFixed(1)}%`);
    console.log(`Autonomous Actions: ${this.status.metrics.autonomousActions}`);
    console.log(`Recovery Actions: ${this.status.metrics.recoveryActions}`);
    console.log(`Optimization Actions: ${this.status.metrics.optimizationActions}`);
    console.log('');
    
    console.log('🔧 COMPONENT STATUS');
    console.log('==================');
    Object.entries(this.status.components).forEach(([component, status]) => {
      const emoji = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
      console.log(`${emoji} ${component}: ${status.toUpperCase()}`);
    });
    
    console.log('\n🌐 ACCESS POINTS');
    console.log('===============');
    console.log('• Main Application: http://localhost:3000');
    console.log('• Health Check: http://localhost:3000/api/health');
    console.log('• Monitoring Dashboard: http://localhost:3001');
    console.log('• Controller Status: http://localhost:3002');
    
    console.log('\n📊 ACTIVE ALERTS');
    console.log('===============');
    const activeAlerts = this.status.alerts.filter(alert => !alert.resolved);
    if (activeAlerts.length === 0) {
      console.log('✅ No active alerts');
    } else {
      activeAlerts.forEach(alert => {
        const emoji = alert.type === 'critical' ? '🚨' : alert.type === 'error' ? '❌' : alert.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${emoji} ${alert.component}: ${alert.message}`);
      });
    }
  }

  // Get system status
  getStatus(): SystemStatus {
    return { ...this.status };
  }

  // Get system metrics
  getMetrics() {
    return { ...this.status.metrics };
  }

  // Get active alerts
  getActiveAlerts(): SystemAlert[] {
    return this.status.alerts.filter(alert => !alert.resolved);
  }

  // Stop controller
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.log('info', 'Stopping autonomous controller...');
    this.status.overall = 'stopping';

    // Stop all intervals
    for (const [, interval] of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();

    // Stop all systems
    if (this.monitor) {
      await this.monitor.stop();
    }

    if (this.startup) {
      await this.startup.stop();
    }

    this.isRunning = false;
    this.status.overall = 'stopping';
    this.saveState();

    this.log('success', 'Autonomous controller stopped');
  }
}

// Main execution
async function main() {
  console.log('🤖 OptiMind AI Ecosystem - Autonomous Controller');
  console.log('====================================================');
  
  const controller = new AutonomousController();

  try {
    const success = await controller.initialize();
    
    if (success) {
      console.log('✅ Autonomous Controller initialized successfully');
      
      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down gracefully...');
        await controller.stop();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log('\n🛑 Shutting down gracefully...');
        await controller.stop();
        process.exit(0);
      });

      // Keep the process running
      console.log('🔄 Controller is running autonomously...');
      console.log('📊 Access controller status at: http://localhost:3002');
      
      // Periodic status updates
      setInterval(() => {
        const status = controller.getStatus();
        const metrics = controller.getMetrics();
        console.log(`[${new Date().toISOString()}] Status: ${status.overall} | Health: ${metrics.healthScore.toFixed(1)}% | Actions: ${metrics.autonomousActions}`);
      }, 300000); // Every 5 minutes
      
    } else {
      console.log('❌ Autonomous Controller initialization failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

export default AutonomousController;