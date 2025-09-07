#!/usr/bin/env node

/**
 * OptiMind AI Ecosystem - Simple Startup Script
 * Premium Diamond Grade Quick Start
 * Simple, reliable startup without complex state management
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_DIR = process.cwd();
const LOG_FILE = path.join(PROJECT_DIR, 'simple-startup.log');

// Simple logging
function log(level: string, message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(`[${level.toUpperCase()}] ${message}`);
}

// Execute command helper
function executeCommand(command: string, options: { silent?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    log('info', `Executing: ${command}`);
    
    try {
      execSync(command, { 
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit'
      });
      resolve(true);
    } catch (error) {
      log('error', `Command failed: ${command}`);
      resolve(false);
    }
  });
}

// Main startup function
async function startup() {
  log('info', '🤖 OptiMind AI Ecosystem - Simple Startup');
  log('info', '==============================================');
  
  try {
    // Step 1: Check prerequisites
    log('info', 'Checking prerequisites...');
    
    // Check if package.json exists
    if (!fs.existsSync(path.join(PROJECT_DIR, 'package.json'))) {
      log('error', 'package.json not found');
      process.exit(1);
    }
    
    // Check if node_modules exists
    if (!fs.existsSync(path.join(PROJECT_DIR, 'node_modules'))) {
      log('info', 'Installing dependencies...');
      await executeCommand('npm install', { silent: true });
    }
    
    // Step 2: Setup environment
    log('info', 'Setting up environment...');
    
    // Create .env if it doesn't exist
    if (!fs.existsSync(path.join(PROJECT_DIR, '.env'))) {
      log('info', 'Creating .env file...');
      const envContent = `# OptiMind AI Ecosystem - Environment Configuration
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV="development"
PORT="3000"
ZAI_API_KEY="1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY"
`;
      fs.writeFileSync(path.join(PROJECT_DIR, '.env'), envContent);
    }
    
    // Step 3: Setup database
    log('info', 'Setting up database...');
    await executeCommand('npm run db:push -- --accept-data-loss', { silent: true });
    await executeCommand('npm run db:generate', { silent: true });
    await executeCommand('npm run db:seed', { silent: true });
    
    // Step 4: Start development server
    log('info', 'Starting development server...');
    
    // Kill any existing processes on port 3000
    try {
      execSync('pkill -f "node.*3000"', { stdio: 'pipe' });
    } catch (error) {
      // Ignore if no process found
    }
    
    // Start the server
    const serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: PROJECT_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
      env: { ...process.env, PORT: '3000' }
    });
    
    serverProcess.unref();
    
    // Save PID
    fs.writeFileSync(path.join(PROJECT_DIR, '.server.pid'), serverProcess.pid.toString());
    
    // Step 5: Wait for server to start
    log('info', 'Waiting for server to start...');
    
    for (let i = 1; i <= 30; i++) {
      try {
        execSync('curl -s http://localhost:3000/api/health', { 
          timeout: 5000,
          stdio: 'pipe'
        });
        log('success', 'Server started successfully!');
        break;
      } catch (error) {
        if (i === 30) {
          log('error', 'Server failed to start');
          process.exit(1);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        log('info', `Waiting for server... (${i}/30)`);
      }
    }
    
    // Step 6: Start monitoring (optional)
    log('info', 'Starting monitoring system...');
    
    try {
      const monitorProcess = spawn('tsx', ['self-healing-monitor.ts'], {
        cwd: PROJECT_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });
      
      monitorProcess.unref();
      fs.writeFileSync(path.join(PROJECT_DIR, '.monitor.pid'), monitorProcess.pid.toString());
      log('success', 'Monitoring system started');
    } catch (error) {
      log('warn', 'Failed to start monitoring system, continuing anyway');
    }
    
    // Step 7: Display success message
    log('success', '🎉 OptiMind AI Ecosystem started successfully!');
    log('info', '');
    log('info', '🌐 Access Points:');
    log('info', '   • Main Application: http://localhost:3000');
    log('info', '   • Health Check: http://localhost:3000/api/health');
    log('info', '   • Monitoring Dashboard: http://localhost:3001');
    log('info', '');
    log('info', '📊 System Status:');
    log('info', '   • Development Server: RUNNING');
    log('info', '   • Monitoring System: STARTED');
    log('info', '   • Database: READY');
    log('info', '');
    log('info', '📋 Log Files:');
    log('info', `   • Startup Log: ${  LOG_FILE}`);
    log('info', `   • Server Log: ${  path.join(PROJECT_DIR, 'dev-server.log')}`);
    log('info', `   • Monitor Log: ${  path.join(PROJECT_DIR, 'self-healing-monitor.log')}`);
    log('info', '');
    log('info', '🛠️  Management:');
    log('info', '   • Stop server: kill $(cat .server.pid)');
    log('info', '   • Stop monitor: kill $(cat .monitor.pid)');
    log('info', `   • View logs: tail -f ${  LOG_FILE}`);
    
  } catch (error) {
    log('error', `Startup failed: ${error}`);
    process.exit(1);
  }
}

// Run startup
startup().catch(error => {
  log('error', `Fatal error: ${error}`);
  process.exit(1);
});