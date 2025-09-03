/**
 * adaptiveConsensus.ts
 * Enhanced consensus algorithm with adaptive weighting based on model performance
 * Features dynamic weight adjustment, performance tracking, and confidence optimization
 */

import { ModelResult, ConsensusResult } from '../types/index';

interface ModelPerformance {
  modelName: string;
  totalAnalyses: number;
  correctPredictions: number;
  averageConfidence: number;
  averageLatency: number;
  errorRate: number;
  lastUpdated: Date;
  accuracy: number;
  reliability: number;
}

interface AdaptiveWeights {
  [modelName: string]: number;
}

interface ConsensusConfig {
  baseWeights: AdaptiveWeights;
  learningRate: number;
  minWeight: number;
  maxWeight: number;
  performanceWindow: number; // number of recent analyses to consider
  enableAdaptiveLearning: boolean;
  confidenceThreshold: number;
  reliabilityThreshold: number;
}

export class AdaptiveConsensusEngine {
  private modelPerformance: Map<string, ModelPerformance> = new Map();
  private config: ConsensusConfig;
  private analysisHistory: Array<{
    imageId: string;
    modelsUsed: string[];
    consensus: ConsensusResult;
    groundTruth?: string;
    timestamp: Date;
  }> = [];

  constructor(config: Partial<ConsensusConfig> = {}) {
    this.config = {
      baseWeights: {
        'GLM-4.5V': 0.4,
        'GLM-4.5': 0.3,
        'GLM-4.5-AIR': 0.3,
      },
      learningRate: 0.1,
      minWeight: 0.1,
      maxWeight: 0.8,
      performanceWindow: 100,
      enableAdaptiveLearning: true,
      confidenceThreshold: 0.7,
      reliabilityThreshold: 0.8,
      ...config
    };

    // Initialize model performance tracking
    Object.keys(this.config.baseWeights).forEach(modelName => {
      this.modelPerformance.set(modelName, {
        modelName,
        totalAnalyses: 0,
        correctPredictions: 0,
        averageConfidence: 0,
        averageLatency: 0,
        errorRate: 0,
        lastUpdated: new Date(),
        accuracy: 0,
        reliability: 1.0
      });
    });
  }

  /**
   * Compute adaptive consensus with dynamic weight adjustment
   */
  computeAdaptiveConsensus(modelResults: ModelResult[]): ConsensusResult {
    if (modelResults.length === 0) {
      throw new Error('No model results provided for consensus computation');
    }

    // Get current adaptive weights
    const adaptiveWeights = this.getAdaptiveWeights();
    
    // Calculate weighted consensus
    const consensus = this.calculateWeightedConsensus(modelResults, adaptiveWeights);
    
    // Update performance tracking (async, don't block)
    this.updatePerformanceTracking(modelResults, consensus).catch(err => {
      console.warn('[AdaptiveConsensus] Failed to update performance tracking:', err);
    });

    return consensus;
  }

  /**
   * Get current adaptive weights based on model performance
   */
  private getAdaptiveWeights(): AdaptiveWeights {
    if (!this.config.enableAdaptiveLearning) {
      return { ...this.config.baseWeights };
    }

    const weights: AdaptiveWeights = {};
    const totalPerformance = Array.from(this.modelPerformance.values())
      .reduce((sum, perf) => sum + perf.reliability, 0);

    // Calculate adaptive weights based on performance
    this.modelPerformance.forEach((performance, modelName) => {
      const baseWeight = this.config.baseWeights[modelName] || 0.25;
      const performanceMultiplier = totalPerformance > 0 
        ? (performance.reliability / totalPerformance) * this.modelPerformance.size 
        : 1;
      
      // Apply adaptive adjustment
      let adaptiveWeight = baseWeight * performanceMultiplier;
      
      // Apply bounds
      adaptiveWeight = Math.max(this.config.minWeight, 
        Math.min(this.config.maxWeight, adaptiveWeight));
      
      weights[modelName] = adaptiveWeight;
    });

    // Normalize weights to sum to 1
    const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (weightSum > 0) {
      Object.keys(weights).forEach(key => {
        weights[key] = weights[key] / weightSum;
      });
    }

    return weights;
  }

