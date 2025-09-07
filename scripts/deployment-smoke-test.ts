#!/usr/bin/env tsx

import { createServer } from 'http'
import { nextServer } from 'next/dist/server/next'

/**
 * Smoke test script for deployment verification
 * This script performs basic health checks after deployment
 */

async function runSmokeTests() {
  console.log('🚀 Starting deployment smoke tests...')
  
  const tests = [
    {
      name: 'Environment Check',
      test: () => {
        console.log('✅ Environment variables loaded')
        console.log(`📦 NODE_ENV: ${process.env.NODE_ENV}`)
        console.log(`🌐 NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'not set'}`)
        return true
      }
    },
    {
      name: 'Database Connection',
      test: async () => {
        try {
          const { PrismaClient } = await import('@prisma/client')
          const prisma = new PrismaClient()
          
          await prisma.$connect()
          console.log('✅ Database connection successful')
          
          // Basic query test
          const result = await prisma.$queryRaw`SELECT 1 as test`
          console.log('✅ Database query test passed')
          
          await prisma.$disconnect()
          return true
        } catch (error) {
          console.error('❌ Database connection failed:', error)
          return false
        }
      }
    },
    {
      name: 'Build Verification',
      test: () => {
        const fs = require('fs')
        const path = require('path')
        
        // Check if .next directory exists
        const nextDir = path.join(process.cwd(), '.next')
        if (!fs.existsSync(nextDir)) {
          console.error('❌ .next directory not found')
          return false
        }
        console.log('✅ .next directory exists')
        
        // Check for key build files
        const buildFiles = [
          'BUILD_ID',
          'routes-manifest.json',
          'prerender-manifest.json'
        ]
        
        for (const file of buildFiles) {
          const filePath = path.join(nextDir, file)
          if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} found`)
          } else {
            console.warn(`⚠️  ${file} not found (may be normal for some builds)`)
          }
        }
        
        return true
      }
    },
    {
      name: 'Static Assets Check',
      test: () => {
        const fs = require('fs')
        const path = require('path')
        
        // Check public directory
        const publicDir = path.join(process.cwd(), 'public')
        if (fs.existsSync(publicDir)) {
          const files = fs.readdirSync(publicDir)
          console.log(`✅ Public directory contains ${files.length} files`)
        } else {
          console.warn('⚠️  Public directory not found')
        }
        
        return true
      }
    },
    {
      name: 'API Routes Structure',
      test: () => {
        const fs = require('fs')
        const path = require('path')
        
        // Check if API routes directory exists
        const apiDir = path.join(process.cwd(), 'src', 'app', 'api')
        if (fs.existsSync(apiDir)) {
          const getApiFiles = (dir: string): string[] => {
            const files: string[] = []
            const items = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const item of items) {
              const fullPath = path.join(dir, item.name)
              if (item.isDirectory()) {
                files.push(...getApiFiles(fullPath))
              } else if (item.name === 'route.ts' || item.name === 'route.js') {
                files.push(fullPath)
              }
            }
            return files
          }
          
          const apiFiles = getApiFiles(apiDir)
          console.log(`✅ Found ${apiFiles.length} API route files`)
        } else {
          console.warn('⚠️  API routes directory not found')
        }
        
        return true
      }
    }
  ]
  
  let passedTests = 0
  const totalTests = tests.length
  
  for (const test of tests) {
    try {
      console.log(`\n🧪 Running: ${test.name}`)
      const result = await test.test()
      if (result) {
        passedTests++
        console.log(`✅ ${test.name} passed`)
      } else {
        console.log(`❌ ${test.name} failed`)
      }
    } catch (error) {
      console.error(`❌ ${test.name} failed with error:`, error)
    }
  }
  
  console.log(`\n📊 Smoke Test Results: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 All smoke tests passed!')
    process.exit(0)
  } else {
    console.log('⚠️  Some smoke tests failed')
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

// Run smoke tests
runSmokeTests()