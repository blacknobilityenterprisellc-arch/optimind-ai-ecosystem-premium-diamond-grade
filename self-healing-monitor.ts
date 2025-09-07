#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Self-Healing & Monitoring System
 * Premium Diamond Grade Autonomous Intelligence
 * Provides intelligent monitoring, self-healing, and system optimization
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createServer } from 'http';

// System configuration
interface SystemConfig {
  monitoring: {
    enabled: boolean;
    interval: number;
    healthCheckTimeout: number;
    metricsRetention: number;
  };
  selfHealing: {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number;
    autoRestart: boolean;
  };
  optimization: {
    enabled: boolean;
    interval: number;
    memoryThreshold: number;
    cpuThreshold: number;
    diskThreshold: number;
  };
  alerts: {
    enabled: boolean;
    channels: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

// System health status
interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
  components: {
    database: 'healthy' | 'degraded' | 'unhealthy';
    server: 'healthy' | 'degraded' | 'unhealthy';
    dependencies: 'healthy' | 'degraded' | 'unhealthy';
    aiServices: 'healthy' | 'degraded' | 'unhealthy';
    monitoring: 'healthy' | 'degraded' | 'unhealthy';
    network: 'healthy' | 'degraded' | 'unhealthy';
  };
  metrics: {
    uptime: number;
    memory: { usage: number; available: number; total: number };
    cpu: { usage: number; cores: number };
    disk: { usage: number; available: number; total: number };
    responseTime: number;
    errorRate: number;
  };
  lastCheck: Date;
  issues: SystemIssue[];
}

// System issue
interface SystemIssue {
  id: string;
  type: 'database' | 'server' | 'dependencies' | 'aiServices' | 'monitoring' | 'network' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
  resolutionAttempts: number;
  lastAttempt?: Date;
}

class SelfHealingMonitor {
  private config: SystemConfig;
  private health: SystemHealth;
  private logFile: string;
  private metricsFile: string;
  private issuesFile: string;
  private startTime: number;
  private isRunning: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private optimizationInterval?: NodeJS.Timeout;

  constructor() {
    this.startTime = Date.now();
    this.logFile = path.join(process.cwd(), 'self-healing-monitor.log');
    this.metricsFile = path.join(process.cwd(), 'system-metrics.json');
    this.issuesFile = path.join(process.cwd(), 'system-issues.json');
    
    this.config = {
      monitoring: {
        enabled: true,
        interval: 30000, // 30 seconds
        healthCheckTimeout: 10000,
        metricsRetention: 86400000 // 24 hours
      },
      selfHealing: {
        enabled: true,
        maxRetries: 3,
        retryDelay: 5000,
        autoRestart: true
      },
      optimization: {
        enabled: true,
        interval: 300000, // 5 minutes
        memoryThreshold: 80,
        cpuThreshold: 70,
        diskThreshold: 85
      },
      alerts: {
        enabled: true,
        channels: ['log', 'console'],
        severity: 'medium'
      }
    };

    this.health = this.initializeHealth();
    this.loadState();
  }

  private initializeHealth(): SystemHealth {
    return {
      overall: 'healthy',
      components: {
        database: 'healthy',
        server: 'healthy',
        dependencies: 'healthy',
        aiServices: 'healthy',
        monitoring: 'healthy',
        network: 'healthy'
      },
      metrics: {
        uptime: 0,
        memory: { usage: 0, available: 0, total: 0 },
        cpu: { usage: 0, cores: os.cpus().length },
        disk: { usage: 0, available: 0, total: 0 },
        responseTime: 0,
        errorRate: 0
      },
      lastCheck: new Date(),
      issues: []
    };
  }

