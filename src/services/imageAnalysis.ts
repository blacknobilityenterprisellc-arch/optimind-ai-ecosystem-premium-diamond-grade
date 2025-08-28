/**
 * imageAnalysis.ts
 * Real GLM-4.5V + GLM-4.5 orchestration + consensus calculator with Z.AI integration
 */
import { v4 as uuidv4 } from 'uuid';
import { ModelResult, AnalysisResult, ConsensusResult, ImageUploadRequest } from '../types/index';
import { ZaiClient } from './zaiClient';
import { zaiVisionAnalyze } from './zaiVision';
import { zaiTextReasoning } from './zaiText';
import { zaiAirAnalyze } from './zaiAir';

// Initialize Z.AI client singleton
const zaiClient = new ZaiClient({ 
  apiKey: process.env.ZAI_API_KEY || 'default-key-for-development' 
});

// Model weights for consensus calculation (updated to include AIR)
const DEFAULT_MODEL_WEIGHTS: Record<string, number> = {
  'GLM-4.5V': 0.4,
  'GLM-4.5': 0.3,
  'GLM-4.5-AIR': 0.3, // Advanced Image Reasoning gets equal weight
};

/**
 * Enhanced consensus calculator with configurable weights and sophisticated aggregation
 * Now includes AIR-specific reasoning chain analysis and enhanced multi-model consensus
 */
export function computeConsensus(modelResults: ModelResult[]): ConsensusResult {
  const map = new Map<string, number[]>();
  const provenanceModels = [];
  const airReasoningSteps: number[] = [];
  
  // Accumulate scores by label with AIR-specific processing
  for (const r of modelResults) {
    provenanceModels.push({ name: r.modelName, version: r.modelVersion });
    
    // Track AIR reasoning steps for confidence adjustment
    if (r.modelName === 'GLM-4.5-AIR' && r.rawOutput?._air_metadata?.reasoningSteps) {
      airReasoningSteps.push(r.rawOutput._air_metadata.reasoningSteps);
    }
    
    for (const l of r.labels) {
      if (!map.has(l.label)) map.set(l.label, []);
      map.get(l.label)!.push(l.score);
    }
  }
  
  const aggregated: Array<{ label: string; score: number }> = [];
  for (const [label, scores] of map.entries()) {
    // Enhanced weighted mean with AIR confidence boost
    let totalWeighted = 0;
    let totalWeight = 0;
    
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const modelName = modelResults[i]?.modelName || 'unknown';
      let weight = DEFAULT_MODEL_WEIGHTS[modelName] || 0.5;
      
      // Apply AIR confidence boost for models that benefited from AIR analysis
      if (modelName === 'GLM-4.5' && airReasoningSteps.length > 0) {
        // Boost text reasoning confidence when AIR analysis was available
        weight *= 1.1;
      }
      
      totalWeighted += score * weight;
      totalWeight += weight;
    }
    
    const weightedMean = totalWeighted / Math.max(1, totalWeight);
    aggregated.push({ label, score: Math.round(weightedMean * 1000) / 1000 });
  }
  
  // Sort by score descending
  aggregated.sort((a, b) => b.score - a.score);
  const top = aggregated[0];
  
  // Compute enhanced spread with AIR reasoning consideration
  const topScores = map.get(top.label) || [];
  const mean = topScores.reduce((a, b) => a + b, 0) / Math.max(1, topScores.length);
  const variance = topScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, topScores.length);
  const spread = Math.sqrt(variance);
  
  // Adjust confidence based on AIR reasoning depth
  const airConfidenceBoost = airReasoningSteps.length > 0 ? 
    Math.min(0.1, airReasoningSteps.reduce((a, b) => a + b, 0) * 0.01) : 0;
  
  // Enhanced action mapping with AIR-specific considerations
  const recommendedAction = determineRecommendedActionWithAIR(
    top.score, 
    spread, 
    airConfidenceBoost,
    airReasoningSteps.length > 0
  );
  const reasons = generateEnhancedReasons(top, aggregated, modelResults.length, spread, airReasoningSteps);
  
  const consensus: ConsensusResult = {
    topLabel: top.label,
    score: Math.min(1.0, top.score + airConfidenceBoost), // Apply confidence boost
    spread: Math.round(spread * 1000) / 1000,
    allLabels: aggregated,
    provenance: { 
      models: provenanceModels, 
      timestamp: new Date().toISOString() 
    },
    recommendedAction: recommendedAction,
    reasons,
  };
  
  return consensus;
}

/**
 * Determine recommended action based on score and spread (original function)
 */
function determineRecommendedAction(score: number, spread: number): ConsensusResult['recommendedAction'] {
  if (score >= 0.9) {
    return 'quarantine';
  } else if (score >= 0.75) {
    return spread > 0.2 ? 'hold_for_review' : 'quarantine';
  } else if (score >= 0.5) {
    return spread > 0.3 ? 'hold_for_review' : 'monitor';
  } else {
    return 'allow';
  }
}

