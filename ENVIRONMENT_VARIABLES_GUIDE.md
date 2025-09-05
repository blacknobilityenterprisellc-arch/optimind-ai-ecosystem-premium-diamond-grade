# Environment Variables and Deployment Settings Guide

This comprehensive guide explains how to configure and manage environment variables across all deployment platforms for the OptiMind AI Ecosystem.

## Overview

The OptiMind AI Ecosystem uses environment variables to configure different aspects of the application across multiple deployment platforms (Vercel, Netlify, and local development).

## Environment Variables Structure

### Required Variables

These variables are required for the application to function:

```bash
# Application Configuration
NODE_ENV=development|production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database Configuration (Neon)
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:port/db?sslmode=require"
SHADOW_DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_here

# Security
ENCRYPTION_KEY=your_32_character_key
JWT_SECRET=your_jwt_secret

# AI Services
ZAI_API_KEY=your_zai_api_key
```

### Optional Variables

These variables enhance functionality but are not required:

```bash
# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_ai_key
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
SMTP_FROM=noreply@yourdomain.com

# Analytics
NEXT_PUBLIC_GA_ID=your_ga_id
SENTRY_DSN=your_sentry_dsn

# Payment Processing
STRIPE_API_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# GitHub Integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Platform-Specific Configuration

### Vercel Environment Variables

#### Adding Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Click "Add variable"
4. Enter the variable name and value
5. Select the environments (Production, Preview, Development)
6. Click "Add"

#### Vercel-Specific Variables

```bash
# Vercel Configuration
VERCEL_ENV=development|preview|production
VERCEL_URL=your-vercel-app-url.vercel.app
VERCEL_GITHUB_COMMIT_SHA=commit_sha
VERCEL_GIT_PROVIDER=github
```

#### Environment Scopes in Vercel

- **Production**: Available in production deployments
- **Preview**: Available in preview deployments (pull requests)
- **Development**: Available in development environments
- **All**: Available in all environments

### Netlify Environment Variables

#### Adding Variables to Netlify

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Build & deploy" → "Environment"
3. Click "Edit variables"
4. Enter the variable name and value
5. Select the contexts (All, Production, Deploy Preview, Branch Deploys)
6. Click "Save"

#### Netlify-Specific Variables

```bash
# Netlify Configuration
NETLIFY_USE_YARN=true
NETLIFY_BUILD_CACHE=true
NETLIFY_SITE_ID=your_site_id
NETLIFY_DEPLOY_ID=deploy_id
CONTEXT=production|deploy-preview|branch-deploy
BRANCH=branch_name
PULL_REQUEST=pr_number
```

#### Environment Contexts in Netlify

- **All**: Available in all contexts
- **Production**: Available in production deployments
- **Deploy Preview**: Available in preview deployments
- **Branch Deploys**: Available in branch deployments

### Local Development Environment Variables

#### Using .env Files

Create different environment files for different scenarios:

```bash
# .env (local development)
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="postgresql://user:pass@localhost:5432/optimind_dev"

# .env.staging (staging)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.optimind-ai.com
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# .env.production (production)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://optimind-ai.com
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

#### Loading Environment Variables

The application loads environment variables in this order:

1. `.env` (default)
2. `.env.local` (overrides default)
3. `.env.development` (development only)
4. `.env.production` (production only)
5. System environment variables

## Security Best Practices

### 1. Never Commit Secrets to Version Control

```bash
# Add to .gitignore
.env
.env.local
.env.development
.env.production
*.key
*.pem
*.crt
```

### 2. Use Platform-Specific Secret Management

```bash
# Vercel
vercel env add NEXTAUTH_SECRET

# Netlify
netlify env:set NEXTAUTH_SECRET your_secret

# GitHub Secrets (for CI/CD)
gh secret set NEXTAUTH_SECRET --body your_secret
```

### 3. Generate Strong Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secret
openssl rand -hex 32

