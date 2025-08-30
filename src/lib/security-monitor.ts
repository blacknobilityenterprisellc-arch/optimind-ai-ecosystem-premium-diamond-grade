// Real-time Security Monitoring System for Private Photo Guardian
// Note: ZAI SDK integration - temporarily disabled for development
// import ZAI from 'z-ai-web-dev-sdk';

export interface SecurityEvent {
  id: string;
  type: 'auth' | 'access' | 'scan' | 'upload' | 'download' | 'delete' | 'share' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  details: Record<string, any>;
  resolved: boolean;
  actionTaken?: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  mediumEvents: number;
  lowEvents: number;
  resolvedEvents: number;
  averageResponseTime: number;
  threatScore: number;
  lastUpdated: Date;
}

export interface SecurityAlert {
  id: string;
  type: 'intrusion' | 'brute_force' | 'data_breach' | 'suspicious_activity' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  affectedResources: string[];
  recommendedActions: string[];
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

export interface AnomalyDetection {
  id: string;
  type: 'behavioral' | 'statistical' | 'pattern' | 'network';
  confidence: number;
  description: string;
  timestamp: Date;
  context: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private anomalies: AnomalyDetection[] = [];
  private zai: any = null;
  private isActive: boolean = false;
  private eventCallbacks: Set<(event: SecurityEvent) => void> = new Set();
  private alertCallbacks: Set<(alert: SecurityAlert) => void> = new Set();

  private constructor() {
    this.initializeAI();
    this.startMonitoring();
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  private async initializeAI() {
    try {
      // Temporarily disabled - ZAI SDK integration
      // this.zai = await ZAI.create();
      console.log('Security Monitor AI initialized successfully (mock mode)');
    } catch (error) {
      console.error('Failed to initialize Security Monitor AI:', error);
    }
  }

  private startMonitoring() {
    if (typeof window === 'undefined') return;
    
    this.isActive = true;
    
    // Monitor authentication events
    this.monitorAuthentication();
    
    // Monitor file access patterns
    this.monitorFileAccess();
    
    // Monitor network activity
    this.monitorNetworkActivity();
    
    // Monitor system events
    this.monitorSystemEvents();
    
    // Start anomaly detection
    this.startAnomalyDetection();
    
    console.log('Security monitoring started');
  }

  private monitorAuthentication() {
    if (typeof window === 'undefined') return;
    
    // Monitor successful and failed authentication attempts
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_session') {
        if (event.newValue && !event.oldValue) {
          // Successful login
          this.logEvent({
            type: 'auth',
            severity: 'low',
            description: 'User authentication successful',
            details: { method: 'session' }
          });
        } else if (!event.newValue && event.oldValue) {
          // Logout
          this.logEvent({
            type: 'auth',
            severity: 'low',
            description: 'User session ended',
            details: { method: 'session_end' }
          });
        }
      }
    });

    // Monitor PIN validation attempts
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      let response;
      
      if (url === '/api/auth/pin' && options?.method === 'POST') {
        try {
          response = await originalFetch(...args);
          const clonedResponse = response.clone();
          
          clonedResponse.json().then(data => {
            if (data.success) {
              this.logEvent({
                type: 'auth',
                severity: 'low',
                description: 'PIN authentication successful',
                details: { method: 'pin' }
              });
            } else {
              this.logEvent({
                type: 'auth',
                severity: 'medium',
                description: 'PIN authentication failed',
                details: { 
                  method: 'pin',
                  reason: data.error || 'invalid_pin'
                }
              });
              
              // Check for potential brute force attack
              this.checkForBruteForce();
            }
          }).catch(() => {});
        } catch (error) {
          this.logEvent({
            type: 'auth',
            severity: 'medium',
            description: 'PIN authentication error',
            details: { error: String(error) }
          });
        }
      } else {
        response = await originalFetch(...args);
      }
      