/**
 * Enhanced recommended action determination with AIR-specific considerations
 */
function determineRecommendedActionWithAIR(
  score: number, 
  spread: number, 
  airConfidenceBoost: number,
  hasAIRAnalysis: boolean
): ConsensusResult['recommendedAction'] {
  const adjustedScore = Math.min(1.0, score + airConfidenceBoost);
  
  // More conservative thresholds when AIR analysis is available
  if (hasAIRAnalysis) {
    if (adjustedScore >= 0.85) {
      return 'quarantine';
    } else if (adjustedScore >= 0.7) {
      return spread > 0.15 ? 'hold_for_review' : 'quarantine';
    } else if (adjustedScore >= 0.45) {
      return spread > 0.25 ? 'hold_for_review' : 'monitor';
    } else {
      return 'allow';
    }
  }
  
  // Fallback to original logic
  return determineRecommendedAction(score, spread);
}

/**
 * Generate human-readable reasons for the consensus decision (original function)
 */
function generateReasons(
  top: { label: string; score: number }, 
  aggregated: Array<{ label: string; score: number }>, 
  modelCount: number,
  spread: number
): string[] {
  const reasons: string[] = [];
  
  reasons.push(`Top label "${top.label}" with confidence ${(top.score * 100).toFixed(1)}%`);
  reasons.push(`Aggregated from ${modelCount} model(s)`);
  
  if (spread > 0.1) {
    reasons.push(`Model agreement spread: ${(spread * 100).toFixed(1)}%`);
  }
  
  if (aggregated.length > 1) {
    const runnerUp = aggregated[1];
    if (runnerUp.score > 0.3) {
      reasons.push(`Secondary detection: "${runnerUp.label}" at ${(runnerUp.score * 100).toFixed(1)}%`);
    }
  }
  
  return reasons;
}

/**
 * Generate enhanced human-readable reasons with AIR-specific insights
 */
function generateEnhancedReasons(
  top: { label: string; score: number }, 
  aggregated: Array<{ label: string; score: number }>, 
  modelCount: number,
  spread: number,
  airReasoningSteps: number[]
): string[] {
  const reasons: string[] = [];
  
  reasons.push(`Top label "${top.label}" with confidence ${(top.score * 100).toFixed(1)}%`);
  reasons.push(`Aggregated from ${modelCount} model(s)`);
  
  // Add AIR-specific reasoning information
  if (airReasoningSteps.length > 0) {
    const totalSteps = airReasoningSteps.reduce((a, b) => a + b, 0);
    reasons.push(`Enhanced with ${totalSteps} AIR reasoning steps`);
  }
  
  if (spread > 0.1) {
    reasons.push(`Model agreement spread: ${(spread * 100).toFixed(1)}%`);
  }
  
  // Add AIR-specific insights if available
  const hasAirAnalysis = modelCount >= 3; // Vision + AIR + Text
  if (hasAirAnalysis) {
    reasons.push('Multi-modal analysis: Vision + Advanced Reasoning + Context');
  }
  
  if (aggregated.length > 1) {
    const runnerUp = aggregated[1];
    if (runnerUp.score > 0.3) {
      reasons.push(`Secondary detection: "${runnerUp.label}" at ${(runnerUp.score * 100).toFixed(1)}%`);
    }
  }
  
  return reasons;
}

/**
 * Main image analysis function with real Z.AI integration
 */
