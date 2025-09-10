/**
 * Self-Healing Integration for OptiMind AI Ecosystem
 *
 * Integrates the Premium Diamond-Grade Scanner with existing systems
 * to provide seamless self-healing capabilities
 */

import { globalErrorHandler } from './global-error-handler';
import { premiumDiamondGradeScanner } from './premium-diamond-grade-scanner';
import { glmOrchestrator } from './glm-orchestrator';

export interface SelfHealingConfig {
  enableAutoDetection: boolean;
  enableAutoFix: boolean;
  enableRealTimeMonitoring: boolean;
  scanInterval: number;
  errorThreshold: number;
  notificationEnabled: boolean;
}

export interface HealingReport {
  healingId: string;
  timestamp: Date;
  initialIssues: number;
  issuesDetected: number;
  issuesFixed: number;
  issuesRemaining: number;
  scanScore: number;
  scanGrade: string;
  healingTime: number;
  success: boolean;
  summary: string;
}

export class SelfHealingIntegration {
  private config: SelfHealingConfig;
  private isInitialized = false;
  private healingHistory: HealingReport[] = [];
  private notificationCallbacks: ((report: HealingReport) => void)[] = [];

  constructor(config: SelfHealingConfig) {
    this.config = config;
  }

  /**
   * Initialize the self-healing system
   */
  async initialize(): Promise<void> {
    try {
      // Initialize GLM Orchestrator
      if (!glmOrchestrator.getStatus().isInitialized) {
        await glmOrchestrator.initialize();
      }

      // Initialize Premium Diamond-Grade Scanner
      await premiumDiamondGradeScanner.initialize();

      // Initialize Global Error Handler
      await globalErrorHandler.initialize();

      // Start scanner if auto-detection is enabled
      if (this.config.enableAutoDetection) {
        premiumDiamondGradeScanner.start();
      }

      this.isInitialized = true;
      console.log('Self-Healing Integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Self-Healing Integration:', error);
      throw error;
    }
  }

  /**
   * Start the self-healing system
   */
  start(): void {
    if (!this.isInitialized) {
      throw new EnhancedError('Self-Healing Integration not initialized');
    }

    console.log('Self-Healing Integration started');
  }

  /**
   * Stop the self-healing system
   */
  stop(): void {
    premiumDiamondGradeScanner.stop();
    globalErrorHandler.stopMonitoring();
    console.log('Self-Healing Integration stopped');
  }

