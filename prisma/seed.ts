import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Premium Diamond-Grade Database...');

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

  // Create enterprise users
  const adminPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@optimind.ai' },
    update: {},
    create: {
      email: 'admin@optimind.ai',
      password: adminPassword,
      name: 'Jocely Honore - CEO',
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

  // Create default tenant
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
    },
  });

  // Create enterprise subscriptions
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
    },
  });

  // Create enterprise projects
  const enterpriseProject1 = await prisma.project.create({
    data: {
      name: 'OptiMind AI Ecosystem - Core Platform',
      description: 'Enterprise-grade AI platform with 45+ AI tools and 35+ AI models',
      status: 'ACTIVE',
      userId: adminUser.id,
      metadata: {
        category: 'platform',
        priority: 'critical',
        tags: ['AI', 'enterprise', 'ecosystem', 'premium'],
        budget: 2500000,
        teamSize: 25,
        estimatedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const enterpriseProject2 = await prisma.project.create({
    data: {
      name: 'Global AI Security Initiative',
      description: 'Military-grade AI security system with zero-trust architecture',
      status: 'ACTIVE',
      userId: enterpriseUser.id,
      metadata: {
        category: 'security',
        priority: 'high',
        tags: ['security', 'AI', 'zero-trust', 'military-grade'],
        budget: 1500000,
        teamSize: 15,
        estimatedCompletion: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const researchProject = await prisma.project.create({
    data: {
      name: 'Neural Network Research & Development',
      description: 'Advanced neural network models for predictive analytics and machine learning',
      status: 'ACTIVE',
      userId: testUser.id,
      metadata: {
        category: 'research',
        priority: 'medium',
        tags: ['neural-network', 'ML', 'research', 'analytics'],
        budget: 500000,
        teamSize: 8,
        estimatedCompletion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    },
  });

  // Create enterprise analyses
  await prisma.analysis.createMany({
    data: [
      {
        type: 'MULTIMODAL_ANALYSIS',
        input: 'Comprehensive AI ecosystem analysis with text, image, and data processing',
        result: {
          score: 96,
          insights: ['Advanced AI integration detected', 'Multi-modal capabilities confirmed', 'Enterprise-grade architecture'],
          recommendations: ['Implement real-time processing', 'Add neural network support', 'Enhance security protocols'],
          aiModels: ['GLM-4.5', 'GPT-4', 'Claude-3', 'Llama-3'],
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
        },
      },
      {
        type: 'DATA_ANALYSIS',
        input: 'Zero-trust security architecture evaluation and vulnerability assessment',
        result: {
          score: 94,
          securityLevel: 'military-grade',
          vulnerabilities: ['Minor configuration issues', 'Update needed for encryption protocols'],
          recommendations: ['Implement quantum encryption', 'Add biometric authentication', 'Enhance audit trails'],
          compliance: ['SOC2', 'GDPR', 'ISO27001', 'HIPAA'],
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
        },
      },
    ],
  });

  // Create enterprise conversations
  const enterpriseConversation1 = await prisma.conversation.create({
    data: {
      title: 'Enterprise AI Strategy Planning',
      userId: adminUser.id,
      metadata: {
        model: 'GLM-4.5',
        totalMessages: 8,
        category: 'strategic',
        priority: 'high',
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
      },
    },
  });

  // Create enterprise messages
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
        content: 'For a comprehensive enterprise AI strategy, you should focus on: 1) Multi-model AI integration (GLM-4.5, GPT-4, Claude-3), 2) Zero-trust security architecture, 3) Scalable infrastructure, 4) Real-time processing capabilities, 5) Advanced analytics and predictive modeling, 6) Enterprise-grade compliance and governance.',
      },
      {
        conversationId: enterpriseConversation1.id,
        role: 'USER',
        content: 'Excellent! How do we implement zero-trust security in our AI ecosystem?',
      },
      {
        conversationId: enterpriseConversation1.id,
        role: 'ASSISTANT',
        content: 'Zero-trust security implementation requires: 1) Continuous authentication and authorization, 2) Micro-segmentation of AI services, 3) Real-time threat detection, 4) Comprehensive audit trails, 5) Military-grade encryption for all data, 6) Biometric authentication for critical operations, 7) Regular security assessments and penetration testing.',
      },
      {
        conversationId: enterpriseConversation2.id,
        role: 'USER',
        content: 'What are the best practices for implementing quantum-resistant encryption in our AI security protocols?',
      },
      {
        conversationId: enterpriseConversation2.id,
        role: 'ASSISTANT',
        content: 'Quantum-resistant encryption best practices include: 1) Implementing lattice-based cryptography, 2) Using hash-based signatures, 3) Deploying post-quantum key exchange protocols, 4) Regular cryptographic agility updates, 5) Hybrid encryption schemes, 6) Continuous monitoring for quantum computing threats, 7) Collaboration with quantum security research communities.',
      },
    ],
  });

  // Create enterprise posts with unique slugs
  await prisma.post.createMany({
    data: [
      {
        title: 'OptiMind AI Ecosystem: Enterprise-Grade AI Platform',
        content: '# OptiMind AI Ecosystem: The Future of Enterprise AI\n\nThe OptiMind AI Ecosystem represents the pinnacle of enterprise-grade artificial intelligence platforms, combining 45+ AI tools and 35+ advanced AI models into a unified, production-ready solution.',
        excerpt: 'Discover the most comprehensive enterprise AI ecosystem with 45+ AI tools and military-grade security.',
        slug: 'optimind-ai-ecosystem-enterprise-grade-' + Date.now(),
        published: true,
        authorId: adminUser.id,
        featured: true,
        publishedAt: new Date(),
        metadata: {
          readingTime: 8,
          tags: ['AI', 'enterprise', 'ecosystem', 'premium'],
          seoScore: 98,
          views: 15420,
          shares: 342,
        },
      },
      {
        title: 'Zero-Trust Security Architecture for AI Systems',
        content: '# Implementing Zero-Trust Security in AI Ecosystems\n\nZero-trust security is no longer optional for enterprise AI systems. This comprehensive guide covers military-grade security protocols for AI platforms.',
        excerpt: 'Learn how to implement military-grade zero-trust security in your AI ecosystem with comprehensive protocols.',
        slug: 'zero-trust-security-ai-architecture-' + Date.now(),
        published: true,
        authorId: enterpriseUser.id,
        featured: true,
        publishedAt: new Date(),
        metadata: {
          readingTime: 12,
          tags: ['security', 'zero-trust', 'AI', 'military-grade'],
          seoScore: 96,
          views: 8934,
          shares: 198,
        },
      },
      {
        title: 'Neural Networks and Predictive Analytics in Enterprise AI',
        content: '# Advanced Neural Networks for Enterprise Predictive Analytics\n\nExplore how advanced neural networks are revolutionizing predictive analytics in enterprise environments with real-time processing capabilities.',
        excerpt: 'Discover how neural networks are transforming enterprise predictive analytics with real-time processing.',
        slug: 'neural-networks-predictive-analytics-enterprise-' + Date.now(),
        published: true,
        authorId: testUser.id,
        featured: false,
        publishedAt: new Date(),
        metadata: {
          readingTime: 10,
          tags: ['neural-networks', 'predictive-analytics', 'AI', 'enterprise'],
          seoScore: 92,
          views: 6543,
          shares: 127,
        },
      },
    ],
  });

  // Create Zero-Trust Security entities
  await prisma.securityPolicy.upsert({
    where: { name: 'Enterprise Access Control Policy' },
    update: {},
    create: {
      name: 'Enterprise Access Control Policy',
      description: 'Comprehensive access control policy for enterprise AI systems',
      type: 'ACCESS_CONTROL',
      rules: {
        authentication: ['multi-factor', 'biometric', 'continuous'],
        authorization: ['role-based', 'attribute-based', 'policy-based'],
        encryption: ['aes-256', 'quantum-resistant', 'end-to-end'],
      },
      priority: 10,
      isActive: true,
    },
  });

  await prisma.securityPolicy.upsert({
    where: { name: 'Data Protection Policy' },
    update: {},
    create: {
      name: 'Data Protection Policy',
      description: 'Military-grade data protection for AI systems',
      type: 'DATA_PROTECTION',
      rules: {
        classification: ['public', 'internal', 'confidential', 'secret', 'top-secret'],
        encryption: ['at-rest', 'in-transit', 'in-use'],
        retention: ['automated', 'compliant', 'auditable'],
      },
      priority: 9,
      isActive: true,
    },
  });

  // Create access controls
  await prisma.accessControl.createMany({
    data: [
      {
        userId: adminUser.id,
        resourceType: 'project',
        resourceId: enterpriseProject1.id,
        permission: 'OWNER',
        grantedBy: 'system',
        conditions: {
          timeRestriction: '24/7',
          locationRestriction: 'any',
          deviceRestriction: 'trusted-devices',
        },
      },
      {
        userId: enterpriseUser.id,
        resourceType: 'project',
        resourceId: enterpriseProject2.id,
        permission: 'ADMIN',
        grantedBy: adminUser.id,
        conditions: {
          timeRestriction: 'business-hours',
          locationRestriction: 'corporate-network',
        },
      },
      {
        userId: testUser.id,
        resourceType: 'project',
        resourceId: researchProject.id,
        permission: 'WRITE',
        grantedBy: enterpriseUser.id,
        conditions: {
          timeRestriction: 'business-hours',
          approvalRequired: true,
        },
      },
    ],
  });

  // Create security incidents
  await prisma.securityIncident.create({
    data: {
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'MEDIUM',
      title: 'Suspicious Login Attempt Detected',
      description: 'Multiple failed login attempts detected from unusual IP address',
      affectedUsers: [testUser.id],
      affectedResources: ['authentication-system'],
      status: 'OPEN',
      assignedTo: enterpriseUser.id,
      metadata: {
        ipAddress: '192.168.1.100',
        attemptCount: 15,
        timeWindow: '5 minutes',
      },
    },
  });

  // Create predictive models
  const predictiveModel = await prisma.predictiveModel.create({
    data: {
      name: 'Enterprise AI Performance Predictor',
      type: 'NEURAL_NETWORK',
      version: '1.0.0',
      description: 'Advanced neural network for predicting AI system performance and optimization opportunities',
      trainingData: {
        datasetSize: 100000,
        features: ['cpu_usage', 'memory_usage', 'response_time', 'error_rate', 'user_load'],
        target: 'performance_score',
      },
      hyperparameters: {
        layers: [128, 64, 32, 16],
        activation: 'relu',
        optimizer: 'adam',
        learningRate: 0.001,
        epochs: 200,
      },
      performance: {
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.93,
        f1Score: 0.925,
      },
      status: 'DEPLOYED',
      accuracy: 0.94,
    },
  });

  // Create predictions
  await prisma.prediction.create({
    data: {
      modelId: predictiveModel.id,
      inputData: {
        cpu_usage: 75,
        memory_usage: 82,
        response_time: 150,
        error_rate: 0.02,
        user_load: 1200,
      },
      outputData: {
        performance_score: 87,
        optimization_needed: true,
        recommendations: [
          'Scale up CPU resources',
          'Optimize memory allocation',
          'Implement caching mechanisms',
        ],
        confidence_interval: [85, 89],
      },
      confidence: 0.94,
      predictionType: 'REGRESSION',
      userId: adminUser.id,
      projectId: enterpriseProject1.id,
      metadata: {
        predictionTime: 450,
        modelVersion: '1.0.0',
        dataFreshness: 'real-time',
      },
    },
  });

  // Create performance logs
  await prisma.performanceLog.createMany({
    data: [
      {
        endpoint: '/api/models/glm-45-flagship',
        method: 'POST',
        responseTime: 450,
        statusCode: 200,
        userId: adminUser.id,
        metadata: {
          model: 'GLM-4.5',
          inputTokens: 150,
          outputTokens: 300,
        },
      },
      {
        endpoint: '/api/security/analyze',
        method: 'POST',
        responseTime: 280,
        statusCode: 200,
        userId: enterpriseUser.id,
        metadata: {
          analysisType: 'vulnerability-scan',
          resourcesScanned: 45,
        },
      },
      {
        endpoint: '/api/analytics/performance',
        method: 'GET',
        responseTime: 120,
        statusCode: 200,
        userId: testUser.id,
        metadata: {
          timeRange: '24h',
          metricsCount: 15,
        },
      },
    ],
  });

  // Create system health metrics
  await prisma.systemHealth.createMany({
    data: [
      {
        metric: 'cpu_usage',
        value: 45.2,
        threshold: 80.0,
        status: 'HEALTHY',
        component: 'main-server',
        metadata: {
          cores: 8,
          loadAverage: [1.2, 1.5, 1.8],
        },
      },
      {
        metric: 'memory_usage',
        value: 67.8,
        threshold: 85.0,
        status: 'HEALTHY',
        component: 'main-server',
        metadata: {
          totalMemory: 16384,
          availableMemory: 5276,
        },
      },
      {
        metric: 'response_time',
        value: 125.5,
        threshold: 500.0,
        status: 'HEALTHY',
        component: 'api-gateway',
        metadata: {
          p95: 180,
          p99: 350,
        },
      },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: adminUser.id,
        type: 'EMAIL',
        title: 'Enterprise System Health Report',
        message: 'All systems are operating within normal parameters. Performance metrics show excellent results.',
        status: 'UNREAD',
        priority: 'MEDIUM',
        scheduledAt: new Date(),
        metadata: {
          category: 'system-health',
          severity: 'normal',
        },
      },
      {
        userId: enterpriseUser.id,
        type: 'IN_APP',
        title: 'Security Alert: Incident Assigned',
        message: 'A new security incident has been assigned to you for investigation.',
        status: 'UNREAD',
        priority: 'HIGH',
        scheduledAt: new Date(),
        metadata: {
          incidentId: '1',
          severity: 'medium',
        },
      },
      {
        userId: testUser.id,
        type: 'PUSH',
        title: 'Model Training Complete',
        message: 'Your neural network model has completed training with 94% accuracy.',
        status: 'READ',
        priority: 'MEDIUM',
        sentAt: new Date(),
        readAt: new Date(),
        metadata: {
          modelId: '1',
          accuracy: 0.94,
          trainingTime: 6800,
        },
      },
    ],
  });

  // Create usage metrics
  await prisma.usageMetric.createMany({
    data: [
      {
        subscriptionId: adminSubscription.id,
        metricName: 'api_calls',
        metricValue: 15420,
        period: 'monthly',
        metadata: {
          endpoints: ['glm-45-flagship', 'security-analysis', 'predictive-modeling'],
        },
      },
      {
        subscriptionId: enterpriseSubscription.id,
        metricName: 'ai_model_usage',
        metricValue: 8934,
        period: 'monthly',
        metadata: {
          models: ['gpt-4', 'claude-3', 'llama-3'],
        },
      },
      {
        subscriptionId: testSubscription.id,
        metricName: 'storage_usage',
        metricValue: 2048,
        period: 'monthly',
        metadata: {
          type: 'model-data',
          unit: 'MB',
        },
      },
    ],
  });

  console.log('✅ Premium Diamond-Grade Database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 3 users (admin, enterprise, test)');
  console.log('  - 3 enterprise subscriptions');
  console.log('  - 3 strategic projects');
  console.log('  - 3 advanced analyses');
  console.log('  - 2 enterprise conversations with 6 messages');
  console.log('  - 3 premium blog posts');
  console.log('  - 2 security policies');
  console.log('  - 3 access controls');
  console.log('  - 1 security incident');
  console.log('  - 1 predictive model');
  console.log('  - 1 prediction');
  console.log('  - 3 performance logs');
  console.log('  - 3 system health metrics');
  console.log('  - 3 notifications');
  console.log('  - 3 usage metrics');
  console.log('');
  console.log('🔑 Test Credentials:');
  console.log('  Admin: admin@optimind.ai / admin123');
  console.log('  Enterprise: enterprise@optimind.ai / enterprise123');
  console.log('  Test: test@optimind.ai / test123');
  console.log('');
  console.log('🚀 Premium Diamond-Grade Features Enabled:');
  console.log('  ✅ Zero-Trust Security Architecture');
  console.log('  ✅ Advanced Predictive Analytics');
  console.log('  ✅ Enterprise-Grade Performance Monitoring');
  console.log('  ✅ Comprehensive Audit Trails');
  console.log('  ✅ Military-Grade Security Protocols');
  console.log('  ✅ Neural Network Support');
  console.log('  ✅ Real-time Processing Capabilities');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });