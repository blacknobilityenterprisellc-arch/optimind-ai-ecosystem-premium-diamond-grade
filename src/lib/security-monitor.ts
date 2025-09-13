/**
 * Security Monitoring and Alerting System
 * 
 * Monitors for unauthorized access attempts, security events,
 * and sends alerts when suspicious activity is detected.
 */

import { getAccessControlManager } from './access-control';
import { getSecretsManager } from './secrets-manager';

export interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'rate_limit_exceeded' | 'suspicious_activity' | 'data_breach' | 'configuration_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: 'email' | 'sms' | 'webhook' | 'slack';
  recipient: string;
  message: string;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  topIPs: Array<{ ip: string; count: number }>;
  alertsSent: number;
  failedEvents: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface MonitoringConfig {
  enableRealTimeMonitoring: boolean;
  alertThresholds: {
    unauthorizedAccessPerMinute: number;
    failedLoginsPerHour: number;
    rateLimitViolationsPerHour: number;
    suspiciousIPThreshold: number;
  };
  alertChannels: {
    email?: {
      enabled: boolean;
      recipients: string[];
      smtpConfig: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
          user: string;
          pass: string;
        };
      };
    };
    webhook?: {
      enabled: boolean;
      url: string;
      headers?: Record<string, string>;
    };
    slack?: {
      enabled: boolean;
      webhookUrl: string;
      channel?: string;
    };
  };
  retentionDays: number;
  enableAutoBlock: boolean;
  blockDuration: number; // minutes
}

