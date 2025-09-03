/**
 * thresholdMapping.ts
 * Recommended threshold mapping and action determination for moderation results
 */

import { ModerationResult } from './validators';

export interface ThresholdConfig {
  quarantine: number;
  review: number;
  allow: number;
}

export interface ModerationAction {
  action: 'quarantine' | 'review' | 'allow' | 'escalate';
  confidence: number;
  reasons: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresHumanReview: boolean;
}

/**
 * Default threshold configuration
 */
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  quarantine: 0.90,
  review: 0.75,
  allow: 0.50
};

/**
 * Special sensitivity rules that override default thresholds
 */
export interface SensitivityRule {
  name: string;
  condition: (result: ModerationResult) => boolean;
  action: Omit<ModerationAction, 'confidence' | 'reasons'>;
  reason: string;
}

export const SENSITIVITY_RULES: SensitivityRule[] = [
  {
    name: 'child_safety_critical',
    condition: (result) => {
      const hasChild = result.labels.some(l => 
        l.label === 'child_detected' && l.score >= 0.6
      );
      const hasSexual = result.labels.some(l => 
        l.label.includes('sexual') && l.score >= 0.1
      );
      return hasChild && hasSexual;
    },
    action: {
      action: 'escalate',
      priority: 'critical',
      requiresHumanReview: true
    },
    reason: 'Child detected with sexual content - immediate escalation required'
  },
  
  {
    name: 'deepfake_high_confidence',
    condition: (result) => {
      return result.labels.some(l => 
        l.label === 'deepfake_suspected' && l.score >= 0.6
      );
    },
    action: {
      action: 'review',
      priority: 'high',
      requiresHumanReview: true
    },
    reason: 'Deepfake suspected with high confidence - forensic review required'
  },
  
  {
    name: 'child_exposed',
    condition: (result) => {
      return result.labels.some(l => 
        l.label === 'child_exposed' && l.score >= 0.5
      );
    },
    action: {
      action: 'quarantine',
      priority: 'critical',
      requiresHumanReview: true
    },
    reason: 'Child exposed content detected - immediate quarantine required'
  },
  
  {
    name: 'sexual_nudity_high',
    condition: (result) => {
      return result.labels.some(l => 
        l.label === 'sexual_nudity' && l.score >= 0.8
      );
    },
    action: {
      action: 'quarantine',
      priority: 'high',
      requiresHumanReview: true
    },
    reason: 'High confidence sexual nudity detected - quarantine required'
  }
];

/**
 * Determine moderation action based on thresholds and sensitivity rules
 */
export function determineModerationAction(
  result: ModerationResult,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
): ModerationAction {
  const topScore = Math.max(...result.labels.map(l => l.score), 0);
  const reasons: string[] = [];

  // Check sensitivity rules first (they override default thresholds)
  for (const rule of SENSITIVITY_RULES) {
    if (rule.condition(result)) {
      reasons.push(rule.reason);
      return {
        ...rule.action,
        confidence: topScore,
        reasons
      };
    }
  }

  // Default threshold-based logic
  let action: ModerationAction['action'];
  let priority: ModerationAction['priority'];
  let requiresHumanReview = false;

  if (topScore >= thresholds.quarantine) {
    action = 'quarantine';
    priority = 'high';
    requiresHumanReview = true;
    reasons.push(`Score ${topScore.toFixed(2)} exceeds quarantine threshold ${thresholds.quarantine}`);
  } else if (topScore >= thresholds.review) {
    action = 'review';
    priority = 'medium';
    requiresHumanReview = true;
    reasons.push(`Score ${topScore.toFixed(2)} exceeds review threshold ${thresholds.review}`);
  } else if (topScore >= thresholds.allow) {
    action = 'allow';
    priority = 'low';
    requiresHumanReview = false;
    reasons.push(`Score ${topScore.toFixed(2)} within allow threshold`);
  } else {
    action = 'allow';
    priority = 'low';
    requiresHumanReview = false;
    reasons.push(`Score ${topScore.toFixed(2)} below allow threshold`);
  }

  // Additional context-based adjustments
  const highSensitivityLabels = result.labels.filter(l => 
    ['child_exposed', 'deepfake_suspected', 'sexual_nudity'].includes(l.label) && l.score >= 0.4
  );

  if (highSensitivityLabels.length > 0 && action === 'allow') {
    action = 'review';
    priority = 'medium';
    requiresHumanReview = true;
    reasons.push('High-sensitivity labels detected near threshold - human review recommended');
  }

  return {
    action,
    confidence: topScore,
    reasons,
    priority,
    requiresHumanReview
  };
}

/**
 * Check if content requires immediate escalation
 */
export function requiresEscalation(result: ModerationResult): boolean {
  return SENSITIVITY_RULES.some(rule => 
    rule.condition(result) && rule.action.action === 'escalate'
  );
}

/**
 * Get recommended handling based on moderation result
 */
export function getHandlingRecommendation(result: ModerationResult): {
  action: ModerationAction;
  handlingSteps: string[];
  timeline: 'immediate' | 'within_hour' | 'within_day' | 'standard';
} {
  const action = determineModerationAction(result);
  
  let handlingSteps: string[] = [];
  let timeline: 'immediate' | 'within_hour' | 'within_day' | 'standard' = 'standard';

  switch (action.action) {
    case 'quarantine':
      handlingSteps = [
        'Immediately quarantine content',
        'Remove from public access',
        'Log quarantine event',
        'Notify moderation team',
        'Schedule human review'
      ];
      timeline = action.priority === 'critical' ? 'immediate' : 'within_hour';
      break;
      
    case 'review':
      handlingSteps = [
        'Enqueue for human review',
        'Flag for priority attention',
        'Preserve original content',
        'Log review request'
      ];
      timeline = action.priority === 'high' ? 'within_hour' : 'within_day';
      break;
      
    case 'escalate':
      handlingSteps = [
        'Immediate escalation to legal/compliance',
        'Preserve all evidence',
        'Notify senior moderators',
        'Document escalation rationale',
        'Engage legal counsel if necessary'
      ];
      timeline = 'immediate';
      break;
      
    case 'allow':
      handlingSteps = [
        'Allow content publication',
        'Log approval decision',
        'Monitor for future reports'
      ];
      timeline = 'standard';
      break;
  }

  if (action.requiresHumanReview) {
    handlingSteps.push('Human review required before final decision');
  }

  return {
    action,
    handlingSteps,
    timeline
  };
}

/**
 * Configuration for different content policies
 */
export const POLICY_CONFIGS = {
  strict: {
    thresholds: { quarantine: 0.75, review: 0.60, allow: 0.40 },
    description: 'Strict policy for sensitive environments'
  },
  standard: {
    thresholds: DEFAULT_THRESHOLDS,
    description: 'Standard balanced policy'
  },
  lenient: {
    thresholds: { quarantine: 0.95, review: 0.85, allow: 0.60 },
    description: 'Lenient policy for creative/educational content'
  }
};