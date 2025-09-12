#!/usr/bin/env node

/**
 * Neon Database Setup Script
 * Configures and initializes Neon PostgreSQL database for OptiMind AI Ecosystem
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

class NeonDatabaseSetup {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async setupNeonDatabase() {
    console.log('🚀 Setting up Neon PostgreSQL Database for OptiMind AI Ecosystem...');

    try {
      // Step 1: Backup current schema
      await this.backupCurrentSchema();
      
      // Step 2: Switch to Neon schema
      await this.switchToNeonSchema();
      
      // Step 3: Generate Prisma client for Neon
      await this.generateNeonClient();
      
      // Step 4: Push schema to Neon
      await this.pushToNeon();
      
      // Step 5: Run Neon-specific migrations
      await this.runNeonMigrations();
      
      // Step 6: Seed Neon database
      await this.seedNeonDatabase();
      
      // Step 7: Verify Neon setup
      await this.verifyNeonSetup();
      
      console.log('✅ Neon Database setup completed successfully!');
      
    } catch (error) {
      console.error('❌ Neon Database setup failed:', error);
      throw error;
    }
  }

  private async backupCurrentSchema() {
    console.log('📦 Backing up current schema...');
    
    const backupPath = path.join(process.cwd(), 'prisma', 'schema-backup.prisma');
    const currentSchema = fs.readFileSync(path.join(process.cwd(), 'prisma', 'schema.prisma'), 'utf-8');
    
    fs.writeFileSync(backupPath, currentSchema);
    console.log('✅ Schema backed up successfully');
  }

  private async switchToNeonSchema() {
    console.log('🔄 Switching to Neon schema...');
    
    const neonSchemaPath = path.join(process.cwd(), 'prisma', 'schema-neon.prisma');
    const mainSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    
    // Copy Neon schema to main schema
    const neonSchema = fs.readFileSync(neonSchemaPath, 'utf-8');
    fs.writeFileSync(mainSchemaPath, neonSchema);
    
    console.log('✅ Switched to Neon schema');
  }

  private async generateNeonClient() {
    console.log('🔧 Generating Prisma client for Neon...');
    
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated for Neon');
    } catch (error) {
      console.error('❌ Failed to generate Prisma client for Neon:', error);
      throw error;
    }
  }

  private async pushToNeon() {
    console.log('📤 Pushing schema to Neon database...');
    
    try {
      // Set environment variables for Neon
      process.env.DATABASE_URL = process.env.NEON_DATABASE_URL || 'postgresql://username:password@host.neon.tech/database?sslmode=require';
      process.env.SHADOW_DATABASE_URL = process.env.NEON_SHADOW_DATABASE_URL || 'postgresql://username:password@host.neon.tech/database?sslmode=require';
      process.env.DIRECT_URL = process.env.NEON_DIRECT_URL || 'postgresql://username:password@host.neon.tech/database?sslmode=require';
      
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Schema pushed to Neon database');
    } catch (error) {
      console.error('❌ Failed to push schema to Neon:', error);
      throw error;
    }
  }

  private async runNeonMigrations() {
    console.log('🔄 Running Neon-specific migrations...');
    
    try {
      // Create PostgreSQL extensions
      const extensions = [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
        'CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";',
      ];
      
      for (const extension of extensions) {
        try {
          await this.prisma.$executeRawUnsafe(extension);
          console.log(`✅ Created extension: ${extension}`);
        } catch (error) {
          console.warn(`⚠️  Extension already exists or failed: ${extension}`);
        }
      }
      
      // Create PostgreSQL-specific indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");',
        'CREATE INDEX IF NOT EXISTS "tenants_slug_idx" ON "tenants" ("slug");',
        'CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" ("status");',
        'CREATE INDEX IF NOT EXISTS "analyses_status_idx" ON "analyses" ("status");',
        'CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" ("status");',
      ];
      
      for (const index of indexes) {
        try {
          await this.prisma.$executeRawUnsafe(index);
          console.log(`✅ Created index: ${index}`);
        } catch (error) {
          console.warn(`⚠️  Index already exists or failed: ${index}`);
        }
      }
      
      console.log('✅ Neon migrations completed');
    } catch (error) {
      console.error('❌ Failed to run Neon migrations:', error);
      throw error;
    }
  }

  private async seedNeonDatabase() {
    console.log('🌱 Seeding Neon database...');
    
    try {
      // Run the enhanced seed for Neon
      execSync('npx tsx prisma/seed.enhanced.ts', { stdio: 'inherit' });
      console.log('✅ Neon database seeded successfully');
    } catch (error) {
      console.error('❌ Failed to seed Neon database:', error);
      throw error;
    }
  }

  private async verifyNeonSetup() {
    console.log('🔍 Verifying Neon setup...');
    
    try {
      // Test basic connection
      const result = await this.prisma.$queryRaw`SELECT version()`;
      console.log('✅ Database connection verified:', result);
      
      // Test table existence
      const tables = await this.prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
      console.log('✅ Tables created:', tables);
      
      // Test data existence
      const userCount = await this.prisma.user.count();
      const tenantCount = await this.prisma.tenant.count();
      const projectCount = await this.prisma.project.count();
      
      console.log('📊 Neon Database Statistics:');
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Tenants: ${tenantCount}`);
      console.log(`   - Projects: ${projectCount}`);
      
      if (userCount > 0 && tenantCount > 0 && projectCount > 0) {
        console.log('✅ Neon database verification completed successfully');
      } else {
        throw new Error('Neon database verification failed - missing data');
      }
      
    } catch (error) {
      console.error('❌ Neon verification failed:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.prisma.$disconnect();
    } catch (error) {
      console.warn('⚠️  Error during cleanup:', error);
    }
  }
}

// Main execution
async function main() {
  const setup = new NeonDatabaseSetup();
  
  try {
    await setup.setupNeonDatabase();
  } catch (error) {
    console.error('❌ Neon database setup failed:', error);
    process.exit(1);
  } finally {
    await setup.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { NeonDatabaseSetup };