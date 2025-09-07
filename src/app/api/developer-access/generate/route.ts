/**
 * Developer Access Key Generation API Endpoint
 * Generates exclusive access keys for developers with monitoring and tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { exclusiveDeveloperAccessService } from '@/lib/exclusive-developer-access';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      keyType,
      accessLevel,
      permissions,
      allowedEndpoints,
      expiresInSeconds,
      metadata,
    } = body;

    // Validate required fields
    if (!userId || !keyType || !accessLevel || !permissions || !allowedEndpoints) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: userId, keyType, accessLevel, permissions, allowedEndpoints',
        },
        { status: 400 }
      );
    }

    // Validate key type
    const validKeyTypes = ['EXCLUSIVE', 'STANDARD', 'TEMPORARY'];
    if (!validKeyTypes.includes(keyType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid key type. Must be one of: ${validKeyTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = [
      'PUBLIC',
      'INTERNAL',
      'RESTRICTED',
      'CONFIDENTIAL',
      'SECRET',
      'TOP_SECRET',
    ];
    if (!validAccessLevels.includes(accessLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid access level. Must be one of: ${validAccessLevels.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate access key
    const result = await exclusiveDeveloperAccessService.generateAccessKey({
      userId,
      keyType,
      accessLevel,
      permissions,
      allowedEndpoints,
      expiresInSeconds,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      key: result.key,
      message: 'Developer access key generated successfully',
    });
  } catch (error) {
    console.error('Error generating developer access key:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
