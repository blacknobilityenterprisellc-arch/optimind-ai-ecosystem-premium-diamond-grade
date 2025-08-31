/**
 * validators.ts
 * AJV-based validation for moderation outputs with canonical schema
 */

import Ajv from 'ajv';
import schema from '../schemas/moderation.schema.json';

const ajv = new Ajv({ strict: false });
export const validateModeration = ajv.compile(schema);

export interface ModerationResult {
  labels: Array<{
    label: string;
    score: number;
    region?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  }>;
  reasons?: string[];
  saliency_base64?: string | null;
  provenance: {
    model: string;
    version?: string;
  };
}

export function assertValidModeration(obj: any): ModerationResult {
  const valid = validateModeration(obj);
  if (!valid) {
    const err = validateModeration.errors;
    throw new Error('Moderation schema validation failed: ' + JSON.stringify(err));
  }
  return obj as ModerationResult;
}

/**
 * Safe validation with fallback for operational resilience
 */
export function safeValidateModeration(obj: any, allowLenient: boolean = false): ModerationResult {
  try {
    return assertValidModeration(obj);
  } catch (error) {
    if (allowLenient) {
      // Return minimal safe object for operational continuity
      return {
        labels: [],
        reasons: ['model_parse_error'],
        provenance: {
          model: obj?.provenance?.model || 'unknown',
          version: obj?.provenance?.version || undefined
        }
      };
    }
    throw error;
  }
}

/**
 * Extract JSON from model response with fallback parsing
 */
export function extractJsonFromResponse(response: string): any {
  try {
    return JSON.parse(response);
  } catch {
    // Attempt to extract first JSON block
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in model response');
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error('Failed to parse extracted JSON block');
    }
  }
}

/**
 * Check if result contains high-sensitivity labels requiring human review
 */
export function requiresHumanReview(result: ModerationResult): boolean {
  const highSensitivityLabels = [
    'child_exposed',
    'deepfake_suspected', 
    'sexual_nudity'
  ];
  
  const hasHighSensitivity = result.labels.some(label => 
    highSensitivityLabels.includes(label.label) && label.score >= 0.6
  );
  
  // Special rule: child_detected + any sexual label
  const hasChild = result.labels.some(label => 
    label.label === 'child_detected' && label.score >= 0.6
  );
  const hasSexual = result.labels.some(label => 
    label.label.includes('sexual') && label.score >= 0.1
  );
  
  return hasHighSensitivity || (hasChild && hasSexual);
}