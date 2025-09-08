#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Automatic Dependency Manager
 * Premium Diamond Grade Dependency Intelligence
 * Automatically installs, configures, and manages all system dependencies
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface DependencyConfig {
  name: string;
  version?: string;
  type: 'production' | 'development' | 'optional';
  critical: boolean;
  validate?: () => Promise<boolean>;
  postInstall?: () => Promise<void>;
}

interface SystemDependency {
  name: string;
  command: string;
  versionFlag: string;
  installCommand?: string;
  critical: boolean;
  url?: string;
}

class AutoDependencyManager {
  private projectPath: string;
  private logFile: string;
  private config: {
    maxRetries: number;
    timeout: number;
    autoUpdate: boolean;
    securityCheck: boolean;
    optimizationEnabled: boolean;
  };

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.logFile = path.join(projectPath, 'dependency-manager.log');
    this.config = {
      maxRetries: 3,
      timeout: 300000, // 5 minutes
      autoUpdate: true,
      securityCheck: true,
      optimizationEnabled: true
    };
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logMessage);
    }] ${message}`);
  }

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
      cwd = this.projectPath, 
      timeout = this.config.timeout, 
      retries = this.config.maxRetries,
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
      } catch (error: unknown) {
        this.log('warn', `Command failed (attempt ${attempt}/${retries}): ${command}`);
        
        if (attempt === retries) {
          this.log('error', `Command failed after ${retries} attempts: ${error instanceof Error ? error.message : String(error)}`);
          return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  // Main dependency management function
  async manageDependencies(): Promise<boolean> {
    this.log('info', 'Starting automatic dependency management...');
    
    try {
      // Check and install system dependencies
      if (!await this.manageSystemDependencies()) {
        this.log('error', 'System dependency management failed');
        return false;
      }

      // Check and install Node.js dependencies
      if (!await this.manageNodeDependencies()) {
        this.log('error', 'Node.js dependency management failed');
        return false;
      }

      // Validate and optimize dependencies
      if (!await this.validateAndOptimizeDependencies()) {
        this.log('error', 'Dependency validation and optimization failed');
        return false;
      }

      // Configure dependencies
      if (!await this.configureDependencies()) {
        this.log('error', 'Dependency configuration failed');
        return false;
      }

      this.log('success', 'Dependency management completed successfully');
      return true;
    } catch (error: unknown) {
      this.log('error', `Dependency management failed: ${error.message}`);
      return false;
    }
  }

  // Manage system dependencies
  private async manageSystemDependencies(): Promise<boolean> {
    this.log('info', 'Managing system dependencies...');

    const systemDeps: SystemDependency[] = [
      {
        name: 'Node.js',
        command: 'node',
        versionFlag: '--version',
        critical: true,
        url: 'https://nodejs.org/'
      },
      {
        name: 'npm',
        command: 'npm',
        versionFlag: '--version',
        critical: true,
        installCommand: 'npm install -g npm'
      },
      {
        name: 'Git',
        command: 'git',
        versionFlag: '--version',
        critical: true,
        url: 'https://git-scm.com/'
      },
      {
        name: 'TypeScript',
        command: 'tsc',
        versionFlag: '--version',
        critical: false,
        installCommand: 'npm install -g typescript'
      },
      {
        name: 'tsx',
        command: 'tsx',
        versionFlag: '--version',
        critical: false,
        installCommand: 'npm install -g tsx'
      }
    ];

    let allInstalled = true;

    for (const dep of systemDeps) {
      const installed = await this.checkAndInstallSystemDependency(dep);
      if (!installed && dep.critical) {
        allInstalled = false;
      }
    }

    return allInstalled;
  }

  // Check and install individual system dependency
  private async checkAndInstallSystemDependency(dep: SystemDependency): Promise<boolean> {
    try {
      const result = await this.executeCommand(`${dep.command} ${dep.versionFlag}`, { 
        silent: true 
      });
      
      if (result.success) {
        this.log('success', `${dep.name} is installed: ${result.output?.trim()}`);
        return true;
      }
    } catch (error) {
      this.log('warn', `${dep.name} is not installed`);
    }

    if (dep.installCommand) {
      this.log('info', `Installing ${dep.name}...`);
      const installResult = await this.executeCommand(dep.installCommand);
      
      if (installResult.success) {
        this.log('success', `${dep.name} installed successfully`);
        return true;
      } else {
        this.log('error', `Failed to install ${dep.name}`);
        return false;
      }
    } else if (dep.url) {
      this.log('error', `${dep.name} is not installed. Please install it manually from: ${dep.url}`);
      return false;
    } else {
      this.log('error', `${dep.name} is not installed and no auto-install command available`);
      return false;
    }
  }

  // Manage Node.js dependencies
  private async manageNodeDependencies(): Promise<boolean> {
    this.log('info', 'Managing Node.js dependencies...');

    // Check if package.json exists
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.log('error', 'package.json not found');
      return false;
    }

    // Read package.json
    let packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
      this.log('error', 'Failed to parse package.json');
      return false;
    }

    // Check if node_modules exists
    const nodeModulesPath = path.join(this.projectPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      this.log('info', 'node_modules not found, installing dependencies...');
      
      const installResult = await this.executeCommand('npm install', {
        timeout: 600000, // 10 minutes
        silent: true
      });
      
      if (!installResult.success) {
        this.log('error', 'Failed to install dependencies');
        return false;
      }
      
      this.log('success', 'Dependencies installed successfully');
    } else {
      this.log('info', 'node_modules found, checking for updates...');
      
      if (this.config.autoUpdate) {
        const updateResult = await this.executeCommand('npm update', {
          timeout: 300000,
          silent: true
        });
        
        if (updateResult.success) {
          this.log('success', 'Dependencies updated successfully');
        } else {
          this.log('warn', 'Dependency update failed, continuing anyway');
        }
      }
    }

    // Verify critical dependencies
    const criticalDeps = this.getCriticalDependencies(packageJson);
    for (const dep of criticalDeps) {
      const installed = await this.verifyDependencyInstalled(dep.name);
      if (!installed) {
        this.log('error', `Critical dependency not installed: ${dep.name}`);
        return false;
      }
    }

    return true;
  }

  // Get critical dependencies from package.json
  private getCriticalDependencies(packageJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
  }): DependencyConfig[] {
    const dependencies: DependencyConfig[] = [];
    
    // Add production dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'production',
          critical: this.isCriticalDependency(name)
        });
      }
    }

    // Add development dependencies
    if (packageJson.devDependencies) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'development',
          critical: this.isCriticalDependency(name)
        });
      }
    }

    return dependencies.filter(dep => dep.critical);
  }

  // Check if dependency is critical
  private isCriticalDependency(name: string): boolean {
    const criticalDeps = [
      'next', 'react', 'react-dom', '@prisma/client', 'typescript',
      'tailwindcss', 'autoprefixer', 'postcss', 'eslint', 'prettier'
    ];
    return criticalDeps.includes(name);
  }

  // Verify dependency is installed
  private async verifyDependencyInstalled(depName: string): Promise<boolean> {
    try {
      const result = await this.executeCommand(`npm list ${depName}`, { 
        silent: true 
      });
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Validate and optimize dependencies
  private async validateAndOptimizeDependencies(): Promise<boolean> {
    this.log('info', 'Validating and optimizing dependencies...');

    // Security audit
    if (this.config.securityCheck) {
      this.log('info', 'Running security audit...');
      const auditResult = await this.executeCommand('npm audit --audit-level=moderate', {
        timeout: 120000,
        silent: true
      });
      
      if (!auditResult.success) {
        this.log('warn', 'Security audit found issues');
      } else {
        this.log('success', 'Security audit passed');
      }
    }

    // Check for unused dependencies
    this.log('info', 'Checking for unused dependencies...');
    try {
      const depcheckResult = await this.executeCommand('npx depcheck', {
        timeout: 60000,
        silent: true
      });
      
      if (depcheckResult.success) {
        this.log('success', 'No unused dependencies found');
      } else {
        this.log('warn', 'Unused dependencies detected, consider removing them');
      }
    } catch (error) {
      this.log('info', 'depcheck not available, skipping unused dependency check');
    }

    // Optimize dependencies
    if (this.config.optimizationEnabled) {
      await this.optimizeDependencies();
    }

    return true;
  }

  // Optimize dependencies
  private async optimizeDependencies(): Promise<void> {
    this.log('info', 'Optimizing dependencies...');

    // Clean npm cache
    this.log('info', 'Cleaning npm cache...');
    await this.executeCommand('npm cache clean --force', { silent: true });

    // Deduplicate dependencies
    this.log('info', 'Deduplicating dependencies...');
    await this.executeCommand('npm dedupe', { silent: true });

    // Check for outdated packages
    this.log('info', 'Checking for outdated packages...');
    const outdatedResult = await this.executeCommand('npm outdated', {
      timeout: 60000,
      silent: true
    });

    if (outdatedResult.success && outdatedResult.output) {
      const outdatedCount = outdatedResult.output.split('\n').length - 2;
      if (outdatedCount > 0) {
        this.log('info', `${outdatedCount} packages are outdated`);
      } else {
        this.log('success', 'All packages are up to date');
      }
    }
  }

  // Configure dependencies
  private async configureDependencies(): Promise<boolean> {
    this.log('info', 'Configuring dependencies...');

    // Configure TypeScript
    await this.configureTypeScript();

    // Configure ESLint
    await this.configureESLint();

    // Configure Prisma
    await this.configurePrisma();

    // Configure Tailwind CSS
    await this.configureTailwind();

    this.log('success', 'Dependencies configured successfully');
    return true;
  }

  // Configure TypeScript
  private async configureTypeScript(): Promise<void> {
    this.log('info', 'Configuring TypeScript...');

    const tsConfigPath = path.join(this.projectPath, 'tsconfig.json');
    if (!fs.existsSync(tsConfigPath)) {
      this.log('warn', 'tsconfig.json not found, creating default...');
      
      const defaultTsConfig = {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [
            {
              name: 'next'
            }
          ],
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*']
          }
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules']
      };

      fs.writeFileSync(tsConfigPath, JSON.stringify(defaultTsConfig, null, 2));
      this.log('success', 'tsconfig.json created');
    }
  }

  // Configure ESLint
  private async configureESLint(): Promise<void> {
    this.log('info', 'Configuring ESLint...');

    const eslintConfigPath = path.join(this.projectPath, 'eslint.config.mjs');
    if (!fs.existsSync(eslintConfigPath)) {
      this.log('warn', 'eslint.config.mjs not found, creating default...');
      
      const defaultEslintConfig = `import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
});
`;

      fs.writeFileSync(eslintConfigPath, defaultEslintConfig);
      this.log('success', 'eslint.config.mjs created');
    }
  }

  // Configure Prisma
  private async configurePrisma(): Promise<void> {
    this.log('info', 'Configuring Prisma...');

    // Check if .env exists
    const envPath = path.join(this.projectPath, '.env');
    if (!fs.existsSync(envPath)) {
      this.log('warn', '.env not found, creating default...');
      
      const defaultEnv = `# Database
