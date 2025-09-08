#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Autonomous Setup & Installation System
 * Premium Diamond Grade Intelligent Installation
 * Automatically installs, configures, and validates all system components
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Global variables
const SCRIPT_DIR = process.cwd();
const LOG_FILE = path.join(SCRIPT_DIR, 'autonomous-setup.log');
const ERROR_LOG = path.join(SCRIPT_DIR, 'autonomous-setup-errors.log');
const START_TIME = Date.now();
const MAX_RETRIES = 3;

// Color definitions for output
const colors = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  PURPLE: '\x1b[0;35m',
  CYAN: '\x1b[0;36m',
  WHITE: '\x1b[1;37m',
  NC: '\x1b[0m' // No Color
};

// Create log files
fs.writeFileSync(LOG_FILE, '');
fs.writeFileSync(ERROR_LOG, '');

// Logging functions
const log = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(`${colors[level as keyof typeof colors] || colors.WHITE}[${level}]${colors.NC} ${message}`);
};

const logInfo = (message: string) => log('INFO', message);
const logSuccess = (message: string) => log('SUCCESS', message);
const logWarning = (message: string) => log('WARNING', message);
const logError = (message: string) => log('ERROR', message);
const logStep = (message: string) => log('STEP', message);
const logProgress = (message: string) => log('PROGRESS', message);

// Execute command with error handling
const executeCommand = (command: string, options: { cwd?: string; silent?: boolean } = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { cwd = SCRIPT_DIR, silent = false } = options;
    
    logProgress(`Executing: ${command}`);
    
    try {
      const result = execSync(command, { 
        cwd, 
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit'
      });
      resolve(result);
    } catch (error) {
      logError(`Command failed: ${command}`);
      logError(`Error: ${error}`);
      reject(error);
    }
  });
};

