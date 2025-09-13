import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Database with Simple Test Data...');

  // Create default tenant first
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      isActive: true,
      maxUsers: 100,
      maxProjects: 50,
      maxStorage: 10240,
      maxApiCalls: 10000,
      securityLevel: 'military-grade',
      mfaRequired: true,
      sessionTimeout: 3600,
    },
  });

  // Create security settings linked to tenant
  const securitySettings = await prisma.securitySettings.upsert({
    where: { tenantId: defaultTenant.id },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      mfaRequired: true,
      sessionTimeout: 3600,
      passwordPolicy: {
        minLength: 12,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        expirationDays: 90,
      },
      encryptionLevel: 'military',
      auditLogEnabled: true,
      dataRetention: 365,
      backupEnabled: true,
      monitoringEnabled: true,
      compliance: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA'],
      certifications: 'SOC2,GDPR,ISO27001,HIPAA',
    },
  });

  // Create enterprise users with enhanced security
  const adminPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@optimind.ai' },
    update: {},
    create: {
      email: 'admin@optimind.ai',
      password: adminPassword,
      name: 'Jocely P. Honore - CEO',
      role: 'ADMIN',
      apiKey: 'admin-api-key-123',
      tenantId: defaultTenant.id,
      securityLevel: 'military',
      lastLoginAt: new Date(),
    },
  });

  const enterprisePassword = await hash('enterprise123', 10);
  const enterpriseUser = await prisma.user.upsert({
    where: { email: 'enterprise@optimind.ai' },
    update: {},
    create: {
      email: 'enterprise@optimind.ai',
      password: enterprisePassword,
      name: 'Enterprise Manager',
      role: 'DEVELOPER',
      apiKey: 'enterprise-api-key-456',
      tenantId: defaultTenant.id,
      securityLevel: 'premium',
      lastLoginAt: new Date(),
    },
  });

  const testPassword = await hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@optimind.ai' },
    update: {},
    create: {
      email: 'test@optimind.ai',
      password: testPassword,
      name: 'Test User',
      role: 'USER',
      apiKey: 'test-api-key-789',
      tenantId: defaultTenant.id,
      securityLevel: 'enhanced',
      lastLoginAt: new Date(),
    },
  });

  // Create enterprise subscriptions with security features
  const adminSubscription = await prisma.subscription.upsert({
    where: { 
      userId_tenantId: {
        userId: adminUser.id,
        tenantId: defaultTenant.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      tenantId: defaultTenant.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      metadata: {
        securityFeatures: ['quantum-encryption', 'biometric-auth', 'zero-trust'],
        supportLevel: '24/7-premium',
        sla: '99.99%',
      },
    },
  });

  const enterpriseSubscription = await prisma.subscription.upsert({
    where: { 
      userId_tenantId: {
        userId: enterpriseUser.id,
        tenantId: defaultTenant.id
      }
    },
    update: {},
    create: {
      userId: enterpriseUser.id,
      tenantId: defaultTenant.id,
      plan: 'PRO',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      metadata: {
        securityFeatures: ['advanced-encryption', 'multi-factor', 'audit-logs'],
        supportLevel: 'business-hours',
        sla: '99.9%',
      },
    },
  });

  const testSubscription = await prisma.subscription.upsert({
    where: { 
      userId_tenantId: {
        userId: testUser.id,
        tenantId: defaultTenant.id
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      tenantId: defaultTenant.id,
      plan: 'BASIC',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      metadata: {
        securityFeatures: ['standard-encryption', 'basic-auth'],
        supportLevel: 'standard',
        sla: '99.5%',
      },
    },
  });

  // Create enterprise projects with enhanced metadata
  const enterpriseProject1 = await prisma.project.create({
    data: {
      name: 'OptiMind AI Ecosystem - Core Platform',
      description: 'Enterprise-grade AI platform with 45+ AI tools and 35+ AI models',
      status: 'ACTIVE',
      userId: adminUser.id,
      tenantId: defaultTenant.id,
      metadata: {
        category: 'platform',
        priority: 'critical',
        tags: ['AI', 'enterprise', 'ecosystem', 'premium', 'security-updated'],
        budget: 2500000,
        teamSize: 25,
        estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        securityLevel: 'military-grade',
        compliance: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA'],
        nextjsVersion: '15.5.2',
        lastSecurityUpdate: new Date().toISOString(),
      },
    },
  });

  const enterpriseProject2 = await prisma.project.create({
    data: {
      name: 'Global AI Security Initiative',
      description: 'Military-grade AI security system with zero-trust architecture',
      status: 'ACTIVE',
      userId: enterpriseUser.id,
      tenantId: defaultTenant.id,
      metadata: {
        category: 'security',
        priority: 'high',
        tags: ['security', 'AI', 'zero-trust', 'military-grade', 'quantum-resistant'],
        budget: 1500000,
        teamSize: 15,
        estimatedCompletion: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        securityLevel: 'top-secret',
        compliance: ['NIST', 'CMMC', 'ISO27001'],
        encryptionStandards: ['AES-256', 'quantum-resistant'],
        nextjsVersion: '15.5.2',
        lastSecurityUpdate: new Date().toISOString(),
      },
    },
  });

  const researchProject = await prisma.project.create({
    data: {
      name: 'Neural Network Research & Development',
      description: 'Advanced neural network models for predictive analytics and machine learning',
      status: 'ACTIVE',
      userId: testUser.id,
      tenantId: defaultTenant.id,
      metadata: {
        category: 'research',
        priority: 'medium',
        tags: ['neural-network', 'ML', 'research', 'analytics', 'security-enhanced'],
        budget: 500000,
        teamSize: 8,
        estimatedCompletion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        securityLevel: 'enterprise',
        compliance: ['GDPR', 'CCPA'],
        nextjsVersion: '15.5.2',
        lastSecurityUpdate: new Date().toISOString(),
      },
    },
  });

  // Create enterprise conversations with security context
  const enterpriseConversation1 = await prisma.conversation.create({
    data: {
      title: 'Enterprise AI Strategy Planning',
      userId: adminUser.id,
      metadata: {
        model: 'GLM-4.5',
        totalMessages: 8,
        category: 'strategic',
        priority: 'high',
        securityLevel: 'confidential',
        encryptionEnabled: true,
        lastSecurityUpdate: new Date().toISOString(),
      },
    },
  });

  const enterpriseConversation2 = await prisma.conversation.create({
    data: {
      title: 'Security Protocol Implementation',
      userId: enterpriseUser.id,
      metadata: {
        model: 'GPT-4',
        totalMessages: 12,
        category: 'security',
        priority: 'critical',
        securityLevel: 'top-secret',
        encryptionEnabled: true,
        lastSecurityUpdate: new Date().toISOString(),
      },
    },
  });

  // Create enterprise messages with security awareness
  await prisma.message.createMany({
    data: [
      {
        conversationId: enterpriseConversation1.id,
        role: 'USER',
        content: 'We need to develop a comprehensive AI strategy for our enterprise platform. What are the key components we should focus on?',
      },
      {
        conversationId: enterpriseConversation1.id,
        role: 'ASSISTANT',
        content: 'For a comprehensive enterprise AI strategy, you should focus on: 1) Multi-model AI integration (GLM-4.5, GPT-4, Claude-3), 2) Zero-trust security architecture, 3) Scalable infrastructure, 4) Real-time processing capabilities, 5) Advanced analytics and predictive modeling, 6) Enterprise-grade compliance and governance. Security updates including Next.js 15.5.2 have been applied.',
      },
      {
        conversationId: enterpriseConversation1.id,
        role: 'USER',
        content: 'Excellent! How do we implement zero-trust security in our AI ecosystem?',
      },
      {
        conversationId: enterpriseConversation1.id,
        role: 'ASSISTANT',
        content: 'Zero-trust security implementation requires: 1) Continuous authentication and authorization, 2) Micro-segmentation of AI services, 3) Real-time threat detection, 4) Comprehensive audit trails, 5) Military-grade encryption for all data, 6) Biometric authentication for critical operations, 7) Regular security assessments and penetration testing. Recent ESLint security enhancements have been deployed.',
      },
      {
        conversationId: enterpriseConversation2.id,
        role: 'USER',
        content: 'What are the best practices for implementing quantum-resistant encryption in our AI security protocols?',
      },
      {
        conversationId: enterpriseConversation2.id,
        role: 'ASSISTANT',
        content: 'Quantum-resistant encryption best practices include: 1) Implementing lattice-based cryptography, 2) Using hash-based signatures, 3) Deploying post-quantum key exchange protocols, 4) Regular cryptographic agility updates, 5) Hybrid encryption schemes, 6) Continuous monitoring for quantum computing threats, 7) Collaboration with quantum security research communities. All security patches are up to date.',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`   - Tenant: ${defaultTenant.name}`);
  console.log(`   - Security Settings: Military-grade`);
  console.log(`   - Users: ${adminUser.name}, ${enterpriseUser.name}, ${testUser.name}`);
  console.log(`   - Projects: ${enterpriseProject1.name}, ${enterpriseProject2.name}, ${researchProject.name}`);
  console.log(`   - Conversations: ${enterpriseConversation1.title}, ${enterpriseConversation2.title}`);
  console.log(`   - Messages: 6 total`);
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });