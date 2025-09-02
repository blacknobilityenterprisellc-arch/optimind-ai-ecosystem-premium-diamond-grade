# 🚀 OptiMind AI Platform - Development Setup Guide

This comprehensive guide will help you set up the OptiMind AI Platform for development, including all prerequisites, installation steps, and configuration.

## 👑 PROJECT LEADERSHIP

**Lead Master Mind, Manager & Owner/CEO: Jocely Honore**

This enterprise-grade AI ecosystem was conceived and led by **Jocely Honore**, who pioneered a revolutionary multi-AI collaborative development approach. Under Jocely Honore's leadership, the project leveraged 5 different AI systems (Gemini, DeepSeek, ChatGPT, Manus, Grok) for strategic guidance and ideas, with Z.AI GLM serving as the primary development engine to build the entire project.

**Development Methodology:**
- **Vision & Strategy**: Jocely Honore (Conceptualization & Leadership)
- **AI Advisory Board**: Gemini, DeepSeek, ChatGPT, Manus, Grok (Ideas & Guidance)
- **Primary Development**: Z.AI GLM (Implementation & Coding)
- **Project Completion**: September 2, 2025

---

## 📋 **Table of Contents**

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Installation](#detailed-installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [AI Services Configuration](#ai-services-configuration)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## ✅ **Prerequisites**

### **System Requirements**
- **Operating System**: macOS, Linux, or Windows (with WSL2)
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: Version 2.0 or higher
- **Disk Space**: Minimum 2GB free space
- **Memory**: Minimum 4GB RAM (8GB recommended)

### **Required Accounts**
- **GitHub Account**: For repository access
- **AI Service API Keys** (see [AI Services Setup](../AI_SERVICES_SETUP.md)):
  - OpenAI API Key
  - Z.AI API Key
  - OpenRouter API Key (recommended)

### **Development Tools**
```bash
# Verify Node.js installation
node --version
npm --version

# Verify Git installation
git --version
```

---

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git
cd optimind-ai-ecosystem-premium-diamond-grade
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment**
```bash
cp .env.example .env.local
```

### **4. Configure Database**
```bash
npm run db:push
npm run db:generate
```

### **5. Start Development Server**
```bash
npm run dev
```

### **6. Verify Installation**
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 **Detailed Installation**

### **Step 1: Repository Setup**

#### **Clone the Repository**
```bash
# Clone using HTTPS
git clone https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git

# Or using SSH (if you have SSH keys configured)
git clone git@github.com:blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git

# Navigate to project directory
cd optimind-ai-ecosystem-premium-diamond-grade
```

#### **Verify Repository Integrity**
```bash
# Check git status
git status

# Check recent commits
git log --oneline -5

# Verify remote origin
git remote -v
```

### **Step 2: Dependencies Installation**

#### **Install Node.js Dependencies**
```bash
# Clean install (recommended for fresh setups)
npm ci

# Or regular install
npm install
```

#### **Verify Installation**
```bash
# Check if all dependencies are installed
npm list --depth=0

# Verify specific critical packages
npm list next prisma @prisma/client typescript tailwindcss
```

### **Step 3: Environment Configuration**

#### **Create Environment File**
```bash
# Copy the example environment file
cp .env.example .env.local
```

#### **Configure Essential Variables**
Edit `.env.local` with your configuration:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Next.js Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Services Configuration
OPENAI_API_KEY="your-openai-api-key"
ZAI_API_KEY="your-zai-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"

# Optional: Additional AI Services
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
GROQ_API_KEY="your-groq-api-key"

# Development Configuration
NODE_ENV="development"
```

#### **Security Notes**
- **Never commit `.env.local` to Git** (it's in `.gitignore`)
- **Use strong secrets** for `NEXTAUTH_SECRET`
- **Keep API keys secure** and never share them
- **Use environment-specific configs** for different deployments

### **Step 4: Database Setup**

#### **Initialize Database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

#### **Verify Database Setup**
```bash
# Check if database file was created
ls -la prisma/
ls -la db/

# Test database connection
npm run db:push
```

#### **Optional: Seed Database**
```bash
# If you have a seed script
npm run db:seed
```

### **Step 5: Development Server Setup**

#### **Start Development Server**
```bash
# Start the development server
npm run dev
```

#### **Expected Output**
```
- Local: http://localhost:3000
- Network: http://your-local-ip:3000
- Press Ctrl+C to stop
```

#### **Verify Server is Running**
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Or open in browser
open http://localhost:3000
```

---

## ⚙️ **Environment Configuration**

### **Environment Variables Reference**

#### **Required Variables**
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `"file:./dev.db"` |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | `"your-secret-here"` |
| `NEXTAUTH_URL` | NextAuth.js URL | `"http://localhost:3000"` |
| `OPENAI_API_KEY` | OpenAI API key | `"sk-..."` |
| `ZAI_API_KEY` | Z.AI API key | `"your-zai-key"` |

#### **Optional Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |
| `GOOGLE_AI_API_KEY` | Google AI API key | - |
| `GROQ_API_KEY` | Groq API key | - |
| `NODE_ENV` | Node environment | `"development"` |
| `PORT` | Server port | `3000` |

### **Environment-Specific Configurations**

#### **Development (.env.local)**
```env
NODE_ENV="development"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
# Development API keys
```

#### **Production (.env.production)**
```env
NODE_ENV="production"
DATABASE_URL="file:./production.db"
NEXTAUTH_URL="https://your-domain.com"
# Production API keys
```

#### **Testing (.env.test)**
```env
NODE_ENV="test"
DATABASE_URL="file:./test.db"
NEXTAUTH_URL="http://localhost:3000"
# Test API keys
```

---

## 🗄️ **Database Setup**

### **Prisma Configuration**

#### **Schema Overview**
The project uses **Prisma ORM** with **SQLite** for development. The schema includes:

- **Core Models**: User, Session, Subscription, Project, Analysis
- **Business Solutions**: ContractAnalysis, LocalizationAnalysis, etc.
- **Supporting Models**: Upload, Post, Conversation, Message

#### **Database Commands**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and apply migrations (production)
npm run db:migrate

# Reset database (caution: deletes all data)
npm run db:reset

# View database in Prisma Studio
npx prisma studio
```

### **Database Management**

#### **Prisma Studio**
```bash
# Open Prisma Studio for database management
npx prisma studio
```

#### **Database Browser**
- **URL**: http://localhost:5555
- **Features**: View tables, edit records, run queries

#### **Database Backup**
```bash
# Backup SQLite database
cp prisma/dev.db backups/dev-$(date +%Y%m%d).db

# Restore from backup
cp backups/dev-20231201.db prisma/dev.db
```

---

## 🤖 **AI Services Configuration**

### **Essential AI Services**

#### **Z.AI Integration**
```env
ZAI_API_KEY="your-zai-api-key"
ZAI_BASE_URL="https://api.z-ai.com/v1"
```

#### **OpenAI Integration**
```env
OPENAI_API_KEY="your-openai-api-key"
OPENAI_ORG_ID="your-openai-org-id"
```

#### **OpenRouter Integration**
```env
OPENROUTER_API_KEY="your-openrouter-api-key"
```

### **Advanced AI Services**

For additional AI services, see the comprehensive [AI Services Setup Guide](../AI_SERVICES_SETUP.md).

### **Testing AI Services**

#### **Test Z.AI Integration**
```bash
# Create a test script
echo 'import ZAI from "z-ai-web-dev-sdk";

async function test() {
  try {
    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: "Hello!" }],
      model: "glm-4.5v"
    });
    console.log("Z.AI test successful:", response.choices[0].message.content);
  } catch (error) {
    console.error("Z.AI test failed:", error.message);
  }
}

