/**
 * Environment-specific configuration for the Optimind AI Ecosystem
 */

export interface EnvironmentConfig {
  name: string
  apiUrl: string
  appUrl: string
  databaseUrl: string
  nodeEnv: 'development' | 'staging' | 'production'
  features: {
    analytics: boolean
    monitoring: boolean
    debugging: boolean
    cache: boolean
  }
  deployment: {
    provider: 'vercel' | 'netlify' | 'railway' | 'docker'
    autoDeploy: boolean
    healthCheck: boolean
  }
  security: {
    cors: boolean
    rateLimit: boolean
    audit: boolean
  }
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    apiUrl: 'http://localhost:3000/api',
    appUrl: 'http://localhost:3000',
    databaseUrl: 'file:./dev.db',
    nodeEnv: 'development',
    features: {
      analytics: false,
      monitoring: false,
      debugging: true,
      cache: false,
    },
    deployment: {
      provider: 'vercel',
      autoDeploy: false,
      healthCheck: false,
    },
    security: {
      cors: true,
      rateLimit: false,
      audit: false,
    },
  },
  staging: {
    name: 'Staging',
    apiUrl: 'https://optimind-ai-staging.vercel.app/api',
    appUrl: 'https://optimind-ai-staging.vercel.app',
    databaseUrl: process.env.STAGING_DATABASE_URL || 'file:./staging.db',
    nodeEnv: 'staging',
    features: {
      analytics: true,
      monitoring: true,
      debugging: true,
      cache: true,
    },
    deployment: {
      provider: 'vercel',
      autoDeploy: true,
      healthCheck: true,
    },
    security: {
      cors: true,
      rateLimit: true,
      audit: true,
    },
  },
  production: {
    name: 'Production',
    apiUrl: 'https://optimind-ai-ecosystem.vercel.app/api',
    appUrl: 'https://optimind-ai-ecosystem.vercel.app',
    databaseUrl: process.env.PRODUCTION_DATABASE_URL || 'file:./prod.db',
    nodeEnv: 'production',
    features: {
      analytics: true,
      monitoring: true,
      debugging: false,
      cache: true,
    },
    deployment: {
      provider: 'vercel',
      autoDeploy: true,
      healthCheck: true,
    },
    security: {
      cors: true,
      rateLimit: true,
      audit: true,
    },
  },
}

export function getEnvironmentConfig(env?: string): EnvironmentConfig {
  const environment = env || process.env.NODE_ENV || process.env.DEPLOY_ENV || 'development'
  return environments[environment] || environments.development
}

export function getCurrentEnvironment(): EnvironmentConfig {
  return getEnvironmentConfig()
}

export function isProduction(): boolean {
  return getCurrentEnvironment().nodeEnv === 'production'
}

export function isStaging(): boolean {
  return getCurrentEnvironment().nodeEnv === 'staging'
}

export function isDevelopment(): boolean {
  return getCurrentEnvironment().nodeEnv === 'development'
}

export default environments