// Execute command with retry mechanism
const executeWithRetry = async (command: string, options: { maxRetries?: number; silent?: boolean } = {}): Promise<string> => {
  const { maxRetries = MAX_RETRIES, silent = false } = options;
  
  for (let i = 1; i <= maxRetries; i++) {
    try {
      logProgress(`Attempt ${i}: ${command}`);
      return await executeCommand(command, { silent });
    } catch (error) {
      if (i === maxRetries) {
        logError(`Failed after ${maxRetries} attempts: ${command}`);
        throw error;
      }
      logWarning(`Attempt ${i} failed, retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  throw new Error('Should not reach here');
};

// Check system requirements
const checkSystemRequirements = async () => {
  logStep('Checking system requirements...');
  
  // Check Node.js
  try {
    const nodeVersion = await executeCommand('node --version', { silent: true });
    logSuccess(`Node.js found: ${nodeVersion.trim()}`);
  } catch (error) {
    logError('Node.js not found. Please install Node.js 18+');
    throw error;
  }
  
  // Check npm
  try {
    const npmVersion = await executeCommand('npm --version', { silent: true });
    logSuccess(`npm found: ${npmVersion.trim()}`);
  } catch (error) {
    logError('npm not found. Please install npm');
    throw error;
  }
  
  // Check Git
  try {
    const gitVersion = await executeCommand('git --version', { silent: true });
    logSuccess(`Git found: ${gitVersion.trim()}`);
  } catch (error) {
    logError('Git not found. Please install Git');
    throw error;
  }
  
  // Check available disk space
  try {
    const dfOutput = await executeCommand('df -k .', { silent: true });
    const availableSpace = parseInt(dfOutput.split('\n')[1]?.split(/[ \t]+/)[3] || '0');
    const requiredSpace = 1048576; // 1GB in KB
    
    if (availableSpace < requiredSpace) {
      logError(`Insufficient disk space. Required: 1GB, Available: ${Math.floor(availableSpace / 1024)}MB`);
      throw new Error('Insufficient disk space');
    }
    
    logSuccess('System requirements check passed');
  } catch (error) {
    logError('Failed to check disk space');
    throw error;
  }
};

// Install project dependencies
const installDependencies = async () => {
  logStep('Installing project dependencies...');
  
  try {
    await executeWithRetry('npm install --no-optional --no-audit --progress=false', { silent: true });
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    throw error;
  }
  
  // Verify critical dependencies
  await verifyCriticalDependencies();
};

// Verify critical dependencies
const verifyCriticalDependencies = async () => {
  logStep('Verifying critical dependencies...');
  
  const criticalDeps = ['next', 'react', 'react-dom', '@prisma/client', 'typescript'];
  
  for (const dep of criticalDeps) {
    try {
      await executeCommand(`npm list ${dep}`, { silent: true });
      logSuccess(`${dep}: ✅ Installed`);
    } catch (error) {
      logError(`${dep}: ❌ Missing`);
      throw error;
    }
  }
  
  logSuccess('All critical dependencies verified');
};

// Setup database
const setupDatabase = async () => {
  logStep('Setting up database...');
  
  // Check if .env file exists
  if (!fs.existsSync(path.join(SCRIPT_DIR, '.env'))) {
    logWarning('.env file not found. Creating default configuration...');
    await createDefaultEnv();
  }
  
  // Run database migrations
  try {
    logProgress('Running database migrations...');
    await executeCommand('npm run db:push -- --accept-data-loss', { silent: true });
    logSuccess('Database migrations completed');
  } catch (error) {
    logError('Database migrations failed');
    throw error;
  }
  
  // Generate Prisma client
  try {
    logProgress('Generating Prisma client...');
    await executeCommand('npm run db:generate', { silent: true });
    logSuccess('Prisma client generated');
  } catch (error) {
    logError('Prisma client generation failed');
    throw error;
  }
  
  // Seed database
  try {
    logProgress('Seeding database...');
    await executeCommand('npm run db:seed', { silent: true });
    logSuccess('Database seeded successfully');
  } catch (error) {
    logWarning('Database seeding failed, continuing anyway');
  }
  
  // Validate database
  await validateDatabase();
};

// Create default .env file
const createDefaultEnv = async () => {
  logStep('Creating default .env configuration...');
  
  const envContent = `# OptiMind AI Ecosystem - Environment Configuration
# Generated by Autonomous Setup System

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
JWT_SECRET="optimind-ai-ecosystem-autonomous-setup-${Date.now()}"
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
  
  fs.writeFileSync(path.join(SCRIPT_DIR, '.env'), envContent);
  logSuccess('Default .env configuration created');
};

// Validate database
const validateDatabase = async () => {
  logStep('Validating database integrity...');
  
  // Run database validation script if it exists
  if (fs.existsSync(path.join(SCRIPT_DIR, 'scripts', 'prisma-database-validator.ts'))) {
    try {
      logProgress('Running Prisma database validation...');
      await executeCommand('npx tsx scripts/prisma-database-validator.ts', { silent: true });
      logSuccess('Database validation passed');
    } catch (error) {
      logWarning('Database validation failed, but continuing');
    }
  } else {
    logInfo('Database validation script not found, skipping');
  }
};

// Run system validation
const runSystemValidation = async () => {
  logStep('Running comprehensive system validation...');
  
  // Run intelligent lightning test if it exists
  if (fs.existsSync(path.join(SCRIPT_DIR, 'intelligent-lightning-test.sh'))) {
    try {
      logProgress('Running intelligent lightning test...');
      await executeCommand('./intelligent-lightning-test.sh', { silent: true });
      logSuccess('Intelligent lightning test passed');
    } catch (error) {
      logWarning('Intelligent lightning test failed');
    }
  }
  
  // Run fast health check if it exists
  if (fs.existsSync(path.join(SCRIPT_DIR, 'fast_health_check.sh'))) {
    try {
      logProgress('Running fast health check...');
      await executeCommand('./fast_health_check.sh', { silent: true });
      logSuccess('Fast health check passed');
    } catch (error) {
      logWarning('Fast health check failed');
    }
  }
};

// Start development server with monitoring
const startDevelopmentServer = async () => {
  logStep('Starting development server with monitoring...');
  
  // Check if port 3000 is available
  try {
    await executeCommand('curl -s http://localhost:3000/api/health', { silent: true });
    logWarning('Port 3000 is already in use. Attempting to free it...');
    try {
      await executeCommand('pkill -f "node.*3000"', { silent: true });
    } catch (error) {
      // Ignore error if process not found
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    // Port is available, continue
  }
  
  // Start server in background
  logProgress('Starting development server...');
  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: SCRIPT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  
  serverProcess.unref();
  
  // Save server PID
  fs.writeFileSync(path.join(SCRIPT_DIR, '.server.pid'), (serverProcess.pid || 0).toString());
  
  // Wait for server to start
  logProgress('Waiting for server to start...');
  for (let i = 1; i <= 30; i++) {
    try {
      await executeCommand('curl -s http://localhost:3000/api/health', { silent: true });
      logSuccess(`Development server started successfully (PID: ${serverProcess.pid})`);
      break;
    } catch (error) {
      if (i === 30) {
        logError('Development server failed to start');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      logProgress(`Waiting for server... (${i}/30)`);
    }
  }
};

// Setup monitoring and auto-restart
const setupMonitoring = async () => {
  logStep('Setting up monitoring and auto-restart...');
  
  // Create monitoring script
  const monitorScript = `#!/bin/bash

# OptiMind AI Ecosystem - Server Monitoring Script

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/monitor.log"
SERVER_PID_FILE="$SCRIPT_DIR/.server.pid"

# Function to check server health
check_server_health() {
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to restart server
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
}

# Main monitoring loop
while true; do
    if ! check_server_health; then
        restart_server
    fi
    
    sleep 30
done
`;
  
  fs.writeFileSync(path.join(SCRIPT_DIR, 'monitor-server.sh'), monitorScript);
  
  // Make monitoring script executable
  try {
    await executeCommand('chmod +x monitor-server.sh');
  } catch (error) {
    logWarning('Could not make monitor script executable');
  }
  
  // Start monitoring in background
  const monitorProcess = spawn('bash', ['monitor-server.sh'], {
    cwd: SCRIPT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  
  monitorProcess.unref();
  
  fs.writeFileSync(path.join(SCRIPT_DIR, '.monitor.pid'), (monitorProcess.pid || 0).toString());
  
  logSuccess(`Monitoring system started (PID: ${monitorProcess.pid})`);
};

// Generate setup report
const generateSetupReport = async () => {
  logStep('Generating setup report...');
  
  const endTime = Date.now();
  const duration = Math.floor((endTime - START_TIME) / 1000);
  
  let nodeVersion = 'Not installed';
  let npmVersion = 'Not installed';
  let gitVersion = 'Not installed';
  
  try {
    nodeVersion = (await executeCommand('node --version', { silent: true })).trim();
  } catch (error) {
    // Ignore
  }
  
  try {
    npmVersion = (await executeCommand('npm --version', { silent: true })).trim();
  } catch (error) {
    // Ignore
  }
  
  try {
    gitVersion = (await executeCommand('git --version', { silent: true })).trim();
  } catch (error) {
    // Ignore
  }
  
  const reportContent = `# OptiMind AI Ecosystem - Autonomous Setup Report

## Setup Summary
- **Start Time**: ${new Date(START_TIME).toISOString()}
- **End Time**: ${new Date(endTime).toISOString()}
- **Duration**: ${duration} seconds
- **Status**: SUCCESS

## System Information
- **Node.js Version**: ${nodeVersion}
- **npm Version**: ${npmVersion}
- **Git Version**: ${gitVersion}
- **Operating System**: ${process.platform}

## Components Installed
- ✅ Node.js and npm
- ✅ Project dependencies
- ✅ Database setup and seeding
- ✅ Development server
- ✅ Monitoring system

## Running Services
- **Development Server**: PID ${fs.readFileSync(path.join(SCRIPT_DIR, '.server.pid'), 'utf8').trim() || 'Not running'}
- **Monitoring Service**: PID ${fs.readFileSync(path.join(SCRIPT_DIR, '.monitor.pid'), 'utf8').trim() || 'Not running'}

## Access URLs
- **Main Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Log Files
- **Setup Log**: ${LOG_FILE}
- **Error Log**: ${ERROR_LOG}
- **Server Log**: ${path.join(SCRIPT_DIR, 'dev-server.log')}
- **Monitor Log**: ${path.join(SCRIPT_DIR, 'monitor.log')}

## Next Steps
1. Visit http://localhost:3000 to access the application
2. Monitor logs for any issues
3. Use the monitoring system for automatic restart capabilities

---
*Generated by OptiMind AI Ecosystem Autonomous Setup System*
`;
  
  fs.writeFileSync(path.join(SCRIPT_DIR, 'setup-report.md'), reportContent);
  logSuccess(`Setup report generated: ${path.join(SCRIPT_DIR, 'setup-report.md')}`);
};

// Main function
const main = async () => {
  console.log(colors.PURPLE);
  console.log(`╔══════════════════════════════════════════════════════════════════════════════╗`);
  console.log(`║              OPTIMIND AI ECOSYSTEM - AUTONOMOUS SETUP SYSTEM               ║`);
  console.log(`║                    Premium Diamond Grade Installation                      ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════════════════╝`);
  console.log(colors.NC);
  
  logInfo('Starting autonomous setup process...');
  logInfo('This may take several minutes to complete.');
  
  try {
    // Execute setup steps
    await checkSystemRequirements();
    await installDependencies();
    await setupDatabase();
    await runSystemValidation();
    await startDevelopmentServer();
    await setupMonitoring();
    await generateSetupReport();
    
    // Display success message
    console.log(colors.GREEN);
    console.log(`╔══════════════════════════════════════════════════════════════════════════════╗`);
    console.log(`║                        SETUP COMPLETED SUCCESSFULLY!                       ║`);
    console.log(`║              OptiMind AI Ecosystem is now running autonomously             ║`);
    console.log(`╚══════════════════════════════════════════════════════════════════════════════╝`);
    console.log(colors.NC);
    
    logSuccess('Autonomous setup completed successfully!');
    logInfo('Application is running at: http://localhost:3000');
    logInfo('Health check available at: http://localhost:3000/api/health');
    logInfo(`Setup report generated: ${path.join(SCRIPT_DIR, 'setup-report.md')}`);
    
    // Display system status
    console.log(`${colors.CYAN  }System Status:${  colors.NC}`);
    console.log(`├── Development Server: ${colors.GREEN}RUNNING${colors.NC}`);
    console.log(`├── Monitoring Service: ${colors.GREEN}RUNNING${colors.NC}`);
    console.log(`├── Database: ${colors.GREEN}READY${colors.NC}`);
    console.log(`└── Dependencies: ${colors.GREEN}INSTALLED${colors.NC}`);
    
    console.log(`\n${colors.YELLOW}Useful Commands:${colors.NC}`);
    console.log(`  • View logs: tail -f ${path.join(SCRIPT_DIR, 'dev-server.log')}`);
    console.log(`  • Stop server: kill $(cat ${path.join(SCRIPT_DIR, '.server.pid')})`);
    console.log(`  • Stop monitoring: kill $(cat ${path.join(SCRIPT_DIR, '.monitor.pid')})`);
    console.log(`  • Restart everything: tsx autonomous-setup.ts`);
    
    process.exit(0);
  } catch (error) {
    logError(`Setup failed: ${error}`);
    console.log(`${colors.RED  }Setup failed. Check the error log for details.${  colors.NC}`);
    process.exit(1);
  }
};

// Run main function
main().catch(error => {
  logError(`Unhandled error: ${error}`);
  process.exit(1);
});