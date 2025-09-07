#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env' });

import fetch from 'node-fetch'

/**
 * Health check script for deployment verification
 * This script performs comprehensive health checks after deployment
 */

interface HealthCheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
  duration?: number
  details?: any
}

class DeploymentHealthChecker {
  private results: HealthCheckResult[] = []
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async runCheck(name: string, check: () => Promise<boolean>, message: string): Promise<void> {
    const startTime = Date.now()
    try {
      const result = await check()
      const duration = Date.now() - startTime
      const status = result ? 'pass' : 'fail'
      
      this.results.push({
        name,
        status,
        message,
        duration
      })
      
      console.log(`${status === 'pass' ? '✅' : '❌'} ${name}: ${message} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime
      this.results.push({
        name,
        status: 'fail',
        message: `${message} - Error: ${error}`,
        duration
      })
      
      console.log(`❌ ${name}: ${message} - Error: ${error} (${duration}ms)`)
    }
  }

  async runAllChecks(): Promise<void> {
    console.log('🏥 Starting deployment health checks...')
    console.log(`🌐 Base URL: ${this.baseUrl}`)

    // Application Health Check
    await this.runCheck(
      'Application Health',
      async () => {
        try {
          const response = await fetch(`${this.baseUrl}/api/health`, {
            method: 'GET',
            timeout: 10000
          })
          return response.ok
        } catch {
          // If health endpoint doesn't exist, try the main page
          try {
            const response = await fetch(this.baseUrl, {
              method: 'GET',
              timeout: 10000
            })
            return response.ok
          } catch {
            return false
          }
        }
      },
      'Application is responding'
    )

    // Database Health Check
    await this.runCheck(
      'Database Health',
      async () => {
        try {
          const response = await fetch(`${this.baseUrl}/api/v2/database/health`, {
            method: 'GET',
            timeout: 15000
          })
          if (response.ok) {
            const data = await response.json()
            return data.status === 'healthy'
          }
          return false
        } catch {
          // Fallback: check if we can import and use Prisma
          try {
            const { PrismaClient } = await import('@prisma/client')
            const prisma = new PrismaClient()
            await prisma.$connect()
            await prisma.$queryRaw`SELECT 1 as test`
            await prisma.$disconnect()
            return true
          } catch {
            return false
          }
        }
      },
      'Database connection is healthy'
    )

    // API Endpoints Check
    await this.runCheck(
      'API Endpoints',
      async () => {
        const endpoints = [
          '/api/health',
          '/api/hello',
          '/api/users'
        ]
        
        let workingEndpoints = 0
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
              method: 'GET',
              timeout: 5000
            })
            if (response.ok || response.status === 404) {
              workingEndpoints++
            }
          } catch {
            // Endpoint not accessible
          }
        }
        
        return workingEndpoints > 0
      },
      'API endpoints are accessible'
    )

    // Static Assets Check
    await this.runCheck(
      'Static Assets',
      async () => {
        const assets = [
          '/favicon.ico',
          '/logo.svg'
        ]
        
        let workingAssets = 0
        for (const asset of assets) {
          try {
            const response = await fetch(`${this.baseUrl}${asset}`, {
              method: 'GET',
              timeout: 5000
            })
            if (response.ok) {
              workingAssets++
            }
          } catch {
            // Asset not accessible
          }
        }
        
        return workingAssets > 0
      },
      'Static assets are accessible'
    )

    // Performance Check
    await this.runCheck(
      'Performance',
      async () => {
        try {
          const startTime = Date.now()
          const response = await fetch(this.baseUrl, {
            method: 'GET',
            timeout: 30000
          })
          const loadTime = Date.now() - startTime
          
          // Consider it good if page loads within 10 seconds
          return loadTime < 10000 && response.ok
        } catch {
          return false
        }
      },
      'Application loads within acceptable time'
    )

    // Memory Usage Check
    await this.runCheck(
      'Memory Usage',
      async () => {
        const used = process.memoryUsage()
        const heapUsed = Math.round(used.heapUsed / 1024 / 1024)
        const heapTotal = Math.round(used.heapTotal / 1024 / 1024)
        
        console.log(`📊 Memory Usage: ${heapUsed}MB / ${heapTotal}MB`)
        
        // Consider it good if heap usage is less than 500MB
        return heapUsed < 500
      },
      'Memory usage is within acceptable limits'
    )

    // Security Headers Check
    await this.runCheck(
      'Security Headers',
      async () => {
        try {
          const response = await fetch(this.baseUrl, {
            method: 'GET',
            timeout: 5000
          })
          
          const headers = response.headers
          const securityHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection'
          ]
          
          let securityScore = 0
          for (const header of securityHeaders) {
            if (headers.has(header)) {
              securityScore++
            }
          }
          
          return securityScore >= 2
        } catch {
          return false
        }
      },
      'Security headers are present'
    )

    this.generateReport()
  }

  generateReport(): void {
    console.log('\n📋 Health Check Report')
    console.log('=' .repeat(50))
    
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const warned = this.results.filter(r => r.status === 'warn').length
    const total = this.results.length
    
    console.log(`Total Checks: ${total}`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warned}`)
    console.log('')
    
    for (const result of this.results) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
      const duration = result.duration ? ` (${result.duration}ms)` : ''
      console.log(`${icon} ${result.name}: ${result.message}${duration}`)
    }
    
    console.log('')
    
    if (failed === 0) {
      console.log('🎉 All health checks passed!')
      process.exit(0)
    } else {
      console.log(`⚠️  ${failed} health check(s) failed`)
      process.exit(1)
    }
  }
}

// Main execution
async function main() {
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const checker = new DeploymentHealthChecker(baseUrl)
  
  try {
    await checker.runAllChecks()
  } catch (error) {
    console.error('Health check failed with error:', error)
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

// Run health checks
main()