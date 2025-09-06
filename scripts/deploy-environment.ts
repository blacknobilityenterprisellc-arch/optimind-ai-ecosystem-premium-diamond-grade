#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { getEnvironmentConfig } from '../config/environments'

/**
 * Environment-specific deployment script
 */

interface DeploymentOptions {
  environment: string
  provider?: string
  dryRun?: boolean
  skipTests?: boolean
  skipBuild?: boolean
}

class EnvironmentDeployer {
  private options: DeploymentOptions
  private config: ReturnType<typeof getEnvironmentConfig>

  constructor(options: DeploymentOptions) {
    this.options = options
    this.config = getEnvironmentConfig(options.environment)
  }

  async deploy(): Promise<void> {
    console.log(`🚀 Starting deployment for ${this.config.name} environment...`)
    console.log(`📋 Configuration: ${JSON.stringify(this.config, null, 2)}`)

    try {
      // Pre-deployment checks
      await this.runPreDeploymentChecks()

      // Build application
      if (!this.options.skipBuild) {
        await this.buildApplication()
      }

      // Run tests
      if (!this.options.skipTests) {
        await this.runTests()
      }

      // Deploy based on provider
      await this.deployToProvider()

      // Post-deployment verification
      await this.runPostDeploymentChecks()

      console.log(`🎉 Deployment to ${this.config.name} completed successfully!`)
    } catch (error) {
      console.error(`❌ Deployment failed:`, error)
      process.exit(1)
    }
  }