      return response;
    };
  }

  private monitorFileAccess() {
    if (typeof window === 'undefined') return;
    
    // Monitor file upload/download patterns
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      // Monitor file uploads
      const urlString = typeof url === 'string' ? url : (url as Request).url;
      if (urlString.includes('/api/scan') && options?.method === 'POST') {
        this.logEvent({
          type: 'upload',
          severity: 'low',
          description: 'File upload initiated',
          details: { endpoint: url }
        });
      }
      
      // Monitor bulk operations
      if (options?.body && typeof options.body === 'string') {
        try {
          const body = JSON.parse(options.body);
          if (body.action === 'download' && body.photoIds?.length > 5) {
            this.logEvent({
              type: 'download',
              severity: 'medium',
              description: 'Bulk download initiated',
              details: { count: body.photoIds.length }
            });
          }
          
          if (body.action === 'delete' && body.photoIds?.length > 3) {
            this.logEvent({
              type: 'delete',
              severity: 'medium',
              description: 'Bulk delete initiated',
              details: { count: body.photoIds.length }
            });
          }
        } catch (error) {
          // Ignore JSON parse errors
        }
      }
      
      return originalFetch(...args);
    };
  }

  private monitorNetworkActivity() {
    if (typeof window === 'undefined') return;
    
    // Monitor for suspicious network patterns
    let requestCount = 0;
    let lastRequestTime = Date.now();
    
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      requestCount++;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastRequestTime;
      
      // Check for rapid successive requests (potential DDoS or scraping)
      if (timeDiff < 100 && requestCount > 10) {
        this.logEvent({
          type: 'system',
          severity: 'high',
          description: 'High frequency requests detected',
          details: { 
            requestCount,
            timeWindow: timeDiff,
            averageInterval: timeDiff / requestCount
          }
        });
        
        this.detectAnomaly({
          type: 'network',
          confidence: 0.8,
          description: 'Unusual request frequency pattern detected',
          context: { requestCount, timeDiff }
        });
      }
      
      // Reset counter if time window is large
      if (timeDiff > 5000) {
        requestCount = 0;
        lastRequestTime = currentTime;
      }
      
      return originalFetch(...args);
    };
  }

  private monitorSystemEvents() {
    if (typeof window === 'undefined') return;
    
    // Monitor for system-level events
    window.addEventListener('error', (event) => {
      this.logEvent({
        type: 'system',
        severity: 'medium',
        description: 'JavaScript error occurred',
        details: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logEvent({
        type: 'system',
        severity: 'high',
        description: 'Unhandled promise rejection',
        details: {
          reason: event.reason instanceof Error ? event.reason.message : String(event.reason)
        }
      });
    });

    // Monitor for visibility changes (potential tab switching)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.logEvent({
            type: 'system',
            severity: 'low',
            description: 'Application tab hidden',
            details: { timestamp: new Date().toISOString() }
          });
        } else {
          this.logEvent({
            type: 'system',
            severity: 'low',
            description: 'Application tab visible',
            details: { timestamp: new Date().toISOString() }
          });
        }
      });
    }
  }

  private startAnomalyDetection() {
    // Periodic anomaly detection
    setInterval(() => {
      this.detectBehavioralAnomalies();
      this.detectStatisticalAnomalies();
      this.detectPatternAnomalies();
    }, 30000); // Check every 30 seconds
  }

  private detectBehavioralAnomalies() {
    // Analyze user behavior patterns
    const recentEvents = this.events.filter(event => 
      Date.now() - event.timestamp.getTime() < 300000 // Last 5 minutes
    );

    // Check for unusual activity patterns
    const authEvents = recentEvents.filter(e => e.type === 'auth');
    const fileEvents = recentEvents.filter(e => ['upload', 'download', 'delete'].includes(e.type));
    
    if (authEvents.length > 5) {
      this.detectAnomaly({
        type: 'behavioral',
        confidence: 0.7,
        description: 'Unusual authentication frequency',
        context: { authEvents: authEvents.length, timeWindow: '5 minutes' }
      });
    }

    if (fileEvents.length > 20) {
      this.detectAnomaly({
        type: 'behavioral',
        confidence: 0.8,
        description: 'Unusual file activity frequency',
        context: { fileEvents: fileEvents.length, timeWindow: '5 minutes' }
      });
    }
  }

  private detectStatisticalAnomalies() {
    // Statistical analysis of events
    const recentEvents = this.events.filter(event => 
      Date.now() - event.timestamp.getTime() < 3600000 // Last hour
    );

    if (recentEvents.length < 10) return;

    // Calculate event frequency
    const eventTypes = ['auth', 'access', 'scan', 'upload', 'download', 'delete'];
    const frequencies = eventTypes.map(type => 
      recentEvents.filter(e => e.type === type).length
    );

    // Check for statistical outliers
    const mean = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
    const variance = frequencies.reduce((sum, freq) => sum + Math.pow(freq - mean, 2), 0) / frequencies.length;
    const standardDeviation = Math.sqrt(variance);

    frequencies.forEach((freq, index) => {
      if (Math.abs(freq - mean) > 2 * standardDeviation) {
        this.detectAnomaly({
          type: 'statistical',
          confidence: 0.6,
          description: `Statistical anomaly in ${eventTypes[index]} events`,
          context: { 
            frequency: freq, 
            mean, 
            standardDeviation,
            eventType: eventTypes[index]
          }
        });
      }
    });
  }

  private detectPatternAnomalies() {
    // Detect unusual patterns in event sequences
    const recentEvents = this.events.slice(-20); // Last 20 events
    
    if (recentEvents.length < 10) return;

    // Check for repeating patterns
    const eventSequence = recentEvents.map(e => e.type).join(',');
    const patternMatches = (eventSequence.match(/auth,access,scan/g) || []).length;
    
    if (patternMatches > 3) {
      this.detectAnomaly({
        type: 'pattern',
        confidence: 0.9,
        description: 'Repetitive authentication-scan pattern detected',
        context: { patternMatches, sequenceLength: recentEvents.length }
      });
    }
  }

  private checkForBruteForce() {
    const recentAuthEvents = this.events.filter(event => 
      event.type === 'auth' && 
      event.details?.reason === 'invalid_pin' &&
      Date.now() - event.timestamp.getTime() < 300000 // Last 5 minutes
    );

    if (recentAuthEvents.length >= 5) {
      this.createAlert({
        type: 'brute_force',
        severity: 'high',
        title: 'Potential Brute Force Attack',
        description: `Multiple failed authentication attempts detected (${recentAuthEvents.length} attempts)`,
        affectedResources: ['authentication_system'],
        recommendedActions: [
          'Enable account lockout after multiple failed attempts',
          'Implement rate limiting',
          'Monitor for additional suspicious activity',
          'Consider implementing CAPTCHA'
        ]
      });
    }
  }

  private detectAnomaly(anomaly: Omit<AnomalyDetection, 'id' | 'timestamp' | 'riskLevel'>) {
    const riskLevel = this.calculateRiskLevel(anomaly.confidence, anomaly.type);
    
    const detection: AnomalyDetection = {
      id: this.generateId(),
      timestamp: new Date(),
      riskLevel,
      ...anomaly
    };

    this.anomalies.push(detection);
    
    // Create alert for high-risk anomalies
    if (riskLevel === 'high' || riskLevel === 'critical') {
      this.createAlert({
        type: 'suspicious_activity',
        severity: riskLevel,
        title: 'Suspicious Activity Detected',
        description: anomaly.description,
        affectedResources: ['system'],
        recommendedActions: [
          'Review activity logs',
          'Verify user identity',
          'Monitor for additional suspicious behavior',
          'Consider temporary access restrictions'
        ]
      });
    }

    console.log('Anomaly detected:', detection);
  }

  private calculateRiskLevel(confidence: number, type: string): 'low' | 'medium' | 'high' | 'critical' {
    if (confidence >= 0.9) return 'critical';
    if (confidence >= 0.7) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  }

  private createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'status'>) {
    const newAlert: SecurityAlert = {
      id: this.generateId(),
      timestamp: new Date(),
      status: 'active',
      ...alert
    };

    this.alerts.push(newAlert);
    this.alertCallbacks.forEach(callback => callback(newAlert));
    
    console.log('Security alert created:', newAlert);
  }

  private logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>) {
    const securityEvent: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      resolved: false,
      ...event
    };

    this.events.push(securityEvent);
    this.eventCallbacks.forEach(callback => callback(securityEvent));
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Public API
  public getEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  public getAlerts(limit: number = 50): SecurityAlert[] {
    return this.alerts.slice(-limit);
  }

  public getAnomalies(limit: number = 50): AnomalyDetection[] {
    return this.anomalies.slice(-limit);
  }

  public getMetrics(): SecurityMetrics {
    const totalEvents = this.events.length;
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length;
    const highEvents = this.events.filter(e => e.severity === 'high').length;
    const mediumEvents = this.events.filter(e => e.severity === 'medium').length;
    const lowEvents = this.events.filter(e => e.severity === 'low').length;
    const resolvedEvents = this.events.filter(e => e.resolved).length;
    
    const threatScore = totalEvents > 0 
      ? ((criticalEvents * 4 + highEvents * 3 + mediumEvents * 2 + lowEvents) / totalEvents) * 25
      : 0;

    return {
      totalEvents,
      criticalEvents,
      highEvents,
      mediumEvents,
      lowEvents,
      resolvedEvents,
      averageResponseTime: 0, // TODO: Calculate actual response time
      threatScore: Math.min(threatScore, 100),
      lastUpdated: new Date()
    };
  }

  public resolveEvent(eventId: string, actionTaken: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      event.actionTaken = actionTaken;
      return true;
    }
    return false;
  }

  public resolveAlert(alertId: string, status: 'resolved' | 'false_positive'): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      return true;
    }
    return false;
  }

  public onEvent(callback: (event: SecurityEvent) => void): () => void {
    this.eventCallbacks.add(callback);
    return () => this.eventCallbacks.delete(callback);
  }

  public onAlert(callback: (alert: SecurityAlert) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  public async performSecurityAssessment(): Promise<string> {
    if (!this.zai) {
      return "Security assessment unavailable - AI not initialized";
    }

    try {
      const metrics = this.getMetrics();
      const recentEvents = this.getEvents(20);
      const activeAlerts = this.alerts.filter(a => a.status === 'active');

      const prompt = `
        Perform a comprehensive security assessment based on the following data:
        
        Security Metrics:
        - Total Events: ${metrics.totalEvents}
        - Critical Events: ${metrics.criticalEvents}
        - High Events: ${metrics.highEvents}
        - Medium Events: ${metrics.mediumEvents}
        - Low Events: ${metrics.lowEvents}
        - Resolved Events: ${metrics.resolvedEvents}
        - Threat Score: ${metrics.threatScore.toFixed(1)}
        
        Recent Events (last 20):
        ${recentEvents.map(e => `- ${e.type}: ${e.description} (${e.severity})`).join('\n')}
        
        Active Alerts (${activeAlerts.length}):
        ${activeAlerts.map(a => `- ${a.title}: ${a.description} (${a.severity})`).join('\n')}
        
        Provide a comprehensive security assessment including:
        1. Overall security posture
        2. Identified risks and vulnerabilities
        3. Recommended immediate actions
        4. Long-term security improvements
        5. Threat level evaluation
      `;

      const response = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert security analyst. Provide comprehensive, actionable security assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content || "Security assessment completed";
    } catch (error) {
      console.error('Security assessment failed:', error);
      return "Security assessment failed";
    }
  }

  public exportSecurityData(): string {
    return JSON.stringify({
      events: this.events,
      alerts: this.alerts,
      anomalies: this.anomalies,
      metrics: this.getMetrics(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  public clearOldData(olderThanDays: number = 30): void {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    this.events = this.events.filter(e => e.timestamp > cutoffDate);
    this.alerts = this.alerts.filter(a => a.timestamp > cutoffDate);
    this.anomalies = this.anomalies.filter(a => a.timestamp > cutoffDate);
  }
}

// Export singleton instance
export const securityMonitor = SecurityMonitor.getInstance();

// React hook for security monitoring
import { useEffect, useState, useCallback } from 'react';

export function useSecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [assessment, setAssessment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to security events
    const unsubscribeEvents = securityMonitor.onEvent((event) => {
      setEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events
    });

    const unsubscribeAlerts = securityMonitor.onAlert((alert) => {
      setAlerts(prev => [...prev, alert]);
    });

    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      setMetrics(securityMonitor.getMetrics());
    }, 5000);

    // Initial data load
    setEvents(securityMonitor.getEvents(100));
    setAlerts(securityMonitor.getAlerts(50));
    setMetrics(securityMonitor.getMetrics());

    return () => {
      unsubscribeEvents();
      unsubscribeAlerts();
      clearInterval(metricsInterval);
    };
  }, []);

  const resolveEvent = useCallback((eventId: string, actionTaken: string) => {
    return securityMonitor.resolveEvent(eventId, actionTaken);
  }, []);

  const resolveAlert = useCallback((alertId: string, status: 'resolved' | 'false_positive') => {
    return securityMonitor.resolveAlert(alertId, status);
  }, []);

  const performAssessment = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await securityMonitor.performSecurityAssessment();
      setAssessment(result);
    } catch (error) {
      console.error('Security assessment failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportData = useCallback(() => {
    return securityMonitor.exportSecurityData();
  }, []);

  const clearOldData = useCallback((olderThanDays: number = 30) => {
    securityMonitor.clearOldData(olderThanDays);
  }, []);

  return {
    events,
    alerts,
    metrics,
    assessment,
    isLoading,
    resolveEvent,
    resolveAlert,
    performAssessment,
    exportData,
    clearOldData
  };
}