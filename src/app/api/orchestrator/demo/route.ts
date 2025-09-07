/**
 * API endpoint for demonstrating the Agent Orchestrator System
 *
 * This endpoint provides a web interface to test and monitor
 * the enhanced agent coordination system.
 */
import { NextRequest, NextResponse } from "next/server";
import { OrchestratorDemo } from "@/lib/orchestration/demo";

// Global demo instance
let demoInstance: OrchestratorDemo | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "start":
        if (demoInstance) {
          return NextResponse.json(
            { error: "Demo already running" },
            { status: 400 },
          );
        }

        demoInstance = new OrchestratorDemo();
        // Start demo in background
        demoInstance.start().catch(console.error);

        return NextResponse.json({
          message: "Demo started successfully",
          status: "running",
        });

      case "stop":
        if (!demoInstance) {
          return NextResponse.json(
            { error: "No demo running" },
            { status: 400 },
          );
        }

        await demoInstance.stop();
        demoInstance = null;

        return NextResponse.json({
          message: "Demo stopped successfully",
          status: "stopped",
        });

      case "status":
        const isRunning = demoInstance !== null;
        return NextResponse.json({
          running: isRunning,
          message: isRunning ? "Demo is running" : "No demo running",
        });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Orchestrator demo API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const isRunning = demoInstance !== null;

    return NextResponse.json({
      orchestrator: {
        status: isRunning ? "running" : "stopped",
        version: "1.0.0",
        capabilities: [
          "Dynamic Load Balancing",
          "Fault Tolerance",
          "Task Dependencies",
          "Real-time Monitoring",
          "Performance Optimization",
        ],
        agents: [
          "Text Generation Agent",
          "Data Analysis Agent",
          "Web Search Agent",
        ],
        features: [
          "Multi-agent coordination",
          "Intelligent task distribution",
          "Automatic failover",
          "Performance metrics",
          "Health monitoring",
        ],
      },
    });
  } catch (error) {
    console.error("Orchestrator info API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
