/**
 * zaiIntegration.ts
 * End-to-end orchestration:
 *  - calls GLM-4.5V (vision), GLM-4.5-AIR (advanced reasoning), and GLM-4.5 (text)
 *  - validates outputs via AJV
 *  - persists raw AI outputs to SQLite via Prisma
 *  - computes a sophisticated consensus and persists it
 *  - marks reviewNeeded when thresholds/critical labels found
 *  - handles failures gracefully with proper auditing
 *
 * Usage:
 *   const integr = new ZaiIntegration({ zaiApiKey: process.env.ZAI_API_KEY });
 *   const result = await integr.analyzeAndPersistImage(imageId, imageBuffer, uploadMetadata);
 */

import { ZaiClient } from './zaiClient';
import { zaiVisionAnalyze } from './zaiVision';
import { zaiTextReasoning } from './zaiText';
import { zaiAirAnalyze } from './zaiAir';
import { assertValidModeration } from './validators';
import { persistAnalysisResult, flagAnalysisAsFailed } from './moderationPersistence';
import { AnalysisType } from '@prisma/client';
import { computeConsensus } from './imageAnalysis';
import { AdaptiveConsensusEngine } from './adaptiveConsensus';
import pLimit from 'p-limit';

const DEFAULT_TIMEOUT_MS = Number(process.env.ZAI_CALL_TIMEOUT_MS || 30000);

export interface ZaiIntegrationConfig {
  zaiApiKey: string;
  visionModel?: string;
  textModel?: string;
  airModel?: string;
  maxConcurrency?: number;
  enableAIR?: boolean;
  enableAdaptiveConsensus?: boolean;
  adaptiveConfig?: any;
}

export class ZaiIntegration {
  client: ZaiClient;
  visionModel: string;
  textModel: string;
  airModel: string;
  enableAIR: boolean;
  enableAdaptiveConsensus: boolean;
  adaptiveEngine: AdaptiveConsensusEngine;
  limit: ReturnType<typeof pLimit>;

  constructor(cfg: Partial<ZaiIntegrationConfig>) {
    if (!cfg.zaiApiKey) {
      throw new Error('ZAI API key required for ZaiIntegration');
    }

    this.client = new ZaiClient({ 
      apiKey: cfg.zaiApiKey, 
      apiUrl: process.env.ZAI_API_URL 
    });
    
    this.visionModel = cfg.visionModel || process.env.ZAI_VISION_MODEL || 'GLM-4.5V';
    this.textModel = cfg.textModel || process.env.ZAI_TEXT_MODEL || 'GLM-4.5';
    this.airModel = cfg.airModel || process.env.ZAI_AIR_MODEL || 'GLM-4.5-AIR';
    this.enableAIR = cfg.enableAIR ?? true;
    this.enableAdaptiveConsensus = cfg.enableAdaptiveConsensus ?? true;
    this.limit = pLimit(cfg.maxConcurrency ?? 2);
    
    // Initialize adaptive consensus engine
    this.adaptiveEngine = new AdaptiveConsensusEngine(cfg.adaptiveConfig);
  }

  /**
   * Primary method: analyze image buffer and persist all artifacts.
   * Returns a summary that includes persisted DB records (IDs) or failure info.
   */
  async analyzeAndPersistImage(
    imageId: string, 
    imageBuffer: Buffer, 
    uploadContext: Record<string, any>
  ) {
    console.log(`[zaiIntegration] Starting analysis for image ${imageId}`);

    // Run vision, AIR (if enabled), and text in parallel with limited concurrency
    const tasks = [
      this.limit(() => this.runVision(imageId, imageBuffer, uploadContext)),
    ];

    if (this.enableAIR) {
      tasks.push(this.limit(() => this.runAIR(imageId, imageBuffer, uploadContext)));
    }

    tasks.push(this.limit(() => this.runText(imageId, imageBuffer, uploadContext)));

    const results = await Promise.allSettled(tasks);
    const [visionResult, airResult, textResult] = results.map(r => 
      r.status === 'fulfilled' ? r.value : null
    );

    // If all models failed, mark overall failure
    const successfulResults = [visionResult, airResult, textResult].filter(Boolean);
    if (successfulResults.length === 0) {
      await flagAnalysisAsFailed(imageId, { 
        error: 'all_models_failed',
        details: 'Vision, AIR, and Text analysis all failed'
      });
      return { 
        success: false, 
        reason: 'all_models_failed',
        error: 'All analysis models failed'
      };
    }

    // Compute consensus using the sophisticated consensus calculator
    let consensus;
    try {
      const modelResults = [];
      if (visionResult?.raw) modelResults.push(visionResult.rawModelMapped);
      if (airResult?.raw) modelResults.push(airResult.rawModelMapped);
      if (textResult?.raw) modelResults.push(textResult.rawModelMapped);

      // Use adaptive consensus if enabled, otherwise fall back to original
      if (this.enableAdaptiveConsensus && modelResults.length > 0) {
        consensus = this.adaptiveEngine.computeAdaptiveConsensus(modelResults);
      } else {
        consensus = computeConsensus(modelResults);
      }
    } catch (err) {
      console.warn('[zaiIntegration] consensus computation failed', (err as Error).message);
      consensus = {
        topLabel: 'unknown',
        score: 0,
        spread: 0,
        allLabels: [],
        provenance: { models: [], timestamp: new Date().toISOString() },
        recommendedAction: 'monitor',
        reasons: ['consensus_failure'],
      };
    }

    // Determine whether human review is needed per policy
    const reviewNeeded = this.determineReviewNeed(consensus, successfulResults.length);

    // Persist consensus as an analysis record
    try {
      const persisted = await persistAnalysisResult({
        type: AnalysisType.CONSENSUS,
        inputRef: imageId,
        labels: consensus.allLabels || [{ label: consensus.topLabel, score: consensus.score }],
        reasons: consensus.reasons || [],
        provenance: consensus.provenance || { model: 'consensus', version: '1' },
        rawOutput: consensus,
        reviewNeeded,
      });

      console.log(`[zaiIntegration] Analysis completed for ${imageId}`, {
        success: true,
        consensus: {
          topLabel: consensus.topLabel,
          score: consensus.score,
          action: consensus.recommendedAction,
        },
        reviewNeeded,
        persistedId: persisted.id,
      });

      return {
        success: true,
        persistedId: persisted.id,
        consensus,
        vision: visionResult?.persisted,
        air: airResult?.persisted,
        text: textResult?.persisted,
      };
    } catch (err) {
      console.error('[zaiIntegration] failed to persist consensus', (err as Error).message);
      await flagAnalysisAsFailed(imageId, { 
        error: 'consensus_persist_failed', 
        details: (err as Error).message 
      });
      return { 
        success: false, 
        reason: 'consensus_persist_failed',
        error: (err as Error).message
      };
    }
  }

