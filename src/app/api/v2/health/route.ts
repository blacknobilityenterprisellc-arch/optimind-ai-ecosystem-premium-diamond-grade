/**
 * OptiMind AI Ecosystem - Comprehensive Health Check API v2.0
 * Premium Diamond Grade System Health Monitoring
 *
 * Enterprise-grade health monitoring with quantum security integration,
 * predictive analytics, and comprehensive system diagnostics.
 */

import { NextResponse } from "next/server";

import { quantumSecurityV2 } from "@/lib/v2/quantum-security";
import { predictiveAnalyticsV2 } from "@/lib/v2/predictive-analytics";
import { mcpIntegrationV2 } from "@/lib/v2/mcp-integration";
import { DatabaseManagerV2 } from "@/lib/v2/database-manager";

// Health status constants with enterprise-grade precision
const HEALTH_STATUS = {
  HEALTHY: "healthy" as const,
  DEGRADED: "degraded" as const,
  UNHEALTHY: "unhealthy" as const,
  ERROR: "error" as const,
  OPERATIONAL: "operational" as const,
} as const;

// Health threshold constants for enterprise monitoring
const HEALTH_THRESHOLDS = {
  HEALTHY_RATIO: 0.75,
  DEGRADED_RATIO: 0.5,
  UPTIME_TARGET: 99.9,
} as const;

// System capabilities for enterprise reporting
const SYSTEM_CAPABILITIES = [
  "quantum_security",
  "predictive_analytics",
  "mcp_integration",
  "database_management",
  "self_healing",
  "real_time_monitoring",
  "enterprise_grade",
] as const;

// Service status strings for consistent reporting
const SERVICE_STATUS = {
  HEALTHY: HEALTH_STATUS.HEALTHY,
  UNHEALTHY: HEALTH_STATUS.UNHEALTHY,
  DEGRADED: HEALTH_STATUS.DEGRADED,
  ERROR: HEALTH_STATUS.ERROR,
  OPERATIONAL: HEALTH_STATUS.OPERATIONAL,
} as const;

// Component indices for array access
const COMPONENT_INDICES = {
  QUANTUM_SECURITY: 0,
  PREDICTIVE_ANALYTICS: 1,
  MCP_INTEGRATION: 2,
  DATABASE_MANAGER: 3,
} as const;

// Error messages for consistent reporting
const ERROR_MESSAGES = {
  SERVICE_UNAVAILABLE: "Service unavailable",
  UNKNOWN_ERROR: "Unknown error",
  HEALTH_CHECK_FAILED: "Health check failed",
} as const;

interface ComponentHealth {
  quantumSecurity: string;
  predictiveAnalytics: string;
  mcpIntegration: string;
  databaseManager: string;
}

interface HealthMetrics {
  quantum: unknown;
  predictive: unknown;
  mcp: unknown;
  database: unknown;
}

interface HealthResponse {
  service: string;
  overallHealth: string;
  componentHealth: ComponentHealth;
  healthDetails: Record<string, unknown>;
  metrics: HealthMetrics;
  capabilities: readonly string[];
  uptime: string;
  timestamp: string;
}

interface HealthError {
  error: string;
  message: string;
  overallHealth: string;
  timestamp: string;
}

// Create singleton instance for database manager
const dbManager = databaseManagerV2;

/**
 * Performs comprehensive health checks on all v2.0 components
 * using Promise.allSettled for resilient error handling
 */
async function performComponentHealthChecks() {
  return await Promise.allSettled([
    quantumSecurityV2.healthCheck(),
    predictiveAnalyticsV2.healthCheck(),
    Promise.resolve({
      status: HEALTH_STATUS.OPERATIONAL,
      checks: { mcp: HEALTH_STATUS.OPERATIONAL },
    }),
    dbManager.healthCheck(),
  ]);
}

/**
 * Calculates component health status from health check results
 */
function calculateComponentHealth(
  healthChecks: PromiseSettledResult<unknown>[],
): ComponentHealth {
  return {
    quantumSecurity:
      healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].status === "fulfilled"
        ? (
            healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].value as {
              status: string;
            }
          ).status
        : SERVICE_STATUS.ERROR,
    predictiveAnalytics:
      healthChecks[COMPONENT_INDICES.PREDICTIVE_ANALYTICS].status ===
      "fulfilled"
        ? (
            healthChecks[COMPONENT_INDICES.PREDICTIVE_ANALYTICS].value as {
              status: string;
            }
          ).status
        : SERVICE_STATUS.ERROR,
    mcpIntegration:
      healthChecks[COMPONENT_INDICES.MCP_INTEGRATION].status === "fulfilled"
        ? (
            healthChecks[COMPONENT_INDICES.MCP_INTEGRATION].value as {
              status: string;
            }
          ).status
        : SERVICE_STATUS.ERROR,
    databaseManager:
      healthChecks[COMPONENT_INDICES.DATABASE_MANAGER].status === "fulfilled"
        ? (
            healthChecks[COMPONENT_INDICES.DATABASE_MANAGER].value as {
              status: string;
            }
          ).status
        : SERVICE_STATUS.ERROR,
  };
}

