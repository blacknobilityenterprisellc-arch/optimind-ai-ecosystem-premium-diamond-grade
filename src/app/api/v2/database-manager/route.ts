/**
 * OptiMind AI Ecosystem - Database Manager API v2.0
 * Premium Diamond Grade Resumable Database Management Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import { DatabaseManagerV2 } from '@/lib/v2/database-manager';

// Create singleton instance
const dbManager = new DatabaseManagerV2();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'create_operation':
        result = await dbManager.createOperation(
          params.type,
          params.table,
          params.data,
          params.options
        );
        break;

      case 'execute_query':
        result = await dbManager.executeQuery(params.query, params.params);
        break;

      case 'execute_transaction':
        result = await dbManager.executeTransaction(params.operations);
        break;

      case 'backup_database':
        result = await dbManager.backupDatabase(params.backupPath);
        break;

      case 'restore_database':
        result = await dbManager.restoreDatabase(params.backupPath);
        break;

      case 'get_operation_status':
        result = await dbManager.getOperationStatus(params.operationId);
        break;

      case 'get_database_metrics':
        result = dbManager.getDatabaseMetrics();
        break;

      case 'health_check':
        result = await dbManager.healthCheck();
        break;

      case 'cleanup_expired_operations':
        result = await dbManager.cleanupExpiredOperations();
        break;

      case 'get_operation_history':
        result = dbManager.getOperationHistory(params.limit);
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported operation', operation },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      operation,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database Manager API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        operation: body.operation
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const health = await dbManager.healthCheck();
    const metrics = dbManager.getDatabaseMetrics();

    return NextResponse.json({
      service: 'Database Manager v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'operation_management',
        'query_execution',
        'transaction_processing',
        'backup_restore',
        'health_monitoring',
        'metrics_tracking',
        'resumable_operations'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database Manager GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}