# Generate encryption key
openssl rand -hex 32
```

### 4. Rotate Secrets Regularly

- API keys: Every 90 days
- Database passwords: Every 180 days
- JWT secrets: Every 365 days
- Encryption keys: Every 2 years

### 5. Use Different Secrets for Different Environments

```bash
# Development
NEXTAUTH_SECRET=dev_secret_here

# Staging
NEXTAUTH_SECRET=staging_secret_here

# Production
NEXTAUTH_SECRET=production_secret_here
```

## Environment Variable Management

### 1. Using dotenv-cli

```bash
# Install dotenv-cli
npm install -g dotenv-cli

# Load environment variables
dotenv -- your_command

# Example with specific environment file
dotenv -e .env.production -- npm run build
```

### 2. Using direnv (for local development)

```bash
# Install direnv
# macOS: brew install direnv
# Ubuntu: sudo apt-get install direnv

# Add to .envrc
export NODE_ENV=development
export NEXT_PUBLIC_APP_URL=http://localhost:3000

# Hook into shell
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
```

### 3. Using AWS Secrets Manager (for production)

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name optimind/production/nextauth-secret \
  --secret-string "your_secret_here"

# Retrieve in application
const secret = await getSecret('optimind/production/nextauth-secret');
```

## Deployment Configuration

### Vercel Deployment Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-app.vercel.app",
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://your-app.vercel.app",
      "NODE_ENV": "production"
    }
  }
}
```

### Netlify Deployment Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[context.production.environment]
  NODE_ENV = "production"
  NEXT_PUBLIC_APP_URL = "https://your-app.netlify.app"

[context.deploy-preview.environment]
  NODE_ENV = "development"
  NEXT_PUBLIC_APP_URL = "https://deploy-preview-branch--your-app.netlify.app"
```

### GitHub Actions Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

## Environment Validation

### 1. Runtime Validation

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(32),
  ZAI_API_KEY: z.string().min(1),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('Invalid environment variables:', error);
  process.exit(1);
}
```

### 2. Build-time Validation

```typescript
// next.config.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
});

const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
});

export default {
  // ... other config
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

### 3. Startup Validation

```typescript
// src/lib/startup.ts
export function validateEnvironment() {
  const required = [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'ENCRYPTION_KEY',
    'ZAI_API_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables

**Symptoms**: Application fails to start or build
**Solution**: Check that all required variables are set in the correct environment

#### 2. Invalid Variable Format

**Symptoms**: Database connection fails, authentication errors
**Solution**: Validate variable formats (URLs, secrets, etc.)

#### 3. Environment Variable Scope Issues

**Symptoms**: Variables work in development but not in production
**Solution**: Check that variables are available in the correct environment scope

#### 4. Secret Exposure

**Symptoms**: Security vulnerabilities detected
**Solution**: Rotate secrets and ensure they're not committed to version control

### Debug Commands

```bash
# Check environment variables in Vercel
vercel env ls

# Check environment variables in Netlify
netlify env:list

# Check current environment variables
printenv | grep NEXT

# Test database connection
npx prisma db push
```

## Monitoring and Maintenance

### 1. Regular Audits

- Monthly: Review all environment variables
- Quarterly: Rotate API keys and secrets
- Annually: Review security policies

### 2. Monitoring Tools

- **Vercel**: Built-in environment variable monitoring
- **Netlify**: Environment variable usage tracking
- **Sentry**: Error tracking related to missing variables
- **Custom**: Application-level monitoring

### 3. Documentation

Maintain up-to-date documentation:
- Environment variable definitions
- Setup procedures
- Security policies
- Troubleshooting guides

## Success Criteria

Environment variable configuration is successful when:

- ✅ All required variables are properly configured
- ✅ Application builds and runs successfully on all platforms
- ✅ Database connections work correctly
- ✅ Authentication and authorization function properly
- ✅ AI services are accessible and functional
- ✅ Security best practices are followed
- ✅ Environment-specific configurations work correctly
- ✅ Monitoring and validation are in place
- ✅ Documentation is comprehensive and up-to-date

---

**Note**: This completes the environment variables and deployment settings configuration. The final step is to test all integrations and validate deployments.