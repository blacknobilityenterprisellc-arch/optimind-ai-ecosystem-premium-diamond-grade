// Automatic NSFW Detection and Quarantine System
// Real-time monitoring and automatic protection for families and enterprises

import { nsfwDetectionService, NSFWDetectionResult } from './nsfw-detection';
import { secureVault } from './secure-vault';

export interface QuarantineConfig {
  enableAutoQuarantine: boolean;
  quarantineThreshold: number; // 0-1, above this value = auto-quarantine
  enableRealTimeScanning: boolean;
  scanInterval: number; // minutes
  enableNotifications: boolean;
  notificationEmail?: string;
  enableAdminAlerts: boolean;
  adminEmail?: string;
  autoDeleteHighRisk: boolean;
  highRiskThreshold: number; // 0-1, above this = auto-delete
  retentionPeriod: number; // days to keep quarantined items
  enableWhitelist: boolean;
  whitelistPatterns: string[];
  enableBlacklist: boolean;
  blacklistPatterns: string[];
}

export interface QuarantineEvent {
  id: string;
  timestamp: Date;
  itemId: string;
  itemName: string;
  action: 'quarantined' | 'deleted' | 'released' | 'flagged';
  reason: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  categories: string[];
  userId?: string;
  ipAddress?: string;
  deviceInfo?: string;
  autoAction: boolean;
  reviewed: boolean;
  reviewerId?: string;
  reviewDate?: Date;
  reviewNotes?: string;
}

export interface QuarantineStats {
  totalEvents: number;
  quarantinedItems: number;
  deletedItems: number;
  releasedItems: number;
  pendingReview: number;
  highRiskItems: number;
  averageConfidence: number;
  falsePositiveRate: number;
  detectionAccuracy: number;
  lastScanDate?: Date;
  nextScanDate?: Date;
}

export interface SafetyPolicy {
  id: string;
  name: string;
  description: string;
  rules: SafetyRule[];
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafetyRule {
  id: string;
  name: string;
  condition: string;
  action: 'quarantine' | 'delete' | 'flag' | 'notify';
  threshold: number;
  categories: string[];
  enabled: boolean;
}

export interface UserSafetyProfile {
  userId: string;
  username: string;
  role: 'admin' | 'moderator' | 'user' | 'child';
  safetyLevel: 'strict' | 'moderate' | 'relaxed';
  parentalControls?: {
    enabled: boolean;
    restrictedContent: string[];
    timeLimits: {
      startTime: string;
      endTime: string;
      allowedDays: number[];
    };
    requireApproval: boolean;
    approvalQueue: string[];
  };
  quarantinePermissions: {
    canViewQuarantined: boolean;
    canReleaseItems: boolean;
    canDeleteItems: boolean;
    canManagePolicies: boolean;
  };
}

class AutoQuarantineSystem {
  private config: QuarantineConfig;
  private quarantineEvents: QuarantineEvent[] = [];
  private safetyPolicies: SafetyPolicy[] = [];
  private userProfiles: Map<string, UserSafetyProfile> = new Map();
  private scanInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(config?: Partial<QuarantineConfig>) {
    this.config = {
      enableAutoQuarantine: true,
      quarantineThreshold: 0.8,
      enableRealTimeScanning: true,
      scanInterval: 30, // 30 minutes
      enableNotifications: true,
      autoDeleteHighRisk: false,
      highRiskThreshold: 0.95,
      retentionPeriod: 30, // 30 days
      enableWhitelist: true,
      whitelistPatterns: [],
      enableBlacklist: true,
      blacklistPatterns: ['nsfw', 'explicit', 'adult'],
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize default safety policies
      this.initializeDefaultPolicies();
      
      // Start real-time scanning if enabled
      if (this.config.enableRealTimeScanning) {
        this.startRealTimeScanning();
      }

      this.isInitialized = true;
      console.log('Auto Quarantine System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Auto Quarantine System:', error);
      throw new Error('Auto Quarantine System initialization failed');
    }
  }

