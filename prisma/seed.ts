import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@optimind.ai' },
    update: {},
    create: {
      email: 'admin@optimind.ai',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      apiKey: 'admin-api-key-123',
    },
  });

  // Create test user
  const testPassword = await hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@optimind.ai' },
    update: {},
    create: {
      email: 'test@optimind.ai',
      password: testPassword,
      name: 'Test User',
      role: 'USER',
      apiKey: 'test-api-key-456',
    },
  });

  // Create subscriptions
  const adminSubscription = await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  const testSubscription = await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      plan: 'PRO',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // Create sample projects
  const sampleProject1 = await prisma.project.create({
    data: {
      name: 'AI Content Optimization',
      description: 'Using AI to optimize content for better engagement',
      status: 'ACTIVE',
      userId: adminUser.id,
      metadata: {
        category: 'content',
        priority: 'high',
        tags: ['AI', 'content', 'optimization'],
      },
    },
  });

  const sampleProject2 = await prisma.project.create({
    data: {
      name: 'SEO Analysis Dashboard',
      description: 'Comprehensive SEO analysis and reporting dashboard',
      status: 'ACTIVE',
      userId: testUser.id,
      metadata: {
        category: 'analytics',
        priority: 'medium',
        tags: ['SEO', 'dashboard', 'analytics'],
      },
    },
  });

  // Create sample analyses
  await prisma.analysis.create({
    data: {
      type: 'SEO_ANALYSIS',
      input: 'Sample content for SEO analysis',
      result: {
        score: 85,
        recommendations: ['Improve meta description', 'Add more keywords'],
        keywords: ['AI', 'optimization', 'content'],
      },
      confidence: 0.92,
      status: 'COMPLETED',
      userId: adminUser.id,
      projectId: sampleProject1.id,
      model: 'gpt-4',
      processingTime: 2500,
    },
  });

  await prisma.analysis.create({
    data: {
      type: 'CONTENT_OPTIMIZATION',
      input: 'Blog post about AI trends',
      result: {
        optimizedContent: 'Optimized blog post content...',
        improvements: ['Better structure', 'Improved readability'],
        score: 78,
      },
      confidence: 0.88,
      status: 'COMPLETED',
      userId: testUser.id,
      projectId: sampleProject2.id,
      model: 'claude-3',
      processingTime: 3200,
    },
  });

  // Create sample conversation
  const sampleConversation = await prisma.conversation.create({
    data: {
      title: 'AI Assistant Chat',
      userId: testUser.id,
      metadata: {
        model: 'gpt-4',
        totalMessages: 3,
      },
    },
  });

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: sampleConversation.id,
        role: 'USER',
        content: 'Hello, can you help me with AI optimization?',
      },
      {
        conversationId: sampleConversation.id,
        role: 'ASSISTANT',
        content: 'Of course! I can help you with AI-powered optimization strategies. What specific area would you like to focus on?',
      },
      {
        conversationId: sampleConversation.id,
        role: 'USER',
        content: 'I need help with content optimization for my blog.',
      },
    ],
  });

  // Create sample posts (with unique slugs)
  await prisma.post.create({
    data: {
      title: 'Getting Started with AI Optimization',
      content: '# Getting Started with AI Optimization\n\nArtificial Intelligence is revolutionizing the way we approach content optimization...',
      excerpt: 'Learn how to leverage AI for content optimization and better engagement.',
      slug: 'getting-started-with-ai-optimization-' + Date.now(),
      published: true,
      authorId: adminUser.id,
      featured: true,
      publishedAt: new Date(),
      metadata: {
        readingTime: 5,
        tags: ['AI', 'optimization', 'content'],
        seoScore: 92,
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 2 users (admin, test)');
  console.log('  - 2 subscriptions');
  console.log('  - 2 projects');
  console.log('  - 2 analyses');
  console.log('  - 1 conversation with 3 messages');
  console.log('  - 1 blog post');
  console.log('');
  console.log('🔑 Test Credentials:');
  console.log('  Admin: admin@optimind.ai / admin123');
  console.log('  Test: test@optimind.ai / test123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });