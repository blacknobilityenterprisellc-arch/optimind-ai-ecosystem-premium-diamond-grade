import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Premium Diamond-Grade Database with Security Updates...');

  // Create security settings
  const securitySettings = await prisma.securitySettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      pin_hash: 'dummy_hash',
      salt: 'dummy_salt',
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
      lastLoginAt: new Date(),
    },
  });

  // Create default tenant with enhanced configuration
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
      plan: 'ENTERPRISE',
      maxUsers: 100,
      maxProjects: 50,
      maxStorage: 10240,
      configuration: {
        security: {
          enableMFA: true,
          sessionTimeout: 3600,
          passwordPolicy: {
            minLength: 12,
            requireSpecialChars: true,
            requireNumbers: true,
            requireUppercase: true,
            expirationDays: 90,
          },
        },
        features: {
          aiModels: ['GLM-4.5', 'GPT-4', 'Claude-3', 'Llama-3'],
          securityLevel: 'military-grade',
          compliance: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA'],
        },
      },
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

  // Create enterprise analyses with security focus
  await prisma.analysis.createMany({
    data: [
      {
        type: 'MULTIMODAL_ANALYSIS',
        input: 'Comprehensive AI ecosystem analysis with text, image, and data processing',
        result: {
          score: 96,
          insights: ['Advanced AI integration detected', 'Multi-modal capabilities confirmed', 'Enterprise-grade architecture', 'Security patches applied'],
          recommendations: ['Implement real-time processing', 'Add neural network support', 'Enhance security protocols', 'Regular security audits'],
          aiModels: ['GLM-4.5', 'GPT-4', 'Claude-3', 'Llama-3'],
          securityStatus: 'secure',
          vulnerabilities: [],
          lastSecurityScan: new Date().toISOString(),
        },
        confidence: 0.98,
        status: 'COMPLETED',
        userId: adminUser.id,
        projectId: enterpriseProject1.id,
        model: 'ensemble',
        processingTime: 4500,
        metadata: {
          analysisDepth: 'comprehensive',
          dataPoints: 15420,
          processingNodes: 8,
          securityScanCompleted: true,
          nextjsVersion: '15.5.2',
        },
      },
      {
        type: 'DATA_ANALYSIS',
        input: 'Zero-trust security architecture evaluation and vulnerability assessment',
        result: {
          score: 94,
          securityLevel: 'military-grade',
          vulnerabilities: [],
          recommendations: ['Maintain quantum encryption', 'Continue biometric authentication', 'Enhance audit trails', 'Regular penetration testing'],
          compliance: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA', 'NIST'],
          patchesApplied: ['Next.js 15.5.2', 'ESLint security rules'],
          lastSecurityUpdate: new Date().toISOString(),
        },
        confidence: 0.96,
        status: 'COMPLETED',
        userId: enterpriseUser.id,
        projectId: enterpriseProject2.id,
        model: 'security-ai',
        processingTime: 3200,
        metadata: {
          securityScore: 94,
          threatLevel: 'low',
          complianceScore: 98,
          vulnerabilitiesFixed: 3,
          nextjsVersion: '15.5.2',
        },
      },
      {
        type: 'DATA_ANALYSIS',
        input: 'Neural network performance prediction and optimization analysis',
        result: {
          score: 89,
          accuracy: 94.5,
          loss: 0.045,
          predictions: ['High accuracy expected', 'Optimal for real-time processing', 'Suitable for enterprise deployment'],
          optimization: ['Layer optimization recommended', 'Hyperparameter tuning needed', 'Data augmentation suggested'],
          securityMetrics: {
            dataEncryption: 'AES-256',
            modelProtection: 'enabled',
            accessControl: 'role-based',
          },
          lastSecurityUpdate: new Date().toISOString(),
        },
        confidence: 0.92,
        status: 'COMPLETED',
        userId: testUser.id,
        projectId: researchProject.id,
        model: 'neural-network',
        processingTime: 6800,
        metadata: {
          epochs: 150,
          batchSize: 32,
          learningRate: 0.001,
          validationAccuracy: 94.5,
          nextjsVersion: '15.5.2',
        },
      },
    ],
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

  // Create enterprise posts with security focus
  await prisma.post.createMany({
    data: [
      {
        title: 'OptiMind AI Ecosystem: Enterprise-Grade AI Platform with Security Updates',
        content: '# OptiMind AI Ecosystem: The Future of Enterprise AI\n\nThe OptiMind AI Ecosystem represents the pinnacle of enterprise-grade artificial intelligence platforms, combining 45+ AI tools and 35+ advanced AI models into a unified, production-ready solution. Recent security updates include Next.js 15.5.2 and enhanced ESLint configuration.',
        excerpt: 'Discover the most comprehensive enterprise AI ecosystem with 45+ AI tools and military-grade security. Updated with latest security patches.',
        slug: 'optimind-ai-ecosystem-enterprise-grade-security-updates-' + Date.now(),
        published: true,
        authorId: adminUser.id,
        featured: true,
        publishedAt: new Date(),
        metadata: {
          readingTime: 8,
          tags: ['AI', 'enterprise', 'ecosystem', 'premium', 'security'],
          seoScore: 98,
          views: 15420,
          shares: 342,
          securityLevel: 'enterprise',
          lastUpdated: new Date().toISOString(),
        },
      },
      {
        title: 'Zero-Trust Security Architecture for AI Systems: Updated Best Practices',
        content: '# Implementing Zero-Trust Security in AI Ecosystems\n\nZero-trust security is no longer optional for enterprise AI systems. This comprehensive guide covers military-grade security protocols for AI platforms, including recent Next.js 15.5.2 security patches.',
        excerpt: 'Learn how to implement military-grade zero-trust security in your AI ecosystem with comprehensive protocols and latest updates.',
        slug: 'zero-trust-security-ai-architecture-updated-' + Date.now(),
        published: true,
        authorId: enterpriseUser.id,
        featured: true,
        publishedAt: new Date(),
        metadata: {
          readingTime: 12,
          tags: ['security', 'zero-trust', 'AI', 'military-grade', 'updates'],
          seoScore: 96,
          views: 8934,
          shares: 198,
          securityLevel: 'top-secret',
          lastUpdated: new Date().toISOString(),
        },
      },
      {
        title: 'Neural Networks and Predictive Analytics in Enterprise AI: Security Enhanced',
        content: '# Advanced Neural Networks for Enterprise Predictive Analytics\n\nExplore how advanced neural networks are revolutionizing predictive analytics in enterprise environments with real-time processing capabilities and enhanced security measures.',
        excerpt: 'Discover how neural networks are transforming enterprise predictive analytics with real-time processing and security enhancements.',
        slug: 'neural-networks-predictive-analytics-enterprise-security-' + Date.now(),
        published: true,
        authorId: testUser.id,
        featured: false,
        publishedAt: new Date(),
        metadata: {
          readingTime: 10,
          tags: ['neural-networks', 'predictive-analytics', 'AI', 'enterprise', 'security'],
          seoScore: 92,
          views: 6543,
          shares: 127,
          securityLevel: 'enterprise',
          lastUpdated: new Date().toISOString(),
        },
      },
    ],
  });

  // Create enhanced tenant settings with security configuration
  await prisma.tenantSetting.upsert({
    where: {
      tenantId_key: {
        tenantId: defaultTenant.id,
        key: 'security_configuration'
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      key: 'security_configuration',
      value: {
        enableMFA: true,
        sessionTimeout: 3600,
        passwordPolicy: {
          minLength: 12,
          requireSpecialChars: true,
          requireNumbers: true,
          requireUppercase: true,
          expirationDays: 90,
        },
        encryptionStandards: ['AES-256', 'quantum-resistant'],
        auditLogLevel: 'detailed',
      },
      category: 'SECURITY',
      isSystem: true,
    },
  });

  await prisma.tenantSetting.upsert({
    where: {
      tenantId_key: {
        tenantId: defaultTenant.id,
        key: 'ai_model_configuration'
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      key: 'ai_model_configuration',
      value: {
        defaultModel: 'GLM-4.5',
        availableModels: ['GLM-4.5', 'GPT-4', 'Claude-3', 'Llama-3'],
        maxTokens: 8192,
        temperature: 0.7,
        securityEnabled: true,
      },
      category: 'FEATURES',
      isSystem: false,
    },
  });

  await prisma.tenantSetting.upsert({
    where: {
      tenantId_key: {
        tenantId: defaultTenant.id,
        key: 'compliance_settings'
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      key: 'compliance_settings',
      value: {
        enabledFrameworks: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA'],
        auditFrequency: 'weekly',
        dataRetention: '7-years',
        encryptionRequired: true,
      },
      category: 'GENERAL',
      isSystem: true,
    },
  });

  // Create tenant users with enhanced roles
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: defaultTenant.id,
        userId: adminUser.id
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      userId: adminUser.id,
      role: 'OWNER',
      status: 'ACTIVE',
      permissions: {
        canManageUsers: true,
        canManageBilling: true,
        canManageSecurity: true,
        canAccessAllData: true,
        canConfigureAI: true,
      },
    },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: defaultTenant.id,
        userId: enterpriseUser.id
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      userId: enterpriseUser.id,
      role: 'ADMIN',
      status: 'ACTIVE',
      permissions: {
        canManageUsers: true,
        canManageBilling: false,
        canManageSecurity: true,
        canAccessAllData: false,
        canConfigureAI: true,
      },
    },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: defaultTenant.id,
        userId: testUser.id
      }
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      userId: testUser.id,
      role: 'MEMBER',
      status: 'ACTIVE',
      permissions: {
        canManageUsers: false,
        canManageBilling: false,
        canManageSecurity: false,
        canAccessAllData: false,
        canConfigureAI: false,
      },
    },
  });

  // Create audit logs for security updates
  await prisma.tenantAuditLog.createMany({
    data: [
      {
        tenantId: defaultTenant.id,
        userId: adminUser.id,
        action: 'SECURITY_UPDATE',
        resourceType: 'system',
        resourceId: 'nextjs-version',
        oldValues: { version: '15.3.5' },
        newValues: { version: '15.5.2' },
        metadata: {
          updateType: 'security_patch',
          reason: 'CVE mitigation',
          approvedBy: 'security-team',
        },
      },
      {
        tenantId: defaultTenant.id,
        userId: adminUser.id,
        action: 'SECURITY_UPDATE',
        resourceType: 'system',
        resourceId: 'eslint-config',
        oldValues: { securityLevel: 'basic' },
        newValues: { securityLevel: 'enhanced' },
        metadata: {
          updateType: 'configuration_change',
          reason: 'security_enhancement',
          approvedBy: 'security-team',
        },
      },
      {
        tenantId: defaultTenant.id,
        userId: enterpriseUser.id,
        action: 'ACCESS_GRANTED',
        resourceType: 'project',
        resourceId: enterpriseProject2.id,
        metadata: {
          permissionLevel: 'ADMIN',
          grantedBy: 'admin@optimind.ai',
          reason: 'project_assignment',
        },
      },
    ],
  });

  console.log('✅ Premium Diamond-Grade Database seeded successfully!');
  console.log('📊 Database Statistics:');
  console.log('   - Users: 3');
  console.log('   - Projects: 3');
  console.log('   - Analyses: 3');
  console.log('   - Conversations: 2');
  console.log('   - Posts: 3');
  console.log('   - Tenant Settings: 3');
  console.log('   - Tenant Users: 3');
  console.log('   - Audit Logs: 3');
  console.log('🔒 Security Features: Enabled');
  console.log('🚀 Next.js Version: 15.5.2');
  console.log('🛡️ ESLint Security: Enhanced');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });