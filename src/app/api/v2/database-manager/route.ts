/**
 * OptiMind AI Ecosystem - Database Manager API v2.0
 * Premium Diamond Grade Database Management Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { databaseManagerV2, type DatabaseConfig } from '@/lib/v2/database-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    // Validate required fields
    if (!operation) {
      return NextResponse.json(
        { error: 'Operation is required' },
        { status: 400 }
      );
    }

    // Execute database management operation
    let result;

    switch (operation) {
      case 'health':
        result = await databaseManagerV2.performHealthCheck();
        break;

      case 'metrics':
        result = await databaseManagerV2.getMetrics();
        break;

      case 'optimize':
        result = await databaseManagerV2.optimizeDatabase();
        break;

      case 'backup':
        const backupResult = await databaseManagerV2.createBackup(params.type, params.options);
        result = { backup: backupResult };
        break;

      case 'cleanup':
        const cleanupResult = await databaseManagerV2.cleanup(params.options);
        result = cleanupResult;
        break;

      case 'create_work':
        const work = await databaseManagerV2.createResumableWork(
          params.type,
          params.totalItems,
          params.metadata
        );
        result = { work };
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported operation: ${operation}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      operation,
      result,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Database Manager API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');

    // Handle different GET operations
    switch (operation) {
      case 'health':
        const health = await databaseManagerV2.performHealthCheck();
        return NextResponse.json({
          success: true,
          operation: 'health',
          result: health,
          timestamp: new Date()
        });

      case 'metrics':
        const metrics = await databaseManagerV2.getMetrics();
        return NextResponse.json({
          success: true,
          operation: 'metrics',
          result: metrics,
          timestamp: new Date()
        });

      case 'backups':
        // Get list of backups (simplified)
        const backups = await databaseManagerV2.createBackup('full'); // This would normally list existing backups
        return NextResponse.json({
          success: true,
          operation: 'backups',
          result: { backups: [] }, // Placeholder
          timestamp: new Date()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid operation. Use: health, metrics, or backups' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Database Manager API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}