  private loadState(): void {
    try {
      // Load metrics
      if (fs.existsSync(this.metricsFile)) {
        const metricsData = fs.readFileSync(this.metricsFile, 'utf8');
        const savedMetrics = JSON.parse(metricsData);
        this.health.metrics = { ...this.health.metrics, ...savedMetrics };
      }

      // Load issues
      if (fs.existsSync(this.issuesFile)) {
        const issuesData = fs.readFileSync(this.issuesFile, 'utf8');
        this.health.issues = JSON.parse(issuesData);
      }
    } catch (error) {
      this.log('warn', 'Failed to load state, using defaults');
    }
  }

  private saveState(): void {
    try {
      // Save metrics
      fs.writeFileSync(this.metricsFile, JSON.stringify(this.health.metrics, null, 2));
      
      // Save issues
      fs.writeFileSync(this.issuesFile, JSON.stringify(this.health.issues, null, 2));
    } catch (error) {
      this.log('error', `Failed to save state: ${error}`);
    }
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logMessage);
    
    if (this.config.alerts.channels.includes('console')) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }

  // Start monitoring
  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'Monitoring is already running');
      return;
    }

    this.log('info', 'Starting self-healing monitoring system...');
    this.isRunning = true;

    // Start health monitoring
    if (this.config.monitoring.enabled) {
      this.monitoringInterval = setInterval(async () => {
        await this.performHealthCheck();
      }, this.config.monitoring.interval);
      
      this.log('info', `Health monitoring started (interval: ${this.config.monitoring.interval}ms)`);
    }

    // Start optimization
    if (this.config.optimization.enabled) {
      this.optimizationInterval = setInterval(async () => {
        await this.performOptimization();
      }, this.config.optimization.interval);
      
      this.log('info', `System optimization started (interval: ${this.config.optimization.interval}ms)`);
    }

    // Start web dashboard
    this.startWebDashboard();

    this.log('success', 'Self-healing monitoring system started successfully');
  }

  // Stop monitoring
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.log('warn', 'Monitoring is not running');
      return;
    }

    this.log('info', 'Stopping self-healing monitoring system...');
    this.isRunning = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }

    this.log('success', 'Self-healing monitoring system stopped');
  }

  // Perform comprehensive health check
  private async performHealthCheck(): Promise<void> {
    try {
      this.log('info', 'Performing comprehensive health check...');

      // Update uptime
      this.health.metrics.uptime = Date.now() - this.startTime;

      // Check system resources
      await this.checkSystemResources();

      // Check database health
      await this.checkDatabaseHealth();

      // Check server health
      await this.checkServerHealth();

      // Check dependencies health
      await this.checkDependenciesHealth();

      // Check AI services health
      await this.checkAIServicesHealth();

      // Check network health
      await this.checkNetworkHealth();

      // Update overall health status
      this.updateOverallHealth();

      // Save state
      this.saveState();

      // Log health status
      this.logHealthStatus();

      // Perform self-healing if needed
      if (this.config.selfHealing.enabled && this.health.overall !== 'healthy') {
        await this.performSelfHealing();
      }

    } catch (error: any) {
      this.log('error', `Health check failed: ${error.message}`);
      await this.createIssue('system', 'high', `Health check failed: ${error.message}`);
    }
  }

  // Check system resources
  private async checkSystemResources(): Promise<void> {
    try {
      // Memory usage
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsage = (usedMem / totalMem) * 100;

      this.health.metrics.memory = {
        usage: Math.round(memUsage * 100) / 100,
        available: Math.round(freeMem / 1024 / 1024),
        total: Math.round(totalMem / 1024 / 1024)
      };

      // CPU usage (simplified calculation)
      const cpus = os.cpus();
      const cpuUsage = this.calculateCPUUsage();
      this.health.metrics.cpu = {
        usage: Math.round(cpuUsage * 100) / 100,
        cores: cpus.length
      };

      // Disk usage
      const diskUsage = await this.getDiskUsage();
      this.health.metrics.disk = diskUsage;

      // Check for resource thresholds
      if (memUsage > this.config.optimization.memoryThreshold) {
        await this.createIssue('system', 'high', `High memory usage: ${memUsage.toFixed(1)}%`);
      }

      if (cpuUsage > this.config.optimization.cpuThreshold) {
        await this.createIssue('system', 'medium', `High CPU usage: ${cpuUsage.toFixed(1)}%`);
      }

      if (diskUsage.usage > this.config.optimization.diskThreshold) {
        await this.createIssue('system', 'high', `High disk usage: ${diskUsage.usage.toFixed(1)}%`);
      }

    } catch (error: any) {
      this.log('error', `System resource check failed: ${error.message}`);
    }
  }

  // Calculate CPU usage
  private calculateCPUUsage(): number {
    // Simplified CPU usage calculation
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    return totalTick > 0 ? ((totalTick - totalIdle) / totalTick) * 100 : 0;
  }

  // Get disk usage
  private async getDiskUsage(): Promise<{ usage: number; available: number; total: number }> {
    try {
      const result = await this.executeCommand('df -k .', { silent: true });
      if (result.success && result.output) {
        const lines = result.output.split('\n');
        const data = lines[1].split(/\s+/);
        const total = parseInt(data[1]) * 1024; // KB to bytes
        const available = parseInt(data[3]) * 1024; // KB to bytes
        const used = total - available;
        const usage = (used / total) * 100;

        return {
          usage: Math.round(usage * 100) / 100,
          available: Math.round(available / 1024 / 1024),
          total: Math.round(total / 1024 / 1024)
        };
      }
    } catch (error) {
      // Fallback values
      return { usage: 0, available: 0, total: 0 };
    }

    return { usage: 0, available: 0, total: 0 };
  }

  // Check database health
  private async checkDatabaseHealth(): Promise<void> {
    try {
      const startTime = Date.now();
      const result = await this.executeCommand('npx tsx scripts/prisma-database-validator.ts', {
        silent: true,
        timeout: this.config.monitoring.healthCheckTimeout
      });

      const responseTime = Date.now() - startTime;
      this.health.metrics.responseTime = responseTime;

      if (result.success) {
        this.health.components.database = 'healthy';
      } else {
        this.health.components.database = 'unhealthy';
        await this.createIssue('database', 'high', 'Database validation failed');
      }
    } catch (error: any) {
      this.health.components.database = 'unhealthy';
      await this.createIssue('database', 'high', `Database health check failed: ${error.message}`);
    }
  }

  // Check server health
  private async checkServerHealth(): Promise<void> {
    try {
      const startTime = Date.now();
      const result = await this.executeCommand('curl -s http://localhost:3000/api/health', {
        silent: true,
        timeout: this.config.monitoring.healthCheckTimeout
      });

      const responseTime = Date.now() - startTime;
      this.health.metrics.responseTime = Math.max(this.health.metrics.responseTime, responseTime);

      if (result.success) {
        this.health.components.server = 'healthy';
      } else {
        this.health.components.server = 'unhealthy';
        await this.createIssue('server', 'critical', 'Server is not responding');
      }
    } catch (error: any) {
      this.health.components.server = 'unhealthy';
      await this.createIssue('server', 'critical', `Server health check failed: ${error.message}`);
    }
  }

  // Check dependencies health
  private async checkDependenciesHealth(): Promise<void> {
    try {
      const result = await this.executeCommand('npm list next', {
        silent: true,
        timeout: this.config.monitoring.healthCheckTimeout
      });

      if (result.success) {
        this.health.components.dependencies = 'healthy';
      } else {
        this.health.components.dependencies = 'unhealthy';
        await this.createIssue('dependencies', 'high', 'Dependencies check failed');
      }
    } catch (error: any) {
      this.health.components.dependencies = 'unhealthy';
      await this.createIssue('dependencies', 'high', `Dependencies health check failed: ${error.message}`);
    }
  }

  // Check AI services health
  private async checkAIServicesHealth(): Promise<void> {
    try {
      // Check if Z.AI API key is configured
      if (process.env.ZAI_API_KEY) {
        this.health.components.aiServices = 'healthy';
      } else {
        this.health.components.aiServices = 'degraded';
        await this.createIssue('aiServices', 'medium', 'Z.AI API key not configured');
      }
    } catch (error: any) {
      this.health.components.aiServices = 'unhealthy';
      await this.createIssue('aiServices', 'high', `AI services health check failed: ${error.message}`);
    }
  }

  // Check network health
  private async checkNetworkHealth(): Promise<void> {
    try {
      const result = await this.executeCommand('curl -s https://www.google.com --connect-timeout 5', {
        silent: true,
        timeout: this.config.monitoring.healthCheckTimeout
      });

      if (result.success) {
        this.health.components.network = 'healthy';
      } else {
        this.health.components.network = 'degraded';
        await this.createIssue('network', 'medium', 'Network connectivity issues');
      }
    } catch (error: any) {
      this.health.components.network = 'unhealthy';
      await this.createIssue('network', 'high', `Network health check failed: ${error.message}`);
    }
  }

  // Update overall health status
  private updateOverallHealth(): void {
    const components = Object.values(this.health.components);
    const healthyCount = components.filter(status => status === 'healthy').length;
    const unhealthyCount = components.filter(status => status === 'unhealthy').length;
    const degradedCount = components.filter(status => status === 'degraded').length;

    if (unhealthyCount > 0) {
      this.health.overall = 'unhealthy';
    } else if (degradedCount > 0) {
      this.health.overall = 'degraded';
    } else {
      this.health.overall = 'healthy';
    }

    // Update error rate based on issues
    const recentIssues = this.health.issues.filter(issue => 
      !issue.resolved && 
      (Date.now() - issue.timestamp.getTime()) < 300000 // 5 minutes
    );
    this.health.metrics.errorRate = recentIssues.length;
  }

  // Log health status
  private logHealthStatus(): void {
    this.log('info', `Health Status: ${this.health.overall.toUpperCase()}`);
    this.log('info', `Components: ${Object.values(this.health.components).filter(s => s === 'healthy').length}/${Object.keys(this.health.components).length} healthy`);
    this.log('info', `Memory: ${this.health.metrics.memory.usage}% | CPU: ${this.health.metrics.cpu.usage}% | Disk: ${this.health.metrics.disk.usage}%`);
    this.log('info', `Response Time: ${this.health.metrics.responseTime}ms | Error Rate: ${this.health.metrics.errorRate}`);
  }

  // Create system issue
  private async createIssue(
    type: SystemIssue['type'],
    severity: SystemIssue['severity'],
    description: string
  ): Promise<void> {
    const issue: SystemIssue = {
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      timestamp: new Date(),
      resolved: false,
      resolutionAttempts: 0
    };

    this.health.issues.push(issue);
    this.log('warn', `Issue created: ${type} - ${description} (${severity})`);

    // Send alert
    await this.sendAlert(issue);
  }

  // Send alert
  private async sendAlert(issue: SystemIssue): Promise<void> {
    if (!this.config.alerts.enabled) return;

    const alertMessage = `🚨 ${issue.severity.toUpperCase()} Alert: ${issue.description}`;
    
    if (this.config.alerts.channels.includes('console')) {
      console.log(alertMessage);
    }

    if (this.config.alerts.channels.includes('log')) {
      this.log('alert', alertMessage);
    }

    // Add more alert channels here (email, Slack, etc.)
  }

  // Perform self-healing
  private async performSelfHealing(): Promise<void> {
    this.log('info', 'Performing self-healing procedures...');

    const unresolvedIssues = this.health.issues.filter(issue => !issue.resolved);
    
    for (const issue of unresolvedIssues) {
      if (issue.resolutionAttempts >= this.config.selfHealing.maxRetries) {
        this.log('warn', `Max retries reached for issue ${issue.id}, skipping`);
        continue;
      }

      issue.resolutionAttempts++;
      issue.lastAttempt = new Date();

      try {
        const healed = await this.healIssue(issue);
        if (healed) {
          issue.resolved = true;
          this.log('success', `Issue ${issue.id} resolved successfully`);
        } else {
          this.log('warn', `Failed to heal issue ${issue.id} (attempt ${issue.resolutionAttempts})`);
        }
      } catch (error: any) {
        this.log('error', `Error healing issue ${issue.id}: ${error.message}`);
      }
    }

    this.saveState();
  }

  // Heal specific issue
  private async healIssue(issue: SystemIssue): Promise<boolean> {
    this.log('info', `Attempting to heal issue: ${issue.description}`);

    switch (issue.type) {
      case 'database':
        return await this.healDatabaseIssue(issue);
      case 'server':
        return await this.healServerIssue(issue);
      case 'dependencies':
        return await this.healDependenciesIssue(issue);
      case 'system':
        return await this.healSystemIssue(issue);
      default:
        this.log('warn', `No healing procedure for issue type: ${issue.type}`);
        return false;
    }
  }

  // Healing procedures
  private async healDatabaseIssue(issue: SystemIssue): Promise<boolean> {
    try {
      this.log('info', 'Healing database issue...');
      
      // Try to regenerate Prisma client
      await this.executeCommand('npx prisma generate', { silent: true });
      
      // Try to run database migrations
      await this.executeCommand('npm run db:push -- --accept-data-loss', { silent: true });
      
      // Validate database
      const result = await this.executeCommand('npx tsx scripts/prisma-database-validator.ts', { 
        silent: true 
      });
      
      return result.success;
    } catch (error) {
      this.log('error', `Database healing failed: ${error}`);
      return false;
    }
  }

  private async healServerIssue(issue: SystemIssue): Promise<boolean> {
    try {
      this.log('info', 'Healing server issue...');
      
      // Kill existing server process
      await this.executeCommand('pkill -f "node.*3000"', { silent: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Start new server
      const serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });
      
      serverProcess.unref();
      fs.writeFileSync(path.join(process.cwd(), '.server.pid'), serverProcess.pid.toString());
      
      // Wait for server to start
      for (let i = 1; i <= 10; i++) {
        try {
          await this.executeCommand('curl -s http://localhost:3000/api/health', { 
            silent: true,
            timeout: 5000 
          });
          return true;
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      return false;
    } catch (error) {
      this.log('error', `Server healing failed: ${error}`);
      return false;
    }
  }

  private async healDependenciesIssue(issue: SystemIssue): Promise<boolean> {
    try {
      this.log('info', 'Healing dependencies issue...');
      
      // Clean npm cache
      await this.executeCommand('npm cache clean --force', { silent: true });
      
      // Reinstall dependencies
      await this.executeCommand('npm install', { 
        silent: true,
        timeout: 300000 
      });
      
      return true;
    } catch (error) {
      this.log('error', `Dependencies healing failed: ${error}`);
      return false;
    }
  }

  private async healSystemIssue(issue: SystemIssue): Promise<boolean> {
    try {
      this.log('info', 'Healing system issue...');
      
      // Clean up temporary files
      await this.executeCommand('find . -name "*.tmp" -delete', { silent: true });
      
      // Clean up large log files
      await this.executeCommand('find . -name "*.log" -size +10M -exec sh -c \'tail -1000 "$1" > "$1.tmp" && mv "$1.tmp" "$1"\' _ {} \\;', { silent: true });
      
      return true;
    } catch (error) {
      this.log('error', `System healing failed: ${error}`);
      return false;
    }
  }

  // Perform system optimization
  private async performOptimization(): Promise<void> {
    this.log('info', 'Performing system optimization...');

    try {
      // Memory optimization
      if (this.health.metrics.memory.usage > this.config.optimization.memoryThreshold) {
        await this.optimizeMemory();
      }

      // Disk optimization
      if (this.health.metrics.disk.usage > this.config.optimization.diskThreshold) {
        await this.optimizeDisk();
      }

      // Log cleanup
      await this.cleanupLogs();

      this.log('success', 'System optimization completed');
    } catch (error: any) {
      this.log('error', `System optimization failed: ${error.message}`);
    }
  }

  // Memory optimization
  private async optimizeMemory(): Promise<void> {
    this.log('info', 'Optimizing memory usage...');
    
    // Clear npm cache
    await this.executeCommand('npm cache clean --force', { silent: true });
    
    // Restart non-critical services if needed
    if (this.health.metrics.memory.usage > 90) {
      this.log('warn', 'Critical memory usage, consider manual intervention');
    }
  }

  // Disk optimization
  private async optimizeDisk(): Promise<void> {
    this.log('info', 'Optimizing disk usage...');
    
    // Clean up temporary files
    await this.executeCommand('find . -name "*.tmp" -delete', { silent: true });
    await this.executeCommand('find . -name "*.temp" -delete', { silent: true });
    
    // Clean up node_modules if needed
    if (this.health.metrics.disk.usage > 95) {
      this.log('warn', 'Critical disk usage, consider cleaning node_modules');
    }
  }

  // Log cleanup
  private async cleanupLogs(): Promise<void> {
    this.log('info', 'Cleaning up logs...');
    
    const logFiles = ['self-healing-monitor.log', 'system-intelligence.log', 'dependency-manager.log'];
    
    for (const logFile of logFiles) {
      const filePath = path.join(process.cwd(), logFile);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 10 * 1024 * 1024) { // 10MB
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          const lastLines = lines.slice(-1000);
          fs.writeFileSync(filePath, lastLines.join('\n'));
        }
      }
    }
  }

  // Start web dashboard
  private startWebDashboard(): void {
    const server = createServer(async (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      
      if (req.url === '/health') {
        res.end(JSON.stringify(this.health));
      } else if (req.url === '/metrics') {
        res.end(JSON.stringify(this.health.metrics));
      } else if (req.url === '/issues') {
        res.end(JSON.stringify(this.health.issues));
      } else {
        res.end(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: this.health.metrics.uptime,
          health: this.health.overall
        }));
      }
    });

    server.listen(3001, () => {
      this.log('info', 'Web dashboard started on port 3001');
    });
  }

  // Execute command helper
  private async executeCommand(
    command: string,
    options: { 
      cwd?: string; 
      timeout?: number; 
      silent?: boolean;
    } = {}
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const { cwd = process.cwd(), timeout = 10000, silent = false } = options;

    try {
      if (!silent) {
        this.log('info', `Executing: ${command}`);
      }

      const result = execSync(command, { 
        cwd, 
        timeout, 
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit'
      });

      return { success: true, output: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get current health status
  getHealth(): SystemHealth {
    return { ...this.health };
  }

  // Get system metrics
  getMetrics() {
    return { ...this.health.metrics };
  }

  // Get active issues
  getActiveIssues(): SystemIssue[] {
    return this.health.issues.filter(issue => !issue.resolved);
  }
}

// Main execution
async function main() {
  console.log('🤖 OptiMind AI Ecosystem - Self-Healing & Monitoring System');
  console.log('================================================================');

  const monitor = new SelfHealingMonitor();

  try {
    await monitor.start();
    
    console.log('✅ Self-healing monitoring system started');
    console.log('📊 Web dashboard available at: http://localhost:3001');
    console.log('📋 Health endpoints:');
    console.log('   • /health - Full health status');
    console.log('   • /metrics - System metrics');
    console.log('   • /issues - Active issues');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await monitor.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await monitor.stop();
      process.exit(0);
    });

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

export default SelfHealingMonitor;