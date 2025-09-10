import type { Request } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Self-Healing Integration API
 *
 * API endpoints for the OptiMind AI Self-Healing System
 * Provides automatic error detection, healing cycles, and system monitoring
 */

import { selfHealingIntegration } from '@/lib/self-healing-integration';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    // Initialize self-healing integration if not already initialized
    if (!selfHealingIntegration.getSystemStatus().selfHealing.isInitialized) {
      await selfHealingIntegration.initialize();
    }

    switch (action) {
      case 'status':
        const systemStatus = selfHealingIntegration.getSystemStatus();
        return NextResponse.json({
          success: true,
          action: 'status',
          system: 'Self-Healing Integration',
          data: systemStatus,
          timestamp: new Date().toISOString(),
        });

      case 'history':
        const healingHistory = selfHealingIntegration.getHealingHistory(20);
        return NextResponse.json({
          success: true,
          action: 'history',
          system: 'Self-Healing Integration',
          data: {
            healingReports: healingHistory,
            totalReports: healingHistory.length,
          },
          timestamp: new Date().toISOString(),
        });

      case 'monitor-health':
        const healthReport = await selfHealingIntegration.monitorSystemHealth();
        return NextResponse.json({
          success: true,
          action: 'monitor-health',
          system: 'Self-Healing Integration',
          data: healthReport,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: ['status', 'history', 'monitor-health'],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Self-Healing API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        system: 'Self-Healing Integration',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, error, issue } = body;

    // Initialize self-healing integration if not already initialized
    if (!selfHealingIntegration.getSystemStatus().selfHealing.isInitialized) {
      await selfHealingIntegration.initialize();
    }

    switch (action) {
      case 'trigger-healing':
        const healingReport = await selfHealingIntegration.triggerHealingCycle(issue);
        return NextResponse.json({
          success: true,
          action: 'trigger-healing',
          system: 'Self-Healing Integration',
          data: healingReport,
          timestamp: new Date().toISOString(),
        });

      case 'handle-error':
        if (!error) {
          return NextResponse.json(
            {
              success: false,
              error: 'Error data is required',
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        const errorReport = await selfHealingIntegration.handleSystemError(
          new Error(error.message || 'Unknown error'),
          error.context || {}
        );
        return NextResponse.json({
          success: true,
          action: 'handle-error',
          system: 'Self-Healing Integration',
          data: errorReport,
          timestamp: new Date().toISOString(),
        });

      case 'start-system':
        selfHealingIntegration.start();
        return NextResponse.json({
          success: true,
          action: 'start-system',
          system: 'Self-Healing Integration',
          message: 'Self-Healing system started successfully',
          timestamp: new Date().toISOString(),
        });

      case 'stop-system':
        selfHealingIntegration.stop();
        return NextResponse.json({
          success: true,
          action: 'stop-system',
          system: 'Self-Healing Integration',
          message: 'Self-Healing system stopped successfully',
          timestamp: new Date().toISOString(),
        });

      case 'comprehensive-healing':
        // Simulate a critical system error to trigger comprehensive healing
        const criticalError = new Error(
          'Critical system failure detected - requiring comprehensive healing'
        );
        const comprehensiveReport = await selfHealingIntegration.handleSystemError(criticalError, {
          component: 'system-core',
          operation: 'comprehensive-analysis',
          severity: 'critical',
        });
        return NextResponse.json({
          success: true,
          action: 'comprehensive-healing',
          system: 'Self-Healing Integration',
          data: comprehensiveReport,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: [
              'trigger-healing',
              'handle-error',
              'start-system',
              'stop-system',
              'comprehensive-healing',
            ],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Self-Healing API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        system: 'Self-Healing Integration',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