  // ------- Private helpers -------

  private async runVision(imageId: string, buffer: Buffer, ctx: Record<string, any>) {
    try {
      console.log(`[zaiIntegration][vision] Starting vision analysis for ${imageId}`);
      
      const modelResult = await zaiVisionAnalyze(this.client, buffer, {
        model: this.visionModel,
        temperature: 0.0,
        max_tokens: 1200,
        includeSaliencyBase64: false,
        allowLenientParse: false,
      });

      // Validate the result
      assertValidModeration(modelResult.rawOutput);

      // Persist raw vision analysis
      const persisted = await persistAnalysisResult({
        type: AnalysisType.VISION,
        inputRef: imageId,
        labels: modelResult.labels,
        reasons: (modelResult.rawOutput && modelResult.rawOutput.reasons) || [],
        provenance: { model: modelResult.modelName, version: modelResult.modelVersion },
        rawOutput: modelResult.rawOutput,
        reviewNeeded: false, // Will be set by consensus later
      });

      console.log(`[zaiIntegration][vision] Completed for ${imageId}`);
      
      return { 
        raw: modelResult.rawOutput, 
        rawModelMapped: modelResult, 
        persisted 
      };
    } catch (err) {
      console.error(`[zaiIntegration][vision] imageId=${imageId} failed:`, (err as Error).message);
      
      // Persist failure record
      try {
        await flagAnalysisAsFailed(imageId, { 
          error: 'vision_failed', 
          details: (err as Error).message 
        });
      } catch (e) {
        console.warn('[zaiIntegration] failed to flag vision failure', (e as Error).message);
      }
      
      return null;
    }
  }

  private async runAIR(imageId: string, buffer: Buffer, ctx: Record<string, any>) {
    if (!this.enableAIR) return null;

    try {
      console.log(`[zaiIntegration][air] Starting AIR analysis for ${imageId}`);
      
      const modelResult = await zaiAirAnalyze(this.client, buffer, {
        filename: ctx.filename || 'unknown',
        contentType: ctx.contentType || 'image/jpeg',
        size: buffer.length,
        uploaderId: ctx.uploaderId,
        metadata: ctx.metadata || {}
      }, {
        model: this.airModel,
        temperature: 0.0,
        max_tokens: 1500,
        enableMultiStepReasoning: true,
        includeRelationshipAnalysis: true,
        analysisDepth: 'detailed',
        allowLenientParse: false,
      });

      // Validate the result
      assertValidModeration(modelResult.rawOutput);

      // Persist raw AIR analysis
      const persisted = await persistAnalysisResult({
        type: AnalysisType.AIR,
        inputRef: imageId,
        labels: modelResult.labels,
        reasons: (modelResult.rawOutput && modelResult.rawOutput.reasons) || [],
        provenance: { model: modelResult.modelName, version: modelResult.modelVersion },
        rawOutput: modelResult.rawOutput,
        reviewNeeded: false,
      });

      console.log(`[zaiIntegration][air] Completed for ${imageId}`);
      
      return { 
        raw: modelResult.rawOutput, 
        rawModelMapped: modelResult, 
        persisted 
      };
    } catch (err) {
      console.error(`[zaiIntegration][air] imageId=${imageId} failed:`, (err as Error).message);
      
      // Persist failure record
      try {
        await flagAnalysisAsFailed(imageId, { 
          error: 'air_failed', 
          details: (err as Error).message 
        });
      } catch (e) {
        console.warn('[zaiIntegration] failed to flag AIR failure', (e as Error).message);
      }
      
      return null;
    }
  }

