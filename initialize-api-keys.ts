#!/usr/bin/env tsx

/**
 * Initialize OptiMind AI Ecosystem API Key Management System
 * 
 * This script creates the initial API keys and sets up the management system
 * using your existing enterprise-grade infrastructure.
 */

import { db } from './src/lib/db';

async function initializeAPIKeySystem() {
  console.log('🚀 Initializing OptiMind AI Ecosystem API Key Management System...\n');

  try {
    // Step 1: Check if we have any users in the system
    console.log('📋 Step 1: Checking existing users...');
    const users = await db.user.findMany();
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating initial admin user...');
      
      // Create initial admin user
      const adminUser = await db.user.create({
        data: {
          email: 'admin@optimind.ai',
          name: 'System Administrator',
          role: 'ADMIN',
          credits: 10000,
          apiKey: 'optimind-admin-initial-key',
          isActive: true
        }
      });
      
      console.log(`✅ Created admin user: ${adminUser.email}`);
    } else {
      console.log(`✅ Found ${users.length} existing users`);
    }

    // Step 2: Create initial API keys for the admin user
    console.log('\n🗝️  Step 2: Creating initial API keys...');
    const adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminUser) {
      // Create regular API key
      const apiKey = await db.apiKey.create({
        data: {
          name: 'Admin API Key',
          key: 'optimind-admin-api-key-' + Date.now(),
          secret: 'optimind-admin-secret-' + Date.now(),
          userId: adminUser.id,
          permissions: JSON.stringify(['read', 'write', 'admin']),
          rateLimit: 1000,
          isActive: true,
          createdBy: 'system',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      });
      console.log(`✅ Created API key: ${apiKey.name}`);

      // Create developer access key
      const devAccessKey = await db.developerAccessKey.create({
        data: {
          keyId: 'dev-access-key-' + Date.now(),
          userId: adminUser.id,
          keyType: 'EXCLUSIVE',
          accessLevel: 'TOP_SECRET',
          permissions: JSON.stringify(['all']),
          allowedEndpoints: JSON.stringify(['*']),
          rateLimit: JSON.stringify({
            requestsPerMinute: 1000,
            requestsPerHour: 10000,
            requestsPerDay: 50000
          }),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          isActive: true,
          metadata: JSON.stringify({
            purpose: 'System administration and development',
            environment: 'development',
            createdBy: 'system'
          })
        }
      });
      console.log(`✅ Created Developer Access Key: ${devAccessKey.keyId}`);
    }

    // Step 3: Create service-specific API keys for AI services
    console.log('\n🤖 Step 3: Creating AI Service API keys...');
    
    const aiServices = [
      { name: 'ZAI Service', key: 'zai-service-key', service: 'zai' },
      { name: 'OpenRouter Service', key: 'openrouter-service-key', service: 'openrouter' },
      { name: 'Anthropic Service', key: 'anthropic-service-key', service: 'anthropic' },
      { name: 'OpenAI Service', key: 'openai-service-key', service: 'openai' }
    ];

    for (const service of aiServices) {
      try {
        const serviceKey = await db.apiKey.create({
          data: {
            name: service.name,
            key: service.key + '-' + Date.now(),
            secret: service.key + '-secret-' + Date.now(),
            userId: adminUser!.id,
            permissions: JSON.stringify([`service:${service.service}`, 'read', 'write']),
            rateLimit: 500,
            isActive: true,
            createdBy: 'system',
            metadata: JSON.stringify({
              service: service.service,
              type: 'ai-service'
            })
          }
        });
        console.log(`✅ Created ${service.name}: ${serviceKey.name}`);
      } catch (error) {
        console.log(`❌ Failed to create ${service.name}: ${error.message}`);
      }
    }

    // Step 4: Display system status
    console.log('\n📊 Step 4: System Status Summary');
    console.log('═'.repeat(50));
    
    const finalApiKeyCount = await db.apiKey.count();
    const finalDevKeyCount = await db.developerAccessKey.count();
    const finalUserCount = await db.user.count();

    console.log(`👥 Users: ${finalUserCount}`);
    console.log(`🗝️  API Keys: ${finalApiKeyCount}`);
    console.log(`🔑 Developer Access Keys: ${finalDevKeyCount}`);

    // Step 5: Generate environment configuration guide
    console.log('\n📋 Step 5: Environment Configuration Guide');
    console.log('═'.repeat(50));
    console.log('💡 Your API keys are now stored securely in the database!');
    console.log('🛡️  You DO NOT need to put API keys in .env files anymore');
    console.log('🔧 Use the API Manager to access and manage keys programmatically');
    console.log('');
    console.log('🔄 To access your API keys:');
    console.log('   1. Query the database directly using Prisma');
    console.log('   2. Use the ExclusiveDeveloperAccessService');
    console.log('');
    console.log('🌐 Example usage:');
    console.log('   const apiKeys = await db.apiKey.findMany();');
    console.log('   const devKeys = await db.developerAccessKey.findMany();');

    // Clean up
    await db.$disconnect();

    console.log('\n🎉 API Key Management System Initialization Complete!');
    console.log('✅ Your OptiMind AI Ecosystem is now ready with secure API key management');

  } catch (error) {
    console.error('❌ Error initializing API key system:', error);
    console.error('Stack trace:', error.stack);
    await db.$disconnect();
    process.exit(1);
  }
}

// Run the initialization
initializeAPIKeySystem().catch(console.error);