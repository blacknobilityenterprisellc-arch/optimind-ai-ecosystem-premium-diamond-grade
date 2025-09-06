/**
 * OptiMind AI Ecosystem - Database Manager API v2.0
 * Premium Diamond Grade Database Management Endpoints
 *
 * Database health monitoring and metrics
 */

import { NextRequest, NextResponse } from "next/server";

import { databaseManagerV2 } from "@/lib/v2/database-manager";

export async function GET(request: NextRequest) {
  try {
    // Get database health
    const health = await databaseManagerV2.getHealth();

    // Get database metrics
    const metrics = databaseManagerV2.getMetrics();

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
      message: "Database health and metrics retrieved successfully",
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Failed to get database health:", error);
    return NextResponse.json(
      {
        error: "Failed to get database health",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
