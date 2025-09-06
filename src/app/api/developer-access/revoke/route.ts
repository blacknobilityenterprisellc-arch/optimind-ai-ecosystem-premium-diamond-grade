/**
 * Developer Access Key Revocation API Endpoint
 * Revokes developer access keys with audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { exclusiveDeveloperAccessService } from "@/lib/exclusive-developer-access";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { keyId, revokedBy } = body;

    // Validate required fields
    if (!keyId || !revokedBy) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: keyId, revokedBy",
        },
        { status: 400 },
      );
    }

    // Revoke access key
    const result = await exclusiveDeveloperAccessService.revokeAccessKey(
      keyId,
      revokedBy,
    );

    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error,
    });
  } catch (error) {
    console.error("Error revoking developer access key:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