DATABASE_URL="file:./prisma/dev.db"

# Development
NODE_ENV="development"
PORT="3000"

# AI Services
ZAI_API_KEY="1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY"
`;

      fs.writeFileSync(envPath, defaultEnv);
      this.log('success', '.env created');
    }

    // Generate Prisma client
    this.log('info', 'Generating Prisma client...');
    await this.executeCommand('npx prisma generate', { silent: true });
  }

  // Configure Tailwind CSS
  private async configureTailwind(): Promise<void> {
    this.log('info', 'Configuring Tailwind CSS...');

    const tailwindConfigPath = path.join(this.projectPath, 'tailwind.config.ts');
    if (!fs.existsSync(tailwindConfigPath)) {
      this.log('warn', 'tailwind.config.ts not found, creating default...');
      
      const defaultTailwindConfig = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
`;

      fs.writeFileSync(tailwindConfigPath, defaultTailwindConfig);
      this.log('success', 'tailwind.config.ts created');
    }
  }

  // Generate dependency report
  async generateReport(): Promise<void> {
    this.log('info', 'Generating dependency report...');

    const reportPath = path.join(this.projectPath, 'dependency-report.md');
    
    let report = `# OptiMind AI Ecosystem - Dependency Management Report

## Generated at: ${new Date().toISOString()}

## System Information
- **OS**: ${os.platform()} ${os.release()}
- **Node.js**: ${await this.getCommandOutput('node --version')}
- **npm**: ${await this.getCommandOutput('npm --version')}
- **Memory**: ${Math.floor(os.totalmem() / 1024 / 1024)}MB total, ${Math.floor(os.freemem() / 1024 / 1024)}MB free

## Dependencies Status
`;

    // Add system dependencies status
    report += '\n### System Dependencies\n';
    const systemDeps = ['node', 'npm', 'git', 'tsc', 'tsx'];
    for (const dep of systemDeps) {
      const installed = await this.verifyDependencyInstalled(dep);
      report += `- ${dep}: ${installed ? '✅ Installed' : '❌ Missing'}\n`;
    }

    // Add Node.js dependencies status
    report += '\n### Node.js Dependencies\n';
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectPath, 'package.json'), 'utf8'));
    
    if (packageJson.dependencies) {
      report += '\n#### Production Dependencies\n';
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        const installed = await this.verifyDependencyInstalled(name);
        report += `- ${name}@${version}: ${installed ? '✅' : '❌'}\n`;
      }
    }

    if (packageJson.devDependencies) {
      report += '\n#### Development Dependencies\n';
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        const installed = await this.verifyDependencyInstalled(name);
        report += `- ${name}@${version}: ${installed ? '✅' : '❌'}\n`;
      }
    }

    report += '\n## Configuration Files\n';
    const configFiles = ['tsconfig.json', 'eslint.config.mjs', 'tailwind.config.ts', '.env'];
    for (const file of configFiles) {
      const exists = fs.existsSync(path.join(this.projectPath, file));
      report += `- ${file}: ${exists ? '✅' : '❌'}\n`;
    }

    report += '\n## Recommendations\n';
    report += '- Regularly run `npm audit` to check for security vulnerabilities\n';
    report += '- Use `npm outdated` to check for package updates\n';
    report += '- Consider using `npm ci` for production installations\n';
    report += '- Monitor dependency sizes and performance impact\n';

    fs.writeFileSync(reportPath, report);
    this.log('success', `Dependency report generated: ${reportPath}`);
  }

  // Helper to get command output
  private async getCommandOutput(command: string): Promise<string> {
    try {
      const result = await this.executeCommand(command, { silent: true });
      return result.output?.trim() || 'Not available';
    } catch (error) {
      return 'Not available';
    }
  }
}

// Main execution
async function main() {

  const manager = new AutoDependencyManager();
  
  try {
    const success = await manager.manageDependencies();
    
    if (success) {
      
      await manager.generateReport();
    } else {
      
      process.exit(1);
    }
  } catch (error) {
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    
    process.exit(1);
  });
}

export default AutoDependencyManager;