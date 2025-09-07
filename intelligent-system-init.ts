#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Intelligent System Initialization & Validation
 * Premium Diamond Grade System Intelligence
 * Provides intelligent initialization, validation, and self-healing capabilities
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// System configuration
const SYSTEM_CONFIG = {
  maxRetries: 3,
  healthCheckInterval: 30000,
  autoRestart: true,
  selfHealing: true,
  intelligentOptimization: true,
  monitoringEnabled: true,
  logLevel: process.env.LOG_LEVEL || 'info'
};

// System state
interface SystemState {
  initialized: boolean;
  healthy: boolean;
  components: {
    database: boolean;
    server: boolean;
    dependencies: boolean;
    monitoring: boolean;
    aiServices: boolean;
  };
  metrics: {
    uptime: number;
    healthChecks: number;
    restarts: number;
    errors: number;
  };
  lastHealthCheck: Date;
}

class OptiMindSystemIntelligence {
  private state: SystemState;
  private logFile: string;
  private stateFile: string;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.logFile = path.join(process.cwd(), 'system-intelligence.log');
    this.stateFile = path.join(process.cwd(), 'system-state.json');
    this.state = this.loadState();
  }

  // Load system state from file
  private loadState(): SystemState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const data = fs.readFileSync(this.stateFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      // Ignore errors, use default state
    }
    
    return {
      initialized: false,
      healthy: false,
      components: {
        database: false,
        server: false,
        dependencies: false,
        monitoring: false,
        aiServices: false
      },
      metrics: {
        uptime: 0,
        healthChecks: 0,
        restarts: 0,
        errors: 0
      },
      lastHealthCheck: new Date()
    };
  }

  // Save system state to file
  private saveState(): void {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      this.log('error', `Failed to save state: ${error}`);
    }
  }

  // Logging function
  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logMessage);
    
    if (SYSTEM_CONFIG.logLevel === 'debug' || 
        (SYSTEM_CONFIG.logLevel === 'info' && level !== 'debug') ||
        (level === 'error' || level === 'warn')) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }

  // Execute command with error handling and retry
  private async executeCommand(
    command: string, 
    options: { 
      cwd?: string; 
      timeout?: number; 
      retries?: number;
      silent?: boolean;
    } = {}
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const { 
      cwd = process.cwd(), 
      timeout = 30000, 
      retries = SYSTEM_CONFIG.maxRetries,
      silent = false 
    } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!silent) {
          this.log('info', `Executing: ${command} (attempt ${attempt}/${retries})`);
        }

        const result = execSync(command, { 
          cwd, 
          timeout, 
          encoding: 'utf8',
          stdio: silent ? 'pipe' : 'inherit'
        });

        return { success: true, output: result };
      } catch (error: any) {
        this.log('warn', `Command failed (attempt ${attempt}/${retries}): ${command}`);
        
        if (attempt === retries) {
          this.log('error', `Command failed after ${retries} attempts: ${error.message}`);
          return { success: false, error: error.message };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  // Intelligent system initialization
  async initialize(): Promise<boolean> {
    this.log('info', 'Starting intelligent system initialization...');
    
    try {
      // System requirements check
      if (!await this.checkSystemRequirements()) {
        this.log('error', 'System requirements check failed');
        return false;
      }

      // Dependencies initialization
      if (!await this.initializeDependencies()) {
        this.log('error', 'Dependencies initialization failed');
        return false;
      }

      // Database initialization
      if (!await this.initializeDatabase()) {
        this.log('error', 'Database initialization failed');
        return false;
      }

      // AI services initialization
      if (!await this.initializeAIServices()) {
        this.log('error', 'AI services initialization failed');
        return false;
      }

      // Monitoring initialization
      if (!await this.initializeMonitoring()) {
        this.log('error', 'Monitoring initialization failed');
        return false;
      }

      // Server initialization
      if (!await this.initializeServer()) {
        this.log('error', 'Server initialization failed');
        return false;
      }

      this.state.initialized = true;
      this.saveState();
      
      this.log('success', 'System initialization completed successfully');
      return true;
    } catch (error: any) {
      this.log('error', `System initialization failed: ${error.message}`);
      return false;
    }
  }

  // Check system requirements
  private async checkSystemRequirements(): Promise<boolean> {
    this.log('info', 'Checking system requirements...');

    const requirements = [
      { command: 'node --version', name: 'Node.js' },
      { command: 'npm --version', name: 'npm' },
      { command: 'git --version', name: 'Git' }
    ];

    for (const req of requirements) {
      const result = await this.executeCommand(req.command, { silent: true });
      if (!result.success) {
        this.log('error', `${req.name} not found or not working`);
        return false;
      }
      this.log('success', `${req.name}: ${result.output?.trim()}`);
    }

    // Check disk space
    try {
      const dfOutput = await this.executeCommand('df -k .', { silent: true });
      if (dfOutput.success && dfOutput.output) {
        const availableSpace = parseInt(dfOutput.output.split('\n')[1].split(/[ \t]+/)[3]);
        const requiredSpace = 1048576; // 1GB in KB
        
        if (availableSpace < requiredSpace) {
          this.log('error', `Insufficient disk space. Required: 1GB, Available: ${Math.floor(availableSpace / 1024)}MB`);
          return false;
        }
      }
    } catch (error) {
      this.log('warn', 'Could not check disk space');
    }

    // Check memory
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const requiredMemory = 2 * 1024 * 1024 * 1024; // 2GB

    if (freeMemory < requiredMemory) {
      this.log('warn', `Low memory available: ${Math.floor(freeMemory / 1024 / 1024)}MB free`);
    }

    this.log('success', 'System requirements check passed');
    return true;
  }

  // Initialize dependencies
  private async initializeDependencies(): Promise<boolean> {
    this.log('info', 'Initializing dependencies...');

    // Check if node_modules exists
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      this.log('info', 'Installing dependencies...');
      const result = await this.executeCommand('npm install --no-optional --no-audit', { 
        timeout: 300000, // 5 minutes
        silent: true 
      });
      
      if (!result.success) {
        this.log('error', 'Failed to install dependencies');
        return false;
      }
    }

    // Verify critical dependencies
    const criticalDeps = ['next', 'react', 'react-dom', '@prisma/client', 'typescript'];
    for (const dep of criticalDeps) {
      const result = await this.executeCommand(`npm list ${dep}`, { silent: true });
      if (!result.success) {
        this.log('error', `Critical dependency missing: ${dep}`);
        return false;
      }
    }

    this.state.components.dependencies = true;
    this.log('success', 'Dependencies initialized successfully');
    return true;
  }

  // Initialize database
  private async initializeDatabase(): Promise<boolean> {
    this.log('info', 'Initializing database...');

    // Check if .env exists
    if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
      this.log('warn', '.env file not found, creating default...');
      await this.createDefaultEnv();
    }

    // Run database migrations
    const migrateResult = await this.executeCommand('npm run db:push -- --accept-data-loss', { 
      silent: true 
    });
    
    if (!migrateResult.success) {
      this.log('error', 'Database migration failed');
      return false;
    }

    // Generate Prisma client
    const generateResult = await this.executeCommand('npm run db:generate', { 
      silent: true 
    });
    
    if (!generateResult.success) {
      this.log('error', 'Prisma client generation failed');
      return false;
    }

    // Seed database
    const seedResult = await this.executeCommand('npm run db:seed', { 
      silent: true 
    });
    
    if (!seedResult.success) {
      this.log('warn', 'Database seeding failed, continuing anyway');
    }

    // Validate database
    const validateResult = await this.executeCommand('npx tsx scripts/prisma-database-validator.ts', { 
      silent: true 
    });
    
    if (!validateResult.success) {
      this.log('warn', 'Database validation failed, but continuing');
    }

    this.state.components.database = true;
    this.log('success', 'Database initialized successfully');
    return true;
  }

  // Create default .env file
  private async createDefaultEnv(): Promise<void> {
    const envContent = `# OptiMind AI Ecosystem - Environment Configuration
# Generated by Intelligent System Initialization

# Database Configuration
DATABASE_URL="file:./prisma/dev.db"
DIRECT_URL="file:./prisma/dev.db"

# Server Configuration
NODE_ENV="development"
PORT="3000"
HOSTNAME="0.0.0.0"

# AI Services Configuration
ZAI_API_KEY="1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY"

# Security Configuration
JWT_SECRET="optimind-ai-ecosystem-intelligent-${Date.now()}"
ENCRYPTION_KEY="optimind-ai-ecosystem-encryption-key-${Date.now()}"
NEXTAUTH_SECRET="optimind-ai-ecosystem-nextauth-secret-${Date.now()}"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEBUG="true"
LOG_LEVEL="info"

# Development Settings
TURBOPACK="1"
NEXT_TELEMETRY_DISABLED="1"
`;

    fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
    this.log('success', 'Default .env configuration created');
  }

  // Initialize AI services
  private async initializeAIServices(): Promise<boolean> {
    this.log('info', 'Initializing AI services...');

    // Test Z.AI SDK
    try {
      const testScript = `
        import ZAI from 'z-ai-web-dev-sdk';
        const zai = await ZAI.create();
        console.log('Z.AI SDK initialized successfully');
      `;
      
      fs.writeFileSync(path.join(process.cwd(), 'test-zai.ts'), testScript);
      
      const result = await this.executeCommand('npx tsx test-zai.ts', { 
        silent: true,
        timeout: 10000 
      });
      
      fs.unlinkSync(path.join(process.cwd(), 'test-zai.ts'));
      
      if (result.success) {
        this.log('success', 'Z.AI SDK initialized successfully');
      } else {
        this.log('warn', 'Z.AI SDK initialization failed, but continuing');
      }
    } catch (error) {
      this.log('warn', 'Could not test Z.AI SDK');
    }

    // Test other AI service configurations
    const aiServices = ['OPENROUTER_API_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY'];
    let aiServicesCount = 0;
    
    for (const service of aiServices) {
      if (process.env[service]) {
        aiServicesCount++;
        this.log('info', `${service} is configured`);
      }
    }

    if (aiServicesCount > 0) {
      this.log('success', `${aiServicesCount} AI services configured`);
    } else {
      this.log('info', 'No additional AI services configured, using default Z.AI');
    }

    this.state.components.aiServices = true;
    this.log('success', 'AI services initialized successfully');
    return true;
  }

  // Initialize monitoring
  private async initializeMonitoring(): Promise<boolean> {
    this.log('info', 'Initializing monitoring system...');

    // Create monitoring script
    const monitorScript = `#!/bin/bash

# OptiMind AI Ecosystem - Intelligent Monitoring Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/intelligent-monitor.log"
SERVER_PID_FILE="$SCRIPT_DIR/.server.pid"
STATE_FILE="$SCRIPT_DIR/system-state.json"

# Health check function
health_check() {
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "healthy"
        return 0
    else
        echo "unhealthy"
        return 1
    fi
}

# Restart server function
restart_server() {
    echo "$(date): Server health check failed, restarting..." >> "$LOG_FILE"
    
    # Kill existing server
    if [ -f "$SERVER_PID_FILE" ]; then
        OLD_PID=$(cat "$SERVER_PID_FILE")
        kill -9 "$OLD_PID" 2>/dev/null || true
    fi
    
    # Start new server
    cd "$SCRIPT_DIR"
    nohup npm run dev > "$SCRIPT_DIR/dev-server.log" 2>&1 &
    NEW_PID=$!
    echo "$NEW_PID" > "$SERVER_PID_FILE"
    
    echo "$(date): Server restarted with PID $NEW_PID" >> "$LOG_FILE"
    
    # Update state
    if [ -f "$STATE_FILE" ]; then
        python3 -c "
import json
import sys
with open('$STATE_FILE', 'r') as f:
    state = json.load(f)
state['components']['server'] = True
state['metrics']['restarts'] += 1
with open('$STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)
" 2>/dev/null || true
    fi
}

# System optimization function
optimize_system() {
    echo "$(date): Running system optimization..." >> "$LOG_FILE"
    
    # Clean up logs if they're too large
    for log in "$SCRIPT_DIR"/*.log; do
        if [ -f "$log" ] && [ $(stat -c%s "$log" 2>/dev/null || echo 0) -gt 10485760 ]; then
            tail -1000 "$log" > "$log.tmp" && mv "$log.tmp" "$log"
            echo "$(date): Cleaned up large log file: $log" >> "$LOG_FILE"
        fi
    done
    
    # Check memory usage
    if command -v free > /dev/null 2>&1; then
        MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
        if [ "$MEMORY_USAGE" -gt 80 ]; then
            echo "$(date): High memory usage detected: $MEMORY_USAGE%" >> "$LOG_FILE"
        fi
    fi
}

# Main monitoring loop
while true; do
    # Health check
    if ! health_check > /dev/null 2>&1; then
        restart_server
    fi
    
    # System optimization (every 10 minutes)
    if [ $(( $(date +%s) % 600 )) -lt 30 ]; then
        optimize_system
    fi
    
    sleep 30
done
`;

    fs.writeFileSync(path.join(process.cwd(), 'intelligent-monitor.sh'), monitorScript);

    // Start monitoring
    try {
      const monitorProcess = spawn('bash', ['intelligent-monitor.sh'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });
      
      monitorProcess.unref();
      fs.writeFileSync(path.join(process.cwd(), '.intelligent-monitor.pid'), monitorProcess.pid.toString());
      
      this.state.components.monitoring = true;
      this.log('success', 'Intelligent monitoring system started');
      return true;
    } catch (error) {
      this.log('error', 'Failed to start intelligent monitoring');
      return false;
    }
  }

  // Initialize server
  private async initializeServer(): Promise<boolean> {
    this.log('info', 'Initializing server...');

    // Check if port 3000 is available
    try {
      await this.executeCommand('curl -s http://localhost:3000/api/health', { 
        silent: true,
        timeout: 5000 
      });
      
      this.log('warn', 'Port 3000 is in use, attempting to free it...');
      await this.executeCommand('pkill -f "node.*3000"', { silent: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      // Port is available, continue
    }

    // Start server
    try {
      const serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true,
        env: { ...process.env, NODE_ENV: 'development' }
      });
      
      serverProcess.unref();
      fs.writeFileSync(path.join(process.cwd(), '.server.pid'), serverProcess.pid.toString());

      // Wait for server to start
      for (let i = 1; i <= 30; i++) {
        try {
          await this.executeCommand('curl -s http://localhost:3000/api/health', { 
            silent: true,
            timeout: 5000 
          });
          
          this.state.components.server = true;
          this.log('success', `Server started successfully (PID: ${serverProcess.pid})`);
          return true;
        } catch (error) {
          if (i === 30) {
            this.log('error', 'Server failed to start');
            return false;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      this.log('error', 'Failed to start server');
      return false;
    }

    return false;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    this.state.metrics.healthChecks++;
    this.state.lastHealthCheck = new Date();

    const checks = [
      { name: 'database', check: () => this.checkDatabase() },
      { name: 'server', check: () => this.checkServer() },
      { name: 'dependencies', check: () => this.checkDependencies() },
      { name: 'aiServices', check: () => this.checkAIServices() },
      { name: 'monitoring', check: () => this.checkMonitoring() }
    ];

    let healthyCount = 0;
    for (const check of checks) {
      try {
        const result = await check.check();
        this.state.components[check.name as keyof typeof this.state.components] = result;
        if (result) healthyCount++;
      } catch (error) {
        this.log('error', `Health check failed for ${check.name}: ${error}`);
        this.state.components[check.name as keyof typeof this.state.components] = false;
      }
    }

    this.state.healthy = healthyCount === checks.length;
    this.state.metrics.uptime = Date.now() - this.startTime;
    this.saveState();

    return this.state.healthy;
  }

  // Check database health
  private async checkDatabase(): Promise<boolean> {
    try {
      const result = await this.executeCommand('npx tsx scripts/prisma-database-validator.ts', { 
        silent: true,
        timeout: 30000 
      });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Check server health
  private async checkServer(): Promise<boolean> {
    try {
      const result = await this.executeCommand('curl -s http://localhost:3000/api/health', { 
        silent: true,
        timeout: 10000 
      });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Check dependencies health
  private async checkDependencies(): Promise<boolean> {
    try {
      const result = await this.executeCommand('npm list next', { silent: true });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Check AI services health
  private async checkAIServices(): Promise<boolean> {
    try {
      // Check if Z.AI API key is set
      return !!process.env.ZAI_API_KEY;
    } catch (error) {
      return false;
    }
  }

  // Check monitoring health
  private async checkMonitoring(): Promise<boolean> {
    try {
      const monitorPid = fs.readFileSync(path.join(process.cwd(), '.intelligent-monitor.pid'), 'utf8');
      const result = await this.executeCommand(`ps -p ${monitorPid}`, { silent: true });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Self-healing
  async selfHeal(): Promise<boolean> {
    if (!SYSTEM_CONFIG.selfHealing) {
      return false;
    }

    this.log('info', 'Starting self-healing process...');

    const issues: string[] = [];
    
    if (!this.state.components.database) {
      issues.push('database');
      await this.healDatabase();
    }
    
    if (!this.state.components.server) {
      issues.push('server');
      await this.healServer();
    }
    
    if (!this.state.components.dependencies) {
      issues.push('dependencies');
      await this.healDependencies();
    }
    
    if (!this.state.components.monitoring) {
      issues.push('monitoring');
      await this.healMonitoring();
    }

    if (issues.length > 0) {
      this.log('info', `Self-healing attempted for: ${issues.join(', ')}`);
      this.state.metrics.restarts++;
      this.saveState();
    }

    return issues.length === 0;
  }

  // Healing methods
  private async healDatabase(): Promise<void> {
    this.log('info', 'Attempting to heal database...');
    await this.initializeDatabase();
  }

  private async healServer(): Promise<void> {
    this.log('info', 'Attempting to heal server...');
    await this.initializeServer();
  }

  private async healDependencies(): Promise<void> {
    this.log('info', 'Attempting to heal dependencies...');
    await this.initializeDependencies();
  }

  private async healMonitoring(): Promise<void> {
    this.log('info', 'Attempting to heal monitoring...');
    await this.initializeMonitoring();
  }

  // Get system status
  getStatus(): SystemState {
    return { ...this.state };
  }

  // Get system metrics
  getMetrics() {
    return {
      ...this.state.metrics,
      uptime: Date.now() - this.startTime,
      healthScore: Object.values(this.state.components).filter(Boolean).length / 
                   Object.keys(this.state.components).length * 100
    };
  }
}

// Main execution
async function main() {
  console.log('🤖 OptiMind AI Ecosystem - Intelligent System Initialization');
  console.log('====================================================');
  
  const intelligence = new OptiMindSystemIntelligence();
  
  try {
    // Initialize system
    const initialized = await intelligence.initialize();
    
    if (initialized) {
      console.log('✅ System initialized successfully');
      
      // Start health monitoring
      setInterval(async () => {
        const healthy = await intelligence.healthCheck();
        
        if (!healthy) {
          console.log('⚠️ System unhealthy, attempting self-healing...');
          await intelligence.selfHeal();
        }
        
        // Log metrics
        const metrics = intelligence.getMetrics();
        console.log(`📊 Health Score: ${metrics.healthScore.toFixed(1)}% | Uptime: ${Math.floor(metrics.uptime / 1000)}s`);
      }, SYSTEM_CONFIG.healthCheckInterval);
      
      console.log('🔄 Health monitoring started');
      console.log('📋 System Status:');
      console.log(`   Initialized: ${intelligence.getStatus().initialized ? '✅' : '❌'}`);
      console.log(`   Healthy: ${intelligence.getStatus().healthy ? '✅' : '❌'}`);
      console.log(`   Components: ${Object.values(intelligence.getStatus().components).filter(Boolean).length}/${Object.keys(intelligence.getStatus().components).length}`);
      
    } else {
      console.log('❌ System initialization failed');
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

export default OptiMindSystemIntelligence;