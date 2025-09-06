#!/usr/bin/env tsx

// Database Validation Script for OptiMind AI Ecosystem
import { PrismaClient } from '@prisma/client';

async function validateDatabase(databaseUrl: string, dbName: string) {
  console.log(`🔍 Validating ${dbName}...`);
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // Test connection
    await prisma.$connect();
    console.log(`✅ ${dbName} connection successful`);

    // Get basic table info
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
    ` as Array<{ name: string }>;

    console.log(`📊 ${dbName} contains ${tables.length} tables:`);
    
    // Count records in key tables
    for (const table of tables.slice(0, 5)) { // Show first 5 tables
      try {
        const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM ${table.name};`);
        console.log(`   - ${table.name}: ${JSON.stringify(count)} records`);
      } catch (error) {
        console.log(`   - ${table.name}: Unable to count records`);
      }
    }

    if (tables.length > 5) {
      console.log(`   ... and ${tables.length - 5} more tables`);
    }

    await prisma.$disconnect();
    console.log(`✅ ${dbName} validation complete\n`);
    
  } catch (error) {
    console.error(`❌ ${dbName} validation failed:`, error);
  }
}

async function main() {
  console.log('🚀 Starting database validation...\n');

  // Validate main database
  await validateDatabase('file:./prisma/dev.db', 'Main Database');

  // Validate custom database
  await validateDatabase('file:./db/custom.db', 'Custom Database');

  console.log('🎉 Database validation complete!');
}

main().catch(console.error);