  /**
   * Calculate weighted consensus with enhanced logic
   */
  private calculateWeightedConsensus(
    modelResults: ModelResult[], 
    weights: AdaptiveWeights
  ): ConsensusResult {
    const labelScores = new Map<string, { scores: number[], weights: number[], models: string[] }>();
    const provenanceModels = [];

    // Collect scores and weights for each label
    for (const result of modelResults) {
      const modelName = result.modelName;
      const weight = weights[modelName] || this.config.baseWeights[modelName] || 0.25;
      
      provenanceModels.push({ 
        name: modelName, 
        version: result.modelVersion,
        weight: weight,
        latency: result.latencyMs || 0
      });

      for (const label of result.labels) {
        if (!labelScores.has(label.label)) {
          labelScores.set(label.label, { scores: [], weights: [], models: [] });
        }
        const entry = labelScores.get(label.label)!;
        entry.scores.push(label.score);
        entry.weights.push(weight);
        entry.models.push(modelName);
      }
    }

    // Calculate weighted scores for each label
    const aggregatedLabels = Array.from(labelScores.entries()).map(([label, data]) => {
      // Calculate weighted average
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (let i = 0; i < data.scores.length; i++) {
        const score = data.scores[i];
        const weight = data.weights[i];
        
        // Apply confidence boost for high-performing models
        const modelPerf = this.modelPerformance.get(data.models[i]);
        const confidenceBoost = modelPerf && modelPerf.accuracy > this.config.confidenceThreshold 
          ? 1 + (modelPerf.accuracy - this.config.confidenceThreshold) * 0.5 
          : 1;
        
        weightedSum += score * weight * confidenceBoost;
        totalWeight += weight;
      }
      
      const weightedScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
      
      // Calculate agreement score (how much models agree on this label)
      const agreement = this.calculateAgreementScore(data.scores, data.weights);
      
      return {
        label,
        score: weightedScore,
        agreement,
        modelCount: data.models.length,
        supportingModels: data.models
      };
    });

    // Sort by weighted score
    aggregatedLabels.sort((a, b) => b.score - a.score);
    const topLabel = aggregatedLabels[0];

    // Calculate consensus metrics
    const spread = this.calculateEnhancedSpread(aggregatedLabels);
    const confidence = this.calculateEnhancedConfidence(topLabel, aggregatedLabels, spread);
    
    // Determine recommended action with adaptive thresholds
    const recommendedAction = this.determineAdaptiveAction(topLabel, confidence, spread);
    
    // Generate enhanced reasons
    const reasons = this.generateAdaptiveReasons(topLabel, aggregatedLabels, weights, spread);

    return {
      topLabel: topLabel.label,
      score: confidence,
      spread,
      allLabels: aggregatedLabels.map(l => ({ label: l.label, score: l.score })),
      provenance: {
        models: provenanceModels,
        timestamp: new Date().toISOString(),
        adaptiveWeights: weights,
        performanceMetrics: this.getPerformanceSummary()
      },
      recommendedAction,
      reasons
    };
  }

  /**
   * Calculate agreement score between models
   */
  private calculateAgreementScore(scores: number[], weights: number[]): number {
    if (scores.length <= 1) return 1.0;

    // Calculate weighted variance
    const weightedMean = scores.reduce((sum, score, i) => sum + score * weights[i], 0) / 
                         weights.reduce((sum, w) => sum + w, 0);
    
    const weightedVariance = scores.reduce((sum, score, i) => {
      const diff = score - weightedMean;
      return sum + diff * diff * weights[i];
    }, 0) / weights.reduce((sum, w) => sum + w, 0);

    // Convert variance to agreement score (inverse relationship)
    return Math.max(0, 1 - Math.sqrt(weightedVariance));
  }

  /**
   * Calculate enhanced spread considering model agreement
   */
  private calculateEnhancedSpread(labels: Array<{ label: string; score: number; agreement: number }>): number {
    if (labels.length <= 1) return 0;

    const topScore = labels[0].score;
    const secondScore = labels.length > 1 ? labels[1].score : 0;
    
    // Calculate spread based on score difference and agreement
    const scoreSpread = topScore - secondScore;
    const agreementFactor = labels[0].agreement;
    
    // Lower agreement increases spread, higher agreement decreases it
    return Math.max(0, scoreSpread * (2 - agreementFactor));
  }