  private initializeDefaultPolicies(): void {
    const defaultPolicies: SafetyPolicy[] = [
      {
        id: 'family-safety',
        name: 'Family Safety Policy',
        description: 'Protect families from inappropriate content',
        rules: [
          {
            id: 'nsfw-detection',
            name: 'NSFW Content Detection',
            condition: 'isNsfw == true',
            action: 'quarantine',
            threshold: 0.8,
            categories: ['nsfw', 'explicit', 'adult'],
            enabled: true
          },
          {
            id: 'high-risk-detection',
            name: 'High Risk Content',
            condition: 'riskLevel == "critical"',
            action: 'delete',
            threshold: 0.95,
            categories: ['illegal', 'harmful', 'dangerous'],
            enabled: true
          }
        ],
        isActive: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'enterprise-security',
        name: 'Enterprise Security Policy',
        description: 'Maintain professional workplace standards',
        rules: [
          {
            id: 'workplace-appropriate',
            name: 'Workplace Appropriate Content',
            condition: 'categories.includes("suggestive") || categories.includes("adult")',
            action: 'quarantine',
            threshold: 0.7,
            categories: ['suggestive', 'adult', 'inappropriate'],
            enabled: true
          }
        ],
        isActive: true,
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.safetyPolicies = defaultPolicies;
  }

  // Process a new image through the quarantine system
  async processImage(
    imageBase64: string,
    itemId: string,
    itemName: string,
    userId?: string,
    additionalContext?: {
      ipAddress?: string;
      deviceInfo?: string;
      source?: string;
    }
  ): Promise<QuarantineEvent | null> {
    if (!this.isInitialized) {
      throw new Error('Auto Quarantine System not initialized');
    }

    try {
      // Check whitelist first
      if (this.config.enableWhitelist && this.isWhitelisted(itemName)) {
        return null; // Skip quarantine for whitelisted items
      }

      // Perform NSFW detection
      const detectionResult = await nsfwDetectionService.analyzeImage(imageBase64, itemId);

      // Check if item should be quarantined based on policies
      const quarantineDecision = this.evaluateQuarantineDecision(detectionResult, itemName);

      if (quarantineDecision.shouldQuarantine) {
        // Create quarantine event
        const event: QuarantineEvent = {
          id: crypto.randomBytes(16).toString('hex'),
          timestamp: new Date(),
          itemId,
          itemName,
          action: quarantineDecision.action,
          reason: quarantineDecision.reason,
          riskLevel: detectionResult.riskLevel,
          confidence: detectionResult.confidence,
          categories: detectionResult.categories,
          userId,
          ipAddress: additionalContext?.ipAddress,
          deviceInfo: additionalContext?.deviceInfo,
          autoAction: true,
          reviewed: false
        };

        // Execute the quarantine action
        await this.executeQuarantineAction(event, detectionResult);

        // Store the event
        this.quarantineEvents.push(event);

        // Send notifications if enabled
        if (this.config.enableNotifications) {
          await this.sendQuarantineNotification(event);
        }

        return event;
      }

      return null;
    } catch (error) {
      console.error('Error processing image for quarantine:', error);
      throw error;
    }
  }

  private isWhitelisted(itemName: string): boolean {
    return this.config.whitelistPatterns.some(pattern => 
      itemName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private isBlacklisted(itemName: string): boolean {
    return this.config.blacklistPatterns.some(pattern => 
      itemName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private evaluateQuarantineDecision(
    detectionResult: NSFWDetectionResult,
    itemName: string
  ): {
    shouldQuarantine: boolean;
    action: 'quarantined' | 'deleted' | 'flagged';
    reason: string;
  } {
    // Check blacklist
    if (this.config.enableBlacklist && this.isBlacklisted(itemName)) {
      return {
        shouldQuarantine: true,
        action: 'quarantined',
        reason: 'Item matches blacklist pattern'
      };
    }

    // Check NSFW detection
    if (detectionResult.isNsfw && detectionResult.confidence >= this.config.quarantineThreshold) {
      // Check for high-risk auto-delete
      if (this.config.autoDeleteHighRisk && detectionResult.confidence >= this.config.highRiskThreshold) {
        return {
          shouldQuarantine: true,
          action: 'deleted',
          reason: `High-risk NSFW content detected (${Math.round(detectionResult.confidence * 100)}% confidence)`
        };
      }

      return {
        shouldQuarantine: true,
        action: 'quarantined',
        reason: `NSFW content detected (${Math.round(detectionResult.confidence * 100)}% confidence)`
      };
    }

    // Check safety policies
    for (const policy of this.safetyPolicies.filter(p => p.isActive)) {
      for (const rule of policy.rules.filter(r => r.enabled)) {
        if (this.evaluateRule(rule, detectionResult)) {
          return {
            shouldQuarantine: true,
            action: rule.action === 'delete' ? 'deleted' : 
                   rule.action === 'flag' ? 'flagged' : 'quarantined',
            reason: `Policy violation: ${rule.name}`
          };
        }
      }
    }

    return {
      shouldQuarantine: false,
      action: 'quarantined',
      reason: ''
    };
  }

  private evaluateRule(rule: SafetyRule, detectionResult: NSFWDetectionResult): boolean {
    // Simple rule evaluation - can be extended with more complex logic
    if (rule.categories.length > 0) {
      const hasMatchingCategory = rule.categories.some(cat => 
        detectionResult.categories.includes(cat)
      );
      if (!hasMatchingCategory) return false;
    }

    return detectionResult.confidence >= rule.threshold;
  }

  private async executeQuarantineAction(event: QuarantineEvent, detectionResult: NSFWDetectionResult): Promise<void> {
    try {
      switch (event.action) {
        case 'quarantined':
          await secureVault.quarantineItem(event.itemId, event.reason, event.riskLevel);
          break;
        case 'deleted':
          await secureVault.removeItem(event.itemId, true); // Secure delete
          break;
        case 'flagged':
          // Flag for review - just log the event
          break;
      }
    } catch (error) {
      console.error(`Failed to execute quarantine action ${event.action}:`, error);
      throw error;
    }
  }

  private async sendQuarantineNotification(event: QuarantineEvent): Promise<void> {
    // In a real implementation, this would send emails, push notifications, etc.
    console.log(`Quarantine Notification: ${event.itemName} was ${event.action} - ${event.reason}`);
    
    // Send admin alerts if enabled
    if (this.config.enableAdminAlerts && event.riskLevel === 'critical') {
      console.log(`ADMIN ALERT: Critical risk item detected - ${event.itemName}`);
    }
  }

  // Start real-time scanning
  private startRealTimeScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }

    this.scanInterval = setInterval(async () => {
      await this.performScheduledScan();
    }, this.config.scanInterval * 60 * 1000);
  }

  // Stop real-time scanning
  stopRealTimeScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  // Perform scheduled scan of all items
  private async performScheduledScan(): Promise<void> {
    try {
      console.log('Performing scheduled safety scan...');
      
      // Get all non-quarantined items from vault
      const items = secureVault.getItems({ isQuarantined: false });
      
      for (const item of items) {
        try {
          // For each item, we would need to decrypt and re-analyze
          // This is a simplified version - in practice, you'd need to handle decryption securely
          const { data, metadata } = await secureVault.getItem(item.id);
          const imageBase64 = data.toString('base64');
          
          await this.processImage(
            imageBase64,
            item.id,
            item.name,
            undefined,
            { source: 'scheduled-scan' }
          );
        } catch (error) {
          console.error(`Failed to scan item ${item.id}:`, error);
        }
      }

      console.log(`Scheduled scan completed. Processed ${items.length} items.`);
    } catch (error) {
      console.error('Scheduled scan failed:', error);
    }
  }

  // Get quarantine statistics
  getStats(): QuarantineStats {
    const totalEvents = this.quarantineEvents.length;
    const quarantinedItems = this.quarantineEvents.filter(e => e.action === 'quarantined').length;
    const deletedItems = this.quarantineEvents.filter(e => e.action === 'deleted').length;
    const releasedItems = this.quarantineEvents.filter(e => e.action === 'released').length;
    const pendingReview = this.quarantineEvents.filter(e => !e.reviewed).length;
    const highRiskItems = this.quarantineEvents.filter(e => e.riskLevel === 'critical').length;
    
    const avgConfidence = totalEvents > 0 
      ? this.quarantineEvents.reduce((sum, e) => sum + e.confidence, 0) / totalEvents 
      : 0;

    // Calculate false positive rate (simplified)
    const falsePositiveRate = releasedItems / Math.max(quarantinedItems, 1);
    const detectionAccuracy = 1 - falsePositiveRate;

    return {
      totalEvents,
      quarantinedItems,
      deletedItems,
      releasedItems,
      pendingReview,
      highRiskItems,
      averageConfidence: avgConfidence,
      falsePositiveRate,
      detectionAccuracy,
      lastScanDate: new Date(), // Would track actual last scan time
      nextScanDate: new Date(Date.now() + this.config.scanInterval * 60 * 1000)
    };
  }

  // Get quarantine events
  getEvents(filter?: {
    action?: QuarantineEvent['action'];
    riskLevel?: QuarantineEvent['riskLevel'];
    userId?: string;
    reviewed?: boolean;
    limit?: number;
  }): QuarantineEvent[] {
    let events = [...this.quarantineEvents].reverse(); // Most recent first

    if (filter) {
      events = events.filter(event => {
        if (filter.action && event.action !== filter.action) return false;
        if (filter.riskLevel && event.riskLevel !== filter.riskLevel) return false;
        if (filter.userId && event.userId !== filter.userId) return false;
        if (filter.reviewed !== undefined && event.reviewed !== filter.reviewed) return false;
        return true;
      });
    }

    return filter?.limit ? events.slice(0, filter.limit) : events;
  }

  // Review a quarantine event
  async reviewEvent(
    eventId: string,
    reviewerId: string,
    action: 'approve' | 'reject' | 'release',
    notes?: string
  ): Promise<void> {
    const event = this.quarantineEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    event.reviewed = true;
    event.reviewerId = reviewerId;
    event.reviewDate = new Date();
    event.reviewNotes = notes;

    if (action === 'release') {
      // Release the item from quarantine
      try {
        const item = secureVault.getItems().find(i => i.id === event.itemId);
        if (item) {
          item.isQuarantined = false;
          item.quarantineReason = undefined;
          event.action = 'released';
        }
      } catch (error) {
        console.error('Failed to release item:', error);
      }
    }

    console.log(`Event ${eventId} reviewed by ${reviewerId}: ${action}`);
  }

  // Manage safety policies
  addSafetyPolicy(policy: Omit<SafetyPolicy, 'id' | 'createdAt' | 'updatedAt'>): SafetyPolicy {
    const newPolicy: SafetyPolicy = {
      ...policy,
      id: crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.safetyPolicies.push(newPolicy);
    return newPolicy;
  }

  updateSafetyPolicy(policyId: string, updates: Partial<SafetyPolicy>): void {
    const policy = this.safetyPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error('Policy not found');
    }

    Object.assign(policy, updates, { updatedAt: new Date() });
  }

  deleteSafetyPolicy(policyId: string): void {
    this.safetyPolicies = this.safetyPolicies.filter(p => p.id !== policyId);
  }

  getSafetyPolicies(): SafetyPolicy[] {
    return [...this.safetyPolicies];
  }

  // User profile management
  addUserProfile(profile: UserSafetyProfile): void {
    this.userProfiles.set(profile.userId, profile);
  }

  getUserProfile(userId: string): UserSafetyProfile | undefined {
    return this.userProfiles.get(userId);
  }

  updateUserProfile(userId: string, updates: Partial<UserSafetyProfile>): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    Object.assign(profile, updates);
  }

  // Update configuration
  updateConfig(newConfig: Partial<QuarantineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart real-time scanning if needed
    if (this.config.enableRealTimeScanning && !this.scanInterval) {
      this.startRealTimeScanning();
    } else if (!this.config.enableRealTimeScanning && this.scanInterval) {
      this.stopRealTimeScanning();
    }
  }

  getConfig(): QuarantineConfig {
    return { ...this.config };
  }

  // Clean up old events
  cleanupOldEvents(retentionDays: number = this.config.retentionPeriod): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    this.quarantineEvents = this.quarantineEvents.filter(event => 
      event.timestamp > cutoffDate
    );
  }
}

// Export singleton instance
export const autoQuarantineSystem = new AutoQuarantineSystem();

// Export types and utilities
export type { QuarantineConfig, QuarantineEvent, QuarantineStats, SafetyPolicy, SafetyRule, UserSafetyProfile };