#!/usr/bin/env tsx

/**
 * Check existing API keys in the database
 * This script queries the database for existing API keys and developer access keys
 */

import { db } from './src/lib/db';

async function checkAPIKeys() {
  console.log('🔍 Checking existing API keys in database...\n');

  try {
    // Check regular API keys
    console.log('📋 Regular API Keys:');
    console.log('═'.repeat(50));
    
    const apiKeys = await db.apiKey.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (apiKeys.length === 0) {
      console.log('❌ No API keys found in database');
    } else {
      console.log(`✅ Found ${apiKeys.length} API keys:\n`);
      
      apiKeys.forEach((key, index) => {
        console.log(`${index + 1}. 🗝️ ${key.name}`);
        console.log(`   ID: ${key.id}`);
        console.log(`   Key: ${key.key.substring(0, 20)}...`);
        console.log(`   User: ${key.user.email} (${key.user.role})`);
        console.log(`   Status: ${key.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Created: ${key.createdAt}`);
        if (key.expiresAt) {
          console.log(`   Expires: ${key.expiresAt}`);
        }
        if (key.lastUsedAt) {
          console.log(`   Last Used: ${key.lastUsedAt}`);
        }
        console.log(`   Rate Limit: ${key.rateLimit || 'Not set'}`);
        if (key.permissions) {
          console.log(`   Permissions: ${JSON.stringify(key.permissions)}`);
        }
        console.log('');
      });
    }

    // Check developer access keys
    console.log('\n🔑 Developer Access Keys:');
    console.log('═'.repeat(50));
    
    const devKeys = await db.developerAccessKey.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (devKeys.length === 0) {
      console.log('❌ No developer access keys found in database');
    } else {
      console.log(`✅ Found ${devKeys.length} developer access keys:\n`);
      
      devKeys.forEach((key, index) => {
        console.log(`${index + 1}. 🔐 ${key.keyId}`);
        console.log(`   ID: ${key.id}`);
        console.log(`   User: ${key.user.email} (${key.user.role})`);
        console.log(`   Type: ${key.keyType}`);
        console.log(`   Access Level: ${key.accessLevel}`);
        console.log(`   Status: ${key.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Created: ${key.createdAt}`);
        console.log(`   Expires: ${key.expiresAt}`);
        if (key.metadata) {
          console.log(`   Metadata: ${JSON.stringify(key.metadata, null, 2)}`);
        }
        console.log('');
      });
    }

    // Check users with API key access
    console.log('\n👥 Users with API Access:');
    console.log('═'.repeat(50));
    
    const usersWithKeys = await db.user.findMany({
      where: {
        OR: [
          {
            apiKeys: {
              some: {}
            }
          },
          {
            developerAccessKeys: {
              some: {}
            }
          }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        apiKey: true,
        _count: {
          select: {
            apiKeys: true,
            developerAccessKeys: true
          }
        }
      }
    });

    if (usersWithKeys.length === 0) {
      console.log('❌ No users with API key access found');
    } else {
      console.log(`✅ Found ${usersWithKeys.length} users with API access:\n`);
      
      usersWithKeys.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.name || user.email}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Credits: ${user.credits}`);
        console.log(`   API Key: ${user.apiKey ? 'Set' : 'Not set'}`);
        console.log(`   Regular API Keys: ${user._count.apiKeys}`);
        console.log(`   Developer Access Keys: ${user._count.developerAccessKeys}`);
        console.log('');
      });
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Total API Keys: ${apiKeys.length}`);
    console.log(`Total Developer Access Keys: ${devKeys.length}`);
    console.log(`Users with API Access: ${usersWithKeys.length}`);
    console.log(`Active API Keys: ${apiKeys.filter(k => k.isActive).length}`);
    console.log(`Active Developer Keys: ${devKeys.filter(k => k.isActive).length}`);

    if (apiKeys.length > 0 || devKeys.length > 0) {
      console.log('\n✅ Your API key management system is working!');
      console.log('💡 Keys are stored securely in the database, not in .env files');
      console.log('🔧 Use the EnterpriseAPIManager to manage these keys programmatically');
    } else {
      console.log('\n⚠️  No API keys found in database');
      console.log('💡 You may need to create initial API keys using the key management system');
    }

  } catch (error) {
    console.error('❌ Error checking API keys:', error);
    console.error('Make sure the database is properly configured and accessible');
  } finally {
    await db.$disconnect();
  }
}

// Run the check
checkAPIKeys().catch(console.error);