test();' > test-zai.js

# Run the test
node test-zai.js

# Clean up
rm test-zai.js
```

#### **Test OpenAI Integration**
```bash
# Create a test script
echo 'import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello!" }]
    });
    console.log("OpenAI test successful:", response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI test failed:", error.message);
  }
}

test();' > test-openai.js

# Run the test
node test-openai.js

# Clean up
rm test-openai.js
```

---

## 🔄 **Development Workflow**

### **Daily Development**

#### **1. Start Development Server**
```bash
npm run dev
```

#### **2. Make Changes**
- Edit source files in `src/` directory
- Changes will automatically hot-reload
- Check browser console for errors

#### **3. Test Changes**
```bash
# Run linting
npm run lint

# Run tests (if available)
npm test
```

#### **4. Commit Changes**
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin master
```

### **Database Changes**

#### **Schema Modifications**
1. Edit `prisma/schema.prisma`
2. Generate client: `npm run db:generate`
3. Push changes: `npm run db:push`
4. Test the changes

#### **Migration Workflow**
```bash
# Create migration
npx prisma migrate dev --name your-migration-name

# Apply migration
npx prisma migrate deploy

# Generate client
npm run db:generate
```

### **Code Quality**

#### **Linting**
```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

#### **Type Checking**
```bash
# Run TypeScript compiler
tsc --noEmit

