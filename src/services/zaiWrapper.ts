/**
 * zaiWrapper.ts
 * Real Z.AI SDK integration for GLM-4.5V and GLM-4.5 with deterministic prompts and schema enforcement
 * 
 * This service provides:
 * - GLM-4.5V for visual content analysis with structured output
 * - GLM-4.5 for text reasoning and consensus computation
 * - Deterministic prompts with JSON schema enforcement
 * - Error handling and retry logic
 * - Performance monitoring
 */

import ZAI from 'z-ai-web-dev-sdk';
import { ModelResult } from '../types/index';

// Z.AI Client singleton
let zaiClient: ZAI | null = null;

async function getZaiClient(): Promise<ZAI> {
  if (!zaiClient) {
    zaiClient = await ZAI.create();
  }
  return zaiClient;
}

// JSON Schema for GLM-4.5V visual analysis output
const VISION_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    regions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          score: { type: "number", minimum: 0, maximum: 1 },
          region: {
            type: "object",
            properties: {
              x: { type: "number", minimum: 0, maximum: 1 },
              y: { type: "number", minimum: 0, maximum: 1 },
              width: { type: "number", minimum: 0, maximum: 1 },
              height: { type: "number", minimum: 0, maximum: 1 }
            },
            required: ["x", "y", "width", "height"]
          }
        },
        required: ["label", "score"]
      }
    },
    tags: {
      type: "array",
      items: { type: "string" }
    },
    overall_assessment: {
      type: "object",
      properties: {
        primary_category: { 
          type: "string",
          enum: ["safe", "nsfw", "deepfake", "violence", "hate", "other"]
        },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        reasoning: { type: "string" }
      },
      required: ["primary_category", "confidence", "reasoning"]
    },
    saliency_map_requested: { type: "boolean" }
  },
  required: ["regions", "tags", "overall_assessment"]
};

// JSON Schema for GLM-4.5 text reasoning output
const TEXT_REASONING_SCHEMA = {
  type: "object",
  properties: {
    analysis_summary: {
      type: "object",
      properties: {
        content_category: { type: "string" },
        risk_level: { 
          type: "string",
          enum: ["low", "medium", "high", "critical"]
        },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        key_indicators: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["content_category", "risk_level", "confidence", "key_indicators"]
    },
    recommended_action: {
      type: "string",
      enum: ["allow", "monitor", "quarantine", "hold_for_review", "escalate", "delete_pending_appeal"]
    },
    reasoning: { type: "string" },
    metadata_analysis: {
      type: "object",
      properties: {
        context_relevance: { type: "string" },
        additional_factors: { type: "array", items: { type: "string" } }
      }
    }
  },
  required: ["analysis_summary", "recommended_action", "reasoning"]
};

/**
 * GLM-4.5V Visual Analysis with structured output
 * Analyzes image content for moderation purposes with deterministic prompts
 */
export async function zaiVisionAnalyze(imageBuffer: Buffer, imageFormat: string = 'jpeg'): Promise<ModelResult> {
  const startTime = Date.now();
  const client = await getZaiClient();
  
  try {
    // Convert buffer to base64 for API
    const base64Image = imageBuffer.toString('base64');
    const imageMime = `image/${imageFormat}`;
    
    const systemPrompt = `You are VisionAgent, an expert content moderation AI using GLM-4.5V. Analyze the provided image for potentially harmful content including:
    
1. NSFW content (nudity, sexual acts, explicit material)
2. Deepfakes or AI-generated synthetic content
3. Violence, weapons, or graphic content
4. Hate speech, discrimination, or offensive symbols
5. Other policy violations

You must respond with a JSON object following this exact structure:
${JSON.stringify(VISION_ANALYSIS_SCHEMA, null, 2)}

Guidelines:
- Use normalized coordinates (0-1) for bounding boxes
- Provide confidence scores between 0 and 1
- Be conservative in NSFW detection - when in doubt, flag for review
- Include all relevant tags that describe the content
- Provide clear reasoning for your assessment
- Set saliency_map_requested to true if the image contains areas of concern

Important: Respond ONLY with valid JSON. No explanations, no markdown, just the JSON object.`;

    const userPrompt = `Analyze this image for content moderation. Provide detailed analysis with bounding boxes, confidence scores, and overall assessment.`;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageMime};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      model: "glm-4.5v",
      temperature: 0.0,  // Deterministic output
      max_tokens: 2048,
      thinking: {
        type: "enabled"  // Enable multi-step reasoning
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from GLM-4.5V');
    }

    // Parse and validate JSON response
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse GLM-4.5V response:', content);
      throw new Error(`Invalid JSON response from GLM-4.5V: ${parseError.message}`);
    }

    // Convert analysis to ModelResult format
    const labels: ModelResult['labels'] = [];
    
    // Add regions as labels with bounding boxes
    if (analysis.regions && Array.isArray(analysis.regions)) {
      analysis.regions.forEach((region: any) => {
        labels.push({
          label: region.label,
          score: region.score,
          region: region.region
        });
      });
    }

    // Add tags as labels without bounding boxes
    if (analysis.tags && Array.isArray(analysis.tags)) {
      analysis.tags.forEach((tag: string) => {
        if (!labels.find(l => l.label === tag)) {
          labels.push({
            label: tag,
            score: analysis.overall_assessment.confidence * 0.8  // Slightly lower confidence for tags
          });
        }
      });
    }

    // Add overall assessment as a label
    if (analysis.overall_assessment) {
      labels.push({
        label: analysis.overall_assessment.primary_category,
        score: analysis.overall_assessment.confidence
      });
    }

    const latencyMs = Date.now() - startTime;

    return {
      modelName: 'GLM-4.5V',
      modelVersion: '2025-07-28',
      labels,
      rawOutput: analysis,
      latencyMs,
      saliencyUrl: analysis.saliency_map_requested ? 'pending_generation' : undefined
    };

  } catch (error) {
    console.error('GLM-4.5V analysis failed:', error);
    throw new Error(`GLM-4.5V analysis failed: ${error.message}`);
  }
}

