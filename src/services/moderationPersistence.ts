/**
 * moderationPersistence.ts
 * Database persistence layer for moderation analysis results
 * Handles storing analysis results, failures, and review items
 */

import { db } from '@/lib/db';
import { AnalysisType, ReviewPriority, ReviewStatus } from '@prisma/client';
import { ModelResult, ConsensusResult } from '@/types';

export interface PersistAnalysisInput {
  type: AnalysisType;
  inputRef: string;
  labels: Array<{ label: string; score: number; region?: any }>;
  reasons?: string[];
  provenance: { model: string; version?: string };
  rawOutput?: any;
  reviewNeeded: boolean;
}

export interface FlagFailureInput {
  inputRef: string;
  error: string;
  details?: string;
  metadata?: Record<string, any>;
}

/**
 * Persist a successful analysis result to the database
 */
export async function persistAnalysisResult(input: PersistAnalysisInput) {
  try {
    const analysis = await db.moderationAnalysis.create({
      data: {
        inputRef: input.inputRef,
        type: input.type,
        labels: input.labels,
        reasons: input.reasons || [],
        provenance: input.provenance,
        rawOutput: input.rawOutput,
        reviewNeeded: input.reviewNeeded,
      },
    });

    // If review is needed, create a review item
    if (input.reviewNeeded) {
      await createReviewItem(input.inputRef, input.labels, input.reasons || []);
    }

    // Log the analysis event
    await logAuditEvent('analysis_completed', {
      inputRef: input.inputRef,
      type: input.type,
      reviewNeeded: input.reviewNeeded,
      analysisId: analysis.id,
    });

    return analysis;
  } catch (error) {
    console.error('[moderationPersistence] Failed to persist analysis:', error);
    throw new Error(`Failed to persist analysis: ${(error as Error).message}`);
  }
}

/**
 * Flag an analysis as failed and persist the failure for auditing
 */
export async function flagAnalysisAsFailed(inputRef: string, failure: FlagFailureInput) {
  try {
    const failedAnalysis = await db.moderationAnalysis.create({
      data: {
        inputRef: inputRef,
        type: AnalysisType.CONSENSUS, // Use consensus as the fallback type
        labels: [{ label: 'analysis_failed', score: 1.0 }],
        reasons: [`Analysis failed: ${failure.error}`, ...(failure.details ? [failure.details] : [])],
        provenance: { model: 'system', version: '1.0' },
        rawOutput: {
          error: failure.error,
          details: failure.details,
          metadata: failure.metadata,
          timestamp: new Date().toISOString(),
        },
        reviewNeeded: true, // Failed analyses always need review
      },
    });

    // Create a high-priority review item for failures
    await createReviewItem(inputRef, [{ label: 'analysis_failed', score: 1.0 }], [
      `Analysis failed: ${failure.error}`,
      ...(failure.details ? [failure.details] : [])
    ], ReviewPriority.HIGH);

    // Log the failure event
    await logAuditEvent('analysis_failed', {
      inputRef,
      error: failure.error,
      details: failure.details,
      metadata: failure.metadata,
      analysisId: failedAnalysis.id,
    });

    return failedAnalysis;
  } catch (error) {
    console.error('[moderationPersistence] Failed to flag analysis as failed:', error);
    throw new Error(`Failed to flag analysis failure: ${(error as Error).message}`);
  }
}

/**
 * Create a review item for human moderation
 */
async function createReviewItem(
  imageId: string,
  labels: Array<{ label: string; score: number }>,
  reasons: string[],
  priority: ReviewPriority = ReviewPriority.MEDIUM
) {
  try {
    // Determine priority based on labels and scores
    const calculatedPriority = calculateReviewPriority(labels, reasons);
    
    const reviewItem = await db.reviewItem.create({
      data: {
        imageId,
        priority: calculatedPriority,
        reasons: reasons,
        metadata: {
          labels,
          severity: calculateSeverity(labels),
          triggeredAt: new Date().toISOString(),
        },
      },
    });

    // Log review item creation
    await logAuditEvent('review_item_created', {
      imageId,
      reviewItemId: reviewItem.id,
      priority: calculatedPriority,
      reasons,
    });

    return reviewItem;
  } catch (error) {
    console.error('[moderationPersistence] Failed to create review item:', error);
    throw new Error(`Failed to create review item: ${(error as Error).message}`);
  }
}

/**
 * Calculate review priority based on labels and scores
 */