export async function analyzeImage(imageBuffer: Buffer, upload: ImageUploadRequest): Promise<AnalysisResult> {
  const imageId = uuidv4();
  const modelResults: ModelResult[] = [];
  
  // 1) Vision model analysis with retry logic
  try {
    const vis = await zaiVisionAnalyze(zaiClient, imageBuffer, { 
      temperature: 0.0,
      includeSaliencyBase64: false,
      allowLenientParse: true
    });
    modelResults.push(vis);
  } catch (err) {
    console.error('[analyzeImage] vision model failed:', err);
    modelResults.push({
      modelName: 'GLM-4.5V',
      modelVersion: '2025-07-28',
      labels: [{ label: 'analysis_failed', score: 0.5 }],
      rawOutput: { error: (err as Error).message },
      latencyMs: 0
    });
  }
  
  // 2) Advanced Image Reasoning (AIR) analysis
  try {
    const air = await zaiAirAnalyze(zaiClient, imageBuffer, {
      filename: upload.filename,
      contentType: upload.contentType,
      size: upload.size,
      uploaderId: upload.uploaderId,
      metadata: upload.metadata || {}
    }, {
      temperature: 0.0,
      enableMultiStepReasoning: true,
      includeRelationshipAnalysis: true,
      analysisDepth: 'detailed',
      allowLenientParse: true
    });
    modelResults.push(air);
  } catch (err) {
    console.error('[analyzeImage] AIR model failed:', err);
    modelResults.push({
      modelName: 'GLM-4.5-AIR',
      modelVersion: '2025-07-28',
      labels: [{ label: 'air_analysis_failed', score: 0.5 }],
      rawOutput: { error: (err as Error).message },
      latencyMs: 0
    });
  }
  
  // 3) Text reasoning with context analysis
  try {
    // Create a context description that includes AIR analysis for enhanced reasoning
    const contextDescription = JSON.stringify({
      filename: upload.filename,
      metadata: upload.metadata || {},
      contentType: upload.contentType,
      size: upload.size,
      uploaderId: upload.uploaderId,
      visionAnalysis: modelResults[0]?.rawOutput,
      airAnalysis: modelResults[1]?.rawOutput, // Include AIR results for enhanced context
      hint: 'Use vision and AIR analysis to reason about sexual content / minors / deepfake behavior with advanced contextual understanding'
    });
    
    const txt = await zaiTextReasoning(zaiClient, contextDescription, { 
      temperature: 0.0,
      allowLenientParse: true 
    });
    modelResults.push(txt);
  } catch (err) {
    console.error('[analyzeImage] text model failed:', err);
    modelResults.push({
      modelName: 'GLM-4.5',
      modelVersion: '2025-07-28',
      labels: [{ label: 'reasoning_failed', score: 0.5 }],
      rawOutput: { error: (err as Error).message },
      latencyMs: 0
    });
  }
  
  // 4) Enhanced consensus computation with AIR integration
  const consensus = computeConsensus(modelResults);
  
  // 5) Create analysis result
  const analysisResult: AnalysisResult = {
    imageId,
    upload,
    consensus,
    modelResults,
    createdAt: new Date().toISOString(),
  };
  
  // 6) Log analysis summary for monitoring
  console.log(`[analyzeImage] Completed analysis for ${imageId}:`, {
    topLabel: consensus.topLabel,
    score: consensus.score,
    action: consensus.recommendedAction,
    modelsUsed: modelResults.map(r => r.modelName),
    totalLatency: modelResults.reduce((sum, r) => sum + (r.latencyMs || 0), 0),
    airEnabled: modelResults.some(r => r.modelName === 'GLM-4.5-AIR')
  });
  
  return analysisResult;
}

/**
 * Batch analysis for multiple images (useful for processing queues)
 */
export async function analyzeBatchImages(
  images: Array<{ buffer: Buffer; upload: ImageUploadRequest }>
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  
  // Process images in parallel with concurrency limit
  const concurrencyLimit = 3; // Adjust based on your API limits
  const batches = [];
  
  for (let i = 0; i < images.length; i += concurrencyLimit) {
    const batch = images.slice(i, i + concurrencyLimit);
    batches.push(batch);
  }
  
  for (const batch of batches) {
    const batchPromises = batch.map(({ buffer, upload }) => 
      analyzeImage(buffer, upload).catch(error => {
        console.error('Batch analysis failed for image:', upload.filename, error);
        // Return a fallback result
        const imageId = uuidv4();
        return {
          imageId,
          upload,
          consensus: {
            topLabel: 'analysis_error',
            score: 0.5,
            spread: 0,
            allLabels: [{ label: 'analysis_error', score: 0.5 }],
            provenance: { models: [], timestamp: new Date().toISOString() },
            recommendedAction: 'hold_for_review',
            reasons: ['Analysis failed due to error']
          },
          modelResults: [],
          createdAt: new Date().toISOString()
        } as AnalysisResult;
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Get analysis statistics for monitoring
 */
export function getAnalysisStats(results: AnalysisResult[]) {
  const stats = {
    totalImages: results.length,
    averageConfidence: 0,
    actionDistribution: {} as Record<string, number>,
    modelUsage: {} as Record<string, number>,
    averageLatency: 0,
    errorRate: 0
  };
  
  if (results.length === 0) return stats;
  
  // Calculate average confidence
  const totalConfidence = results.reduce((sum, r) => sum + r.consensus.score, 0);
  stats.averageConfidence = totalConfidence / results.length;
  
  // Action distribution
  results.forEach(r => {
    const action = r.consensus.recommendedAction;
    stats.actionDistribution[action] = (stats.actionDistribution[action] || 0) + 1;
  });
  
  // Model usage
  results.forEach(r => {
    r.modelResults.forEach(model => {
      stats.modelUsage[model.modelName] = (stats.modelUsage[model.modelName] || 0) + 1;
    });
  });
  
  // Average latency
  const totalLatency = results.reduce((sum, r) => 
    sum + r.modelResults.reduce((modelSum, model) => modelSum + (model.latencyMs || 0), 0), 0
  );
  stats.averageLatency = totalLatency / results.length;
  
  // Error rate (models that failed)
  const failedAnalyses = results.filter(r => 
    r.modelResults.some(model => model.labels.some(label => label.label.includes('failed')))
  );
  stats.errorRate = failedAnalyses.length / results.length;
  
  return stats;
}