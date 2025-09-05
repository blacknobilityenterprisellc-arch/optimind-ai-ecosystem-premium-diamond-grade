# Neon Database Integration Guide for OptiMind AI Ecosystem

This guide provides comprehensive instructions for configuring Neon database integration with the OptiMind AI Ecosystem.

## Overview

Neon is a serverless PostgreSQL database that provides:
- Serverless architecture with automatic scaling
- Branching for development and testing
- Built-in connection pooling
- Edge SQL for low-latency queries
- Seamless integration with Vercel

## Prerequisites

- Neon account (free or paid)
- Vercel project configured (from previous step)
- Database schema understanding
- Environment variables access

## Step 1: Create Neon Database

### 1.1 Sign Up for Neon
1. Go to [neon.tech](https://neon.tech)
2. Sign up with your GitHub account or email
3. Verify your email address

### 1.2 Create a New Project
1. Click "New Project" in the Neon dashboard
2. Configure your project:
   - **Project Name**: `optimind-ai-ecosystem`
   - **Database Name**: `optimind_db`
   - **Region**: Choose the closest region to your users
   - **PostgreSQL Version**: Latest stable version

### 1.3 Get Connection Details
After creating the project, you'll get:
- **Connection String**: `postgresql://username:password@host:port/database?sslmode=require`
- **Host**: Your Neon host address
- **Database**: Your database name
- **Username**: Your database username
- **Password**: Your database password

## Step 2: Database Schema Migration

### 2.1 Current Schema Analysis
The current schema uses SQLite with the following key models:
- **Multi-Tenant Architecture**: Tenant, TenantUser, TenantSetting
- **User Management**: User, Session, SecuritySettings
- **Subscription Management**: Subscription, SubscriptionUsage
- **Project Management**: Project, Analysis
- **AI Services**: AIRequestLog, AIModelUsageLog, AIModelComparison
- **Business Solutions**: ContractAnalysis, LocalizationAnalysis, etc.

### 2.2 Create Neon-Specific Schema

Create a new schema file optimized for PostgreSQL:

```prisma
// prisma/schema-neon.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Neon-specific configuration
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 2.3 Migration Strategy

Since we're migrating from SQLite to PostgreSQL, we need to:

1. **Export existing data** (if any)
2. **Create new PostgreSQL schema**
3. **Import data** (if applicable)
4. **Update application configuration**

## Step 3: Environment Variables Configuration

### 3.1 Required Environment Variables

Add these to your Vercel environment variables:

```bash
# Neon Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"
SHADOW_DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Database Pooling (Neon-specific)
PGSSLMODE=require
PGHOST=your-neon-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Connection Pool Configuration
DATABASE_POOL_SIZE=20
DATABASE_CONNECTION_TIMEOUT=30000
```

### 3.2 Vercel Configuration

1. Go to your Vercel project
2. Navigate to "Settings" → "Environment Variables"
3. Add all the database-related variables
4. Select appropriate environments (Production, Preview, Development)

## Step 4: Prisma Configuration for Neon

### 4.1 Update Prisma Schema

Create a Neon-optimized schema:

```prisma
// prisma/schema.prisma (Neon version)
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [pg_stat_statements, pgcrypto]
}
```

### 4.2 Create Migration Script

Create a migration script to handle the transition:

```typescript
// scripts/migrate-to-neon.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

async function migrateToNeon() {
  console.log('Starting migration to Neon...');
  
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate');
  
  // Push schema to Neon
  console.log('Pushing schema to Neon...');
  execSync('npx prisma db push');
  
  // Run seed data if needed
  console.log('Running seed data...');
  execSync('npx tsx prisma/seed.ts');
  
  console.log('Migration completed successfully!');
}

