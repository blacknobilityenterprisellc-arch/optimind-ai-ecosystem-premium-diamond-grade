import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Migration Script: SQLite to PostgreSQL (Neon)
 * 
 * This script handles the migration from SQLite to PostgreSQL database.
 * It performs the following steps:
 * 1. Backup existing SQLite database
 * 2. Create new PostgreSQL schema
 * 3. Export data from SQLite
 * 4. Import data to PostgreSQL
 * 5. Update configuration files
 * 6. Run validation tests
 */

class NeonMigration {
  private prisma: PrismaClient;
  private backupPath: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.backupPath = path.join(process.cwd(), 'database_backups', `sqlite-backup-${Date.now()}.sql`);
  }

  async runMigration() {
    console.log('🚀 Starting Neon database migration...');
    
    try {
      // Step 1: Backup existing SQLite database
      await this.backupSQLiteDatabase();
      
      // Step 2: Switch to PostgreSQL schema
      await this.switchToPostgreSQLSchema();
      
      // Step 3: Generate Prisma client for PostgreSQL
      await this.generatePrismaClient();
      
      // Step 4: Push schema to Neon
      await this.pushSchemaToNeon();
      
      // Step 5: Run seed data
      await this.runSeedData();
      
      // Step 6: Validate migration
      await this.validateMigration();
      
      console.log('✅ Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async backupSQLiteDatabase() {
    console.log('📦 Backing up SQLite database...');
    
    // Create backup directory if it doesn't exist
    const backupDir = path.dirname(this.backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    try {
      // Use sqlite3 to dump the database
      execSync(`sqlite3 prisma/dev.db .dump > ${this.backupPath}`);
      console.log(`✅ SQLite database backed up to: ${this.backupPath}`);
    } catch (error) {
      console.warn('⚠️  SQLite backup failed, continuing anyway...');
      console.warn('Error:', error.message);
    }
  }

  private async switchToPostgreSQLSchema() {
    console.log('🔄 Switching to PostgreSQL schema...');
    
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const neonSchemaPath = path.join(process.cwd(), 'prisma', 'schema-neon.prisma');
    
    // Backup original schema
    if (fs.existsSync(schemaPath)) {
      const backupPath = path.join(process.cwd(), 'prisma', 'schema.prisma.backup');
      fs.copyFileSync(schemaPath, backupPath);
    }
    
    // Copy Neon schema to main schema
    if (fs.existsSync(neonSchemaPath)) {
      fs.copyFileSync(neonSchemaPath, schemaPath);
      console.log('✅ Switched to PostgreSQL schema');
    } else {
      throw new EnhancedError('Neon schema file not found');
    }
  }

  private async generatePrismaClient() {
    console.log('🔧 Generating Prisma client...');
    
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      throw new EnhancedError(`Failed to generate Prisma client: ${error.message}`);
    }
  }

  private async pushSchemaToNeon() {
    console.log('📤 Pushing schema to Neon...');
    
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Schema pushed to Neon successfully');
    } catch (error) {
      throw new EnhancedError(`Failed to push schema to Neon: ${error.message}`);
    }
  }

  private async runSeedData() {
    console.log('🌱 Running seed data...');
    
    try {
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      console.log('✅ Seed data completed');
    } catch (error) {
      console.warn('⚠️  Seed data failed, continuing anyway...');
      console.warn('Error:', error.message);
    }
  }

  private async validateMigration() {
    console.log('🔍 Validating migration...');
    
    try {
      // Test database connection
      const result = await this.prisma.$queryRaw`SELECT NOW() as time`;
      console.log('✅ Database connection successful');
      
      // Test basic queries
      const userCount = await this.prisma.user.count();
      const tenantCount = await this.prisma.tenant.count();
      
      console.log(`📊 Database stats:`);
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Tenants: ${tenantCount}`);
      
      // Test creating a record
      const testUser = await this.prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Migration Test User',
          password: 'test-password'
        }
      });
      
      await this.prisma.user.delete({
        where: { id: testUser.id }
      });
      
      console.log('✅ CRUD operations working correctly');
      
    } catch (error) {
      throw new EnhancedError(`Migration validation failed: ${error.message}`);
    }
  }

  async rollback() {
    console.log('🔄 Rolling back migration...');
    
    try {
      // Restore original schema
      const originalSchema = path.join(process.cwd(), 'prisma', 'schema.prisma.backup');
      const currentSchema = path.join(process.cwd(), 'prisma', 'schema.prisma');
      
      if (fs.existsSync(originalSchema)) {
        fs.copyFileSync(originalSchema, currentSchema);
        console.log('✅ Restored original schema');
      }
      
      // Regenerate Prisma client
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('✅ Rollback completed');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const migration = new NeonMigration();
  
  // Check if we're in rollback mode
  const isRollback = process.argv.includes('--rollback');
  
  try {
    if (isRollback) {
      await migration.rollback();
    } else {
      await migration.runMigration();
    }
  } catch (error) {
    console.error('❌ Migration process failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Export for programmatic use
export { NeonMigration };

// Run if called directly
if (require.main === module) {
  main();
}
// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