function calculateReviewPriority(
  labels: Array<{ label: string; score: number }>,
  reasons: string[]
): ReviewPriority {
  // Check for critical labels
  const criticalLabels = ['child_exposed', 'sexual_nudity', 'deepfake_suspected', 'violence'];
  const hasCriticalLabel = labels.some(l => 
    criticalLabels.includes(l.label) && l.score >= 0.6
  );

  if (hasCriticalLabel) {
    return ReviewPriority.CRITICAL;
  }

  // Check for high-confidence sensitive content
  const sensitiveLabels = ['suggestive', 'partial_nudity', 'hate_symbols'];
  const hasHighConfidenceSensitive = labels.some(l => 
    sensitiveLabels.includes(l.label) && l.score >= 0.8
  );

  if (hasHighConfidenceSensitive) {
    return ReviewPriority.HIGH;
  }

  // Check for analysis failures
  const hasFailure = reasons.some(r => r.includes('failed') || r.includes('error'));
  if (hasFailure) {
    return ReviewPriority.HIGH;
  }

  // Default to medium priority for review-needed items
  return ReviewPriority.MEDIUM;
}

/**
 * Calculate severity score for review metadata
 */
function calculateSeverity(labels: Array<{ label: string; score: number }>): number {
  const severityWeights: Record<string, number> = {
    'child_exposed': 1.0,
    'sexual_nudity': 0.9,
    'deepfake_suspected': 0.85,
    'violence': 0.8,
    'hate_symbols': 0.75,
    'suggestive': 0.6,
    'partial_nudity': 0.5,
    'analysis_failed': 0.7,
  };

  let maxSeverity = 0;
  for (const label of labels) {
    const weight = severityWeights[label.label] || 0.3;
    const severity = label.score * weight;
    maxSeverity = Math.max(maxSeverity, severity);
  }

  return Math.round(maxSeverity * 100) / 100;
}

/**
 * Log an audit event for tracking and compliance
 */
async function logAuditEvent(event: string, payload: any, actor?: string) {
  try {
    await db.auditLog.create({
      data: {
        event,
        actor: actor || 'system',
        payload,
      },
    });
  } catch (error) {
    console.error('[moderationPersistence] Failed to log audit event:', error);
    // Don't throw here - audit logging failures shouldn't break the main flow
  }
}

/**
 * Get analysis history for a specific input reference
 */
export async function getAnalysisHistory(inputRef: string) {
  try {
    const analyses = await db.moderationAnalysis.findMany({
      where: { inputRef },
      orderBy: { createdAt: 'desc' },
    });

    const reviewItems = await db.reviewItem.findMany({
      where: { imageId: inputRef },
      orderBy: { createdAt: 'desc' },
    });

    return {
      analyses,
      reviewItems,
    };
  } catch (error) {
    console.error('[moderationPersistence] Failed to get analysis history:', error);
    throw new Error(`Failed to get analysis history: ${(error as Error).message}`);
  }
}

/**
 * Get pending review items with optional filtering
 */
export async function getPendingReviewItems(options: {
  priority?: ReviewPriority;
  assignedTo?: string;
  limit?: number;
  offset?: number;
} = {}) {
  try {
    const { priority, assignedTo, limit = 50, offset = 0 } = options;

    const where: any = { status: ReviewStatus.PENDING };
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const items = await db.reviewItem.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: limit,
      skip: offset,
    });

    return items;
  } catch (error) {
    console.error('[moderationPersistence] Failed to get pending review items:', error);
    throw new Error(`Failed to get pending review items: ${(error as Error).message}`);
  }
}

/**
 * Update a review item status and decision
 */
export async function updateReviewItem(
  reviewId: string,
  updates: {
    status?: ReviewStatus;
    assignedTo?: string;
    reviewDecision?: string;
    reviewNotes?: string;
    completedAt?: Date;
  },
  actor?: string
) {
  try {
    const updatedItem = await db.reviewItem.update({
      where: { id: reviewId },
      data: updates,
    });

    // Update the corresponding analysis if a decision was made
    if (updates.reviewDecision) {
      const analysis = await db.moderationAnalysis.findFirst({
        where: { inputRef: updatedItem.imageId },
        orderBy: { createdAt: 'desc' },
      });

      if (analysis) {
        await db.moderationAnalysis.update({
          where: { id: analysis.id },
          data: {
            reviewedAt: new Date(),
            reviewedBy: actor,
            reviewDecision: updates.reviewDecision,
            reviewNotes: updates.reviewNotes,
          },
        });
      }
    }

    // Log the review update
    await logAuditEvent('review_item_updated', {
      reviewId,
      updates,
      actor,
    });

    return updatedItem;
  } catch (error) {
    console.error('[moderationPersistence] Failed to update review item:', error);
    throw new Error(`Failed to update review item: ${(error as Error).message}`);
  }
}