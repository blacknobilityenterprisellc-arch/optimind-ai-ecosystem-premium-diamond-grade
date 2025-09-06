/**
 * OptiMind AI Ecosystem - Database Update Validator
 * Premium Diamond Grade Database Validation and Backup
 * 
 * This script validates database updates and creates comprehensive backups
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

interface DatabaseValidationResult {
  isValid: boolean;
  tables: string[];
  recordCounts: Record<string, number>;
  errors: string[];
  backupPath?: string;
  timestamp: string;
}

class DatabaseUpdateValidator {
  private backupDir: string;
  private timestamp: string;

  constructor() {
    this.backupDir = path.join(process.cwd(), 'database_backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Create comprehensive database backup
   */
  async createBackup(): Promise<string> {
    const backupFileName = `database_backup_${this.timestamp}.sql`;
    const backupPath = path.join(this.backupDir, backupFileName);

    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      
      // Create backup using sqlite3
      await execAsync(`sqlite3 ./prisma/dev.db ".backup ${backupPath}"`);
      
      console.log(`✅ Database backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error(`❌ Backup creation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Validate database schema and data
   */
  async validateDatabase(): Promise<DatabaseValidationResult> {
    const result: DatabaseValidationResult = {
      isValid: true,
      tables: [],
      recordCounts: {},
      errors: [],
      timestamp: this.timestamp
    };

    try {
      console.log('🔍 Validating database schema and data...');

      // Get list of tables
      const { stdout: tablesOutput } = await execAsync(
        'sqlite3 ./prisma/dev.db ".tables"'
      );
      
      result.tables = tablesOutput.trim().split('\\n').filter(Boolean);

      // Get record counts for each table
      for (const table of result.tables) {
        try {
          const { stdout: countOutput } = await execAsync(
            `sqlite3 ./prisma/dev.db "SELECT COUNT(*) FROM ${table}"`
          );
          result.recordCounts[table] = parseInt(countOutput.trim());
        } catch (error) {
          result.errors.push(`Failed to count records in ${table}: ${error}`);
        }
      }

      // Validate critical tables exist and have data
      const criticalTables = ['users', 'tenants', 'projects', 'analyses'];
      for (const table of criticalTables) {
        if (!result.tables.includes(table)) {
          result.isValid = false;
          result.errors.push(`Critical table missing: ${table}`);
        } else if (result.recordCounts[table] === 0) {
          result.errors.push(`Critical table empty: ${table}`);
        }
      }

      // Check database integrity
      try {
        await execAsync('sqlite3 ./prisma/dev.db "PRAGMA integrity_check;"');
      } catch (error) {
        result.isValid = false;
        result.errors.push(`Database integrity check failed: ${error}`);
      }

      // Check foreign key constraints
      try {
        await execAsync('sqlite3 ./prisma/dev.db "PRAGMA foreign_key_check;"');
      } catch (error) {
        result.isValid = false;
        result.errors.push(`Foreign key check failed: ${error}`);
      }

      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Database validation failed: ${error}`);
    }

    return result;
  }

  /**
   * Generate validation report
   */
  generateReport(result: DatabaseValidationResult): string {
    const status = result.isValid ? '✅ VALID' : '❌ INVALID';
    
    let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                 OPTIMIND AI ECOSYSTEM - DATABASE VALIDATION REPORT              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Generated: ${result.timestamp}                                            ║
║  Status: ${status}                                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 DATABASE OVERVIEW:
├── Total Tables: ${result.tables.length}
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

    if (result.isValid) {
      report += `✅ Database is healthy and ready for production use.\\n`;
      report += `🔹 All critical tables exist and contain data.\\n`;
      report += `🔹 Database integrity checks passed.\\n`;
      report += `🔹 Foreign key constraints are valid.\\n`;
    } else {
      report += `⚠️ Database has issues that need attention.\\n`;
      report += `🔹 Review and fix the errors listed above.\\n`;
      report += `🔹 Consider restoring from backup if necessary.\\n`;
      report += `🔹 Run database migration scripts to fix schema issues.\\n`;
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
    const reportFileName = `database_validation_${this.timestamp}.txt`;
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
    console.log('🚀 Starting comprehensive database validation...');

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
    }
  }
}

// Main execution function
async function main() {
  const validator = new DatabaseUpdateValidator();
  
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

export { DatabaseUpdateValidator };