import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding OptiMind AI Ecosystem Database...');

  // Create enterprise users with enhanced security
  const adminPassword = await hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@optimind.ai' },
    update: {},
    create: {
      email: 'admin@optimind.ai',
      name: 'Jocely P. Honore - CEO',
      role: 'ADMIN',
    },
  });

  const enterprisePassword = await hash('enterprise123', 10);
  const enterpriseUser = await prisma.user.upsert({
    where: { email: 'enterprise@optimind.ai' },
    update: {},
    create: {
      email: 'enterprise@optimind.ai',
      name: 'Enterprise Manager',
      role: 'DEVELOPER',
    },
  });

  const testPassword = await hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@optimind.ai' },
    update: {},
    create: {
      email: 'test@optimind.ai',
      name: 'Test User',
      role: 'USER',
    },
  });

  // Create enterprise projects
  const enterpriseProject1 = await prisma.project.create({
    data: {
      name: 'OptiMind AI Ecosystem - Core Platform',
      description: 'Enterprise-grade AI platform with 45+ AI tools and 35+ AI models',
      userId: adminUser.id,
    },
  });

  const enterpriseProject2 = await prisma.project.create({
    data: {
      name: 'Global AI Security Initiative',
      description: 'Military-grade AI security system with zero-trust architecture',
      userId: enterpriseUser.id,
    },
  });

  const researchProject = await prisma.project.create({
    data: {
      name: 'Neural Network Research & Development',
      description: 'Advanced neural network models for predictive analytics',
      userId: testUser.id,
    },
  });

  // Create enterprise posts
  await prisma.post.createMany({
    data: [
      {
        title: 'OptiMind AI Ecosystem: Enterprise-Grade AI Platform',
        content: '# OptiMind AI Ecosystem: The Future of Enterprise AI\n\nThe OptiMind AI Ecosystem represents the pinnacle of enterprise-grade artificial intelligence platforms.',
        published: true,
        authorId: adminUser.id,
      },
      {
        title: 'Zero-Trust Security Architecture for AI Systems',
        content: '# Implementing Zero-Trust Security in AI Ecosystems\n\nZero-trust security is no longer optional for enterprise AI systems.',
        published: true,
        authorId: enterpriseUser.id,
      },
      {
        title: 'Neural Networks and Predictive Analytics in Enterprise AI',
        content: '# Advanced Neural Networks for Enterprise Predictive Analytics\n\nExplore how advanced neural networks are revolutionizing predictive analytics.',
        published: true,
        authorId: testUser.id,
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:', {
    users: 3,
    projects: 3,
    posts: 3,
  });
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });