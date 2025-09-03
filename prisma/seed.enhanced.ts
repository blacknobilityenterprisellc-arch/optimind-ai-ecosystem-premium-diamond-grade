import { PrismaClient, TaskType, FileStatus, SecurityEventType, UsageStatus, EventSeverity, AuditAction } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Enhanced Premium Diamond-Grade Database with GLM-4.5 Integration...');

  // Create enhanced AI service configurations
  const glmConfig = await prisma.aIServiceConfig.upsert({
    where: { 
      tenantId_name: {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        name: 'GLM-4.5 Flagship'
      }
    },
    update: {},
    create: {
      tenantId: 'cmf3w3no40003otkl666x8ujd',
      name: 'GLM-4.5 Flagship',
      provider: 'Z_AI',
      model: 'GLM-4.5',
      modelType: 'LANGUAGE',
      taskTypes: JSON.stringify(['GENERAL', 'TEXT_ANALYSIS', 'CODE_GENERATION', 'RESEARCH', 'CREATIVE_WRITING']),
      configuration: {
        temperature: 0.7,
        maxTokens: 4000,
        topP: 1.0,
        features: ['reasoning', 'code-generation', 'multilingual']
      },
      maxTokens: 4000,
      temperature: 0.7,
      topP: 1.0,
      enabled: true,
      priority: 10,
      metadata: {
        version: '4.5',
        capabilities: ['advanced-reasoning', 'code-generation', 'multilingual-support'],
        securityLevel: 'enterprise-grade'
      },
    },
  });

  const glmVisionConfig = await prisma.aIServiceConfig.upsert({
    where: { 
      tenantId_name: {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        name: 'GLM-4.5V Vision'
      }
    },
    update: {},
    create: {
      tenantId: 'cmf3w3no40003otkl666x8ujd',
      name: 'GLM-4.5V Vision',
      provider: 'Z_AI',
      model: 'GLM-4.5V',
      modelType: 'VISION',
      taskTypes: JSON.stringify(['IMAGE_GENERATION', 'IMAGE_ANALYSIS', 'MULTIMODAL_ANALYSIS']),
      configuration: {
        temperature: 0.3,
        maxTokens: 2000,
        enableSaliency: true,
        features: ['image-analysis', 'object-detection', 'scene-understanding']
      },
      maxTokens: 2000,
      temperature: 0.3,
      topP: 1.0,
      enabled: true,
      priority: 9,
      metadata: {
        version: '4.5V',
        capabilities: ['vision-analysis', 'object-detection', 'scene-understanding'],
        securityLevel: 'enterprise-grade'
      },
    },
  });

  const glmAirConfig = await prisma.aIServiceConfig.upsert({
    where: { 
      tenantId_name: {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        name: 'GLM-4.5-AIR Advanced'
      }
    },
    update: {},
    create: {
      tenantId: 'cmf3w3no40003otkl666x8ujd',
      name: 'GLM-4.5-AIR Advanced',
      provider: 'Z_AI',
      model: 'GLM-4.5-AIR',
      modelType: 'REASONING',
      taskTypes: JSON.stringify(['RESEARCH', 'DATA_ANALYSIS', 'DOCUMENT_PROCESSING', 'REASONING']),
      configuration: {
        temperature: 0.1,
        maxTokens: 6000,
        enableMultiStepReasoning: true,
        enableRelationshipAnalysis: true,
        features: ['advanced-reasoning', 'relationship-analysis', 'multi-step-processing']
      },
      maxTokens: 6000,
      temperature: 0.1,
      topP: 1.0,
      enabled: true,
      priority: 8,
      metadata: {
        version: '4.5-AIR',
        capabilities: ['advanced-reasoning', 'relationship-analysis', 'multi-step-processing'],
        securityLevel: 'enterprise-grade'
      },
    },
  });

  // Create sample AI request logs
  await prisma.aIRequestLog.createMany({
    data: [
      {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        userId: 'cmf24ulin0000nlrgkontt9it',
        serviceConfigId: glmConfig.id,
        requestType: TaskType.GENERAL,
        input: 'Analyze the enterprise AI ecosystem architecture and provide optimization recommendations',
        output: {
          response: 'The enterprise AI ecosystem demonstrates sophisticated architecture with multi-model integration...',
          confidence: 0.95,
          recommendations: ['Implement real-time processing', 'Enhance security protocols', 'Optimize model routing']
        },
        tokensUsed: 1250,
        processingTime: 3200,
        cost: 0.025,
        status: UsageStatus.COMPLETED,
        metadata: {
          model: 'GLM-4.5',
          timestamp: new Date().toISOString(),
          requestId: 'req_001'
        },
      },
      {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        userId: 'cmf3w3nle0001otkllnqi801f',
        serviceConfigId: glmVisionConfig.id,
        requestType: TaskType.IMAGE_GENERATION,
        input: 'Analyze uploaded enterprise security dashboard screenshot for vulnerabilities',
        output: {
          response: 'Security dashboard analysis complete. No critical vulnerabilities detected...',
          confidence: 0.92,
          securityScore: 94,
          findings: ['Minor configuration recommendations', 'Access control optimization suggested']
        },
        tokensUsed: 890,
        processingTime: 2100,
        cost: 0.018,
        status: UsageStatus.COMPLETED,
        metadata: {
          model: 'GLM-4.5V',
          timestamp: new Date().toISOString(),
          requestId: 'req_002'
        },
      },
      {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        userId: 'cmf24ulin0000nlrgkontt9it',
        serviceConfigId: glmAirConfig.id,
        requestType: TaskType.RESEARCH,
        input: 'Conduct comprehensive analysis of zero-trust security implementation best practices',
        output: {
          response: 'Comprehensive zero-trust security analysis completed with detailed recommendations...',
          confidence: 0.97,
          analysisDepth: 'comprehensive',
          keyFindings: ['Continuous authentication required', 'Micro-segmentation critical', 'Real-time monitoring essential'],
          recommendations: ['Implement biometric authentication', 'Deploy advanced threat detection', 'Establish comprehensive audit trails']
        },
        tokensUsed: 2100,
        processingTime: 5800,
        cost: 0.042,
        status: UsageStatus.COMPLETED,
        metadata: {
          model: 'GLM-4.5-AIR',
          timestamp: new Date().toISOString(),
          requestId: 'req_003'
        },
      },
    ],
  });

  // Create sample file storage entries
  await prisma.fileStorage.createMany({
    data: [
      {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        userId: 'cmf24ulin0000nlrgkontt9it',
        filename: 'enterprise-architecture.pdf',
        originalName: 'Enterprise AI Architecture Blueprint.pdf',
        path: '/uploads/enterprise/enterprise-architecture.pdf',
        size: 2048576, // 2MB
        mimeType: 'application/pdf',
        checksum: 'sha256:abc123...',
        status: FileStatus.ACTIVE,
        encryptionKey: 'encrypted_key_123',
        metadata: {
          category: 'documentation',
          sensitivity: 'confidential',
          accessLevel: 'admin',
          uploadDate: new Date().toISOString(),
          tags: ['architecture', 'enterprise', 'AI', 'blueprint']
        },
        accessCount: 15,
        lastAccessedAt: new Date(),
      },
      {
        tenantId: 'cmf3w3no40003otkl666x8ujd',
        userId: 'cmf3w3nle0001otkllnqi801f',
        filename: 'security-dashboard.png',
        originalName: 'Security Dashboard Screenshot.png',
        path: '/uploads/security/security-dashboard.png',
        size: 1048576, // 1MB
        mimeType: 'image/png',
        checksum: 'sha256:def456...',
        status: FileStatus.ACTIVE,
        metadata: {
          category: 'security',
          sensitivity: 'internal',
          accessLevel: 'user',
          uploadDate: new Date().toISOString(),
          tags: ['security', 'dashboard', 'monitoring', 'enterprise']
        },
        accessCount: 8,
        lastAccessedAt: new Date(),
      },
    ],
  });

  console.log('✅ Enhanced database seeding completed successfully!');
  console.log('📊 Seeded Data Summary:');
  console.log(`   - AI Service Configs: 3 (GLM-4.5, GLM-4.5V, GLM-4.5-AIR)`);
  console.log(`   - AI Request Logs: 3 sample entries`);
  console.log(`   - File Storage: 2 sample files`);
  console.log(`   - Security Audit Logs: Skipped (requires AccessControl records)`);
  console.log('🚀 Premium Diamond-Grade Database with GLM-4.5 Integration is ready!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });