/**
 * OptiMind AI Ecosystem - Prisma Database Validator
 * Premium Diamond Grade Database Validation using Prisma
 * 
 * This script validates database updates using Prisma client
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

interface DatabaseValidationResult {
  isValid: boolean;
  tables: string[];
  recordCounts: Record<string, number>;
  errors: string[];
  backupPath?: string;
  timestamp: string;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
}

class PrismaDatabaseValidator {
  private prisma: PrismaClient;
  private backupDir: string;
  private timestamp: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.backupDir = path.join(process.cwd(), 'database_backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Create backup by copying database file
   */
  async createBackup(): Promise<string> {
    const backupFileName = `database_backup_${this.timestamp}.db`;
    const backupPath = path.join(this.backupDir, backupFileName);
    const sourcePath = path.join(process.cwd(), 'prisma', 'dev.db');

    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.copyFile(sourcePath, backupPath);
      
      console.log(`✅ Database backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error(`❌ Backup creation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get table names using Prisma
   */
  async getTableNames(): Promise<string[]> {
    try {
      // Query SQLite master table to get all user tables
      const tables = await this.prisma.$queryRaw`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%' 
        ORDER BY name
      ` as Array<{ name: string }>;
      
      return tables.map(t => t.name);
    } catch (error) {
      console.error('Failed to get table names:', error);
      return [];
    }
  }

  /**
   * Get record count for a table
   */
  async getRecordCount(tableName: string): Promise<number> {
    try {
      const result = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM ${tableName}`);
      return (result as any[])[0].count;
    } catch (error) {
      console.error(`Failed to count records in ${tableName}:`, error);
      return 0;
    }
  }

  /**
   * Validate database health using Prisma
   */
  async validateDatabase(): Promise<DatabaseValidationResult> {
    const result: DatabaseValidationResult = {
      isValid: true,
      tables: [],
      recordCounts: {},
      errors: [],
      timestamp: this.timestamp,
      healthStatus: 'healthy'
    };

    try {
      console.log('🔍 Validating database schema and data using Prisma...');

      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection successful');

      // Get table names
      result.tables = await this.getTableNames();
      console.log(`📋 Found ${result.tables.length} tables`);

      // Get record counts for each table
      for (const table of result.tables) {
        const count = await this.getRecordCount(table);
        result.recordCounts[table] = count;
      }

      // Validate critical tables exist and have data
      const criticalTables = ['users', 'tenants', 'projects', 'analyses'];
      let criticalIssues = 0;

      for (const table of criticalTables) {
        if (!result.tables.includes(table)) {
          result.isValid = false;
          result.errors.push(`Critical table missing: ${table}`);
          criticalIssues++;
        } else if (result.recordCounts[table] === 0) {
          result.errors.push(`Critical table empty: ${table}`);
          criticalIssues++;
        }
      }

      // Test basic Prisma operations
      try {
        // Test user query
        const userCount = await this.prisma.user.count();
        console.log(`✅ User table accessible: ${userCount} users`);

        // Test tenant query
        const tenantCount = await this.prisma.tenant.count();
        console.log(`✅ Tenant table accessible: ${tenantCount} tenants`);

        // Test project query
        const projectCount = await this.prisma.project.count();
        console.log(`✅ Project table accessible: ${projectCount} projects`);

      } catch (error) {
        result.isValid = false;
        result.errors.push(`Prisma query test failed: ${error}`);
        criticalIssues++;
      }

      // Determine health status
      if (criticalIssues === 0) {
        result.healthStatus = 'healthy';
      } else if (criticalIssues <= 2) {
        result.healthStatus = 'degraded';
      } else {
        result.healthStatus = 'unhealthy';
        result.isValid = false;
      }

      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.healthStatus = 'unhealthy';
      result.errors.push(`Database validation failed: ${error}`);
    }

    return result;
  }

  /**
   * Generate validation report
   */
  generateReport(result: DatabaseValidationResult): string {
    const status = result.isValid ? '✅ VALID' : '❌ INVALID';
    const healthEmoji = result.healthStatus === 'healthy' ? '💚' : 
                       result.healthStatus === 'degraded' ? '💛' : '❤️';
    
    let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║              OPTIMIND AI ECOSYSTEM - PRISMA DATABASE VALIDATION REPORT          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Generated: ${result.timestamp}                                            ║
║  Status: ${status} | Health: ${healthEmoji} ${result.healthStatus.toUpperCase()}              ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 DATABASE OVERVIEW:
├── Total Tables: ${result.tables.length}
├── Health Status: ${result.healthStatus.toUpperCase()}
├── Validation Status: ${result.isValid ? 'PASSED' : 'FAILED'}
└── Errors Found: ${result.errors.length}

📋 TABLES AND RECORD COUNTS:
`;

    for (const [table, count] of Object.entries(result.recordCounts)) {
      const status = count > 0 ? '✅' : '⚠️';
      report += `${status} ${table}: ${count} records\\n`;
    }

    if (result.errors.length > 0) {
      report += `\\n❌ ERRORS:\\n`;
      for (const error of result.errors) {
        report += `   • ${error}\\n`;
      }
    }

    if (result.backupPath) {
      report += `\\n💾 BACKUP:\\n`;
      report += `   • Location: ${result.backupPath}\\n`;
    }

    report += `\\n🎯 RECOMMENDATIONS:\\n`;

    if (result.healthStatus === 'healthy') {
      report += `✅ Database is healthy and ready for production use.\\n`;
      report += `🔹 All critical tables exist and contain data.\\n`;
      report += `🔹 Prisma client operations are working correctly.\\n`;
      report += `🔹 Database connections are stable and responsive.\\n`;
    } else if (result.healthStatus === 'degraded') {
      report += `⚠️ Database has minor issues but is still functional.\\n`;
      report += `🔹 Review the errors listed above for potential improvements.\\n`;
      report += `🔹 Consider running database migrations to fix schema issues.\\n`;
      report += `🔹 Monitor performance and stability in production.\\n`;
    } else {
      report += `❌ Database has serious issues that need immediate attention.\\n`;
      report += `🔹 Review and fix all errors listed above.\\n`;
      report += `🔹 Consider restoring from backup if necessary.\\n`;
      report += `🔹 Run comprehensive database diagnostics.\\n`;
    }

    report += `\\n╔══════════════════════════════════════════════════════════════════════════════╗\\n`;
    report += `║                          END OF VALIDATION REPORT                           ║\\n`;
    report += `╚══════════════════════════════════════════════════════════════════════════════╝\\n`;

    return report;
  }

  /**
   * Save validation report
   */
  async saveReport(report: string): Promise<void> {
    const reportFileName = `prisma_validation_${this.timestamp}.txt`;
    const reportPath = path.join(this.backupDir, reportFileName);

    try {
      await fs.writeFile(reportPath, report, 'utf8');
      console.log(`📄 Validation report saved: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Failed to save report: ${error}`);
    }
  }

  /**
   * Execute complete database validation workflow
   */
  async execute(): Promise<DatabaseValidationResult> {
    console.log('🚀 Starting Prisma database validation...');

    try {
      // Create backup
      const backupPath = await this.createBackup();

      // Validate database
      const result = await this.validateDatabase();
      result.backupPath = backupPath;

      // Generate and save report
      const report = this.generateReport(result);
      console.log('\\n' + report);
      await this.saveReport(report);

      return result;
    } catch (error) {
      console.error('❌ Database validation workflow failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Main execution function
async function main() {
  const validator = new PrismaDatabaseValidator();
  
  try {
    const result = await validator.execute();
    process.exit(result.isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { PrismaDatabaseValidator };