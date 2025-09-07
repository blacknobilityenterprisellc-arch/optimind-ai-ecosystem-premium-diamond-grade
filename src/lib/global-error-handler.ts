/**
 * Global Error Handler for OptiMind AI Ecosystem
 *
 * Automatically detects errors, failures, and issues, then triggers
 * the Premium Diamond-Grade Scanner for comprehensive analysis and fixing
 */

import {
  premiumDiamondGradeScanner,
  ScanIssue,
} from "./premium-diamond-grade-scanner";

export interface ErrorContext {
  component: string;
  operation: string;
  error: Error;
  timestamp: Date;
  severity: "critical" | "high" | "medium" | "low";
  additionalInfo?: any;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  timestamp: Date;
}

export class GlobalErrorHandler {
  private scanner: typeof premiumDiamondGradeScanner;
  private errorThreshold: number;
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring = false;

  constructor(errorThreshold: number = 5) {
    this.scanner = premiumDiamondGradeScanner;
    this.errorThreshold = errorThreshold;
  }

  /**
   * Initialize the error handler
   */
  async initialize(): Promise<void> {
    // Initialize the scanner
    await this.scanner.initialize();

    // Register error detection callback
    this.scanner.onIssueDetected(this.handleIssueDetected.bind(this));

    // Start monitoring
    this.startMonitoring();

    console.log("Global Error Handler initialized successfully");
  }

  /**
   * Start system monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.monitorSystemHealth();
      } catch (error) {
        console.error("System monitoring failed:", error);
      }
    }, 30000); // Monitor every 30 seconds

    console.log("System monitoring started");
  }

  /**
   * Stop system monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.isMonitoring = false;
    console.log("System monitoring stopped");
  }

  /**
   * Handle global errors
   */
  handleError(error: Error, context: Partial<ErrorContext> = {}): void {
    const errorContext: ErrorContext = {
      component: context.component || "unknown",
      operation: context.operation || "unknown",
      error,
      timestamp: new Date(),
      severity: context.severity || this.determineErrorSeverity(error),
      additionalInfo: context.additionalInfo,
    };

    console.error("🚨 Global Error Detected:", {
      component: errorContext.component,
      operation: errorContext.operation,
      error: error.message,
      severity: errorContext.severity,
      timestamp: errorContext.timestamp,
    });

    // Create scan issue from error context
    const scanIssue: ScanIssue = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.getErrorType(error),
      severity: errorContext.severity,
      component: errorContext.component,
      description: `Error in ${errorContext.component}.${errorContext.operation}: ${error.message}`,
      detectedAt: errorContext.timestamp,
      autoFixable: this.isErrorAutoFixable(error),
      fixApplied: false,
    };

