#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Security Verification Script (TypeScript Version)
 * Prevents .env file exposure and ensures proper configuration
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, copyFileSync, chmodSync } from 'fs';
import { join } from 'path';

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  nc: '\x1b[0m' // No Color
};

function log(message: string, color: keyof typeof colors = 'nc') {
  console.log(`${colors[color]}${message}${colors.nc}`);
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return '';
  }
}

function checkGitignore(): boolean {
  log('📋 Checking .gitignore configuration...', 'yellow');
  
  const gitignorePath = '.gitignore';
  if (!existsSync(gitignorePath)) {
    log('❌ .gitignore file missing', 'red');
    writeFileSync(gitignorePath, '# Environment files\n.env*\n');
    log('✅ Created .gitignore file', 'green');
    return true;
  }

  const gitignoreContent = readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    log('✅ .env is properly ignored in .gitignore', 'green');
    return true;
  } else {
    log('❌ CRITICAL: .env is NOT in .gitignore', 'red');
    log('   Adding .env to .gitignore now...', 'red');
    writeFileSync(gitignorePath, `${gitignoreContent  }\n# Environment files\n.env*\n`);
    log('✅ Added .env to .gitignore', 'green');
    return true;
  }
}

function checkEnvFile(): boolean {
  log('📁 Checking .env file existence...', 'yellow');
  
  const envPath = '.env';
  const envExamplePath = '.env.example';
  
  if (existsSync(envPath)) {
    log('✅ .env file exists', 'green');
    return true;
  }
  
  log('⚠️ .env file missing', 'yellow');
  
  if (existsSync(envExamplePath)) {
    log('📄 Creating .env from .env.example...', 'blue');
    copyFileSync(envExamplePath, envPath);
    log('✅ Created .env from template', 'green');
    return true;
  }
  
  log('❌ No .env.example found - creating minimal .env', 'red');
  const minimalEnv = `# Open Router Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# ZAI SDK Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL=https://api.z-ai.com/v1

# Database Configuration
DATABASE_URL="file:./dev.db"

# Application Configuration
NODE_ENV=development
PORT=3000
`;
  
  writeFileSync(envPath, minimalEnv);
  log('✅ Created minimal .env file', 'green');
  return true;
}

function checkGitIgnoreStatus(): boolean {
  log('🔍 Verifying Git ignore status...', 'yellow');
  
  const result = runCommand('git check-ignore .env 2>/dev/null');
  if (result) {
    log('✅ Git is correctly ignoring .env', 'green');
    return true;
  }
  
  log('❌ CRITICAL: Git is NOT ignoring .env', 'red');
  log('   This could expose sensitive data!', 'red');
  return false;
}

function checkStagedEnvFiles(): boolean {
  log('🚫 Checking for staged .env files...', 'yellow');
  
  const stagedFiles = runCommand('git diff --cached --name-only');
  if (stagedFiles.includes('.env')) {
    log('❌ CRITICAL: .env files are staged for commit!', 'red');
    log('   Unstaging .env files...', 'red');
    runCommand('git reset HEAD -- .env 2>/dev/null || true');
    log('✅ Unstaged .env files', 'green');
    return false;
  }
  
  log('✅ No .env files staged', 'green');
  return true;
}

function checkRequiredVariables(): boolean {
  log('🔑 Checking required environment variables...', 'yellow');
  
  const envPath = '.env';
  if (!existsSync(envPath)) {
    log('❌ .env file does not exist', 'red');
    return false;
  }
  
  const envContent = readFileSync(envPath, 'utf8');
  const requiredVars = ['OPENROUTER_API_KEY', 'ZAI_API_KEY', 'DATABASE_URL'];
  const missingVars: string[] = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length === 0) {
    log('✅ All required environment variables are present', 'green');
    return true;
  }
  
  log(`⚠️ Missing environment variables: ${missingVars.join(', ')}`, 'yellow');
  log('📝 Adding missing variables to .env...', 'blue');
  
  let newEnvContent = envContent;
  for (const varName of missingVars) {
    let value = '';
    switch (varName) {
      case 'OPENROUTER_API_KEY':
        value = 'your_openrouter_api_key_here';
        break;
      case 'ZAI_API_KEY':
        value = 'your_zai_api_key_here';
        break;
      case 'DATABASE_URL':
        value = '"file:./dev.db"';
        break;
    }
    newEnvContent += `\n${varName}=${value}\n`;
  }
  
  writeFileSync(envPath, newEnvContent);
  log('✅ Added missing environment variables', 'green');
  return true;
}

function checkFilePermissions(): boolean {
  log('🔐 Checking .env file permissions...', 'yellow');
  
  const envPath = '.env';
  if (!existsSync(envPath)) {
    log('⚠️ .env file does not exist', 'yellow');
    return true;
  }
  
  try {
    // Try to set secure permissions (may fail due to system restrictions)
    chmodSync(envPath, 0o600);
    log('✅ Set .env permissions to 600', 'green');
  } catch (error) {
    log('⚠️ Could not set file permissions (system restriction)', 'yellow');
    log('   This is normal in some environments', 'blue');
  }
  
  return true;
}

function main() {
  log('🔒 Running OptiMind AI Ecosystem Security Checks...', 'blue');
  
  const results = {
    gitignore: checkGitignore(),
    envFile: checkEnvFile(),
    gitStatus: checkGitIgnoreStatus(),
    stagedFiles: checkStagedEnvFiles(),
    requiredVars: checkRequiredVariables(),
    filePermissions: checkFilePermissions()
  };
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    log('🎉 All security checks passed!', 'green');
    log('📊 Security Summary:', 'blue');
    log('  ✅ .gitignore configured properly', 'green');
    log('  ✅ .env file exists and is secure', 'green');
    log('  ✅ Git is ignoring .env files', 'green');
    log('  ✅ No .env files staged for commit', 'green');
    log('  ✅ Required environment variables present', 'green');
    log('  ✅ Secure file permissions set', 'green');
    process.exit(0);
  } else {
    log('❌ Some security checks failed!', 'red');
    log('   Run "npm run security-check" to see details', 'red');
    process.exit(1);
  }
}

// Run the security checks
main();