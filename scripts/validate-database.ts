/**
 * OptiMind AI Ecosystem - Database Validation Script
 * Validates all databases and provides comprehensive status report
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DatabaseStatus {
  isValid: boolean;
  tables: string[];
  recordCounts: Record<string, number>;
  errors: string[];
  timestamp: string;
}

async function validateDatabase(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isValid: true,
    tables: [],
    recordCounts: {},
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    console.log('🔍 Validating OptiMind AI Ecosystem Database...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Get all table names using raw query
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE '_prisma_migrations'
      ORDER BY name
    ` as { name: string }[];

    status.tables = tables.map(t => t.name);
    console.log(`📊 Found ${status.tables.length} tables`);

    // Get record counts for each table
    for (const table of status.tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM ${table}`);
        const count = (result as any[])[0]?.count || 0;
        status.recordCounts[table] = Number(count);
        
        if (count > 0) {
          console.log(`✅ ${table}: ${count} records`);
        } else {
          console.log(`⚠️  ${table}: 0 records`);
        }
      } catch (error) {
        console.error(`❌ Error counting records in ${table}:`, error);
        status.errors.push(`Failed to count records in ${table}: ${error}`);
      }
    }

    // Validate critical tables
    const criticalTables = ['users', 'tenants', 'projects', 'analyses'];
    for (const table of criticalTables) {
      if (!status.tables.includes(table)) {
        status.isValid = false;
        status.errors.push(`Critical table missing: ${table}`);
      } else if (status.recordCounts[table] === 0) {
        status.errors.push(`Critical table empty: ${table}`);
      }
    }

    // Test basic queries
    try {
      const userCount = await prisma.user.count();
      const tenantCount = await prisma.tenant.count();
      const projectCount = await prisma.project.count();
      
      console.log(`👥 Users: ${userCount}`);
      console.log(`🏢 Tenants: ${tenantCount}`);
      console.log(`📁 Projects: ${projectCount}`);

      if (userCount === 0) {
        status.isValid = false;
        status.errors.push('No users found in database');
      }

    } catch (error) {
      status.isValid = false;
      status.errors.push(`Basic query test failed: ${error}`);
    }

    status.isValid = status.errors.length === 0;

  } catch (error) {
    status.isValid = false;
    status.errors.push(`Database validation failed: ${error}`);
    console.error('❌ Database validation error:', error);
  } finally {
    await prisma.$disconnect();
  }

  return status;
}

function generateReport(status: DatabaseStatus): string {
  const validationStatus = status.isValid ? '✅ VALID' : '❌ INVALID';
  
  let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                 OPTIMIND AI ECOSYSTEM - DATABASE STATUS REPORT                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Generated: ${status.timestamp}                                            ║
║  Status: ${validationStatus}                                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 DATABASE OVERVIEW:
├── Total Tables: ${status.tables.length}
├── Validation Status: ${status.isValid ? 'PASSED' : 'FAILED'}
├── Errors Found: ${status.errors.length}
└── Connection: ${status.isValid ? '✅ Connected' : '❌ Failed'}

📋 TABLES AND RECORD COUNTS:
`;

  for (const [table, count] of Object.entries(status.recordCounts)) {
    const statusIcon = count > 0 ? '✅' : '⚠️';
    report += `${statusIcon} ${table}: ${count} records\n`;
  }

  if (status.errors.length > 0) {
    report += `\n❌ ERRORS:\n`;
    for (const error of status.errors) {
      report += `   • ${error}\n`;
    }
  }

  report += `\n🎯 RECOMMENDATIONS:\n`;

  if (status.isValid) {
    report += `✅ Database is healthy and ready for production use.\n`;
    report += `🔹 All critical tables exist and contain data.\n`;
    report += `🔹 Database connections are working properly.\n`;
    report += `🔹 Schema is up to date with latest changes.\n`;
  } else {
    report += `⚠️ Database has issues that need attention.\n`;
    report += `🔹 Review and fix the errors listed above.\n`;
    report += `🔹 Run database migration scripts if needed.\n`;
    report += `🔹 Check database connectivity and permissions.\n`;
  }

  report += `\n╔══════════════════════════════════════════════════════════════════════════════╗\n`;
  report += `║                          END OF STATUS REPORT                              ║\n`;
  report += `╚══════════════════════════════════════════════════════════════════════════════╝\n`;

  return report;
}

async function main() {
  try {
    console.log('🚀 Starting OptiMind AI Ecosystem Database Validation...');
    
    const status = await validateDatabase();
    const report = generateReport(status);
    
    console.log('\n' + report);
    
    if (status.isValid) {
      console.log('🎉 Database validation completed successfully!');
      process.exit(0);
    } else {
      console.log('❌ Database validation failed. Please review the errors above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Database validation script failed:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  main();
}

export { validateDatabase, generateReport };