/**
 * OptiMind AI Ecosystem - v2.0 Health Check API
 * Premium Diamond Grade Comprehensive Health Monitoring
 * 
 * Comprehensive health check for all v2.0 services
 */

import { NextRequest, NextResponse } from 'next/server';
import { quantumSecurityService } from '@/lib/v2/quantum-security-service';
import { predictiveAnalyticsService } from '@/lib/v2/predictive-analytics-service';
import { databaseManagerV2 } from '@/lib/v2/database-manager';

export async function GET(request: NextRequest) {
  try {
    // Get health status from all services
    const [quantumHealth, predictiveHealth, databaseHealth] = await Promise.all([
      quantumSecurityService.healthCheck(),
      predictiveAnalyticsService.healthCheck(),
      databaseManagerV2.getHealth()
    ]);

    // Determine overall system health
    const services = [
      { name: 'Quantum Security', health: quantumHealth.status },
      { name: 'Predictive Analytics', health: predictiveHealth.status },
      { name: 'Database Manager', health: databaseHealth.status }
    ];

    const healthyServices = services.filter(s => s.health === 'healthy').length;
    const totalServices = services.length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      overallStatus = 'healthy';
    } else if (healthyServices >= totalServices / 2) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          status: overallStatus,
          healthyServices,
          totalServices,
          timestamp: new Date()
        },
        services: {
          quantumSecurity: {
            status: quantumHealth.status,
            quantumSecurity: quantumHealth.quantumSecurity,
            serviceMetrics: quantumHealth.serviceMetrics,
            recentEvents: quantumHealth.recentEvents
          },
          predictiveAnalytics: {
            status: predictiveHealth.status,
            models: predictiveHealth.models,
            queueSize: predictiveHealth.queueSize,
            cacheSize: predictiveHealth.cacheSize,
            processing: predictiveHealth.processing,
            modelHealth: predictiveHealth.modelHealth
          },
          database: {
            status: databaseHealth.status,
            connections: databaseHealth.connections,
            responseTime: databaseHealth.responseTime,
            errorRate: databaseHealth.errorRate,
            lastCheck: databaseHealth.lastCheck,
            issues: databaseHealth.issues
          }
        },
        summary: {
          quantumKeys: quantumHealth.serviceMetrics?.activeKeys || 0,
          predictiveModels: predictiveHealth.models || 0,
          databaseQueries: databaseManagerV2.getMetrics().totalQueries,
          uptime: Date.now() - databaseManagerV2.getMetrics().uptime
        }
      },
      message: `v2.0 Health Check - System is ${overallStatus}`
    });

  } catch (error) {
    console.error('v2.0 Health check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform v2.0 health check',
        details: error.message,
        overall: {
          status: 'unhealthy',
          timestamp: new Date()
        }
      },
      { status: 500 }
    );
  }
}