  private async runText(imageId: string, buffer: Buffer, ctx: Record<string, any>) {
    try {
      console.log(`[zaiIntegration][text] Starting text reasoning for ${imageId}`);
      
      // Construct context for text reasoning - include vision and AIR hints if available
      const ctxDesc = JSON.stringify({
        filename: ctx.filename || 'unknown',
        metadata: ctx.metadata || {},
        contentType: ctx.contentType,
        size: buffer.length,
        uploaderId: ctx.uploaderId,
        hint: 'Use vision descriptors and metadata to reason about content categories (sexual_nudity, child_exposed, deepfake, etc.)',
        analysisContext: 'This is part of a multi-modal analysis pipeline. Consider visual context and advanced reasoning.',
      });

      const modelResult = await zaiTextReasoning(this.client, ctxDesc, {
        model: this.textModel,
        temperature: 0.0,
        max_tokens: 800,
        allowLenientParse: false,
      });

      // Validate the result
      assertValidModeration(modelResult.rawOutput);

      const persisted = await persistAnalysisResult({
        type: AnalysisType.TEXT,
        inputRef: imageId,
        labels: modelResult.labels,
        reasons: (modelResult.rawOutput && modelResult.rawOutput.reasons) || [],
        provenance: { model: modelResult.modelName, version: modelResult.modelVersion },
        rawOutput: modelResult.rawOutput,
        reviewNeeded: false,
      });

      console.log(`[zaiIntegration][text] Completed for ${imageId}`);
      
      return { 
        raw: modelResult.rawOutput, 
        rawModelMapped: modelResult, 
        persisted 
      };
    } catch (err) {
      console.error(`[zaiIntegration][text] imageId=${imageId} failed:`, (err as Error).message);
      
      // Persist failure record
      try {
        await flagAnalysisAsFailed(imageId, { 
          error: 'text_failed', 
          details: (err as Error).message 
        });
      } catch (e) {
        console.warn('[zaiIntegration] failed to flag text failure', (e as Error).message);
      }
      
      return null;
    }
  }

  /**
   * Determine if human review is needed based on consensus results
   */
  private determineReviewNeed(consensus: any, successfulModelsCount: number): boolean {
    if (!consensus || !consensus.allLabels) return true;

    // Critical labels that always require review
    const criticalLabels = ['child_exposed', 'deepfake_suspected', 'sexual_nudity', 'violence'];
    for (const l of consensus.allLabels) {
      if (criticalLabels.includes(l.label) && l.score >= 0.6) return true;
    }

    // Special rule: child detection + any sexual content = immediate review
    const hasChildDetection = consensus.allLabels.some(l => 
      l.label === 'child_detected' && l.score >= 0.6
    );
    const hasSexualContent = consensus.allLabels.some(l => 
      ['sexual_nudity', 'partial_nudity', 'suggestive'].includes(l.label) && l.score >= 0.1
    );
    
    if (hasChildDetection && hasSexualContent) return true;

    // Review if there's high model disagreement (spread)
    if (consensus.spread && consensus.spread > 0.25) return true;

    // Review if confidence is low but there are detections
    if (consensus.score < 0.6 && consensus.allLabels.length > 0 && consensus.allLabels[0].score > 0.3) return true;

    // Review if recommended action is quarantine or hold_for_review
    if (['quarantine', 'hold_for_review'].includes(consensus.recommendedAction)) return true;

    // Review if fewer than 2 models succeeded (need consensus)
    if (successfulModelsCount < 2) return true;

    return false;
  }

  /**
   * Get current model performance metrics from adaptive consensus engine
   */
  getModelPerformance() {
    if (this.enableAdaptiveConsensus) {
      return this.adaptiveEngine.getModelPerformance();
    }
    return [];
  }

  /**
   * Get current adaptive weights from consensus engine
   */
  getCurrentWeights() {
    if (this.enableAdaptiveConsensus) {
      return this.adaptiveEngine.getCurrentWeights();
    }
    return {
      'GLM-4.5V': 0.4,
      'GLM-4.5': 0.3,
      'GLM-4.5-AIR': 0.3,
    };
  }

  /**
   * Provide feedback to improve adaptive consensus (ground truth based)
   */
  provideFeedback(imageId: string, groundTruth: string, correctAction: string) {
    if (this.enableAdaptiveConsensus) {
      this.adaptiveEngine.provideFeedback(imageId, groundTruth, correctAction);
    }
  }

  /**
   * Reset adaptive learning
   */
  resetAdaptiveLearning() {
    if (this.enableAdaptiveConsensus) {
      this.adaptiveEngine.resetLearning();
    }
  }
}