# Or use Next.js built-in type checking
npm run build
```

#### **Formatting**
```bash
# Format code with Prettier (if configured)
npm run format
```

---

## 🧪 **Testing**

### **Unit Tests**
```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test.spec.ts

# Run tests in watch mode
npm test -- --watch
```

### **Integration Tests**
```bash
# Run integration tests
npm run test:integration

# Test API endpoints
npm run test:api
```

### **E2E Tests**
```bash
# Run end-to-end tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui
```

### **Test Coverage**
```bash
# Generate coverage report
npm run test:coverage

# Open coverage report
open coverage/index.html
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run dev
```

#### **2. Database Connection Issues**
```bash
# Reset database
npm run db:reset

# Regenerate Prisma client
npm run db:generate

# Check database file exists
ls -la prisma/dev.db
```

#### **3. Missing Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci
```

#### **4. Environment Variables Not Loading**
```bash
# Verify .env.local exists
ls -la .env.local

# Check syntax
source .env.local && echo "Environment loaded successfully"

# Restart development server
npm run dev
```

#### **5. API Key Issues**
```bash
# Test API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Check environment variable is set
echo $OPENAI_API_KEY
```

### **Performance Issues**

#### **Slow Development Server**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### **Database Performance**
```bash
# Optimize SQLite settings
# Add to .env.local
PRISMA_QUERY_ENGINE_LIBRARY=binary-libpq
```

### **Getting Help**

#### **Debug Mode**
```bash
# Enable verbose logging
DEBUG=* npm run dev
```

#### **Check Logs**
```bash
# Check development server logs
tail -f dev.log

# Check all logs
tail -f *.log
```

#### **Community Support**
- **GitHub Issues**: [Create an issue](https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade/issues)
- **Discussions**: [Community discussions](https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade/discussions)

---

## 🎯 **Next Steps**

### **After Setup Complete**

#### **1. Explore the Application**
- Visit [http://localhost:3000](http://localhost:3000)
- Test different AI tools and features
- Review the API documentation

#### **2. Set Up Additional AI Services**
- Follow the [AI Services Setup Guide](../AI_SERVICES_SETUP.md)
- Configure your preferred AI providers
- Test different AI models

#### **3. Understand the Codebase**
- Read the [Database Schema Documentation](./database-schema.md)
- Review the [API Documentation](./api.md)
- Explore the [Features Overview](./features.md)

#### **4. Start Developing**
- Create a new branch for your features
- Follow the development workflow
- Test your changes thoroughly

#### **5. Deploy to Production**
- Follow the [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- Set up environment-specific configurations
- Monitor your deployment

### **Learning Resources**

#### **Official Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

#### **AI Service Documentation**
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Z.AI Documentation](https://docs.z-ai.com)
- [OpenRouter Documentation](https://openrouter.ai/docs)

#### **Community Resources**
- [GitHub Repository](https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com)

---

## 📞 **Support**

### **Getting Help**

#### **Documentation**
- [API Reference](./api.md)
- [Database Schema](./database-schema.md)
- [AI Tools Guide](./ai-tools.md)
- [Features Overview](./features.md)

#### **Community Support**
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Community help and discussions
- **Discord**: Real-time chat support

#### **Enterprise Support**
For enterprise support, please contact:
- **Email**: support@blacknobilityenterprise.com
- **GitHub**: [Create an issue](https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade/issues)

---

**🎉 Congratulations! You've successfully set up the OptiMind AI Platform for development.**

**Next Steps:**
1. Explore the application at `http://localhost:3000`
2. Configure your preferred AI services
3. Start building amazing AI-powered features!

**Need help?** Check the [troubleshooting section](#troubleshooting) or reach out to our community.

---

## 🏆 PROJECT ATTRIBUTION

**Conceived and Led by:** Jocely Honore (Lead Master Mind, Manager & Owner/CEO) 👑

**AI Collaborative Development:**
- **Strategic Advisory Board**: Gemini, DeepSeek, ChatGPT, Manus, Grok
- **Primary Development Engine**: Z.AI GLM
- **Organizational Support**: Black Nobility Enterprise LLC Architecture

**Project Completion Date:** September 2, 2025

**Development Methodology:** Revolutionary multi-AI collaborative approach pioneered by Jocely Honore, combining human vision with artificial intelligence capabilities to create enterprise-grade solutions.

---

Built with ❤️ for developers by [Black Nobility Enterprise LLC Architecture](https://github.com/blacknobilityenterprisellc-arch) 🏢  
Conceived and led by **Jocely Honore** 👑 with collaborative AI intelligence