/**
 * GLM-4.5 Text Reasoning with structured output
 * Provides contextual analysis and reasoning for content moderation decisions
 */
export async function zaiTextReasoning(
  context: {
    visualAnalysis?: any;
    metadata?: Record<string, any>;
    userContext?: string;
    additionalPrompt?: string;
  }
): Promise<ModelResult> {
  const startTime = Date.now();
  const client = await getZaiClient();
  
  try {
    const systemPrompt = `You are ReasoningAgent, an expert content analysis AI using GLM-4.5. Your job is to analyze content context and provide reasoned recommendations for content moderation decisions.

You must respond with a JSON object following this exact structure:
${JSON.stringify(TEXT_REASONING_SCHEMA, null, 2)}

Guidelines:
- Use deterministic reasoning (temperature: 0.0)
- Consider all available context: visual analysis, metadata, user behavior
- Provide clear, actionable recommendations
- Explain your reasoning thoroughly
- Consider edge cases and false positives
- When confidence is low, recommend human review
- Be conservative with high-impact decisions

Risk Level Definitions:
- LOW: Safe content, minimal risk
- MEDIUM: Potentially concerning, needs monitoring
- HIGH: Likely policy violation, needs review
- CRITICAL: Clear violation, immediate action required

Important: Respond ONLY with valid JSON. No explanations, no markdown, just the JSON object.`;

    const userPrompt = `Analyze the following context for content moderation:

Visual Analysis Summary: ${JSON.stringify(context.visualAnalysis || {})}
Metadata: ${JSON.stringify(context.metadata || {})}
User Context: ${context.userContext || 'Not provided'}
Additional Context: ${context.additionalPrompt || 'Not provided'}

Provide a comprehensive analysis including risk assessment, recommended action, and detailed reasoning.`;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "glm-4.5",
      temperature: 0.0,  // Deterministic output
      max_tokens: 1024,
      thinking: {
        type: "enabled"  // Enable multi-step reasoning
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from GLM-4.5');
    }

    // Parse and validate JSON response
    let reasoning;
    try {
      reasoning = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse GLM-4.5 response:', content);
      throw new Error(`Invalid JSON response from GLM-4.5: ${parseError.message}`);
    }

    // Convert reasoning to ModelResult format
    const labels: ModelResult['labels'] = [];
    
    // Add analysis summary as labels
    if (reasoning.analysis_summary) {
      labels.push({
        label: `category_${reasoning.analysis_summary.content_category}`,
        score: reasoning.analysis_summary.confidence
      });
      
      labels.push({
        label: `risk_${reasoning.analysis_summary.risk_level}`,
        score: reasoning.analysis_summary.confidence
      });
      
      // Add key indicators as labels
      if (reasoning.analysis_summary.key_indicators && Array.isArray(reasoning.analysis_summary.key_indicators)) {
        reasoning.analysis_summary.key_indicators.forEach((indicator: string) => {
          labels.push({
            label: indicator.toLowerCase().replace(/\s+/g, '_'),
            score: reasoning.analysis_summary.confidence * 0.9
          });
        });
      }
    }

    // Add recommended action as a label
    if (reasoning.recommended_action) {
      labels.push({
        label: `action_${reasoning.recommended_action}`,
        score: 0.95  // High confidence for recommended action
      });
    }

    const latencyMs = Date.now() - startTime;

    return {
      modelName: 'GLM-4.5',
      modelVersion: '2025-07-28',
      labels,
      rawOutput: reasoning,
      latencyMs
    };

  } catch (error) {
    console.error('GLM-4.5 reasoning failed:', error);
    throw new Error(`GLM-4.5 reasoning failed: ${error.message}`);
  }
}

/**
 * Generate saliency map for image analysis
 * Uses GLM-4.5V to create visual heatmaps highlighting areas of concern
 */
export async function generateSaliencyMap(imageBuffer: Buffer, imageFormat: string = 'jpeg'): Promise<string> {
  const client = await getZaiClient();
  
  try {
    const base64Image = imageBuffer.toString('base64');
    const imageMime = `image/${imageFormat}`;
    
    const response = await client.images.generations.create({
      prompt: `Create a saliency map/heatmap for content moderation analysis. 
      
      Instructions:
      - Highlight areas of concern in RED (high concern)
      - Use YELLOW for medium concern areas  
      - Use BLUE for low concern areas
      - Focus on: potentially explicit content, suspicious elements, policy violations
      - Make the heatmap semi-transparent so original content is visible
      - Use a professional, analytical style suitable for content moderation
      
      This is for professional content moderation analysis, not artistic creation.`,
      image: `data:${imageMime};base64,${base64Image}`,
      size: '1024x1024',
      n: 1
    });

    const imageData = response.data[0];
    if (!imageData || !imageData.base64) {
      throw new Error('No image data received from saliency map generation');
    }

    return `data:image/png;base64,${imageData.base64}`;

  } catch (error) {
    console.error('Saliency map generation failed:', error);
    throw new Error(`Saliency map generation failed: ${error.message}`);
  }
}

/**
 * Retry wrapper for Z.AI calls with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Export utility functions for testing and monitoring
export const ZaiUtils = {
  getZaiClient,
  withRetry,
  VISION_ANALYSIS_SCHEMA,
  TEXT_REASONING_SCHEMA
};