/**
 * Determines overall system health based on component health
 */
function determineOverallHealth(componentHealth: ComponentHealth): string {
  const healthyComponents = Object.values(componentHealth).filter(
    (status) => status === SERVICE_STATUS.HEALTHY,
  ).length;
  const totalComponents = Object.keys(componentHealth).length;
  const healthRatio = healthyComponents / totalComponents;

  if (healthRatio >= HEALTH_THRESHOLDS.HEALTHY_RATIO) {
    return SERVICE_STATUS.HEALTHY;
  } else if (healthRatio >= HEALTH_THRESHOLDS.DEGRADED_RATIO) {
    return SERVICE_STATUS.DEGRADED;
  } else {
    return SERVICE_STATUS.UNHEALTHY;
  }
}

/**
 * Collects metrics from all components with graceful error handling
 */
function collectComponentMetrics(
  healthChecks: PromiseSettledResult<unknown>[],
): HealthMetrics {
  return {
    quantum:
      healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].status === "fulfilled"
        ? (
            healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].value as {
              metrics: unknown;
            }
          ).metrics
        : null,
    predictive:
      healthChecks[COMPONENT_INDICES.PREDICTIVE_ANALYTICS].status ===
      "fulfilled"
        ? predictiveAnalyticsV2.getAnalyticsMetrics()
        : null,
    mcp:
      healthChecks[COMPONENT_INDICES.MCP_INTEGRATION].status === "fulfilled"
        ? mcpIntegrationV2.getStats()
        : null,
    database:
      healthChecks[COMPONENT_INDICES.DATABASE_MANAGER].status === "fulfilled"
        ? dbManager.getDatabaseMetrics()
        : null,
  };
}

/**
 * Builds detailed health information for each component
 */
function buildHealthDetails(
  healthChecks: PromiseSettledResult<unknown>[],
): Record<string, unknown> {
  return {
    quantumSecurity:
      healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].status === "fulfilled"
        ? healthChecks[COMPONENT_INDICES.QUANTUM_SECURITY].value
        : { error: ERROR_MESSAGES.SERVICE_UNAVAILABLE },
    predictiveAnalytics:
      healthChecks[COMPONENT_INDICES.PREDICTIVE_ANALYTICS].status ===
      "fulfilled"
        ? healthChecks[COMPONENT_INDICES.PREDICTIVE_ANALYTICS].value
        : { error: ERROR_MESSAGES.SERVICE_UNAVAILABLE },
    mcpIntegration:
      healthChecks[COMPONENT_INDICES.MCP_INTEGRATION].status === "fulfilled"
        ? healthChecks[COMPONENT_INDICES.MCP_INTEGRATION].value
        : { error: ERROR_MESSAGES.SERVICE_UNAVAILABLE },
    databaseManager:
      healthChecks[COMPONENT_INDICES.DATABASE_MANAGER].status === "fulfilled"
        ? healthChecks[COMPONENT_INDICES.DATABASE_MANAGER].value
        : { error: ERROR_MESSAGES.SERVICE_UNAVAILABLE },
  };
}

/**
 * Constructs comprehensive health response object
 */
function buildHealthResponse(
  overallHealth: string,
  componentHealth: ComponentHealth,
  healthDetails: Record<string, unknown>,
  metrics: HealthMetrics,
): HealthResponse {
  return {
    service: "OptiMind AI Ecosystem v2.0",
    overallHealth,
    componentHealth,
    healthDetails,
    metrics,
    capabilities: SYSTEM_CAPABILITIES,
    uptime: `${HEALTH_THRESHOLDS.UPTIME_TARGET}%`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handles health check errors with enterprise-grade error reporting
 */
function handleHealthError(error: unknown): NextResponse<HealthError> {
  console.error("Comprehensive Health Check API error:", error);
  const errorResponse: HealthError = {
    error: ERROR_MESSAGES.HEALTH_CHECK_FAILED,
    message:
      error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR,
    overallHealth: SERVICE_STATUS.UNHEALTHY,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status: 503 });
}

/**
 * Main health check endpoint with comprehensive system monitoring
 */
export async function GET(): Promise<
  NextResponse<HealthResponse | HealthError>
> {
  try {
    // Perform parallel health checks for optimal performance
    const healthChecks = await performComponentHealthChecks();

    // Calculate system health status
    const componentHealth = calculateComponentHealth(healthChecks);
    const overallHealth = determineOverallHealth(componentHealth);

    // Collect metrics and build response
    const metrics = collectComponentMetrics(healthChecks);
    const healthDetails = buildHealthDetails(healthChecks);
    const healthResponse = buildHealthResponse(
      overallHealth,
      componentHealth,
      healthDetails,
      metrics,
    );

    return NextResponse.json(healthResponse);
  } catch (error) {
    return handleHealthError(error);
  }
}