  /**
   * Calculate enhanced confidence considering multiple factors
   */
  private calculateEnhancedConfidence(
    topLabel: { label: string; score: number; agreement: number; modelCount: number },
    allLabels: Array<{ label: string; score: number }>,
    spread: number
  ): number {
    let confidence = topLabel.score;
    
    // Boost confidence based on model agreement
    confidence *= (0.7 + 0.3 * topLabel.agreement);
    
    // Boost confidence based on number of models
    const modelCountBonus = Math.min(0.1, (topLabel.modelCount - 1) * 0.05);
    confidence += modelCountBonus;
    
    // Reduce confidence based on spread (high spread = low confidence)
    const spreadPenalty = spread * 0.3;
    confidence -= spreadPenalty;
    
    // Consider runner-up score
    if (allLabels.length > 1) {
      const runnerUpScore = allLabels[1].score;
      const runnerUpRatio = runnerUpScore / topLabel.score;
      if (runnerUpRatio > 0.7) {
        confidence *= (1 - (runnerUpRatio - 0.7) * 0.5);
      }
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Determine adaptive action based on confidence and context
   */
  private determineAdaptiveAction(
    topLabel: { label: string; score: number; agreement: number },
    confidence: number,
    spread: number
  ): ConsensusResult['recommendedAction'] {
    // Critical categories always get strict handling
    const criticalCategories = ['child_exposed', 'sexual_nudity', 'violence_extreme', 'deepfake_confirmed'];
    if (criticalCategories.includes(topLabel.label)) {
      return confidence > 0.8 ? 'quarantine' : 'hold_for_review';
    }

    // High confidence, high agreement
    if (confidence >= 0.85 && topLabel.agreement >= 0.8) {
      return topLabel.score > 0.9 ? 'quarantine' : 'monitor';
    }
    
    // Medium confidence with good agreement
    if (confidence >= 0.7 && topLabel.agreement >= 0.6) {
      return spread > 0.3 ? 'hold_for_review' : 'monitor';
    }
    
    // Low confidence or poor agreement
    if (confidence < 0.5 || topLabel.agreement < 0.4) {
      return spread > 0.4 ? 'hold_for_review' : 'allow';
    }
    
    // Default case
    return confidence > 0.6 ? 'monitor' : 'allow';
  }

  /**
   * Generate adaptive reasons with performance context
   */
  private generateAdaptiveReasons(
    topLabel: { label: string; score: number; agreement: number; modelCount: number },
    allLabels: Array<{ label: string; score: number }>,
    weights: AdaptiveWeights,
    spread: number
  ): string[] {
    const reasons: string[] = [];
    
    reasons.push(`Top detection: "${topLabel.label}" with ${(topLabel.score * 100).toFixed(1)}% confidence`);
    reasons.push(`Model agreement: ${(topLabel.agreement * 100).toFixed(1)}% (${topLabel.modelCount} models)`);
    
    // Add weight information
    const weightInfo = Object.entries(weights)
      .map(([model, weight]) => `${model}: ${(weight * 100).toFixed(0)}%`)
      .join(', ');
    reasons.push(`Adaptive weights: ${weightInfo}`);
    
    if (spread > 0.2) {
      reasons.push(`Model spread: ${(spread * 100).toFixed(1)}% (indicates disagreement)`);
    }
    
    // Add performance context
    const avgAccuracy = Array.from(this.modelPerformance.values())
      .reduce((sum, perf) => sum + perf.accuracy, 0) / this.modelPerformance.size;
    if (avgAccuracy > 0.8) {
      reasons.push(`High model accuracy: ${(avgAccuracy * 100).toFixed(1)}% average`);
    }
    
    // Add runner-up information if relevant
    if (allLabels.length > 1 && allLabels[1].score > 0.3) {
      reasons.push(`Secondary detection: "${allLabels[1].label}" at ${(allLabels[1].score * 100).toFixed(1)}%`);
    }
    
    return reasons;
  }

  /**
   * Update performance tracking based on analysis results
   */
  private async updatePerformanceTracking(
    modelResults: ModelResult[], 
    consensus: ConsensusResult
  ): Promise<void> {
    const timestamp = new Date();
    
    // Add to analysis history
    this.analysisHistory.push({
      imageId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      modelsUsed: modelResults.map(r => r.modelName),
      consensus,
      timestamp
    });

    // Keep history within window
    if (this.analysisHistory.length > this.config.performanceWindow) {
      this.analysisHistory = this.analysisHistory.slice(-this.config.performanceWindow);
    }

    // Update individual model performance
    for (const result of modelResults) {
      const performance = this.modelPerformance.get(result.modelName);
      if (!performance) continue;

      // Update basic metrics
      performance.totalAnalyses++;
      performance.averageLatency = (performance.averageLatency * (performance.totalAnalyses - 1) + 
                                   (result.latencyMs || 0)) / performance.totalAnalyses;
      
      // Update confidence tracking
      const avgLabelScore = result.labels.reduce((sum, label) => sum + label.score, 0) / result.labels.length;
      performance.averageConfidence = (performance.averageConfidence * (performance.totalAnalyses - 1) + 
                                      avgLabelScore) / performance.totalAnalyses;
      
      // Update error rate (simplified - in real system, this would use ground truth)
      const hasError = result.labels.some(label => label.label.includes('failed') || label.label.includes('error'));
      if (hasError) {
        performance.errorRate = (performance.errorRate * (performance.totalAnalyses - 1) + 1) / performance.totalAnalyses;
      } else {
        performance.errorRate = (performance.errorRate * (performance.totalAnalyses - 1)) / performance.totalAnalyses;
      }
      
      // Update accuracy (simplified - in real system, this would use verified ground truth)
      // For now, use consensus confidence as a proxy
      const consensusMatch = consensus.topLabel === result.labels[0]?.label;
      if (consensusMatch) {
        performance.correctPredictions++;
      }
      performance.accuracy = performance.correctPredictions / performance.totalAnalyses;
      
      // Update reliability (composite score)
      performance.reliability = this.calculateReliability(performance);
      performance.lastUpdated = timestamp;
    }
  }

  /**
   * Calculate composite reliability score for a model
   */
  private calculateReliability(performance: ModelPerformance): number {
    const accuracyWeight = 0.4;
    const errorRateWeight = 0.3;
    const latencyWeight = 0.2;
    const confidenceWeight = 0.1;
    
    // Normalize metrics (0-1 scale)
    const accuracyScore = performance.accuracy;
    const errorScore = 1 - performance.errorRate;
    const latencyScore = Math.max(0, 1 - (performance.averageLatency / 10000)); // Normalize to 10s max
    const confidenceScore = performance.averageConfidence;
    
    return (accuracyScore * accuracyWeight +
            errorScore * errorRateWeight +
            latencyScore * latencyWeight +
            confidenceScore * confidenceWeight);
  }

  /**
   * Get performance summary for provenance
   */
  private getPerformanceSummary() {
    const summary: any = {};
    
    this.modelPerformance.forEach((performance, modelName) => {
      summary[modelName] = {
        accuracy: performance.accuracy,
        reliability: performance.reliability,
        errorRate: performance.errorRate,
        averageLatency: performance.averageLatency,
        totalAnalyses: performance.totalAnalyses
      };
    });
    
    return summary;
  }

  /**
   * Provide feedback to improve model weights (ground truth based)
   */
  provideFeedback(imageId: string, groundTruth: string, correctAction: string): void {
    const analysis = this.analysisHistory.find(a => a.imageId === imageId);
    if (!analysis) return;

    analysis.groundTruth = groundTruth;
    
    // Update performance based on ground truth
    analysis.modelsUsed.forEach(modelName => {
      const performance = this.modelPerformance.get(modelName);
      if (!performance) return;

      // Find if this model predicted the ground truth
      const modelResult = analysis.consensus.provenance.models.find(m => m.name === modelName);
      if (!modelResult) return;

      // In a real system, we'd have the actual model prediction
      // For now, we'll use consensus as proxy
      const predictedCorrectly = analysis.consensus.topLabel === groundTruth;
      const actionCorrect = analysis.consensus.recommendedAction === correctAction;

      if (predictedCorrectly && actionCorrect) {
        performance.correctPredictions++;
      }

      performance.accuracy = performance.correctPredictions / performance.totalAnalyses;
      performance.reliability = this.calculateReliability(performance);
      performance.lastUpdated = new Date();
    });
  }

  /**
   * Get current model performance metrics
   */
  getModelPerformance(): ModelPerformance[] {
    return Array.from(this.modelPerformance.values());
  }

  /**
   * Get current adaptive weights
   */
  getCurrentWeights(): AdaptiveWeights {
    return this.getAdaptiveWeights();
  }

  /**
   * Reset learning and start fresh
   */
  resetLearning(): void {
    this.modelPerformance.clear();
    this.analysisHistory = [];
    
    // Reinitialize with base weights
    Object.keys(this.config.baseWeights).forEach(modelName => {
      this.modelPerformance.set(modelName, {
        modelName,
        totalAnalyses: 0,
        correctPredictions: 0,
        averageConfidence: 0,
        averageLatency: 0,
        errorRate: 0,
        lastUpdated: new Date(),
        accuracy: 0,
        reliability: 1.0
      });
    });
  }
}