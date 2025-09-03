# 🗄️ OptiMind AI Platform - Database Schema Documentation

This document provides comprehensive documentation for the OptiMind AI Platform's database schema, including all models, relationships, and data structures.

## 📋 **Table of Contents**

- [Overview](#overview)
- [Core Models](#core-models)
- [Business Solution Models](#business-solution-models)
- [Enums & Types](#enums--types)
- [Relationships](#relationships)
- [Database Design Principles](#database-design-principles)
- [Migration Guide](#migration-guide)
- [Performance Considerations](#performance-considerations)

---

## 🏗️ **Overview**

The OptiMind AI Platform uses **SQLite** as the primary database with **Prisma ORM** for type-safe database operations. The schema is designed to support:

- **User Management & Authentication**
- **AI Analysis & Processing**
- **Project Management**
- **File Upload & Management**
- **Content Management**
- **Business Solutions** (ContractWise, GlobalFit, BehaviorPredict, ComplianceGuard, SkillPath)

### **Database Statistics**
- **Total Models**: 18 core models
- **Total Enums**: 17 enumeration types
- **Relationships**: Complex relational structure
- **Storage**: SQLite with JSON support for flexible data storage

---

## 👤 **Core Models**

### **User Model**
**Table**: `users`  
**Purpose**: Central user management and authentication

```sql
-- Core Fields
id              STRING    PRIMARY KEY
email           STRING    UNIQUE
password        STRING    -- Authentication
name            STRING?   -- Optional display name
avatar          STRING?   -- Profile image URL
role            UserRole  -- Access control
apiKey          STRING?   -- API access
isActive        BOOLEAN   DEFAULT true
lastLoginAt     DATETIME? -- Last activity tracking
createdAt       DATETIME  DEFAULT now()
updatedAt       DATETIME  AUTO UPDATE

-- Relations
posts           Post[]           -- Content creation
sessions        Session[]        -- Authentication sessions
projects        Project[]        -- Project management
analyses        Analysis[]       -- AI processing
conversations   Conversation[]  -- Chat functionality
uploads         Upload[]         -- File management
```

**Key Features**:
- Role-based access control (USER, ADMIN, MODERATOR, DEVELOPER)
- API key support for programmatic access
- Activity tracking and status management
- Comprehensive relationship mapping

---

### **Session Model**
**Table**: `sessions`  
**Purpose**: Authentication session management

```sql
id        STRING    PRIMARY KEY
userId    STRING    FOREIGN KEY (users.id)
token     STRING    UNIQUE    -- Session token
expiresAt DATETIME           -- Expiration time
isActive  BOOLEAN   DEFAULT true
createdAt DATETIME  DEFAULT now()

-- Relations
user      User      @relation (onDelete: Cascade)
```

**Key Features**:
- Secure token-based authentication
- Automatic session expiration
- Active/inactive state management
- Cascading deletion on user removal

---

### **Security Settings Model**
**Table**: `security_settings`  
**Purpose**: PIN authentication and security configuration

```sql
id        STRING    PRIMARY KEY DEFAULT "main"
pin_hash  STRING               -- Hashed PIN
salt      STRING               -- Salt for hashing
createdAt DATETIME  DEFAULT now()
updatedAt DATETIME  AUTO UPDATE
```

**Key Features**:
- Single-record design for global security settings
- Secure PIN hashing with salt
- Automatic update tracking

---

## 💳 **Subscription Management**

### **Subscription Model**
**Table**: `subscriptions`  
**Purpose**: User subscription and billing management

```sql
id                  STRING               PRIMARY KEY
userId              STRING               UNIQUE FOREIGN KEY
plan                SubscriptionPlan     -- FREE, BASIC, PRO, ENTERPRISE
status              SubscriptionStatus   -- ACTIVE, CANCELLED, EXPIRED, PENDING
currentPeriodStart DATETIME
currentPeriodEnd   DATETIME
cancelAtPeriodEnd  BOOLEAN              DEFAULT false
metadata            JSON?                -- Additional billing data
createdAt           DATETIME             DEFAULT now()
updatedAt           DATETIME             AUTO UPDATE

-- Relations
user                User                 @relation (onDelete: Cascade)
usage               SubscriptionUsage[]   -- Usage tracking
```

### **Subscription Usage Model**
**Table**: `subscription_usage`  
**Purpose**: Track subscription usage metrics

```sql
id             STRING    PRIMARY KEY
subscriptionId STRING    FOREIGN KEY (subscriptions.id)
metric         STRING    -- Usage metric name
value          INT       -- Usage value
period         STRING    -- "daily", "monthly", "yearly"
createdAt      DATETIME  DEFAULT now()

-- Relations
subscription   Subscription @relation (onDelete: Cascade)

-- Constraints
UNIQUE(subscriptionId, metric, period)
```

**Key Features**:
- Multi-tier subscription plans
- Usage tracking and monitoring
- Flexible billing periods
- Cancellation management
- Metadata for custom billing logic

---

## 📁 **Project Management**

### **Project Model**
**Table**: `projects`  
**Purpose**: Organize user work into projects

```sql
id          String      PRIMARY KEY
name        String      -- Project name
description String?     -- Optional description
status      ProjectStatus -- ACTIVE, COMPLETED, ARCHIVED, SUSPENDED
userId      String      -- Owner
metadata    Json?       -- Project configuration
createdAt   DateTime    DEFAULT now()
updatedAt   DateTime    AUTO UPDATE

-- Relations
user        User        @relation (onDelete: Cascade)
analyses    Analysis[]  -- AI analyses
uploads     Upload[]    -- File uploads
-- Business Solutions Relations
contractAnalyses        ContractAnalysis[]
localizationAnalyses   LocalizationAnalysis[]
customerBehaviorAnalyses CustomerBehaviorAnalysis[]
complianceMonitoring    ComplianceMonitoring[]
learningPaths          LearningPath[]
```

**Key Features**:
- Project-based organization
- Status tracking
- Flexible metadata storage
- Integration with all business solutions

---

## 🧠 **AI Analysis & Processing**

### **Analysis Model**
**Table**: `analyses`  
**Purpose**: Generic AI analysis processing

```sql
id            String           PRIMARY KEY
type          AnalysisType     -- TEXT_ANALYSIS, IMAGE_ANALYSIS, etc.
input         String           -- Input data
result        Json?            -- AI analysis results
confidence    Float?           -- Confidence score
status        AnalysisStatus   -- PENDING, PROCESSING, COMPLETED, FAILED
userId        String           -- Requesting user
projectId     String?          -- Associated project
model         String?          -- AI model used
processingTime Int?            -- Processing duration in ms
metadata      Json?            -- Additional analysis data
createdAt     DateTime         DEFAULT now()
updatedAt     DateTime         AUTO UPDATE

-- Relations
user          User             @relation (onDelete: Cascade)
project       Project?         @relation (onDelete: SetNull)
```

**Analysis Types Available**:
- `TEXT_ANALYSIS` - Natural language processing
- `IMAGE_ANALYSIS` - Computer vision tasks
- `CODE_ANALYSIS` - Source code analysis
- `DATA_ANALYSIS` - Statistical analysis
- `SENTIMENT_ANALYSIS` - Emotional tone analysis
- `CONTENT_OPTIMIZATION` - SEO and content improvement
- `SEO_ANALYSIS` - Search engine optimization
- `MULTIMODAL_ANALYSIS` - Multi-type content analysis

---

## 💬 **Conversations & Chat**

### **Conversation Model**
**Table**: `conversations`  
**Purpose**: Chat conversation management

```sql
id        String   PRIMARY KEY
title     String?  -- Conversation title
userId    String   -- Participant
isActive  Boolean  DEFAULT true
metadata  Json?    -- Conversation settings
createdAt DateTime DEFAULT now()
updatedAt DateTime AUTO UPDATE

-- Relations
user      User     @relation (onDelete: Cascade)
messages  Message[] -- Chat messages
```

### **Message Model**
**Table**: `messages`  
**Purpose**: Individual chat messages

```sql
id            String      PRIMARY KEY
conversationId String      FOREIGN KEY (conversations.id)
role          MessageRole -- USER, ASSISTANT, SYSTEM
content       String      -- Message content
metadata      Json?       -- Additional message data
createdAt     DateTime    DEFAULT now()

-- Relations
conversation  Conversation @relation (onDelete: Cascade)
```

**Message Roles**:
- `USER` - Human user messages
- `ASSISTANT` - AI responses
- `SYSTEM` - System notifications

---

## 📁 **File Upload & Management**

### **Upload Model**
**Table**: `uploads`  
**Purpose**: File upload and processing management

```sql
id            String       PRIMARY KEY
filename      String       -- Stored filename
originalName  String       -- Original user filename
path          String       -- File system path
size          Int          -- File size in bytes
mimeType      String       -- MIME type
status        UploadStatus -- PENDING, PROCESSING, COMPLETED, FAILED, DELETED
userId        String       -- Uploading user
projectId     String?      -- Associated project
metadata      Json?        -- File metadata
processedAt   DateTime?    -- Processing completion time
createdAt     DateTime     DEFAULT now()
updatedAt     DateTime     AUTO UPDATE

-- Relations
user          User         @relation (onDelete: Cascade)
project       Project?     @relation (onDelete: SetNull)
```

**Upload Statuses**:
- `PENDING` - Awaiting processing
- `PROCESSING` - Currently being processed
- `COMPLETED` - Successfully processed
- `FAILED` - Processing failed
- `DELETED` - File removed

---

## 📝 **Content Management**

### **Post Model**
**Table**: `posts`  
**Purpose**: Blog and content management

```sql
id          String   PRIMARY KEY
title       String   -- Post title
content     String?  -- Post content
excerpt     String?  -- Short description
slug        String   UNIQUE -- URL-friendly identifier
published   Boolean  DEFAULT false -- Publication status
authorId    String   -- Author user ID
featured    Boolean  DEFAULT false -- Featured post
metadata    Json?    -- SEO and post metadata
publishedAt DateTime? -- Publication date
createdAt   DateTime DEFAULT now()
updatedAt   DateTime AUTO UPDATE

-- Relations
author      User     @relation (onDelete: Cascade)
```

**Key Features**:
- SEO-friendly URL slugs
- Publication workflow
- Featured content management
- Metadata for SEO optimization
- Flexible content storage

---

## 🏢 **Business Solution Models**

### **ContractWise AI - Contract Analysis**

#### **Contract Analysis Model**
**Table**: `contract_analyses`  
**Purpose**: AI-powered contract analysis and review

```sql
id              String                   PRIMARY KEY
userId          String                   -- Requesting user
projectId       String?                  -- Associated project
contractTitle   String                   -- Contract title
contractType    ContractType             -- Type of contract
fileUrl         String?                  -- Contract file URL
extractedText   String?                  -- Extracted text content
riskAssessment  Json?                    -- Risk analysis results
clauses         Json?                    -- Contract clauses analysis
plainLanguage   Json?                    -- Plain language explanations
complianceCheck Json?                    -- Compliance verification
recommendations Json?                    -- AI recommendations
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          ContractAnalysisStatus   -- Analysis status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Contract Types**:
- `EMPLOYMENT` - Employment contracts
- `SERVICE_AGREEMENT` - Service agreements
- `NDA` - Non-disclosure agreements
- `PARTNERSHIP` - Partnership agreements
- `SALES_CONTRACT` - Sales contracts
- `LEASE_AGREEMENT` - Lease agreements
- `LICENSE_AGREEMENT` - License agreements
- `FRANCHISE` - Franchise agreements
- `MERGER_ACQUISITION` - M&A contracts
- `OTHER` - Other contract types

---

### **GlobalFit AI - Localization Analysis**

#### **Localization Analysis Model**
**Table**: `localization_analyses`  
**Purpose**: Product localization and market adaptation analysis

```sql
id              String                   PRIMARY KEY
userId          String                   -- Requesting user
projectId       String?                  -- Associated project
productName     String                   -- Product name
targetMarket    String                   -- Target market/region
productImages   Json?                    -- Product image URLs (JSON array)
productDesc     String?                  -- Product description
culturalAnalysis Json?                   -- Cultural adaptation analysis
visualAdaptation Json?                   -- Visual adaptation recommendations
marketStrategy  Json?                    -- Market entry strategy
complianceCheck Json?                    -- Regulatory compliance
competitorAnalysis Json?                 -- Competitive landscape
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          LocalizationStatus       -- Analysis status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Key Features**:
- Cultural adaptation analysis
- Visual localization recommendations
- Market entry strategy
- Regulatory compliance checking
- Competitive landscape analysis
- Multi-image product analysis support

---

### **BehaviorPredict AI - Customer Behavior Analysis**

#### **Customer Behavior Analysis Model**
**Table**: `customer_behavior_analyses`  
**Purpose**: AI-powered customer behavior prediction and analysis

```sql
id              String                     PRIMARY KEY
userId          String                     -- Requesting user
projectId       String?                    -- Associated project
customerSegment String?                    -- Customer segment
dataSource      Json?                      -- Data sources (CRM, email, social media)
behaviorPrediction Json?                   -- Behavior predictions
sentimentAnalysis Json?                    -- Sentiment analysis results
journeyMapping  Json?                      -- Customer journey mapping
recommendations Json?                      -- AI recommendations
conversionProbability Float?                 -- Conversion probability
churnRisk       Float?                     -- Churn risk assessment
confidence      Float?                     -- Analysis confidence
processingTime  Int?                       -- Processing duration
status          BehaviorAnalysisStatus     -- Analysis status
metadata        Json?                      -- Additional data
createdAt       DateTime                   DEFAULT now()
updatedAt       DateTime                   AUTO UPDATE

-- Relations
user            User                       @relation (onDelete: Cascade)
project         Project?                   @relation (onDelete: SetNull)
```

**Key Features**:
- Multi-source data integration
- Behavior prediction algorithms
- Sentiment analysis
- Customer journey mapping
- Conversion probability scoring
- Churn risk assessment

---

### **ComplianceGuard AI - Compliance Monitoring**

#### **Compliance Monitoring Model**
**Table**: `compliance_monitoring`  
**Purpose**: Regulatory compliance monitoring and management

```sql
id              String                   PRIMARY KEY
userId          String                   -- Requesting user
projectId       String?                  -- Associated project
businessType    String                   -- Business type/industry
jurisdiction    String                   -- Regulatory jurisdiction
regulations     Json?                    -- Tracked regulations
riskAssessment  Json?                    -- Compliance risk assessment
documentReviews Json?                    -- Document review results
actionPlan      Json?                    -- Compliance action plan
auditPreparation Json?                   -- Audit preparation materials
trainingMaterials Json?                   -- Training resources
nextReviewDate  DateTime?                -- Next review date
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          ComplianceStatus         -- Compliance status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Key Features**:
- Multi-jurisdiction compliance tracking
- Risk assessment and scoring
- Document review automation
- Action plan generation
- Audit preparation support
- Training material creation

---

### **SkillPath AI - Learning Path Generation**

#### **Learning Path Model**
**Table**: `learning_paths`  
**Purpose**: AI-powered learning path generation and management

```sql
id              String                   PRIMARY KEY
userId          String                   -- Requesting user
projectId       String?                  -- Associated project
userProfile     Json?                    -- User skills, experience, goals
skillAssessment Json?                    -- Skill assessment results
learningStyle   Json?                    -- Learning style analysis
generatedPath   Json?                    -- Generated learning path
progressTracking Json?                   -- Progress tracking data
certifications Json?                     -- Certification recommendations
recommendations Json?                    -- Learning recommendations
estimatedCompletion DateTime?             -- Estimated completion date
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          LearningPathStatus       -- Learning path status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Key Features**:
- Personalized learning path generation
- Skill gap analysis
- Learning style adaptation
- Progress tracking
- Certification planning
- Goal-oriented recommendations

---

## 🏷️ **Enums & Types**

### **User Management Enums**

#### **UserRole**
```typescript
enum UserRole {
  USER        // Standard user access
  ADMIN       // Full administrative access
  MODERATOR  // Content moderation access
  DEVELOPER   // Development and API access
}
```

#### **SubscriptionPlan**
```typescript
enum SubscriptionPlan {
  FREE        // Free tier with limited features
  BASIC       // Basic paid tier
  PRO         // Professional tier with advanced features
  ENTERPRISE  // Enterprise tier with custom features
}
```

#### **SubscriptionStatus**
```typescript
enum SubscriptionStatus {
  ACTIVE      // Currently active subscription
  CANCELLED   // Cancelled but still active until period end
  EXPIRED     // Subscription expired
  PENDING     // Awaiting activation
}
```

### **Project Management Enums**

#### **ProjectStatus**
```typescript
enum ProjectStatus {
  ACTIVE      // Currently active project
  COMPLETED   // Successfully completed
  ARCHIVED    -- Archived for reference
  SUSPENDED   -- Temporarily suspended
}
```

### **AI Analysis Enums**

#### **AnalysisType**
```typescript
enum AnalysisType {
  TEXT_ANALYSIS        // Natural language processing
  IMAGE_ANALYSIS       // Computer vision tasks
  CODE_ANALYSIS        // Source code analysis
  DATA_ANALYSIS        // Statistical analysis
  SENTIMENT_ANALYSIS   // Emotional tone analysis
  CONTENT_OPTIMIZATION // SEO and content improvement
  SEO_ANALYSIS         // Search engine optimization
  MULTIMODAL_ANALYSIS  // Multi-type content analysis
}
```

#### **AnalysisStatus**
```typescript
enum AnalysisStatus {
  PENDING     -- Awaiting processing
  PROCESSING  -- Currently being processed
  COMPLETED   -- Successfully completed
  FAILED      -- Processing failed
}
```

### **Communication Enums**

#### **MessageRole**
```typescript
enum MessageRole {
  USER        // Human user messages
  ASSISTANT   // AI responses
  SYSTEM      // System notifications
}
```

### **File Management Enums**

#### **UploadStatus**
```typescript
enum UploadStatus {
  PENDING     -- Awaiting processing
  PROCESSING  -- Currently being processed
  COMPLETED   -- Successfully processed
  FAILED      -- Processing failed
  DELETED     -- File removed
}
```

### **Business Solution Enums**

#### **ContractType**
```typescript
enum ContractType {
  EMPLOYMENT           // Employment contracts
  SERVICE_AGREEMENT    // Service agreements
  NDA                  // Non-disclosure agreements
  PARTNERSHIP          // Partnership agreements
  SALES_CONTRACT       // Sales contracts
  LEASE_AGREEMENT      // Lease agreements
  LICENSE_AGREEMENT    // License agreements
  FRANCHISE            // Franchise agreements
  MERGER_ACQUISITION   // M&A contracts
  OTHER                // Other contract types
}
```

#### **ContractAnalysisStatus**
```typescript
enum ContractAnalysisStatus {
  PENDING           -- Awaiting analysis
  PROCESSING        -- Currently being analyzed
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  REVIEW_REQUIRED   -- Requires human review
}
```

#### **LocalizationStatus**
```typescript
enum LocalizationStatus {
  PENDING           -- Awaiting analysis
  PROCESSING        -- Currently being analyzed
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  REVIEW_REQUIRED   -- Requires human review
}
```

#### **BehaviorAnalysisStatus**
```typescript
enum BehaviorAnalysisStatus {
  PENDING           -- Awaiting analysis
  PROCESSING        -- Currently being analyzed
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  INSUFFICIENT_DATA -- Not enough data for analysis
}
```

#### **ComplianceStatus**
```typescript
enum ComplianceStatus {
  PENDING           -- Awaiting analysis
  PROCESSING        -- Currently being analyzed
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  REVIEW_REQUIRED   -- Requires human review
  URGENT_ATTENTION  -- Requires immediate attention
}
```

#### **LearningPathStatus**
```typescript
enum LearningPathStatus {
  PENDING           -- Awaiting generation
  PROCESSING        -- Currently being generated
  COMPLETED         -- Successfully completed
  FAILED            -- Generation failed
  IN_PROGRESS       -- Currently in progress
  ON_HOLD           -- Temporarily paused
}
```

---

## 🔗 **Relationships**

### **Core Relationships**

#### **User-Centric Relationships**
```mermaid
erDiagram
    User ||--o{ Session : has
    User ||--o{ Subscription : has
    User ||--o{ Project : owns
    User ||--o{ Analysis : requests
    User ||--o{ Conversation : participates
    User ||--o{ Upload : uploads
    User ||--o{ Post : authors
    User ||--o{ ContractAnalysis : requests
    User ||--o{ LocalizationAnalysis : requests
    User ||--o{ CustomerBehaviorAnalysis : requests
    User ||--o{ ComplianceMonitoring : requests
    User ||--o{ LearningPath : requests
```

#### **Project-Centric Relationships**
```mermaid
erDiagram
    Project ||--o{ Analysis : contains
    Project ||--o{ Upload : contains
    Project ||--o{ ContractAnalysis : contains
    Project ||--o{ LocalizationAnalysis : contains
    Project ||--o{ CustomerBehaviorAnalysis : contains
    Project ||--o{ ComplianceMonitoring : contains
    Project ||--o{ LearningPath : contains
```

#### **Conversation-Centric Relationships**
```mermaid
erDiagram
    Conversation ||--o{ Message : contains
```

#### **Subscription-Centric Relationships**
```mermaid
erDiagram
    Subscription ||--o{ SubscriptionUsage : tracks
```

### **Relationship Summary**

| Model | Related Models | Relationship Type | Description |
|-------|---------------|------------------|-------------|
| **User** | Session | One-to-Many | User has multiple sessions |
| **User** | Subscription | One-to-One | User has one subscription |
| **User** | Project | One-to-Many | User owns multiple projects |
| **User** | Analysis | One-to-Many | User requests multiple analyses |
| **User** | Conversation | One-to-Many | User participates in multiple conversations |
| **User** | Upload | One-to-Many | User uploads multiple files |
| **User** | Post | One-to-Many | User authors multiple posts |
| **User** | ContractAnalysis | One-to-Many | User requests contract analyses |
| **User** | LocalizationAnalysis | One-to-Many | User requests localization analyses |
| **User** | CustomerBehaviorAnalysis | One-to-Many | User requests behavior analyses |
| **User** | ComplianceMonitoring | One-to-Many | User requests compliance monitoring |
| **User** | LearningPath | One-to-Many | User requests learning paths |
| **Project** | Analysis | One-to-Many | Project contains multiple analyses |
| **Project** | Upload | One-to-Many | Project contains multiple uploads |
| **Project** | ContractAnalysis | One-to-Many | Project contains contract analyses |
| **Project** | LocalizationAnalysis | One-to-Many | Project contains localization analyses |
| **Project** | CustomerBehaviorAnalysis | One-to-Many | Project contains behavior analyses |
| **Project** | ComplianceMonitoring | One-to-Many | Project contains compliance monitoring |
| **Project** | LearningPath | One-to-Many | Project contains learning paths |
| **Conversation** | Message | One-to-Many | Conversation contains multiple messages |
| **Subscription** | SubscriptionUsage | One-to-Many | Subscription tracks multiple usage metrics |

---

## 🏛️ **Database Design Principles**

### **1. Scalability**
- **SQLite with Prisma ORM**: Efficient for development and small to medium deployments
- **JSON Fields**: Flexible data storage for complex AI analysis results
- **Cascading Deletes**: Automatic cleanup of related data
- **Indexing**: Strategic indexing on frequently queried fields

### **2. Security**
- **Password Hashing**: Secure password storage
- **Session Management**: Token-based authentication
- **Role-Based Access**: User role enumeration for access control
- **Data Isolation**: User-scoped data with proper foreign key relationships

### **3. Performance**
- **Optimized Queries**: Prisma ORM generates efficient SQL queries
- **JSON Storage**: Flexible schema for AI results without complex table structures
- **Status Tracking**: Efficient status-based filtering and querying
- **Timestamps**: Comprehensive audit trail with created/updated timestamps

### **4. Maintainability**
- **Type Safety**: Full TypeScript support with Prisma
- **Clear Naming**: Consistent naming conventions
- **Documentation**: Comprehensive field descriptions
- **Relationships**: Well-defined foreign key relationships

### **5. Extensibility**
- **JSON Metadata**: Flexible storage for additional data
- **Enum Types**: Easy to extend with new values
- **Modular Design**: Business solutions as separate models
- **Status Tracking**: Easy to add new status types

---

## 🔄 **Migration Guide**

### **Database Setup**

#### **Initial Setup**
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations (if using migration-based approach)
npx prisma migrate dev
```

#### **Environment Variables**
```bash
# Database configuration
DATABASE_URL="file:./dev.db"

# Optional: For production databases
# DATABASE_URL="postgresql://user:password@host:port/database"
```

### **Schema Changes**

#### **Adding New Models**
1. Define the model in `schema.prisma`
2. Add necessary relationships
3. Generate Prisma client: `npx prisma generate`
4. Push changes: `npx prisma db push`

#### **Adding New Fields**
1. Add fields to existing models
2. Update TypeScript types if needed
3. Generate Prisma client: `npx prisma generate`
4. Push changes: `npx prisma db push`

#### **Adding New Enums**
1. Define enum in `schema.prisma`
2. Update model fields to use the enum
3. Generate Prisma client: `npx prisma generate`
4. Push changes: `npx prisma db push`

### **Data Migration**

#### **Seeding Initial Data**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default security settings
  await prisma.securitySettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      pin_hash: 'hashed_pin_here',
      salt: 'salt_here'
    }
  })
  
  // Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'hashed_password',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

#### **Running Seed Script**
```bash
# Add seed script to package.json
"scripts": {
  "db:seed": "tsx prisma/seed.ts"
}

# Run the seed script
npm run db:seed
```

---

## ⚡ **Performance Considerations**

### **Query Optimization**

#### **Indexing Strategy**
```sql
-- Automatic indexes from Prisma
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "sessions_token_idx" ON "sessions"("token");
CREATE INDEX "projects_userId_idx" ON "projects"("userId");
CREATE INDEX "analyses_userId_idx" ON "analyses"("userId");
CREATE INDEX "uploads_userId_idx" ON "uploads"("userId");

-- Recommended additional indexes
CREATE INDEX "analyses_status_idx" ON "analyses"("status");
CREATE INDEX "analyses_type_idx" ON "analyses"("type");
CREATE INDEX "uploads_status_idx" ON "uploads"("status");
CREATE INDEX "conversations_userId_idx" ON "conversations"("userId");
```

#### **Query Best Practices**
```typescript
// Efficient queries with Prisma
const userAnalyses = await prisma.analysis.findMany({
  where: {
    userId: currentUserId,
    status: 'COMPLETED'
  },
  select: {
    id: true,
    type: true,
    createdAt: true,
    result: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 50
})

// Batch operations for better performance
const batchResults = await prisma.$transaction([
  prisma.user.create({ data: newUser }),
  prisma.subscription.create({ data: newSubscription }),
  prisma.project.create({ data: newProject })
])
```

### **Database Optimization**

#### **Connection Pooling**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const db = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
```

#### **JSON Field Optimization**
```typescript
// Efficient JSON field queries
const contractsWithHighRisk = await prisma.contractAnalysis.findMany({
  where: {
    userId: currentUserId,
    riskAssessment: {
      path: ['overallRisk'],
      gt: 0.7
    }
  }
})
```

### **Caching Strategy**

#### **Application-Level Caching**
```typescript
// lib/cache.ts
import NodeCache from 'node-cache'

const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60
})

export const getCachedData = (key: string, fetchFn: () => Promise<any>) => {
  const cached = cache.get(key)
  if (cached) return Promise.resolve(cached)
  
  return fetchFn().then(data => {
    cache.set(key, data)
    return data
  })
}
```

#### **Database-Level Caching**
```sql
-- SQLite performance optimizations
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = memory;
```

### **Monitoring & Maintenance**

#### **Database Health Checks**
```typescript
// lib/health.ts
export const checkDatabaseHealth = async () => {
  try {
    await db.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date()
    }
  }
}
```

#### **Performance Monitoring**
```typescript
// lib/performance.ts
export const monitorQueryPerformance = async (queryName: string, queryFn: () => Promise<any>) => {
  const start = Date.now()
  const result = await queryFn()
  const duration = Date.now() - start
  
  if (duration > 1000) { // Log slow queries
    console.warn(`Slow query detected: ${queryName} took ${duration}ms`)
  }
  
  return result
}
```

---

## 📚 **Additional Resources**

### **Prisma Documentation**
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-api)
- [Database Migration](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### **SQLite Documentation**
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLite Performance](https://www.sqlite.org/optoverview.html)
- [JSON1 Extension](https://www.sqlite.org/json1.html)

### **Best Practices**
- [Database Design Best Practices](https://www.prisma.io/docs/guides/database/best-practices)
- [TypeScript with Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/type-safety)
- [Performance Optimization](https://www.prisma.io/docs/guides/performance/optimization)

---

This comprehensive database schema documentation provides a complete reference for the OptiMind AI Platform's data structure, relationships, and best practices for working with the database using Prisma ORM and SQLite.ndations
- Market entry strategy
- Regulatory compliance checking
- Competitive analysis

---

### **BehaviorPredict AI - Customer Behavior Analysis**

#### **Customer Behavior Analysis Model**
**Table**: `customer_behavior_analyses`  
**Purpose**: Customer behavior prediction and analysis

```sql
id              String                     PRIMARY KEY
userId          String                     -- Requesting user
projectId       String?                    -- Associated project
customerSegment String?                     -- Customer segment
dataSource      Json?                      -- Data sources (JSON array)
behaviorPrediction Json?                    -- Behavior predictions
sentimentAnalysis Json?                     -- Sentiment analysis results
journeyMapping  Json?                      -- Customer journey mapping
recommendations Json?                      -- AI recommendations
conversionProbability Float?                -- Conversion probability
churnRisk       Float?                     -- Churn risk assessment
confidence      Float?                     -- Analysis confidence
processingTime  Int?                       -- Processing duration
status          BehaviorAnalysisStatus     -- Analysis status
metadata        Json?                      -- Additional data
createdAt       DateTime                   DEFAULT now()
updatedAt       DateTime                   AUTO UPDATE

-- Relations
user            User                       @relation (onDelete: Cascade)
project         Project?                   @relation (onDelete: SetNull)
```

**Key Features**:
- Customer behavior prediction
- Sentiment analysis
- Journey mapping
- Conversion probability calculation
- Churn risk assessment

---

### **ComplianceGuard AI - Compliance Monitoring**

#### **Compliance Monitoring Model**
**Table**: `compliance_monitoring`  
**Purpose**: Regulatory compliance monitoring and management

```sql
id              String                   PRIMARY KEY
userId          String                   -- Requesting user
projectId       String?                  -- Associated project
businessType    String                   -- Business type/industry
jurisdiction    String                   -- Regulatory jurisdiction
regulations     Json?                    -- Tracked regulations (JSON)
riskAssessment  Json?                    -- Risk assessment results
documentReviews Json?                    -- Document review results
actionPlan      Json?                    -- Compliance action plan
auditPreparation Json?                   -- Audit preparation materials
trainingMaterials Json?                   -- Training resources
nextReviewDate  DateTime?                -- Next review date
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          ComplianceStatus         -- Monitoring status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Key Features**:
- Regulatory tracking
- Risk assessment
- Document review automation
- Action plan generation
- Audit preparation
- Training material creation

---

### **SkillPath AI - Learning Path Generation**

#### **Learning Path Model**
**Table**: `learning_paths`  
**Purpose**: Personalized learning path generation

```sql
id              String                   PRIMARY KEY
userId          String                   -- Learner user ID
projectId       String?                  -- Associated project
userProfile     Json?                    -- User profile data (JSON)
skillAssessment Json?                   -- Skill assessment results
learningStyle   Json?                    -- Learning style analysis
generatedPath   Json?                    -- Generated learning path
progressTracking Json?                   -- Progress tracking data
certifications Json?                    -- Certification recommendations
recommendations Json?                    -- Learning recommendations
estimatedCompletion DateTime?             -- Estimated completion date
confidence      Float?                   -- Analysis confidence
processingTime  Int?                     -- Processing duration
status          LearningPathStatus       -- Path status
metadata        Json?                    -- Additional data
createdAt       DateTime                 DEFAULT now()
updatedAt       DateTime                 AUTO UPDATE

-- Relations
user            User                     @relation (onDelete: Cascade)
project         Project?                 @relation (onDelete: SetNull)
```

**Key Features**:
- Personalized learning paths
- Skill assessment
- Learning style analysis
- Progress tracking
- Certification recommendations
- Completion time estimation

---

## 🏷️ **Enums & Types**

### **User Roles**
```typescript
enum UserRole {
  USER        // Standard user access
  ADMIN       // Full administrative access
  MODERATOR  // Content moderation access
  DEVELOPER   // Development and API access
}
```

### **Subscription Plans**
```typescript
enum SubscriptionPlan {
  FREE        // Free tier with limited features
  BASIC       // Basic paid tier
  PRO         // Professional tier
  ENTERPRISE  // Enterprise tier with custom features
}
```

### **Subscription Status**
```typescript
enum SubscriptionStatus {
  ACTIVE      // Currently active
  CANCELLED   // Cancelled but still active until period end
  EXPIRED     // Subscription expired
  PENDING     // Awaiting activation
}
```

### **Project Status**
```typescript
enum ProjectStatus {
  ACTIVE      // Currently active project
  COMPLETED   -- Successfully completed
  ARCHIVED    -- Archived for reference
  SUSPENDED   -- Temporarily suspended
}
```

### **Analysis Types**
```typescript
enum AnalysisType {
  TEXT_ANALYSIS         // Natural language processing
  IMAGE_ANALYSIS        // Computer vision tasks
  CODE_ANALYSIS         // Source code analysis
  DATA_ANALYSIS         // Statistical analysis
  SENTIMENT_ANALYSIS    // Emotional tone analysis
  CONTENT_OPTIMIZATION  // SEO and content improvement
  SEO_ANALYSIS          // Search engine optimization
  MULTIMODAL_ANALYSIS   -- Multi-type content analysis
}
```

### **Analysis Status**
```typescript
enum AnalysisStatus {
  PENDING     // Awaiting processing
  PROCESSING  -- Currently being processed
  COMPLETED   -- Successfully completed
  FAILED      -- Processing failed
}
```

### **Upload Status**
```typescript
enum UploadStatus {
  PENDING     // Awaiting processing
  PROCESSING  -- Currently being processed
  COMPLETED   -- Successfully processed
  FAILED      -- Processing failed
  DELETED     -- File removed
}
```

### **Business Solution Status Enums**

#### **Contract Analysis Status**
```typescript
enum ContractAnalysisStatus {
  PENDING           // Awaiting analysis
  PROCESSING        -- Currently analyzing
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  REVIEW_REQUIRED   -- Requires human review
}
```

#### **Localization Status**
```typescript
enum LocalizationStatus {
  PENDING           // Awaiting analysis
  PROCESSING        -- Currently analyzing
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  REVIEW_REQUIRED   -- Requires human review
}
```

#### **Behavior Analysis Status**
```typescript
enum BehaviorAnalysisStatus {
  PENDING           // Awaiting analysis
  PROCESSING        -- Currently analyzing
  COMPLETED         -- Successfully completed
  FAILED            -- Analysis failed
  INSUFFICIENT_DATA -- Not enough data for analysis
}
```

#### **Compliance Status**
```typescript
enum ComplianceStatus {
  PENDING           // Awaiting monitoring
  PROCESSING        -- Currently monitoring
  COMPLETED         -- Monitoring completed
  FAILED            -- Monitoring failed
  REVIEW_REQUIRED   -- Requires human review
  URGENT_ATTENTION  -- Requires immediate attention
}
```

#### **Learning Path Status**
```typescript
enum LearningPathStatus {
  PENDING           // Awaiting generation
  PROCESSING        -- Currently generating
  COMPLETED         -- Successfully generated
  FAILED            -- Generation failed
  IN_PROGRESS       -- Currently in progress
  ON_HOLD           -- Temporarily on hold
}
```

---

## 🔗 **Relationships**

### **Core Relationship Diagram**
```
User (1) ──┬─→ (N) Session
           ├─→ (1) Subscription ──→ (N) SubscriptionUsage
           ├─→ (N) Project
           ├─→ (N) Analysis
           ├─→ (N) Conversation ──→ (N) Message
           ├─→ (N) Upload
           ├─→ (N) Post
           ├─→ (N) ContractAnalysis
           ├─→ (N) LocalizationAnalysis
           ├─→ (N) CustomerBehaviorAnalysis
           ├─→ (N) ComplianceMonitoring
           └─→ (N) LearningPath

Project (1) ──┬─→ (N) Analysis
               ├─→ (N) Upload
               ├─→ (N) ContractAnalysis
               ├─→ (N) LocalizationAnalysis
               ├─→ (N) CustomerBehaviorAnalysis
               ├─→ (N) ComplianceMonitoring
               └─→ (N) LearningPath
```

### **Key Relationships**

#### **User-Centric Relationships**
- **One-to-Many**: User → Projects, Analyses, Conversations, Uploads, Posts
- **One-to-One**: User → Subscription, Security Settings
- **Cascade Delete**: User deletion removes all related data

#### **Project-Centric Relationships**
- **One-to-Many**: Project → Analyses, Uploads, Business Solution analyses
- **Foreign Key**: All business solution analyses reference projects
- **Set Null**: Project deletion sets project references to null

#### **Business Solution Relationships**
- **Independent Models**: Each business solution has its own analysis model
- **Shared Structure**: Common fields for status, confidence, processing time
- **Flexible Storage**: JSON fields for dynamic data storage

---

## 🎯 **Database Design Principles**

### **1. Scalability**
- **SQLite**: Lightweight and portable database
- **JSON Storage**: Flexible schema for dynamic data
- **Indexing**: Strategic indexing on foreign keys and unique fields
- **Partitioning**: Logical separation of business solutions

### **2. Security**
- **Authentication**: Secure session management
- **Authorization**: Role-based access control
- **Data Protection**: Sensitive data hashing (passwords, PINs)
- **Audit Trail**: Comprehensive timestamp tracking

### **3. Performance**
- **Normalization**: Balanced normalization to avoid redundancy
- **Query Optimization**: Efficient relationship design
- **Caching Strategy**: Application-level caching for frequent queries
- **Batch Processing**: Support for bulk operations

### **4. Maintainability**
- **Type Safety**: Prisma ORM with TypeScript
- **Clear Naming**: Consistent naming conventions
- **Documentation**: Comprehensive schema documentation
- **Migration Support**: Version-controlled schema changes

---

## 🔄 **Migration Guide**

### **Adding New Models**
1. **Define Model**: Add model definition to `schema.prisma`
2. **Update Relations**: Establish relationships with existing models
3. **Generate Migration**: `npx prisma migrate dev --name add-new-model`
4. **Update Types**: Regenerate TypeScript types
5. **Test**: Verify database operations work correctly

### **Modifying Existing Models**
1. **Backup Database**: Create backup before modifications
2. **Update Schema**: Modify model in `schema.prisma`
3. **Generate Migration**: `npx prisma migrate dev --name modify-model`
4. **Update Application Code**: Adjust code for schema changes
5. **Test**: Verify all functionality works

### **Adding New Enums**
1. **Define Enum**: Add enum definition to `schema.prisma`
2. **Update Models**: Reference enum in relevant models
3. **Generate Migration**: `npx prisma migrate dev --name add-enum`
4. **Update Types**: Regenerate TypeScript types
5. **Update UI**: Update form controls and displays

---

## ⚡ **Performance Considerations**

### **Indexing Strategy**
- **Primary Keys**: Automatic indexing on all primary keys
- **Foreign Keys**: Indexes on all foreign key relationships
- **Unique Constraints**: Indexes on unique fields (email, slug, etc.)
- **Query Optimization**: Additional indexes based on query patterns

### **Query Optimization**
- **Eager Loading**: Use `include` for related data to avoid N+1 queries
- **Selective Loading**: Only load required fields with `select`
- **Pagination**: Implement pagination for large datasets
- **Caching**: Cache frequently accessed data

### **Database Connection**
- **Connection Pooling**: Configure appropriate pool size
- **Timeout Management**: Set reasonable query timeouts
- **Error Handling**: Implement robust error handling
- **Health Checks**: Monitor database connectivity

---

## 📊 **Database Statistics**

### **Model Counts**
- **Core Models**: 8 (User, Session, SecuritySettings, Subscription, SubscriptionUsage, Project, Analysis, Conversation, Message, Upload, Post)
- **Business Solution Models**: 5 (ContractAnalysis, LocalizationAnalysis, CustomerBehaviorAnalysis, ComplianceMonitoring, LearningPath)
- **Total Models**: 13 main models + supporting enums

### **Relationship Complexity**
- **One-to-One**: 2 (User → Subscription, User → SecuritySettings)
- **One-to-Many**: 12+ relationships
- **Many-to-Many**: Handled through junction tables where needed

### **Data Types**
- **String**: Primary keys, names, emails, URLs
- **Integer**: Sizes, counts, durations
- **Float**: Confidence scores, probabilities
- **Boolean**: Status flags, toggles
- **DateTime**: Timestamps, scheduling
- **JSON**: Flexible data storage, metadata

---

For more information about database operations and usage, see the [API Documentation](./api.md) and [Development Guide](../DEPLOYMENT_GUIDE.md).