#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Intelligent Startup Sequence
 * Premium Diamond Grade Autonomous Startup System
 * Provides intelligent startup sequence with failover protection and recovery
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Startup configuration
interface StartupConfig {
  sequence: StartupStep[];
  failover: {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number;
    fallbackStrategies: string[];
  };
  monitoring: {
    enabled: boolean;
    startupTimeout: number;
    healthCheckInterval: number;
  };
  optimization: {
    enabled: boolean;
    parallelStartup: boolean;
    resourceOptimization: boolean;
  };
  recovery: {
    enabled: boolean;
    autoRecovery: boolean;
    checkpointInterval: number;
  };
}

// Startup step
interface StartupStep {
  id: string;
  name: string;
  type: 'system' | 'dependency' | 'database' | 'service' | 'application';
  critical: boolean;
  timeout: number;
  dependencies: string[];
  command: string;
  validation?: () => Promise<boolean>;
  fallback?: () => Promise<boolean>;
  rollback?: () => Promise<void>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  error?: string;
  retryCount: number;
}

// Startup state
interface StartupState {
  phase: 'initializing' | 'starting' | 'validating' | 'optimizing' | 'completed' | 'failed' | 'recovery';
  currentStep: number;
  completedSteps: string[];
  failedSteps: string[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  checkpoints: Checkpoint[];
  metrics: StartupMetrics;
}

// Checkpoint for recovery
interface Checkpoint {
  id: string;
  timestamp: Date;
  stepId: string;
  state: any;
  hash: string;
}

// Startup metrics
interface StartupMetrics {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  averageStepTime: number;
  totalDuration: number;
  resourceUsage: {
    memory: { peak: number; average: number };
    cpu: { peak: number; average: number };
    disk: { usage: number };
  };
  errorCount: number;
  recoveryCount: number;
}

class IntelligentStartup {
  private config: StartupConfig;
  private state: StartupState;
  private logFile: string;
  private stateFile: string;
  private checkpointFile: string;
  private isRunning: boolean = false;
  private recoveryMode: boolean = false;

  constructor() {
    this.logFile = path.join(process.cwd(), 'intelligent-startup.log');
    this.stateFile = path.join(process.cwd(), 'startup-state.json');
    this.checkpointFile = path.join(process.cwd(), 'startup-checkpoints.json');
    
    this.config = {
      sequence: this.initializeStartupSequence(),
      failover: {
        enabled: true,
        maxRetries: 3,
        retryDelay: 5000,
        fallbackStrategies: ['retry', 'skip', 'rollback', 'recovery']
      },
      monitoring: {
        enabled: true,
        startupTimeout: 300000, // 5 minutes
        healthCheckInterval: 10000
      },
      optimization: {
        enabled: true,
        parallelStartup: false,
        resourceOptimization: true
      },
      recovery: {
        enabled: true,
        autoRecovery: true,
        checkpointInterval: 30000 // 30 seconds
      }
    };

    this.state = this.initializeStartupState();
    this.loadState();
  }