  private async runPreDeploymentChecks(): Promise<void> {
    console.log('🔍 Running pre-deployment checks...')

    // Check if required environment variables are set
    const requiredEnvVars = this.getRequiredEnvironmentVariables()
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set`)
      }
    }

    // Check if working directory is clean
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (status.trim()) {
        console.warn('⚠️  Working directory is not clean')
      }
    } catch {
      // Not in git repository or git not available
    }

    console.log('✅ Pre-deployment checks passed')
  }

  private async buildApplication(): Promise<void> {
    console.log('🔨 Building application...')

    const buildCommand = `NODE_ENV=${this.config.nodeEnv} npm run build`
    
    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${buildCommand}`)
      return
    }

    execSync(buildCommand, { stdio: 'inherit' })
    console.log('✅ Application built successfully')
  }

  private async runTests(): Promise<void> {
    console.log('🧪 Running tests...')

    const testCommands = [
      'npm run type-check',
      'npm run lint',
      'npm run test:unit -- --coverage',
    ]

    for (const command of testCommands) {
      if (this.options.dryRun) {
        console.log(`[DRY RUN] Would execute: ${command}`)
        continue
      }

      try {
        execSync(command, { stdio: 'inherit' })
      } catch (error) {
        console.warn(`⚠️  Test command failed: ${command}`)
        if (this.config.nodeEnv === 'production') {
          throw new Error(`Tests failed for production deployment: ${error}`)
        }
      }
    }

    console.log('✅ Tests completed')
  }

  private async deployToProvider(): Promise<void> {
    console.log(`🚀 Deploying to ${this.config.deployment.provider}...`)

    const provider = this.options.provider || this.config.deployment.provider

    switch (provider) {
      case 'vercel':
        await this.deployToVercel()
        break
      case 'netlify':
        await this.deployToNetlify()
        break
      case 'railway':
        await this.deployToRailway()
        break
      case 'docker':
        await this.deployToDocker()
        break
      default:
        throw new Error(`Unsupported deployment provider: ${provider}`)
    }

    console.log(`✅ Deployed to ${provider}`)
  }

  private async deployToVercel(): Promise<void> {
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelOrgId = process.env.VERCEL_ORG_ID
    const vercelProjectId = process.env.VERCEL_PROJECT_ID

    if (!vercelToken || !vercelOrgId || !vercelProjectId) {
      throw new Error('Vercel credentials not configured')
    }

    const args = this.config.nodeEnv === 'production' ? '--prod' : '--preview'
    const command = `npx vercel --token ${vercelToken} --scope ${vercelOrgId} ${args}`

    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${command}`)
      return
    }

    execSync(command, { stdio: 'inherit' })
  }

  private async deployToNetlify(): Promise<void> {
    const netlifyToken = process.env.NETLIFY_AUTH_TOKEN
    const netlifySiteId = process.env.NETLIFY_SITE_ID

    if (!netlifyToken || !netlifySiteId) {
      throw new Error('Netlify credentials not configured')
    }

    const args = this.config.nodeEnv === 'production' ? '--prod' : ''
    const command = `npx netlify deploy --auth ${netlifyToken} --site ${netlifySiteId} ${args}`

    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${command}`)
      return
    }

    execSync(command, { stdio: 'inherit' })
  }

  private async deployToRailway(): Promise<void> {
    const railwayToken = process.env.RAILWAY_TOKEN

    if (!railwayToken) {
      throw new Error('Railway token not configured')
    }

    const command = `npx railway up --service=optimind-ai`

    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${command}`)
      return
    }

    execSync(command, { 
      stdio: 'inherit',
      env: { ...process.env, RAILWAY_TOKEN: railwayToken }
    })
  }

  private async deployToDocker(): Promise<void> {
    const dockerUsername = process.env.DOCKER_USERNAME
    const dockerPassword = process.env.DOCKER_PASSWORD

    if (!dockerUsername || !dockerPassword) {
      throw new Error('Docker credentials not configured')
    }

    const commands = [
      `docker login -u ${dockerUsername} -p ${dockerPassword}`,
      `docker build -t ${dockerUsername}/optimind-ai:latest .`,
      `docker push ${dockerUsername}/optimind-ai:latest`,
    ]

    if (this.options.dryRun) {
      commands.forEach(cmd => console.log(`[DRY RUN] Would execute: ${cmd}`))
      return
    }

    for (const command of commands) {
      execSync(command, { stdio: 'inherit' })
    }
  }

  private async runPostDeploymentChecks(): Promise<void> {
    console.log('🔍 Running post-deployment checks...')

    if (!this.config.deployment.healthCheck) {
      console.log('⏭️  Health checks disabled for this environment')
      return
    }

    // Run health check script
    const healthCheckCommand = 'npx tsx scripts/deployment-health-check.ts'
    
    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would execute: ${healthCheckCommand}`)
      return
    }

    try {
      execSync(healthCheckCommand, { 
        stdio: 'inherit',
        env: { ...process.env, BASE_URL: this.config.appUrl }
      })
      console.log('✅ Health checks passed')
    } catch (error) {
      console.error('❌ Health checks failed')
      throw error
    }
  }

  private getRequiredEnvironmentVariables(): string[] {
    const baseVars = ['NODE_ENV']
    
    switch (this.config.deployment.provider) {
      case 'vercel':
        return [...baseVars, 'VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID']
      case 'netlify':
        return [...baseVars, 'NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID']
      case 'railway':
        return [...baseVars, 'RAILWAY_TOKEN']
      case 'docker':
        return [...baseVars, 'DOCKER_USERNAME', 'DOCKER_PASSWORD']
      default:
        return baseVars
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const options: DeploymentOptions = {
    environment: 'development',
    dryRun: false,
    skipTests: false,
    skipBuild: false,
  }

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--env' || arg === '-e') {
      options.environment = args[++i]
    } else if (arg === '--provider' || arg === '-p') {
      options.provider = args[++i]
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true
    } else if (arg === '--skip-tests') {
      options.skipTests = true
    } else if (arg === '--skip-build') {
      options.skipBuild = true
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: deploy-environment [options]

Options:
  -e, --env <environment>     Target environment (development, staging, production)
  -p, --provider <provider>   Deployment provider (vercel, netlify, railway, docker)
  -d, --dry-run              Show what would be done without actually doing it
  --skip-tests               Skip running tests
  --skip-build               Skip building the application
  -h, --help                 Show this help message

Environment Variables:
  VERCEL_TOKEN              Vercel API token
  VERCEL_ORG_ID             Vercel organization ID
  VERCEL_PROJECT_ID         Vercel project ID
  NETLIFY_AUTH_TOKEN       Netlify authentication token
  NETLIFY_SITE_ID          Netlify site ID
  RAILWAY_TOKEN            Railway API token
  DOCKER_USERNAME          Docker Hub username
  DOCKER_PASSWORD          Docker Hub password
`)
      process.exit(0)
    }
  }

  const deployer = new EnvironmentDeployer(options)
  await deployer.deploy()
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

// Run deployment
main()