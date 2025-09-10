#!/usr/bin/env node

// OptiMind AI Ecosystem - Intelligent Server Management System
// AI-Powered Multi-Server Optimization and Conflict Resolution

import { spawn, execSync } from 'child_process';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { setupSocket } from './src/lib/socket-lightning';
import ZAI from 'z-ai-web-dev-sdk';

interface ServerConfig {
  mode: 'nano' | 'micro' | 'ultra' | 'fast' | 'normal';
  port: number;
  priority: number;
  features: string[];
  resourceUsage: 'minimal' | 'low' | 'medium' | 'high';
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  responseTime: number;
}

class OptiMindServerManager {
  private activeServers: Map<string, any> = new Map();
  private systemMetrics: SystemMetrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    responseTime: 0
  };
  private zai: any = null;
  private optimizationInterval: any = null;

  private serverConfigs: ServerConfig[] = [
    {
      mode: 'nano',
      port: 3007,
      priority: 1,
      features: ['basic-routing', 'static-assets'],
      resourceUsage: 'minimal'
    },
    {
      mode: 'micro',
      port: 3006,
      priority: 2,
      features: ['basic-routing', 'static-assets', 'api-endpoints'],
      resourceUsage: 'low'
    },
    {
      mode: 'ultra',
      port: 3005,
      priority: 3,
      features: ['full-routing', 'api-endpoints', 'socket-io'],
      resourceUsage: 'medium'
    },
    {
      mode: 'fast',
      port: 3004,
      priority: 4,
      features: ['full-routing', 'api-endpoints', 'socket-io', 'hot-reload'],
      resourceUsage: 'medium'
    },
    {
      mode: 'normal',
      port: 3002,
      priority: 5,
      features: ['full-routing', 'api-endpoints', 'socket-io', 'hot-reload', 'dev-tools'],
      resourceUsage: 'high'
    }
  ];

  constructor() {
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      this.zai = await ZAI.create();
      console.log('🤖 OptiMind AI Server Manager initialized');
    } catch (error) {
      console.log('⚠️ AI initialization failed, using fallback optimization');
    }
  }

  async start() {
    console.log('🚀 OptiMind AI Ecosystem - Intelligent Server Management');
    console.log('=========================================================');

    // Step 1: Kill all existing processes
    await this.cleanupExistingProcesses();

    // Step 2: Analyze system resources
    await this.analyzeSystemResources();

    // Step 3: Determine optimal server configuration
    const optimalConfig = await this.determineOptimalConfiguration();

    // Step 4: Start optimized server
    await this.startOptimizedServer(optimalConfig);

    // Step 5: Setup monitoring and auto-optimization
    this.setupMonitoring();

    console.log('✅ OptiMind AI Ecosystem - Optimally Configured and Running');
  }

  private async cleanupExistingProcesses() {
    console.log('🧹 Cleaning up existing processes...');
    
    try {
      // Kill all Node.js, Next.js, and TSX processes
      execSync('pkill -9 -f "node|next|tsx" || true', { stdio: 'pipe' });
      execSync('pkill -9 -f "postcss" || true', { stdio: 'pipe' });
      
      // Kill processes on all OptiMind ports
      const ports = [3000, 3002, 3004, 3005, 3006, 3007];
      for (const port of ports) {
        try {
          const pid = execSync(`lsof -ti :${port}`, { stdio: 'pipe' }).toString().trim();
          if (pid) {
            execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
            console.log(`🛑 Killed process on port ${port}`);
          }
        } catch (e) {
          // Port already free
        }
      }
      
      // Wait for processes to fully terminate
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ All existing processes cleaned up');
    } catch (error) {
      console.log('⚠️ Some processes may still be running');
    }
  }

  private async analyzeSystemResources() {
    console.log('📊 Analyzing system resources...');
    
    try {
      // Get CPU usage
      const cpuUsage = this.getCPUUsage();
      
      // Get memory usage
      const memoryUsage = this.getMemoryUsage();
      
      this.systemMetrics = {
        cpuUsage,
        memoryUsage,
        activeConnections: 0,
        responseTime: 0
      };
      
      console.log(`📈 System Analysis - CPU: ${cpuUsage}%, Memory: ${memoryUsage}%`);
      
      // Use AI for advanced analysis if available
      if (this.zai) {
        await this.aiOptimizedAnalysis();
      }
    } catch (error) {
      console.log('⚠️ Using fallback resource analysis');
    }
  }

  private getCPUUsage(): number {
    try {
      const cpuInfo = execSync('top -bn1 | grep "Cpu(s)"', { encoding: 'utf8' });
      const cpuMatch = cpuInfo.match(/(\d+\.?\d*)%id/);
      if (cpuMatch) {
        return 100 - parseFloat(cpuMatch[1]);
      }
    } catch (e) {
      // Fallback
    }
    return Math.random() * 50 + 20; // Random fallback
  }

  private getMemoryUsage(): number {
    try {
      const memInfo = execSync('free -m', { encoding: 'utf8' });
      const lines = memInfo.split('\n');
      const memLine = lines.find(line => line.startsWith('Mem:'));
      if (memLine) {
        const values = memLine.split(/\s+/);
        const total = parseFloat(values[1]);
        const used = parseFloat(values[2]);
        return (used / total) * 100;
      }
    } catch (e) {
      // Fallback
    }
    return Math.random() * 40 + 30; // Random fallback
  }

  private async aiOptimizedAnalysis() {
    try {
      const analysis = await this.zai.functions.invoke('system_optimization', {
        cpu_usage: this.systemMetrics.cpuUsage,
        memory_usage: this.systemMetrics.memoryUsage,
        available_servers: this.serverConfigs.length,
        optimization_goal: 'balanced_performance'
      });
      
      console.log('🤖 AI Analysis Complete:', analysis.recommendations);
    } catch (error) {
      console.log('⚠️ AI analysis failed, using heuristic optimization');
    }
  }

  private async determineOptimalConfiguration(): Promise<ServerConfig> {
    console.log('🎯 Determining optimal server configuration...');
    
    let bestConfig = this.serverConfigs[0]; // Default to nano
    
    // Heuristic optimization based on system resources
    if (this.systemMetrics.cpuUsage < 30 && this.systemMetrics.memoryUsage < 50) {
      bestConfig = this.serverConfigs[4]; // Normal mode - plenty of resources
    } else if (this.systemMetrics.cpuUsage < 60 && this.systemMetrics.memoryUsage < 70) {
      bestConfig = this.serverConfigs[3]; // Fast mode - moderate resources
    } else if (this.systemMetrics.cpuUsage < 80 && this.systemMetrics.memoryUsage < 85) {
      bestConfig = this.serverConfigs[2]; // Ultra mode - limited resources
    } else {
      bestConfig = this.serverConfigs[0]; // Nano mode - very limited resources
    }
    
    console.log(`🎯 Selected ${bestConfig.mode.toUpperCase()} mode (Port: ${bestConfig.port})`);
    console.log(`📋 Features: ${bestConfig.features.join(', ')}`);
    
    return bestConfig;
  }

  private async startOptimizedServer(config: ServerConfig) {
    console.log(`🚀 Starting optimized ${config.mode.toUpperCase()} server...`);
    
    try {
      const startTime = Date.now();
      
      // Create optimized Next.js app
      const nextApp = next({
        dev: true,
        hostname: '0.0.0.0',
        port: config.port,
        dir: process.cwd(),
        quiet: config.resourceUsage === 'minimal',
        turbopack: config.resourceUsage !== 'minimal',
        experimental: {
          // Only enable heavy features in normal mode
          ...(config.mode === 'normal' && {
            incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
          }),
        },
      });

      const handler = nextApp.getRequestHandler();
      const httpServer = createServer(handler);

      // Add Socket.IO if included in features
      if (config.features.includes('socket-io')) {
        const io = new Server(httpServer, {
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          },
          transports: ['websocket'],
          pingTimeout: 30000,
          pingInterval: 15000,
        });
        setupSocket(io);
      }

      // Prepare app
      await nextApp.prepare();

      // Start server
      httpServer.listen(config.port, '0.0.0.0', () => {
        const startupTime = Date.now() - startTime;
        console.log(`✅ ${config.mode.toUpperCase()} server ready in ${startupTime}ms`);
        console.log(`🌐 Access: http://0.0.0.0:${config.port}`);
        console.log(`🔧 Features: ${config.features.join(', ')}`);
        console.log(`💾 Resource Usage: ${config.resourceUsage}`);
      });

      // Store server reference
      this.activeServers.set(config.mode, {
        server: httpServer,
        nextApp,
        config,
        startTime: Date.now()
      });

      // Setup graceful shutdown
      this.setupGracefulShutdown(httpServer);

    } catch (error) {
      console.error(`❌ Failed to start ${config.mode} server:`, error);
      // Fallback to nano mode
      if (config.mode !== 'nano') {
        console.log('🔄 Falling back to NANO mode...');
        await this.startOptimizedServer(this.serverConfigs[0]);
      }
    }
  }

  private setupGracefulShutdown(server: any) {
    const shutdown = async (signal: string) => {
      console.log(`🛑 Received ${signal}, shutting down gracefully...`);
      
      // Close all servers
      for (const [mode, serverInfo] of this.activeServers) {
        console.log(`🛑 Stopping ${mode} server...`);
        serverInfo.server.close(() => {
          console.log(`✅ ${mode} server stopped`);
        });
      }
      
      // Stop monitoring
      if (this.optimizationInterval) {
        clearInterval(this.optimizationInterval);
      }
      
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  private setupMonitoring() {
    console.log('📊 Setting up intelligent monitoring...');
    
    // Monitor system metrics every 30 seconds
    this.optimizationInterval = setInterval(async () => {
      await this.updateSystemMetrics();
      await this.checkOptimizationNeeds();
    }, 30000);
    
    console.log('✅ Intelligent monitoring activated');
  }

  private async updateSystemMetrics() {
    this.systemMetrics = {
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      activeConnections: this.getActiveConnections(),
      responseTime: this.getResponseTime()
    };
  }

  private getActiveConnections(): number {
    // Simulate connection count
    return Math.floor(Math.random() * 50) + 10;
  }

  private getResponseTime(): number {
    // Simulate response time in ms
    return Math.random() * 200 + 50;
  }

  private async checkOptimizationNeeds() {
    const { cpuUsage, memoryUsage } = this.systemMetrics;
    
    // Check if we need to optimize
    if (cpuUsage > 90 || memoryUsage > 90) {
      console.log('⚠️ High resource usage detected, optimizing...');
      await this.optimizeForHighLoad();
    } else if (cpuUsage < 20 && memoryUsage < 30) {
      console.log('📈 Low resource usage, considering enhanced features...');
      await this.optimizeForLowLoad();
    }
  }

  private async optimizeForHighLoad() {
    // Find the current running server
    const currentServer = Array.from(this.activeServers.values())[0];
    if (!currentServer) return;
    
    const currentMode = currentServer.config.mode;
    
    // If we're not already in nano mode, downgrade
    if (currentMode !== 'nano') {
      console.log('🔄 Downgrading to NANO mode for better performance...');
      await this.restartWithMode('nano');
    }
  }

  private async optimizeForLowLoad() {
    // Find the current running server
    const currentServer = Array.from(this.activeServers.values())[0];
    if (!currentServer) return;
    
    const currentMode = currentServer.config.mode;
    
    // If we're in nano mode, consider upgrading
    if (currentMode === 'nano') {
      console.log('🔄 Upgrading to ULTRA mode for enhanced features...');
      await this.restartWithMode('ultra');
    }
  }

  private async restartWithMode(mode: string) {
    const config = this.serverConfigs.find(c => c.mode === mode);
    if (!config) return;
    
    // Stop current server
    const currentServer = Array.from(this.activeServers.values())[0];
    if (currentServer) {
      currentServer.server.close(() => {
        console.log(`🛑 Stopped previous server`);
      });
      this.activeServers.clear();
    }
    
    // Start new server
    await this.startOptimizedServer(config);
  }
}

// Start the intelligent server manager
const manager = new OptiMindServerManager();
manager.start().catch(error => {
  console.error('💥 OptiMind Server Manager failed:', error);
  process.exit(1);
});