    // Trigger scanner for critical and high severity errors
    if (scanIssue.severity === "critical" || scanIssue.severity === "high") {
      this.triggerScannerForIssue(scanIssue);
    }
  }

  /**
   * Monitor system health
   */
  private async monitorSystemHealth(): Promise<void> {
    try {
      const metrics = await this.collectSystemMetrics();

      // Check for anomalies
      const anomalies = this.detectAnomalies(metrics);

      for (const anomaly of anomalies) {
        const scanIssue: ScanIssue = {
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: anomaly.type,
          severity: anomaly.severity,
          component: anomaly.component,
          description: anomaly.description,
          detectedAt: new Date(),
          autoFixable: true,
          fixApplied: false,
        };

        this.triggerScannerForIssue(scanIssue);
      }
    } catch (error) {
      console.error("System health monitoring failed:", error);
    }
  }

  /**
   * Collect system metrics
   */
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    // In a real implementation, this would collect actual system metrics
    // For now, we'll simulate with realistic values

    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      responseTime: Math.random() * 1000,
      errorRate: Math.random() * 10,
      activeConnections: Math.floor(Math.random() * 1000),
      timestamp: new Date(),
    };
  }

  /**
   * Detect anomalies in system metrics
   */
  private detectAnomalies(metrics: SystemMetrics): Array<{
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    component: string;
    description: string;
  }> {
    const anomalies: Array<{
      type: string;
      severity: "critical" | "high" | "medium" | "low";
      component: string;
      description: string;
    }> = [];

    // CPU Usage Anomaly
    if (metrics.cpuUsage > 90) {
      anomalies.push({
        type: "high-cpu-usage",
        severity: "critical",
        component: "performance",
        description: `Critical CPU usage detected: ${metrics.cpuUsage.toFixed(1)}%`,
      });
    } else if (metrics.cpuUsage > 75) {
      anomalies.push({
        type: "high-cpu-usage",
        severity: "high",
        component: "performance",
        description: `High CPU usage detected: ${metrics.cpuUsage.toFixed(1)}%`,
      });
    }

    // Memory Usage Anomaly
    if (metrics.memoryUsage > 90) {
      anomalies.push({
        type: "high-memory-usage",
        severity: "critical",
        component: "performance",
        description: `Critical memory usage detected: ${metrics.memoryUsage.toFixed(1)}%`,
      });
    } else if (metrics.memoryUsage > 75) {
      anomalies.push({
        type: "high-memory-usage",
        severity: "high",
        component: "performance",
        description: `High memory usage detected: ${metrics.memoryUsage.toFixed(1)}%`,
      });
    }

    // Response Time Anomaly
    if (metrics.responseTime > 5000) {
      anomalies.push({
        type: "high-response-time",
        severity: "critical",
        component: "performance",
        description: `Critical response time detected: ${metrics.responseTime.toFixed(0)}ms`,
      });
    } else if (metrics.responseTime > 2000) {
      anomalies.push({
        type: "high-response-time",
        severity: "high",
        component: "performance",
        description: `High response time detected: ${metrics.responseTime.toFixed(0)}ms`,
      });
    }

    // Error Rate Anomaly
    if (metrics.errorRate > 10) {
      anomalies.push({
        type: "high-error-rate",
        severity: "critical",
        component: "system",
        description: `Critical error rate detected: ${metrics.errorRate.toFixed(1)}%`,
      });
    } else if (metrics.errorRate > 5) {
      anomalies.push({
        type: "high-error-rate",
        severity: "high",
        component: "system",
        description: `High error rate detected: ${metrics.errorRate.toFixed(1)}%`,
      });
    }

    return anomalies;
  }

  /**
   * Determine error severity
   */
  private determineErrorSeverity(
    error: Error,
  ): "critical" | "high" | "medium" | "low" {
    const errorMessage = error.message.toLowerCase();

    // Critical errors
    if (
      errorMessage.includes("critical") ||
      errorMessage.includes("fatal") ||
      errorMessage.includes("security") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("authentication failed")
    ) {
      return "critical";
    }

    // High severity errors
    if (
      errorMessage.includes("timeout") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("database") ||
      errorMessage.includes("server") ||
      errorMessage.includes("internal")
    ) {
      return "high";
    }

    // Medium severity errors
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("validation")
    ) {
      return "medium";
    }

    // Low severity errors
    return "low";
  }

  /**
   * Get error type
   */
  private getErrorType(error: Error): string {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes("timeout")) return "timeout-error";
    if (errorMessage.includes("connection")) return "connection-error";
    if (errorMessage.includes("database")) return "database-error";
    if (errorMessage.includes("security")) return "security-error";
    if (errorMessage.includes("authentication")) return "authentication-error";
    if (errorMessage.includes("validation")) return "validation-error";
    if (errorMessage.includes("not found")) return "not-found-error";

    return "general-error";
  }

  /**
   * Check if error is auto-fixable
   */
  private isErrorAutoFixable(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();

    // Some errors are not auto-fixable
    const nonAutoFixable = [
      "authentication failed",
      "unauthorized",
      "security",
      "fatal",
      "critical security",
    ];

    return !nonAutoFixable.some((term) => errorMessage.includes(term));
  }

  /**
   * Trigger scanner for a specific issue
   */
  private async triggerScannerForIssue(issue: ScanIssue): Promise<void> {
    try {
      console.log(
        `🔧 Triggering Premium Diamond-Grade Scanner for issue: ${issue.type}`,
      );

      await this.scanner.triggerScan(issue);

      console.log(`✅ Scanner triggered successfully for issue: ${issue.type}`);
    } catch (error) {
      console.error(
        `❌ Failed to trigger scanner for issue ${issue.type}:`,
        error,
      );
    }
  }

  /**
   * Handle issue detected by scanner
   */
  private handleIssueDetected(issue: ScanIssue): void {
    console.log(
      `📋 Issue detected by scanner: ${issue.type} (${issue.severity})`,
    );

    // Here you could add additional handling like:
    // - Sending notifications
    // - Logging to external systems
    // - Triggering alerts
    // - Updating dashboards
  }

  /**
   * Get error handler status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      errorThreshold: this.errorThreshold,
      scannerStatus:
        this.scanner.getActiveScans().length > 0 ? "active" : "idle",
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopMonitoring();
    console.log("Global Error Handler destroyed");
  }
}

// Export singleton instance
export const globalErrorHandler = new GlobalErrorHandler(5); // Error threshold of 5%