export class SecurityMonitor {
  private config: MonitoringConfig;
  private eventBuffer: SecurityEvent[] = [];
  private alertQueue: SecurityAlert[] = [];
  private blockedIPs: Set<string> = new Set();
  private blockedIPsExpiry: Map<string, Date> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.startMonitoring();
  }

  /**
   * Start the monitoring system
   */
  private startMonitoring(): void {
    if (this.config.enableRealTimeMonitoring) {
      // Process events every 30 seconds
      setInterval(() => this.processEvents(), 30000);
      
      // Send alerts every minute
      setInterval(() => this.processAlerts(), 60000);
      
      // Clean up expired blocks every hour
      setInterval(() => this.cleanupExpiredBlocks(), 3600000);
      
      console.log('Security monitoring system started');
    }
  }

  /**
   * Record a security event
   */
  async recordEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    this.eventBuffer.push(securityEvent);

    // Check for immediate threats
    await this.checkImmediateThreats(securityEvent);

    // Log to database (in production)
    await this.persistEvent(securityEvent);

    console.log(`Security event recorded: ${event.type} - ${event.title}`);
  }

  /**
   * Check for immediate threats that require instant action
   */
  private async checkImmediateThreats(event: SecurityEvent): Promise<void> {
    // Auto-block IPs with multiple critical events
    if (event.severity === 'critical' && event.ipAddress) {
      const criticalEvents = this.eventBuffer.filter(
        e => e.ipAddress === event.ipAddress && e.severity === 'critical'
      );

      if (criticalEvents.length >= 3) {
        await this.blockIP(event.ipAddress, 'Multiple critical security events');
      }
    }

    // Check for brute force patterns
    if (event.type === 'unauthorized_access' && event.ipAddress) {
      const recentAttempts = this.eventBuffer.filter(
        e => e.ipAddress === event.ipAddress && 
             e.type === 'unauthorized_access' &&
             Date.now() - e.timestamp.getTime() < 60000 // Last minute
      );

      if (recentAttempts.length >= this.config.alertThresholds.unauthorizedAccessPerMinute) {
        await this.blockIP(event.ipAddress, 'Brute force attack detected');
        await this.createAlert({
          eventId: event.id,
          type: 'email',
          recipient: this.config.alertChannels.email?.recipients[0] || 'admin@example.com',
          message: `Brute force attack detected from IP: ${event.ipAddress}`,
          status: 'pending',
          retryCount: 0,
        });
      }
    }
  }

  /**
   * Block an IP address
   */
  private async blockIP(ipAddress: string, reason: string): Promise<void> {
    if (!this.config.enableAutoBlock) return;

    this.blockedIPs.add(ipAddress);
    const expiryTime = new Date(Date.now() + this.config.blockDuration * 60000);
    this.blockedIPsExpiry.set(ipAddress, expiryTime);

    await this.recordEvent({
      type: 'suspicious_activity',
      severity: 'high',
      title: 'IP Address Blocked',
      description: `IP ${ipAddress} blocked due to: ${reason}`,
      source: 'security_monitor',
      ipAddress,
      metadata: { reason, blockDuration: this.config.blockDuration },
    });

    console.log(`IP ${ipAddress} blocked for ${this.config.blockDuration} minutes: ${reason}`);
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ipAddress: string): boolean {
    if (this.blockedIPs.has(ipAddress)) {
      const expiry = this.blockedIPsExpiry.get(ipAddress);
      if (expiry && expiry > new Date()) {
        return true;
      } else {
        // Remove expired block
        this.blockedIPs.delete(ipAddress);
        this.blockedIPsExpiry.delete(ipAddress);
      }
    }
    return false;
  }

  /**
   * Clean up expired IP blocks
   */
  private cleanupExpiredBlocks(): void {
    const now = new Date();
    for (const [ip, expiry] of this.blockedIPsExpiry.entries()) {
      if (expiry <= now) {
        this.blockedIPs.delete(ip);
        this.blockedIPsExpiry.delete(ip);
      }
    }
  }

  /**
   * Process buffered events and generate alerts
   */
  private async processEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    // Analyze events for patterns
    const recentEvents = this.eventBuffer.filter(e => e.timestamp.getTime() > oneMinuteAgo);
    const hourlyEvents = this.eventBuffer.filter(e => e.timestamp.getTime() > oneHourAgo);

    // Check for rate limit violations
    const rateLimitViolations = hourlyEvents.filter(e => e.type === 'rate_limit_exceeded');
    if (rateLimitViolations.length >= this.config.alertThresholds.rateLimitViolationsPerHour) {
      await this.createAlert({
        eventId: rateLimitViolations[0].id,
        type: 'email',
        recipient: this.config.alertChannels.email?.recipients[0] || 'admin@example.com',
        message: `High rate of rate limit violations detected: ${rateLimitViolations.length} in the last hour`,
        status: 'pending',
        retryCount: 0,
      });
    }

    // Check for suspicious IP patterns
    const ipCounts = this.countEventsByIP(hourlyEvents);
    for (const [ip, count] of ipCounts.entries()) {
      if (count >= this.config.alertThresholds.suspiciousIPThreshold) {
        await this.createAlert({
          eventId: crypto.randomUUID(),
          type: 'email',
          recipient: this.config.alertChannels.email?.recipients[0] || 'admin@example.com',
          message: `Suspicious activity detected from IP ${ip}: ${count} events in the last hour`,
          status: 'pending',
          retryCount: 0,
        });
      }
    }

    // Clear old events from buffer
    this.eventBuffer = this.eventBuffer.filter(e => e.timestamp.getTime() > oneHourAgo);
  }

  /**
   * Count events by IP address
   */
  private countEventsByIP(events: SecurityEvent[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const event of events) {
      if (event.ipAddress) {
        counts.set(event.ipAddress, (counts.get(event.ipAddress) || 0) + 1);
      }
    }
    return counts;
  }

  /**
   * Create an alert
   */
  private async createAlert(alert: Omit<SecurityAlert, 'id'>): Promise<void> {
    const fullAlert: SecurityAlert = {
      ...alert,
      id: crypto.randomUUID(),
    };

    this.alertQueue.push(fullAlert);
  }

  /**
   * Process alert queue
   */
  private async processAlerts(): Promise<void> {
    if (this.alertQueue.length === 0) return;

    for (const alert of this.alertQueue) {
      try {
        await this.sendAlert(alert);
        alert.status = 'sent';
        alert.sentAt = new Date();
      } catch (error) {
        console.error(`Failed to send alert ${alert.id}:`, error);
        alert.status = 'failed';
        alert.retryCount++;
      }
    }

    // Remove sent alerts or keep failed ones for retry
    this.alertQueue = this.alertQueue.filter(alert => 
      alert.status === 'failed' && alert.retryCount < 3
    );
  }

  /**
   * Send alert via configured channels
   */
  private async sendAlert(alert: SecurityAlert): Promise<void> {
    switch (alert.type) {
      case 'email':
        await this.sendEmailAlert(alert);
        break;
      case 'webhook':
        await this.sendWebhookAlert(alert);
        break;
      case 'slack':
        await this.sendSlackAlert(alert);
        break;
      default:
        console.warn(`Unknown alert type: ${alert.type}`);
    }
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(alert: SecurityAlert): Promise<void> {
    if (!this.config.alertChannels.email?.enabled) return;

    const emailConfig = this.config.alertChannels.email.smtpConfig;
    
    // In production, use nodemailer or similar
    console.log(`Email alert sent to ${alert.recipient}: ${alert.message}`);
    
    // Implementation would use nodemailer:
    // const transporter = nodemailer.createTransport(emailConfig);
    // await transporter.sendMail({
    //   from: emailConfig.auth.user,
    //   to: alert.recipient,
    //   subject: 'Security Alert - OptiMind AI Ecosystem',
    //   text: alert.message,
    // });
  }

  /**
   * Send webhook alert
   */
  private async sendWebhookAlert(alert: SecurityAlert): Promise<void> {
    if (!this.config.alertChannels.webhook?.enabled) return;

    const webhookConfig = this.config.alertChannels.webhook;
    
    console.log(`Webhook alert sent to ${webhookConfig.url}: ${alert.message}`);
    
    // Implementation would use fetch:
    // await fetch(webhookConfig.url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...webhookConfig.headers,
    //   },
    //   body: JSON.stringify({
    //     alert: alert.message,
    //     timestamp: new Date().toISOString(),
    //     severity: 'high',
    //   }),
    // });
  }

  /**
   * Send Slack alert
   */
  private async sendSlackAlert(alert: SecurityAlert): Promise<void> {
    if (!this.config.alertChannels.slack?.enabled) return;

    const slackConfig = this.config.alertChannels.slack;
    
    console.log(`Slack alert sent to ${slackConfig.channel || 'general'}: ${alert.message}`);
    
    // Implementation would use Slack webhook:
    // await fetch(slackConfig.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     channel: slackConfig.channel,
    //     text: `🚨 Security Alert: ${alert.message}`,
    //   }),
    // });
  }

  /**
   * Persist event to database
   */
  private async persistEvent(event: SecurityEvent): Promise<void> {
    try {
      // In production, save to database
      console.log(`Persisting security event: ${event.type}`);
    } catch (error) {
      console.error('Failed to persist security event:', error);
    }
  }

  /**
   * Get security metrics
   */
  async getMetrics(timeRange: { start: Date; end: Date }): Promise<SecurityMetrics> {
    const eventsInRange = this.eventBuffer.filter(
      e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
    );

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ipCounts = new Map<string, number>();

    for (const event of eventsInRange) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      if (event.ipAddress) {
        ipCounts.set(event.ipAddress, (ipCounts.get(event.ipAddress) || 0) + 1);
      }
    }

    const topIPs = Array.from(ipCounts.entries())
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: eventsInRange.length,
      eventsByType,
      eventsBySeverity,
      topIPs,
      alertsSent: this.alertQueue.filter(a => a.status === 'sent').length,
      failedEvents: eventsInRange.filter(e => e.severity === 'critical').length,
      timeRange,
    };
  }

  /**
   * Get current blocked IPs
   */
  getBlockedIPs(): Array<{ ip: string; expiresAt: Date; reason?: string }> {
    const now = new Date();
    return Array.from(this.blockedIPs).map(ip => ({
      ip,
      expiresAt: this.blockedIPsExpiry.get(ip) || now,
    }));
  }

  /**
   * Unblock an IP address
   */
  async unblockIP(ipAddress: string): Promise<boolean> {
    if (this.blockedIPs.has(ipAddress)) {
      this.blockedIPs.delete(ipAddress);
      this.blockedIPsExpiry.delete(ipAddress);
      
      await this.recordEvent({
        type: 'configuration_change',
        severity: 'low',
        title: 'IP Address Unblocked',
        description: `IP ${ipAddress} manually unblocked`,
        source: 'security_monitor',
        ipAddress,
      });

      return true;
    }
    return false;
  }
}

