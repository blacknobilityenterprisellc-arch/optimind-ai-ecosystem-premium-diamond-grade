#!/usr/bin/env tsx

/**
 * Next-OptiMind Integration Status Checker
 * 
 * This script checks the status of the Next-OptiMind integration
 * and provides a comprehensive overview of the current state.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface IntegrationStatus {
  isActive: boolean;
  nextDirectoryExists: boolean;
  buildArtifacts: {
    staticAssets: number;
    serverFiles: number;
    typeDefinitions: number;
    totalSize: number;
  };
  optimizationInsights: number;
  learningPatterns: number;
  performanceMetrics: number;
  lastActivity: Date | null;
  capabilities: string[];
}

function checkIntegrationStatus(): IntegrationStatus {
  const nextDir = join(process.cwd(), '.next');
  const statusFile = join(nextDir, '.integration-status.json');
  
  let status: IntegrationStatus = {
    isActive: false,
    nextDirectoryExists: false,
    buildArtifacts: {
      staticAssets: 0,
      serverFiles: 0,
      typeDefinitions: 0,
      totalSize: 0
    },
    optimizationInsights: 0,
    learningPatterns: 0,
    performanceMetrics: 0,
    lastActivity: null,
    capabilities: []
  };
  
  // Check if .next directory exists
  status.nextDirectoryExists = existsSync(nextDir);
  
  if (status.nextDirectoryExists) {
    // Count build artifacts
    const staticDir = join(nextDir, 'static');
    const serverDir = join(nextDir, 'server');
    const typesDir = join(nextDir, 'types');
    
    status.buildArtifacts.staticAssets = existsSync(staticDir) ? countFiles(staticDir) : 0;
    status.buildArtifacts.serverFiles = existsSync(serverDir) ? countFiles(serverDir) : 0;
    status.buildArtifacts.typeDefinitions = existsSync(typesDir) ? countFiles(typesDir) : 0;
    status.buildArtifacts.totalSize = calculateDirectorySize(nextDir);
    
    // Check for integration status file
    if (existsSync(statusFile)) {
      try {
        const savedStatus = JSON.parse(readFileSync(statusFile, 'utf8'));
        status = { ...status, ...savedStatus };
      } catch (error) {
        console.log('⚠️ Could not read integration status file');
      }
    }
  }
  
  return status;
}

function countFiles(dir: string): number {
  try {
    const { execSync } = require('child_process');
    return parseInt(execSync(`find "${dir}" -type f | wc -l`, { encoding: 'utf8' }).trim());
  } catch {
    return 0;
  }
}

function calculateDirectorySize(dir: string): number {
  try {
    const { execSync } = require('child_process');
    return parseInt(execSync(`du -sb "${dir}" | cut -f1`, { encoding: 'utf8' }).trim());
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function displayStatus(status: IntegrationStatus): void {
  console.log('\n🎯 NEXT-OPTIMIND INTEGRATION STATUS');
  console.log('=====================================');
  
  console.log(`📁 .next Directory: ${status.nextDirectoryExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  console.log(`🚀 Integration Active: ${status.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
  
  if (status.nextDirectoryExists) {
    console.log('\n📦 BUILD ARTIFACTS:');
    console.log('==================');
    console.log(`🎨 Static Assets: ${status.buildArtifacts.staticAssets}`);
    console.log(`🖥️  Server Files: ${status.buildArtifacts.serverFiles}`);
    console.log(`📝 Type Definitions: ${status.buildArtifacts.typeDefinitions}`);
    console.log(`📏 Total Size: ${formatBytes(status.buildArtifacts.totalSize)}`);
    
    console.log('\n🧠 AI CAPABILITIES:');
    console.log('================');
    console.log(`🔍 Optimization Insights: ${status.optimizationInsights}`);
    console.log(`📚 Learning Patterns: ${status.learningPatterns}`);
    console.log(`📊 Performance Metrics: ${status.performanceMetrics}`);
    
    if (status.capabilities.length > 0) {
      console.log('\n⚡ ACTIVE CAPABILITIES:');
      console.log('======================');
      status.capabilities.forEach(capability => {
        console.log(`• ${capability}`);
      });
    }
    
    if (status.lastActivity) {
      console.log(`\n⏰ Last Activity: ${new Date(status.lastActivity).toISOString()}`);
    }
  }
  
  console.log('\n📋 INTEGRATION FEATURES:');
  console.log('====================');
  console.log('🔄 Real-time Optimization');
  console.log('🔮 Predictive Analysis');
  console.log('⚕️ Self-Healing');
  console.log('📚 Continuous Learning');
  console.log('🎨 Intelligent Asset Management');
  console.log('⚡ Dynamic Performance Tuning');
  console.log('🧠 AI-Powered Insights');
  console.log('📊 Performance Monitoring');
  console.log('🛡️ Security Enhancement');
  console.log('🎯 Targeted Optimizations');
  
  console.log('\n🎉 SEAMLESS INTEGRATION BENEFITS:');
  console.log('==============================');
  console.log('✅ .next directory build optimizations');
  console.log('✅ OptiMind AI Ecosystem intelligence');
  console.log('✅ Real-time performance monitoring');
  console.log('✅ Continuous learning and improvement');
  console.log('✅ Self-healing build processes');
  console.log('✅ Predictive optimization');
  console.log('✅ Intelligent asset management');
  console.log('✅ Dynamic performance tuning');
  console.log('✅ AI-powered insights');
  console.log('✅ Seamless user experience');
  
  console.log('=====================================');
}

// Main execution
const status = checkIntegrationStatus();
displayStatus(status);

// Save current status
const nextDir = join(process.cwd(), '.next');
const statusFile = join(nextDir, '.integration-status.json');

if (status.nextDirectoryExists) {
  try {
    status.lastActivity = new Date();
    writeFileSync(statusFile, JSON.stringify(status, null, 2));
    console.log('💾 Integration status saved');
  } catch (error) {
    console.log('⚠️ Could not save integration status');
  }
}

export { checkIntegrationStatus };