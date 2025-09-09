/**
 * OptiMind AI Ecosystem - Database Manager API v2.0
 * Premium Diamond Grade Database Management Endpoints
 *
 * Database health monitoring and metrics
 */


import { DatabaseManagerV2 } from '@/lib/v2/database-manager';

export async function GET() {
  try {
    // Get database health
    const health = await DatabaseManagerV2.health();

    // Get database metrics
    const metrics = DatabaseManagerV2.getMetrics
      ? await DatabaseManagerV2.getMetrics()
      : {
          totalConnections: 0,
          activeConnections: 0,
          totalQueries: 0,
          averageQueryTime: 0,
          slowQueries: 0,
          errors: 0,
          uptime: 0,
          lastBackup: null,
          databaseSize: 0,
        };

    // Fix BigInt serialization
    const responseData = {
      success: true,
      data: {
        health: {
          status: health.status,
          connections: health.connections,
          responseTime: health.responseTime,
          errorRate: health.errorRate,
          lastCheck: health.lastCheck,
          issues: health.issues,
        },
        metrics: {
          totalConnections: metrics.totalConnections,
          activeConnections: metrics.activeConnections,
          totalQueries: metrics.totalQueries,
          averageQueryTime: metrics.averageQueryTime,
          slowQueries: metrics.slowQueries,
          errors: metrics.errors,
          uptime: Number(metrics.uptime),
          lastBackup: metrics.lastBackup,
          databaseSize: Number(metrics.databaseSize),
        },
      },
      message: 'Database health and metrics retrieved successfully',
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Failed to get database health:', error);
    return NextResponse.json(
      {
        error: 'Failed to get database health',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
