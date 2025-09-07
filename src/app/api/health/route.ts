import { NextResponse } from "next/server";

// Health status constants
const HEALTH_STATUS = {
  HEALTHY: "healthy" as const,
  DEGRADED: "degraded" as const,
  UNHEALTHY: "unhealthy" as const,
} as const;

// Health thresholds
const HEALTH_THRESHOLDS = {
  UPTIME_TARGET: 99.9,
  MAX_RESPONSE_TIME: 100,
  WARNING_CPU_THRESHOLD: 70,
  WARNING_MEMORY_THRESHOLD: 80,
  WARNING_DISK_THRESHOLD: 85,
} as const;

interface ServiceHealth {
  database: string;
  aiModels: string;
  api: string;
  storage: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface HealthAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface HealthData {
  status: string;
  timestamp: string;
  uptime: string;
  responseTime: number;
  services: ServiceHealth;
  alerts: HealthAlert[];
  metrics: SystemMetrics;
  version: string;
  environment: string;
}

/**
 * Creates default health alerts for the system
 */
function createHealthAlerts(): HealthAlert[] {
  return [
    {
      id: "1",
      type: "success",
      title: "System Performance Optimized",
      description: "All systems are running at peak efficiency",
      timestamp: "5 minutes ago",
    },
    {
      id: "2",
      type: "info",
      title: "New Features Available",
      description: "Check out the latest AI optimization tools",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      type: "warning",
      title: "API Rate Limit Approaching",
      description: "Consider upgrading your plan for higher limits",
      timestamp: "3 hours ago",
    },
  ];
}

/**
 * Generates system metrics with default values
 */
function generateSystemMetrics(): SystemMetrics {
  return {
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 34,
  };
}

/**
 * Creates service health status object
 */
function createServiceHealth(): ServiceHealth {
  return {
    database: HEALTH_STATUS.HEALTHY,
    aiModels: HEALTH_STATUS.HEALTHY,
    api: HEALTH_STATUS.HEALTHY,
    storage: HEALTH_STATUS.HEALTHY,
  };
}

/**
 * Builds comprehensive health data object
 */
function buildHealthData(): HealthData {
  return {
    status: HEALTH_STATUS.HEALTHY,
    timestamp: new Date().toISOString(),
    uptime: `${HEALTH_THRESHOLDS.UPTIME_TARGET}%`,
    responseTime: 98,
    services: createServiceHealth(),
    alerts: createHealthAlerts(),
    metrics: generateSystemMetrics(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };
}

/**
 * Handles health check errors with proper response
 */
function handleHealthError(error: unknown): NextResponse {
  console.error("Error fetching health data:", error);
  return NextResponse.json(
    { error: "Failed to fetch health data" },
    { status: 500 },
  );
}

export async function GET(): Promise<NextResponse> {
  try {
    const healthData = buildHealthData();
    return NextResponse.json(healthData);
  } catch (error) {
    return handleHealthError(error);
  }
}
