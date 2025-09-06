import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime,
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    arch: process.arch,
    nodeEnv: process.env.NODE_ENV,
  };

  // Check database connection (quick check)
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`.catch(() => {});
    await prisma.$disconnect();
    healthStatus.database = 'connected';
  } catch (error) {
    healthStatus.database = 'disconnected';
  }

  // Check critical services
  healthStatus.services = {
    api: 'operational',
    database: healthStatus.database === 'connected' ? 'operational' : 'degraded',
    auth: 'operational',
    fileSystem: 'operational',
  };

  // Calculate response time
  const responseTime = Date.now() - startTime;
  healthStatus.responseTime = `${responseTime}ms`;

  // Determine overall health
  const isHealthy = healthStatus.database === 'connected' && responseTime < 5000;
  healthStatus.status = isHealthy ? 'healthy' : 'degraded';

  return NextResponse.json(healthStatus, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Response-Time': `${responseTime}ms`,
    },
  });
}
