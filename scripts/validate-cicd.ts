#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

/**
 * CI/CD Validation Script
 * This script validates the CI/CD configuration and provides guidance for local testing
 */

interface ValidationResult {
  valid: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  fix?: string
}

interface WorkflowValidation {
  file: string
  results: ValidationResult[]
}

class CICDValidator {
  private projectRoot: string
  private results: WorkflowValidation[] = []

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  async validateAll(): Promise<void> {
    console.log('🔍 Starting CI/CD validation...')
    console.log(`📁 Project root: ${this.projectRoot}`)

    // Validate workflow files
    await this.validateWorkflows()

    // Validate package.json scripts
    await this.validatePackageJson()

    // Validate configuration files
    await this.validateConfigFiles()

    // Validate Docker setup
    await this.validateDockerSetup()

    // Validate testing setup
    await this.validateTestingSetup()

    // Generate report
    this.generateReport()

    // Provide local testing guidance
    this.provideLocalTestingGuidance()
  }

  private async validateWorkflows(): Promise<void> {
    console.log('\n📋 Validating workflow files...')
    
    const workflowFiles = [
      '.github/workflows/ci.yml',
      '.github/workflows/deployment.yml',
      '.github/workflows/automated-testing.yml',
      '.github/workflows/code-quality.yml',
      '.github/workflows/enterprise/ci-enterprise.yml',
      '.github/workflows/enterprise/cd-enterprise.yml'
    ]

    for (const workflowFile of workflowFiles) {
      const filePath = join(this.projectRoot, workflowFile)
      const validation: WorkflowValidation = {
        file: workflowFile,
        results: []
      }

      if (!existsSync(filePath)) {
        validation.results.push({
          valid: false,
          message: `Workflow file not found: ${workflowFile}`,
          severity: 'error'
        })
        this.results.push(validation)
        continue
      }

      try {
        const content = readFileSync(filePath, 'utf8')
        
        // Validate YAML syntax (basic check)
        if (!content.includes('name:')) {
          validation.results.push({
            valid: false,
            message: 'Workflow missing name field',
            severity: 'error'
          })
        }

        // Check for required GitHub Actions
        const requiredActions = ['actions/checkout@v4', 'actions/setup-node@v4']
        for (const action of requiredActions) {
          if (!content.includes(action)) {
            validation.results.push({
              valid: false,
              message: `Missing required action: ${action}`,
              severity: 'warning'
            })
          }
        }

        // Check for Node.js version
        if (!content.includes('node-version:')) {
          validation.results.push({
            valid: false,
            message: 'Node.js version not specified',
            severity: 'warning'
          })
        }

        // Check for timeout configurations
        if (!content.includes('timeout-minutes:')) {
          validation.results.push({
            valid: false,
            message: 'No timeout configured for jobs',
            severity: 'warning'
          })
        }

        // Validate specific workflow configurations
        if (workflowFile.includes('deployment.yml')) {
          this.validateDeploymentWorkflow(content, validation)
        }

        if (workflowFile.includes('testing.yml')) {
          this.validateTestingWorkflow(content, validation)
        }

        validation.results.push({
          valid: true,
          message: 'Workflow file structure is valid',
          severity: 'info'
        })

      } catch (error) {
        validation.results.push({
          valid: false,
          message: `Error reading workflow file: ${error}`,
          severity: 'error'
        })
      }

      this.results.push(validation)
    }
  }

  private validateDeploymentWorkflow(content: string, validation: WorkflowValidation): void {
    // Check for deployment environments
    if (!content.includes('environment:')) {
      validation.results.push({
        valid: false,
        message: 'Deployment environments not configured',
        severity: 'error'
      })
    }

    // Check for proper branch triggers
    if (!content.includes('branches: [ main, master ]')) {
      validation.results.push({
        valid: false,
        message: 'Deployment branch triggers may be misconfigured',
        severity: 'warning'
      })
    }

    // Check for deployment providers
    const providers = ['vercel', 'netlify', 'railway', 'docker']
    const hasProvider = providers.some(provider => content.includes(provider))
    
    if (!hasProvider) {
      validation.results.push({
        valid: false,
        message: 'No deployment providers configured',
        severity: 'error'
      })
    }

    // Check for required secrets
    const requiredSecrets = [
      'VERCEL_TOKEN',
      'NETLIFY_AUTH_TOKEN',
      'RAILWAY_TOKEN',
      'DOCKER_USERNAME'
    ]

    for (const secret of requiredSecrets) {
      if (content.includes(secret)) {
        validation.results.push({
          valid: true,
          message: `Required secret referenced: ${secret}`,
          severity: 'info'
        })
      }
    }
  }

  private validateTestingWorkflow(content: string, validation: WorkflowValidation): void {
    // Check for test commands
    if (!content.includes('npm run test')) {
      validation.results.push({
        valid: false,
        message: 'Test commands not properly configured',
        severity: 'error'
      })
    }

    // Check for coverage reporting
    if (!content.includes('coverage')) {
      validation.results.push({
        valid: false,
        message: 'Test coverage not configured',
        severity: 'warning'
      })
    }

    // Check for artifact uploads
    if (!content.includes('upload-artifact')) {
      validation.results.push({
        valid: false,
        message: 'Test artifacts not configured for upload',
        severity: 'warning'
      })
    }
  }

  private async validatePackageJson(): Promise<void> {
    console.log('\n📦 Validating package.json...')
    
    const packageJsonPath = join(this.projectRoot, 'package.json')
    const validation: WorkflowValidation = {
      file: 'package.json',
      results: []
    }

    if (!existsSync(packageJsonPath)) {
      validation.results.push({
        valid: false,
        message: 'package.json not found',
        severity: 'error'
      })
      this.results.push(validation)
      return
    }

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      // Check for required scripts
      const requiredScripts = [
        'build',
        'test',
        'lint',
        'type-check'
      ]

      for (const script of requiredScripts) {
        if (!packageJson.scripts || !packageJson.scripts[script]) {
          validation.results.push({
            valid: false,
            message: `Required script missing: ${script}`,
            severity: 'error'
          })
        } else {
          validation.results.push({
            valid: true,
            message: `Required script found: ${script}`,
            severity: 'info'
          })
        }
      }

      // Check for testing dependencies
      const devDeps = packageJson.devDependencies || {}
      const testDeps = ['jest', '@playwright/test']
      
      for (const dep of testDeps) {
        if (devDeps[dep]) {
          validation.results.push({
            valid: true,
            message: `Testing dependency found: ${dep}`,
            severity: 'info'
          })
        }
      }

    } catch (error) {
      validation.results.push({
        valid: false,
        message: `Error parsing package.json: ${error}`,
        severity: 'error'
      })
    }

    this.results.push(validation)
  }

  private async validateConfigFiles(): Promise<void> {
    console.log('\n⚙️  Validating configuration files...')
    
    const configFiles = [
      'jest.config.js',
      'jest.setup.js',
      'playwright.config.ts',
      'eslint.config.mjs',
      'tsconfig.json'
    ]

    for (const configFile of configFiles) {
      const filePath = join(this.projectRoot, configFile)
      const validation: WorkflowValidation = {
        file: configFile,
        results: []
      }

      if (existsSync(filePath)) {
        validation.results.push({
          valid: true,
          message: `Configuration file found: ${configFile}`,
          severity: 'info'
        })
      } else {
        validation.results.push({
          valid: false,
          message: `Configuration file missing: ${configFile}`,
          severity: 'warning'
        })
      }

      this.results.push(validation)
    }
  }

  private async validateDockerSetup(): Promise<void> {
    console.log('\n🐳 Validating Docker setup...')
    
    const dockerFiles = ['Dockerfile', '.dockerignore']
    const validation: WorkflowValidation = {
      file: 'Docker Setup',
      results: []
    }

    for (const dockerFile of dockerFiles) {
      const filePath = join(this.projectRoot, dockerFile)
      
      if (existsSync(filePath)) {
        validation.results.push({
          valid: true,
          message: `Docker file found: ${dockerFile}`,
          severity: 'info'
        })
      } else {
        validation.results.push({
          valid: false,
          message: `Docker file missing: ${dockerFile}`,
          severity: 'warning'
        })
      }
    }

    this.results.push(validation)
  }

  private async validateTestingSetup(): Promise<void> {
    console.log('\n🧪 Validating testing setup...')
    
    const testDirs = ['src/__tests__', 'src/e2e']
    const validation: WorkflowValidation = {
      file: 'Testing Setup',
      results: []
    }

    for (const testDir of testDirs) {
      const dirPath = join(this.projectRoot, testDir)
      
      if (existsSync(dirPath)) {
        validation.results.push({
          valid: true,
          message: `Test directory found: ${testDir}`,
          severity: 'info'
        })
      } else {
        validation.results.push({
          valid: false,
          message: `Test directory missing: ${testDir}`,
          severity: 'warning'
        })
      }
    }

    this.results.push(validation)
  }

  private generateReport(): void {
    console.log('\n📊 CI/CD Validation Report')
    console.log('=' .repeat(50))

    let totalErrors = 0
    let totalWarnings = 0
    let totalInfo = 0

    for (const workflow of this.results) {
      console.log(`\n📄 ${workflow.file}`)
      console.log('-' .repeat(30))

      for (const result of workflow.results) {
        const icon = result.severity === 'error' ? '❌' : 
                    result.severity === 'warning' ? '⚠️' : 'ℹ️'
        
        console.log(`${icon} ${result.message}`)
        
        if (result.severity === 'error') totalErrors++
        else if (result.severity === 'warning') totalWarnings++
        else totalInfo++

        if (result.fix) {
          console.log(`   💡 Fix: ${result.fix}`)
        }
      }
    }

    console.log('\n📈 Summary')
    console.log('=' .repeat(50))
    console.log(`❌ Errors: ${totalErrors}`)
    console.log(`⚠️  Warnings: ${totalWarnings}`)
    console.log(`ℹ️  Info: ${totalInfo}`)

    if (totalErrors === 0) {
      console.log('\n🎉 All critical validations passed!')
    } else {
      console.log('\n⚠️  Some issues found that need to be addressed.')
    }
  }

  private provideLocalTestingGuidance(): void {
    console.log('\n🔧 Local Testing Guidance')
    console.log('=' .repeat(50))

    console.log('\n📋 Prerequisites:')
    console.log('  • Node.js 20.x installed')
    console.log('  • Docker installed (for containerized testing)')
    console.log('  • Act CLI installed (for GitHub Actions testing)')

    console.log('\n🧪 Testing Commands:')
    console.log('  # Run all tests locally')
    console.log('  npm test')
    console.log('  npm run test:coverage')
    console.log('  npm run test:e2e')
    
    console.log('\n  # Run linting and type checking')
    console.log('  npm run lint')
    console.log('  npm run type-check')
    
    console.log('\n  # Build application')
    console.log('  npm run build')

    console.log('\n🐳 Docker Testing:')
    console.log('  # Build Docker image')
    console.log('  docker build -t optimind-ai:latest .')
    
    console.log('  # Run Docker container locally')
    console.log('  docker run -p 3000:3000 optimind-ai:latest')

    console.log('\n🎭 GitHub Actions Testing (using Act):')
    console.log('  # Install Act CLI')
    console.log('  # See: https://github.com/nektos/act')
    
    console.log('\n  # Run specific workflow locally')
    console.log('  act -W .github/workflows/ci.yml')
    console.log('  act -W .github/workflows/deployment.yml --dry-run')
    
    console.log('\n  # Run with specific environment')
    console.log('  act -e .env -W .github/workflows/ci.yml')

    console.log('\n🔍 Environment Variables for Local Testing:')
    console.log('  # Create .env.local file with:')
    console.log('  NODE_ENV=development')
    console.log('  DATABASE_URL="file:./dev.db"')
    console.log('  NEXT_PUBLIC_APP_URL="http://localhost:3000"')

    console.log('\n📊 Monitoring and Debugging:')
    console.log('  # Check workflow logs')
    console.log('  # GitHub: Repository > Actions > Workflow run')
    
    console.log('\n  # Local development monitoring')
    console.log('  npm run dev')
    console.log('  # Check dev.log for output')
    
    console.log('\n  # Health checks')
    console.log('  npx tsx scripts/deployment-health-check.ts')
    console.log('  npx tsx scripts/deployment-smoke-test.ts')

    console.log('\n🚀 Deployment Testing:')
    console.log('  # Test deployment script locally')
    console.log('  npx tsx scripts/deploy-environment.ts --env staging --dry-run')
    
    console.log('\n  # Validate configuration before deployment')
    console.log('  npx tsx scripts/validate-cicd.ts')
  }
}

// Main execution
async function main() {
  const validator = new CICDValidator()
  
  try {
    await validator.validateAll()
  } catch (error) {
    console.error('Validation failed with error:', error)
    process.exit(1)
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Run validation
main()