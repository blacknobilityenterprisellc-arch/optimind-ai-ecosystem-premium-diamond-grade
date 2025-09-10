import { NextResponse } from 'next/server';

/**
 * Developer Access Key Validation API Endpoint
 * Validates developer access keys and returns access permissions
 */

import { exclusiveDeveloperAccessService } from '@/lib/exclusive-developer-access';

export async function POST() {
  try {
    const body = await request.json();

    const { keyId, endpoint, method, ipAddress, userAgent } = body;

    // Validate required fields
    if (!keyId || !endpoint || !method || !ipAddress || !userAgent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: keyId, endpoint, method, ipAddress, userAgent',
        },
        { status: 400 }
      );
    }

    // Validate access key
    const result = await exclusiveDeveloperAccessService.validateAccessKey(keyId, {
      endpoint,
      method,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      validation: result,
    });
  } catch (error) {
    console.error('Error validating developer access key:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