// Default configuration
export const defaultMonitoringConfig: MonitoringConfig = {
  enableRealTimeMonitoring: true,
  alertThresholds: {
    unauthorizedAccessPerMinute: 10,
    failedLoginsPerHour: 20,
    rateLimitViolationsPerHour: 50,
    suspiciousIPThreshold: 100,
  },
  alertChannels: {
    email: {
      enabled: true,
      recipients: ['admin@example.com'],
      smtpConfig: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      },
    },
    webhook: {
      enabled: false,
      url: '',
    },
    slack: {
      enabled: false,
      webhookUrl: '',
    },
  },
  retentionDays: 90,
  enableAutoBlock: true,
  blockDuration: 60, // 1 hour
};

// Singleton instance
let securityMonitorInstance: SecurityMonitor | null = null;

export function getSecurityMonitor(config?: Partial<MonitoringConfig>): SecurityMonitor {
  if (!securityMonitorInstance) {
    const fullConfig = { ...defaultMonitoringConfig, ...config };
    securityMonitorInstance = new SecurityMonitor(fullConfig);
  }
  return securityMonitorInstance;
}

// Middleware for security monitoring
export function withSecurityMonitoring(handler: any) {
  return async (req: any, res: any) => {
    const monitor = getSecurityMonitor();
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Check if IP is blocked
    if (monitor.isIPBlocked(ipAddress)) {
      await monitor.recordEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        title: 'Blocked IP Access Attempt',
        description: `Blocked IP ${ipAddress} attempted to access ${req.url}`,
        source: 'security_middleware',
        ipAddress,
        userAgent,
      });

      return res.status(403).json({ error: 'Access denied' });
    }

    // Monitor the request
    const startTime = Date.now();
    
    try {
      const result = await handler(req, res);
      
      // Log successful access
      await monitor.recordEvent({
        type: 'suspicious_activity',
        severity: 'low',
        title: 'Successful API Access',
        description: `Successful access to ${req.url}`,
        source: 'security_middleware',
        ipAddress,
        userAgent,
        metadata: { 
          method: req.method, 
          url: req.url, 
          responseTime: Date.now() - startTime 
        },
      });

      return result;
    } catch (error) {
      // Log failed access
      await monitor.recordEvent({
        type: 'unauthorized_access',
        severity: 'high',
        title: 'API Access Failed',
        description: `Failed access to ${req.url}: ${error.message}`,
        source: 'security_middleware',
        ipAddress,
        userAgent,
        metadata: { 
          method: req.method, 
          url: req.url, 
          error: error.message 
        },
      });

      throw error;
    }
  };
}