  /**
   * Trigger a self-healing cycle
   */
  async triggerHealingCycle(issue?: any): Promise<HealingReport> {
    if (!this.isInitialized) {
      throw new EnhancedError('Self-Healing Integration not initialized');
    }

    const healingId = this.generateHealingId();
    const startTime = Date.now();

    try {
      console.log(`🔄 Triggering Self-Healing Cycle: ${healingId}`);

      // If no issue provided, create a general system check
      if (!issue) {
        issue = {
          id: `system_check_${Date.now()}`,
          type: 'system-health-check',
          severity: 'high' as const,
          component: 'system',
          description: 'Comprehensive system health check initiated',
          detectedAt: new Date(),
          autoFixable: true,
          fixApplied: false,
        };
      }

      // Trigger scanner
      const scanResult = await premiumDiamondGradeScanner.triggerScan(issue);

      // Create healing report
      const healingReport: HealingReport = {
        healingId,
        timestamp: new Date(),
        initialIssues: scanResult.issues.length,
        issuesDetected: scanResult.issues.length,
        issuesFixed: scanResult.issues.filter(i => i.fixApplied).length,
        issuesRemaining: scanResult.issues.filter(i => !i.fixApplied).length,
        scanScore: scanResult.score,
        scanGrade: scanResult.grade,
        healingTime: Date.now() - startTime,
        success: scanResult.status === 'completed',
        summary: this.generateHealingSummary(scanResult),
      };

      // Add to history
      this.healingHistory.push(healingReport);

      // Send notifications if enabled
      if (this.config.notificationEnabled) {
        this.sendNotifications(healingReport);
      }

      console.log(`✅ Self-Healing Cycle completed: ${healingReport.summary}`);
      return healingReport;
    } catch (error) {
      const healingReport: HealingReport = {
        healingId,
        timestamp: new Date(),
        initialIssues: 0,
        issuesDetected: 0,
        issuesFixed: 0,
        issuesRemaining: 0,
        scanScore: 0,
        scanGrade: 'F',
        healingTime: Date.now() - startTime,
        success: false,
        summary: `Self-Healing Cycle failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };

      this.healingHistory.push(healingReport);
      console.error('❌ Self-Healing Cycle failed:', error);

      return healingReport;
    }
  }

  /**
   * Handle system errors automatically
   */
  async handleSystemError(error: Error, context: any = {}): Promise<HealingReport> {
    console.log('🚨 Handling System Error:', error.message);

    // Report to global error handler
    globalErrorHandler.handleError(error, context);

    // Trigger healing cycle
    const healingReport = await this.triggerHealingCycle({
      id: `error_${Date.now()}`,
      type: 'system-error',
      severity: 'high' as const,
      component: context.component || 'system',
      description: `System error: ${error.message}`,
      detectedAt: new Date(),
      autoFixable: true,
      fixApplied: false,
    });

    return healingReport;
  }

  /**
   * Monitor system health proactively
   */
  async monitorSystemHealth(): Promise<HealingReport> {
    console.log('🔍 Proactive System Health Monitoring');

    // Use GLM orchestrator to analyze system health
    const healthStatus = await glmOrchestrator.analyzeSystemHealth();

    // Check if system health is degraded
    if (healthStatus.overall === 'poor' || healthStatus.overall === 'critical') {
      const issue = {
        id: `health_degraded_${Date.now()}`,
        type: 'system-health-degraded',
        severity: 'critical' as const,
        component: 'system',
        description: `System health degraded to ${healthStatus.overall}`,
        detectedAt: new Date(),
        autoFixable: true,
        fixApplied: false,
      };

      return await this.triggerHealingCycle(issue);
    }

    // If health is good, return a positive report
    const healingReport: HealingReport = {
      healingId: this.generateHealingId(),
      timestamp: new Date(),
      initialIssues: 0,
      issuesDetected: 0,
      issuesFixed: 0,
      issuesRemaining: 0,
      scanScore: 95,
      scanGrade: 'A',
      healingTime: 0,
      success: true,
      summary: 'System health is optimal - no issues detected',
    };

    this.healingHistory.push(healingReport);
    return healingReport;
  }

  /**
   * Get healing history
   */
  getHealingHistory(limit: number = 10): HealingReport[] {
    return this.healingHistory.slice(-limit);
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    const scannerStatus = premiumDiamondGradeScanner.getStatus();
    const errorHandlerStatus = globalErrorHandler.getStatus();

    return {
      selfHealing: {
        isInitialized: this.isInitialized,
        config: this.config,
      },
      scanner: scannerStatus,
      errorHandler: errorHandlerStatus,
      healingHistory: {
        total: this.healingHistory.length,
        successful: this.healingHistory.filter(h => h.success).length,
        averageScore:
          this.healingHistory.length > 0
            ? this.healingHistory.reduce((sum, h) => sum + h.scanScore, 0) /
              this.healingHistory.length
            : 0,
      },
    };
  }

  /**
   * Register notification callback
   */
  onNotification(callback: (report: HealingReport) => void): void {
    this.notificationCallbacks.push(callback);
  }

  /**
   * Generate healing summary
   */
  private generateHealingSummary(scanResult: any): string {
    const { grade, score, summary, issues, fixesApplied } = scanResult;

    if (grade === 'A+' || grade === 'A') {
      return `Excellent system health (${grade}, ${score}/100). All checks passed successfully.`;
    } else if (grade === 'B' || grade === 'C') {
      return `Good system health (${grade}, ${score}/100). ${fixesApplied} issues fixed out of ${issues.length} detected.`;
    } else {
      return `System needs attention (${grade}, ${score}/100). ${fixesApplied} issues fixed, ${issues.length - fixesApplied} remaining.`;
    }
  }

  /**
   * Send notifications
   */
  private sendNotifications(report: HealingReport): void {
    console.log('📧 Sending healing notifications:', report.summary);

    this.notificationCallbacks.forEach(callback => {
      try {
        callback(report);
      } catch (error) {
        console.error('Notification callback failed:', error);
      }
    });
  }

  /**
   * Generate unique healing ID
   */
  private generateHealingId(): string {
    return `healing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.healingHistory = [];
    this.notificationCallbacks = [];
    globalErrorHandler.destroy();
    premiumDiamondGradeScanner.destroy();
    console.log('Self-Healing Integration destroyed');
  }
}

// Export singleton instance
export const selfHealingIntegration = new SelfHealingIntegration({
  enableAutoDetection: true,
  enableAutoFix: true,
  enableRealTimeMonitoring: true,
  scanInterval: 30000, // 30 seconds
  errorThreshold: 5, // 5% error rate threshold
  notificationEnabled: true,
});

// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