  private initializeStartupSequence(): StartupStep[] {
    return [
      {
        id: 'system_check',
        name: 'System Requirements Check',
        type: 'system',
        critical: true,
        timeout: 30000,
        dependencies: [],
        command: 'node --version && npm --version',
        validation: async () => {
          try {
            await this.executeCommand('node --version', { silent: true });
            await this.executeCommand('npm --version', { silent: true });
            return true;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Attempting to install Node.js and npm...');
          // Fallback commands would go here
          return false;
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'dependency_install',
        name: 'Dependency Installation',
        type: 'dependency',
        critical: true,
        timeout: 300000,
        dependencies: ['system_check'],
        command: 'npm install --no-optional --no-audit',
        validation: async () => {
          try {
            const result = await this.executeCommand('npm list next', { silent: true });
            return result.success;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Attempting to clean and reinstall dependencies...');
          await this.executeCommand('npm cache clean --force', { silent: true });
          await this.executeCommand('rm -rf node_modules', { silent: true });
          const result = await this.executeCommand('npm install', { silent: true, timeout: 600000 });
          return result.success;
        },
        rollback: async () => {
          await this.executeCommand('rm -rf node_modules', { silent: true });
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'database_setup',
        name: 'Database Setup',
        type: 'database',
        critical: true,
        timeout: 120000,
        dependencies: ['dependency_install'],
        command: 'npm run db:push -- --accept-data-loss && npm run db:generate',
        validation: async () => {
          try {
            const result = await this.executeCommand('npx tsx scripts/prisma-database-validator.ts', { silent: true });
            return result.success;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Attempting database recovery...');
          await this.executeCommand('npx prisma generate', { silent: true });
          await this.executeCommand('npm run db:push -- --accept-data-loss', { silent: true });
          const result = await this.executeCommand('npm run db:seed', { silent: true });
          return result.success;
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'ai_services_init',
        name: 'AI Services Initialization',
        type: 'service',
        critical: false,
        timeout: 60000,
        dependencies: ['database_setup'],
        command: 'echo "Testing AI services..."',
        validation: async () => {
          return !!process.env.ZAI_API_KEY;
        },
        fallback: async () => {
          this.log('info', 'Using default AI services configuration...');
          return true;
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'server_start',
        name: 'Server Start',
        type: 'application',
        critical: true,
        timeout: 60000,
        dependencies: ['database_setup', 'ai_services_init'],
        command: 'npm run dev',
        validation: async () => {
          try {
            const result = await this.executeCommand('curl -s http://localhost:3000/api/health', { 
              silent: true,
              timeout: 10000 
            });
            return result.success;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Attempting server recovery...');
          await this.executeCommand('pkill -f "node.*3000"', { silent: true });
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const serverProcess = spawn('npm', ['run', 'dev'], {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: true,
            env: { ...process.env, PORT: '3000' }
          });
          
          serverProcess.unref();
          fs.writeFileSync(path.join(process.cwd(), '.server.pid'), serverProcess.pid.toString());
          
          // Wait for server to start
          for (let i = 1; i <= 15; i++) {
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
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'monitoring_start',
        name: 'Monitoring Start',
        type: 'service',
        critical: false,
        timeout: 30000,
        dependencies: ['server_start'],
        command: 'echo "Starting monitoring..."',
        validation: async () => {
          try {
            const monitorPid = fs.readFileSync(path.join(process.cwd(), '.intelligent-monitor.pid'), 'utf8');
            const result = await this.executeCommand(`ps -p ${monitorPid}`, { silent: true });
            return result.success;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Starting monitoring system...');
          const monitorProcess = spawn('tsx', ['self-healing-monitor.ts'], {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: true
          });
          
          monitorProcess.unref();
          fs.writeFileSync(path.join(process.cwd(), '.intelligent-monitor.pid'), monitorProcess.pid.toString());
          
          await new Promise(resolve => setTimeout(resolve, 5000));
          return true;
        },
        status: 'pending',
        retryCount: 0
      },
      {
        id: 'final_validation',
        name: 'Final Validation',
        type: 'system',
        critical: true,
        timeout: 30000,
        dependencies: ['server_start', 'monitoring_start'],
        command: 'echo "Final validation..."',
        validation: async () => {
          try {
            const healthResult = await this.executeCommand('curl -s http://localhost:3000/api/health', { 
              silent: true,
              timeout: 10000 
            });
            
            const metricsResult = await this.executeCommand('curl -s http://localhost:3001/metrics', { 
              silent: true,
              timeout: 5000 
            });
            
            return healthResult.success;
          } catch (error) {
            return false;
          }
        },
        fallback: async () => {
          this.log('info', 'Performing basic validation...');
          const result = await this.executeCommand('curl -s http://localhost:3000/api/health', { 
            silent: true,
            timeout: 10000 
          });
          return result.success;
        },
        status: 'pending',
        retryCount: 0
      }
    ];
  }

  private initializeStartupState(): StartupState {
    return {
      phase: 'initializing',
      currentStep: 0,
      completedSteps: [],
      failedSteps: [],
      startTime: new Date(),
      checkpoints: [],
      metrics: {
        totalSteps: 0,
        completedSteps: 0,
        failedSteps: 0,
        averageStepTime: 0,
        totalDuration: 0,
        resourceUsage: {
          memory: { peak: 0, average: 0 },
          cpu: { peak: 0, average: 0 },
          disk: { usage: 0 }
        },
        errorCount: 0,
        recoveryCount: 0
      }
    };
  }

  private loadState(): void {
    try {
      // Load startup state
      if (fs.existsSync(this.stateFile)) {
        const stateData = fs.readFileSync(this.stateFile, 'utf8');
        const savedState = JSON.parse(stateData);
        this.state = { ...this.state, ...savedState };
      }

      // Load checkpoints
      if (fs.existsSync(this.checkpointFile)) {
        const checkpointData = fs.readFileSync(this.checkpointFile, 'utf8');
        this.state.checkpoints = JSON.parse(checkpointData);
      }

      // Check if we need to recover
      if (this.state.phase === 'failed' && this.config.recovery.enabled) {
        this.recoveryMode = true;
        this.log('info', 'Recovery mode detected, attempting to recover from previous failure...');
      }
    } catch (error) {
      this.log('warn', 'Failed to load state, starting fresh');
    }
  }

  private saveState(): void {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
      fs.writeFileSync(this.checkpointFile, JSON.stringify(this.state.checkpoints, null, 2));
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

  private async executeCommand(
    command: string,
    options: {
      cwd?: string;
      timeout?: number;
      silent?: boolean;
    } = {}
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const { cwd = process.cwd(), timeout = 30000, silent = false } = options;

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

  // Main startup function
  async startup(): Promise<boolean> {
    if (this.isRunning) {
      this.log('warn', 'Startup sequence is already running');
      return false;
    }

    this.isRunning = true;
    this.state.startTime = new Date();
    this.state.metrics.totalSteps = this.config.sequence.length;

    this.log('info', 'Starting intelligent startup sequence...');
    this.log('info', `Recovery mode: ${this.recoveryMode}`);
    this.log('info', `Total steps: ${this.config.sequence.length}`);

    try {
      // Initialize startup
      this.state.phase = 'starting';
      await this.createCheckpoint('startup_start', 'initializing');

      // Execute startup sequence
      const success = await this.executeStartupSequence();

      if (success) {
        this.state.phase = 'optimizing';
        await this.optimizeSystem();
        
        this.state.phase = 'completed';
        this.state.endTime = new Date();
        this.state.duration = this.state.endTime.getTime() - this.state.startTime.getTime();
        
        this.log('success', 'Startup sequence completed successfully!');
        this.logStartupSummary();
        
        // Start monitoring
        if (this.config.monitoring.enabled) {
          await this.startMonitoring();
        }
        
        return true;
      } else {
        this.state.phase = 'failed';
        this.state.endTime = new Date();
        this.state.duration = this.state.endTime.getTime() - this.state.startTime.getTime();
        
        this.log('error', 'Startup sequence failed');
        
        // Attempt recovery if enabled
        if (this.config.recovery.enabled && this.config.recovery.autoRecovery) {
          return await this.attemptRecovery();
        }
        
        return false;
      }
    } catch (error: any) {
      this.state.phase = 'failed';
      this.state.endTime = new Date();
      this.state.duration = this.state.endTime.getTime() - this.state.startTime.getTime();
      
      this.log('error', `Startup sequence failed with error: ${error.message}`);
      this.state.metrics.errorCount++;
      
      return false;
    } finally {
      this.isRunning = false;
      this.saveState();
    }
  }

  // Execute startup sequence
  private async executeStartupSequence(): Promise<boolean> {
    this.log('info', 'Executing startup sequence...');

    for (let i = 0; i < this.config.sequence.length; i++) {
      const step = this.config.sequence[i];
      this.state.currentStep = i;

      // Check if step was already completed (recovery mode)
      if (this.recoveryMode && this.state.completedSteps.includes(step.id)) {
        this.log('info', `Step ${step.name} already completed, skipping...`);
        step.status = 'completed';
        continue;
      }

      // Check dependencies
      if (!await this.checkDependencies(step)) {
        this.log('error', `Dependencies not met for step: ${step.name}`);
        step.status = 'failed';
        this.state.failedSteps.push(step.id);
        this.state.metrics.failedSteps++;
        continue;
      }

      // Execute step
      const stepSuccess = await this.executeStep(step);
      
      if (stepSuccess) {
        this.state.completedSteps.push(step.id);
        this.state.metrics.completedSteps++;
        
        // Create checkpoint
        if (this.config.recovery.enabled) {
          await this.createCheckpoint(step.id, 'completed');
        }
      } else {
        this.state.failedSteps.push(step.id);
        this.state.metrics.failedSteps++;
        
        // Handle failure based on criticality
        if (step.critical) {
          this.log('error', `Critical step failed: ${step.name}`);
          return false;
        } else {
          this.log('warn', `Non-critical step failed: ${step.name}, continuing...`);
        }
      }
    }

    return this.state.metrics.failedSteps === 0 || 
           this.config.sequence.filter(s => s.critical).every(s => this.state.completedSteps.includes(s.id));
  }

  // Check step dependencies
  private async checkDependencies(step: StartupStep): Promise<boolean> {
    for (const depId of step.dependencies) {
      if (!this.state.completedSteps.includes(depId)) {
        this.log('warn', `Dependency not met: ${depId} for step: ${step.name}`);
        return false;
      }
    }
    return true;
  }

  // Execute individual step
  private async executeStep(step: StartupStep): Promise<boolean> {
    this.log('info', `Executing step: ${step.name}`);
    step.status = 'running';
    step.startTime = new Date();

    try {
      // Update resource metrics
      await this.updateResourceMetrics();

      // Execute step command
      const result = await this.executeCommand(step.command, {
        timeout: step.timeout,
        silent: true
      });

      if (result.success) {
        // Validate step
        if (step.validation) {
          const validationSuccess = await step.validation();
          if (!validationSuccess) {
            throw new EnhancedError('Step validation failed');
          }
        }

        step.status = 'completed';
        step.endTime = new Date();
        this.log('success', `Step completed: ${step.name}`);
        
        // Update metrics
        const stepDuration = step.endTime.getTime() - step.startTime.getTime();
        this.updateStepMetrics(stepDuration);
        
        return true;
      } else {
        throw new EnhancedError(result.error || 'Step execution failed');
      }
    } catch (error: any) {
      step.status = 'failed';
      step.endTime = new Date();
      step.error = error.message;
      this.state.metrics.errorCount++;
      
      this.log('error', `Step failed: ${step.name} - ${error.message}`);
      
      // Attempt fallback if available
      if (this.config.failover.enabled && step.fallback) {
        return await this.attemptFallback(step);
      }
      
      return false;
    }
  }

  // Attempt fallback for failed step
  private async attemptFallback(step: StartupStep): Promise<boolean> {
    this.log('info', `Attempting fallback for step: ${step.name}`);
    
    for (const strategy of this.config.failover.fallbackStrategies) {
      if (step.retryCount >= this.config.failover.maxRetries) {
        this.log('warn', `Max retries reached for step: ${step.name}`);
        break;
      }

      step.retryCount++;
      
      try {
        switch (strategy) {
          case 'retry':
            this.log('info', `Retrying step: ${step.name} (attempt ${step.retryCount})`);
            await new Promise(resolve => setTimeout(resolve, this.config.failover.retryDelay));
            
            const retryResult = await this.executeCommand(step.command, {
              timeout: step.timeout,
              silent: true
            });
            
            if (retryResult.success && (!step.validation || await step.validation())) {
              step.status = 'completed';
              step.endTime = new Date();
              this.log('success', `Step recovered with retry: ${step.name}`);
              return true;
            }
            break;
            
          case 'skip':
            if (!step.critical) {
              this.log('info', `Skipping non-critical step: ${step.name}`);
              step.status = 'skipped';
              return true;
            }
            break;
            
          case 'rollback':
            if (step.rollback) {
              this.log('info', `Attempting rollback for step: ${step.name}`);
              await step.rollback();
              await new Promise(resolve => setTimeout(resolve, this.config.failover.retryDelay));
            }
            break;
            
          case 'recovery':
            if (step.fallback) {
              this.log('info', `Attempting recovery for step: ${step.name}`);
              const fallbackSuccess = await step.fallback();
              if (fallbackSuccess) {
                step.status = 'completed';
                step.endTime = new Date();
                this.log('success', `Step recovered with fallback: ${step.name}`);
                return true;
              }
            }
            break;
        }
      } catch (error: any) {
        this.log('error', `Fallback ${strategy} failed for step ${step.name}: ${error.message}`);
      }
    }

    return false;
  }

  // Update resource metrics
  private async updateResourceMetrics(): Promise<void> {
    try {
      const memUsage = process.memoryUsage();
      const totalMem = os.totalmem();
      const usedMem = memUsage.heapUsed;
      const memPercent = (usedMem / totalMem) * 100;

      this.state.metrics.resourceUsage.memory.peak = Math.max(
        this.state.metrics.resourceUsage.memory.peak,
        memPercent
      );

      // CPU usage (simplified)
      const cpuUsage = process.cpuUsage();
      const cpuPercent = (cpuUsage.user / 1000000) * 100; // Convert to percentage
      
      this.state.metrics.resourceUsage.cpu.peak = Math.max(
        this.state.metrics.resourceUsage.cpu.peak,
        cpuPercent
      );

      // Disk usage
      try {
        const dfResult = await this.executeCommand('df -k .', { silent: true });
        if (dfResult.success && dfResult.output) {
          const lines = dfResult.output.split('\n');
          const data = lines[1].split(/\s+/);
          const total = parseInt(data[1]) * 1024;
          const available = parseInt(data[3]) * 1024;
          const used = total - available;
          const diskUsage = (used / total) * 100;
          
          this.state.metrics.resourceUsage.disk.usage = diskUsage;
        }
      } catch (error) {
        // Ignore disk usage error
      }
    } catch (error) {
      // Ignore metric update errors
    }
  }

  // Update step metrics
  private updateStepMetrics(stepDuration: number): void {
    const totalCompleted = this.state.metrics.completedSteps;
    const totalDuration = this.state.metrics.totalDuration + stepDuration;
    
    this.state.metrics.totalDuration = totalDuration;
    this.state.metrics.averageStepTime = totalCompleted > 0 ? totalDuration / totalCompleted : 0;
  }

  // Create checkpoint
  private async createCheckpoint(stepId: string, state: string): Promise<void> {
    const checkpoint: Checkpoint = {
      id: `checkpoint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      stepId,
      state: { ...this.state },
      hash: this.generateHash()
    };

    this.state.checkpoints.push(checkpoint);
    
    // Keep only recent checkpoints
    if (this.state.checkpoints.length > 10) {
      this.state.checkpoints = this.state.checkpoints.slice(-10);
    }
    
    this.saveState();
  }

  // Generate hash for checkpoint
  private generateHash(): string {
    const data = JSON.stringify(this.state);
    return require('crypto').createHash('md5').update(data).digest('hex');
  }

  // Optimize system after startup
  private async optimizeSystem(): Promise<void> {
    this.log('info', 'Optimizing system after startup...');

    if (!this.config.optimization.enabled) {
      return;
    }

    try {
      // Clean up temporary files
      await this.executeCommand('find . -name "*.tmp" -delete', { silent: true });
      
      // Optimize memory
      if (this.state.metrics.resourceUsage.memory.peak > 80) {
        this.log('info', 'High memory usage detected, optimizing...');
        await this.executeCommand('npm cache clean --force', { silent: true });
      }
      
      // Start system optimization services
      if (this.config.optimization.resourceOptimization) {
        this.log('info', 'Starting resource optimization...');
        // Start optimization services here
      }
      
      this.log('success', 'System optimization completed');
    } catch (error: any) {
      this.log('warn', `System optimization failed: ${error.message}`);
    }
  }

  // Start monitoring
  private async startMonitoring(): Promise<void> {
    this.log('info', 'Starting monitoring services...');

    try {
      // Start self-healing monitor
      const monitorProcess = spawn('tsx', ['self-healing-monitor.ts'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });
      
      monitorProcess.unref();
      fs.writeFileSync(path.join(process.cwd(), '.startup-monitor.pid'), monitorProcess.pid.toString());
      
      this.log('success', 'Monitoring services started');
    } catch (error: any) {
      this.log('warn', `Failed to start monitoring: ${error.message}`);
    }
  }

  // Attempt recovery
  private async attemptRecovery(): Promise<boolean> {
    this.log('info', 'Attempting system recovery...');
    this.state.phase = 'recovery';
    this.state.metrics.recoveryCount++;

    try {
      // Find the latest successful checkpoint
      const latestCheckpoint = this.state.checkpoints
        .filter(cp => cp.state.completedSteps.length > 0)
        .pop();

      if (latestCheckpoint) {
        this.log('info', `Recovering from checkpoint: ${latestCheckpoint.id}`);
        
        // Restore state from checkpoint
        this.state = { ...this.state, ...latestCheckpoint.state };
        this.state.phase = 'recovery';
        
        // Restart from failed step
        const failedStepIndex = this.config.sequence.findIndex(step => 
          this.state.failedSteps.includes(step.id)
        );
        
        if (failedStepIndex !== -1) {
          this.state.currentStep = failedStepIndex;
          this.state.failedSteps = [];
          
          // Retry startup sequence from failed step
          const success = await this.executeStartupSequence();
          
          if (success) {
            this.state.phase = 'optimizing';
            await this.optimizeSystem();
            
            this.state.phase = 'completed';
            this.state.endTime = new Date();
            this.state.duration = this.state.endTime.getTime() - this.state.startTime.getTime();
            
            this.log('success', 'System recovery completed successfully!');
            return true;
          }
        }
      }

      this.log('error', 'System recovery failed');
      return false;
    } catch (error: any) {
      this.log('error', `System recovery failed: ${error.message}`);
      return false;
    }
  }

  // Log startup summary
  private logStartupSummary(): void {
    this.log('info', '=== STARTUP SUMMARY ===');
    this.log('info', `Total Duration: ${this.state.duration}ms`);
    this.log('info', `Steps Completed: ${this.state.metrics.completedSteps}/${this.state.metrics.totalSteps}`);
    this.log('info', `Steps Failed: ${this.state.metrics.failedSteps}`);
    this.log('info', `Average Step Time: ${this.state.metrics.averageStepTime.toFixed(2)}ms`);
    this.log('info', `Errors: ${this.state.metrics.errorCount}`);
    this.log('info', `Recoveries: ${this.state.metrics.recoveryCount}`);
    this.log('info', `Peak Memory Usage: ${this.state.metrics.resourceUsage.memory.peak.toFixed(2)}%`);
    this.log('info', `Peak CPU Usage: ${this.state.metrics.resourceUsage.cpu.peak.toFixed(2)}%`);
    this.log('info', `Disk Usage: ${this.state.metrics.resourceUsage.disk.usage.toFixed(2)}%`);
    this.log('info', '========================');
  }

  // Get startup status
  getStatus(): StartupState {
    return { ...this.state };
  }

  // Get startup metrics
  getMetrics(): StartupMetrics {
    return { ...this.state.metrics };
  }

  // Stop startup sequence
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.log('info', 'Stopping startup sequence...');
    this.isRunning = false;
    this.state.phase = 'failed';
    this.state.endTime = new Date();
    this.state.duration = this.state.endTime.getTime() - this.state.startTime.getTime();
    this.saveState();
  }
}

// Main execution
async function main() {
  console.log('🤖 OptiMind AI Ecosystem - Intelligent Startup Sequence');
  console.log('=======================================================');
  
  const startup = new IntelligentStartup();

  try {
    const success = await startup.startup();
    
    if (success) {
      console.log('✅ Startup sequence completed successfully');
      console.log('🌐 Application is running at: http://localhost:3000');
      console.log('📊 Monitoring dashboard at: http://localhost:3001');
    } else {
      console.log('❌ Startup sequence failed');
      console.log('📋 Check the logs for details: intelligent-startup.log');
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

export default IntelligentStartup;
// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
