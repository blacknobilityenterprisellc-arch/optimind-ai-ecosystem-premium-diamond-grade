import { NextResponse } from 'next/server';

/**
 * OptiMind AI Ecosystem - Database Manager API v2.0
 * Premium Diamond Grade Database Management Endpoints
 *
 * Database backup and restore operations
 */


import { databaseManagerV2 } from '@/lib/v2/database-manager';

export async function POST() {
  try {
    // Create database backup
    const backup = await databaseManagerV2.createBackup();

    return NextResponse.json({
      success: true,
      data: {
        id: backup.id,
        timestamp: backup.timestamp,
        size: backup.size,
        path: backup.path,
        status: backup.status,
        checksum: backup.checksum,
      },
      message: 'Database backup created successfully',
    });
  } catch (error) {
    console.error('Database backup creation failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to create database backup',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get backup history
    const backupHistory = databaseManagerV2.getBackupHistory();

    return NextResponse.json({
      success: true,
      data: {
        backups: backupHistory,
        total: backupHistory.length,
        lastBackup: backupHistory.length > 0 ? backupHistory[0].timestamp : null,
      },
      message: 'Backup history retrieved successfully',
    });
  } catch (error) {
    console.error('Failed to get backup history:', error);
    return NextResponse.json(
      {
        error: 'Failed to get backup history',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
