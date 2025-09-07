/**
 * Premium Diamond-Grade Scanner API
 *
 * API endpoints for the OptiMind AI Premium Diamond-Grade Scanner
 * Provides automatic issue detection, scanning, and fixing capabilities
 */

import { NextRequest, NextResponse } from "next/server";
import { premiumDiamondGradeScanner } from "@/lib/premium-diamond-grade-scanner";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";

    // Initialize scanner if not already initialized
    if (!premiumDiamondGradeScanner.getActiveScans().length) {
      await premiumDiamondGradeScanner.initialize();
    }

    switch (action) {
      case "status":
        const activeScans = premiumDiamondGradeScanner.getActiveScans();
        const scanHistory = premiumDiamondGradeScanner.getScanHistory();

        return NextResponse.json({
          success: true,
          action: "status",
          scanner: "Premium Diamond-Grade",
          data: {
            activeScans: activeScans.length,
            scanHistory: scanHistory.length,
            latestScan: scanHistory[scanHistory.length - 1] || null,
            activeScanDetails: activeScans,
          },
          timestamp: new Date().toISOString(),
        });

      case "history":
        const history = premiumDiamondGradeScanner.getScanHistory(20);
        return NextResponse.json({
          success: true,
          action: "history",
          scanner: "Premium Diamond-Grade",
          data: {
            scans: history,
            totalScans: history.length,
          },
          timestamp: new Date().toISOString(),
        });

      case "trigger-scan":
        // Simulate an issue to trigger a scan
        const mockIssue = {
          id: `manual_${Date.now()}`,
          type: "manual-trigger",
          severity: "high" as const,
          component: "system",
          description: "Manually triggered scan for system health assessment",
          detectedAt: new Date(),
          autoFixable: true,
          fixApplied: false,
        };

        const scanResult =
          await premiumDiamondGradeScanner.triggerScan(mockIssue);
        return NextResponse.json({
          success: true,
          action: "trigger-scan",
          scanner: "Premium Diamond-Grade",
          data: scanResult,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
            availableActions: ["status", "history", "trigger-scan"],
            timestamp: new Date().toISOString(),
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Premium Scanner API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        scanner: "Premium Diamond-Grade",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, issue } = body;

    // Initialize scanner if not already initialized
    if (!premiumDiamondGradeScanner.getActiveScans().length) {
      await premiumDiamondGradeScanner.initialize();
    }

    switch (action) {
      case "report-issue":
        if (!issue) {
          return NextResponse.json(
            {
              success: false,
              error: "Issue data is required",
              timestamp: new Date().toISOString(),
            },
            { status: 400 },
          );
        }

        const scanResult = await premiumDiamondGradeScanner.triggerScan(issue);
        return NextResponse.json({
          success: true,
          action: "report-issue",
          scanner: "Premium Diamond-Grade",
          data: scanResult,
          timestamp: new Date().toISOString(),
        });

      case "start-scanner":
        premiumDiamondGradeScanner.start();
        return NextResponse.json({
          success: true,
          action: "start-scanner",
          scanner: "Premium Diamond-Grade",
          message: "Scanner started successfully",
          timestamp: new Date().toISOString(),
        });

      case "stop-scanner":
        premiumDiamondGradeScanner.stop();
        return NextResponse.json({
          success: true,
          action: "stop-scanner",
          scanner: "Premium Diamond-Grade",
          message: "Scanner stopped successfully",
          timestamp: new Date().toISOString(),
        });

      case "comprehensive-scan":
        // Run a comprehensive scan with multiple simulated issues
        const comprehensiveIssue = {
          id: `comprehensive_${Date.now()}`,
          type: "comprehensive-assessment",
          severity: "critical" as const,
          component: "system",
          description: "Comprehensive system assessment for all components",
          detectedAt: new Date(),
          autoFixable: true,
          fixApplied: false,
        };

        const comprehensiveResult =
          await premiumDiamondGradeScanner.triggerScan(comprehensiveIssue);
        return NextResponse.json({
          success: true,
          action: "comprehensive-scan",
          scanner: "Premium Diamond-Grade",
          data: comprehensiveResult,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
            availableActions: [
              "report-issue",
              "start-scanner",
              "stop-scanner",
              "comprehensive-scan",
            ],
            timestamp: new Date().toISOString(),
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Premium Scanner API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        scanner: "Premium Diamond-Grade",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