migrateToNeon().catch(console.error);
```

### 4.3 Update Package.json Scripts

Add Neon-specific scripts:

```json
{
  "scripts": {
    "db:neon:push": "prisma db push",
    "db:neon:generate": "prisma generate",
    "db:neon:migrate": "prisma migrate dev",
    "db:neon:studio": "prisma studio",
    "db:neon:seed": "tsx prisma/seed.ts",
    "db:neon:reset": "prisma migrate reset",
    "db:neon:migrate-to-neon": "tsx scripts/migrate-to-neon.ts"
  }
}
```

## Step 5: Application Configuration

### 5.1 Update Database Client

Update your database client configuration:

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### 5.2 Connection Pooling

Configure connection pooling for better performance:

```typescript
// src/lib/db-pool.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL!,
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
```

## Step 6: Neon-Specific Features

### 6.1 Database Branching

Neon allows you to create branches for development:

```bash
# Create a new branch
npx neon branches create dev-branch --parent main

# Switch to branch
npx neon branches switch dev-branch

# Delete branch
npx neon branches delete dev-branch
```

### 6.2 Connection Pooling

Neon provides built-in connection pooling. Configure it in your application:

```typescript
// Use pooled connection for better performance
const poolUrl = process.env.DATABASE_URL?.replace('postgres://', 'pgbouncer://');
```

### 6.3 Edge SQL

For low-latency queries, use Neon's Edge SQL:

```typescript
// Edge-compatible database queries
export const edgeDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});
```

## Step 7: Backup and Recovery

### 7.1 Automated Backups

Neon provides automated backups. Configure backup settings:

1. Go to Neon dashboard
2. Navigate to your project
3. Click "Settings" → "Backups"
4. Configure backup retention and schedule

### 7.2 Point-in-Time Recovery

Use Neon's point-in-time recovery:

```bash
# Restore to a specific point in time
npx neon branches restore --timestamp "2024-01-01T12:00:00Z"
```

## Step 8: Monitoring and Analytics

### 8.1 Neon Console

Monitor your database through the Neon console:
- Query performance
- Connection usage
- Storage metrics
- CPU and memory usage

### 8.2 Integration with Vercel

Neon integrates seamlessly with Vercel:

```typescript
// Use Vercel's edge runtime with Neon
export const runtime = 'edge';

export async function GET() {
  const data = await db.query('SELECT * FROM users');
  return new Response(JSON.stringify(data));
}
```

## Step 9: Security Configuration

### 9.1 SSL/TLS Configuration

Ensure SSL is enabled:

```typescript
// Force SSL in database connection
const sslConfig = process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: true }
  : { rejectUnauthorized: false };

export const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});
```

### 9.2 Network Security

Configure Neon's network security:
- IP whitelisting
- VPC peering (for enterprise plans)
- Connection encryption

## Step 10: Testing and Validation

### 10.1 Connection Test

Create a test endpoint to verify database connection:

```typescript
// src/app/api/test-db/route.ts
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.$queryRaw`SELECT NOW()`;
    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 });
  }
}
```

### 10.2 Performance Testing

Test database performance:

```typescript
// src/app/api/test-db-performance/route.ts
import { db } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test query performance
    const users = await db.user.findMany({
      take: 100,
      select: { id: true, email: true, name: true }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return Response.json({
      success: true,
      queryTime: duration,
      recordCount: users.length,
      message: 'Performance test completed'
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Performance test failed',
      error: error.message
    }, { status: 500 });
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check Neon project status
   - Verify connection string
   - Ensure SSL is properly configured

2. **Migration Failures**
   - Check schema compatibility
   - Verify data types
   - Use `prisma db push` for development

3. **Performance Issues**
   - Monitor query performance
   - Use connection pooling
   - Optimize database indexes

4. **Environment Variables**
   - Double-check variable names
   - Ensure proper escaping
   - Verify environment scope

### Support Resources

- [Neon Documentation](https://neon.tech/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Vercel Neon Integration](https://vercel.com/integrations/neon)
- [Neon Community](https://neon.tech/community)

## Success Criteria

The Neon integration is successful when:

- ✅ Database connection works properly
- ✅ All migrations execute successfully
- ✅ Application can read/write data
- ✅ Performance meets requirements
- ✅ Backup and recovery work
- ✅ Security configurations are in place
- ✅ Monitoring is functional

---

**Note**: This integration is part of the comprehensive deployment strategy. After completing Neon configuration, proceed to Netlify deployment setup.