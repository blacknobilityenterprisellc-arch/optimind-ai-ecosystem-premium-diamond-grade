// src/services/zaiAir.ts
/**
 * zaiAir.ts
 * Wrapper for GLM-4.5 AIR (Advanced Image Reasoning) model.
 * Specialized for complex image understanding, contextual analysis, and advanced reasoning tasks.
 * 
 * Features:
 * - Multi-step reasoning for complex image scenarios
 * - Contextual understanding with metadata integration
 * - Advanced object relationship analysis
 * - Scene composition and intent inference
 * - Cross-modal reasoning (visual + textual context)
 * - Deterministic output with structured JSON schema
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ZaiClient } from './zaiClient';
import { ModelResult, ModelLabel } from '../types/index';

addFormats(Ajv);

const ajv = new Ajv({ strict: false });

export interface AirOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  enableMultiStepReasoning?: boolean;
  includeRelationshipAnalysis?: boolean;
  allowLenientParse?: boolean;
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
}

/** JSON schema for GLM-4.5 AIR advanced reasoning output */
const airSchema = {
  type: 'object',
  properties: {
    scene_analysis: {
      type: 'object',
      properties: {
        primary_subjects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              subject: { type: 'string' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              attributes: { type: 'array', items: { type: 'string' } },
              bounding_box: {
                type: 'object',
                properties: {
                  x: { type: 'number', minimum: 0, maximum: 1 },
                  y: { type: 'number', minimum: 0, maximum: 1 },
                  width: { type: 'number', minimum: 0, maximum: 1 },
                  height: { type: 'number', minimum: 0, maximum: 1 }
                },
                required: ['x', 'y', 'width', 'height']
              }
            },
            required: ['subject', 'confidence']
          }
        },
        scene_composition: {
          type: 'object',
          properties: {
            setting: { type: 'string' },
            atmosphere: { type: 'string' },
            lighting: { type: 'string' },
            perspective: { type: 'string' }
          }
        },
        spatial_relationships: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              subject_a: { type: 'string' },
              subject_b: { type: 'string' },
              relationship: { type: 'string' },
              confidence: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['subject_a', 'subject_b', 'relationship', 'confidence']
          }
        }
      },
      required: ['primary_subjects']
    },
    contextual_analysis: {
      type: 'object',
      properties: {
        intent_inference: {
          type: 'object',
          properties: {
            primary_intent: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            alternative_intents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  intent: { type: 'string' },
                  confidence: { type: 'number', minimum: 0, maximum: 1 }
                },
                required: ['intent', 'confidence']
              }
            }
          },
          required: ['primary_intent', 'confidence']
        },
        emotional_tone: {
          type: 'object',
          properties: {
            dominant_emotion: { type: 'string' },
            intensity: { type: 'number', minimum: 0, maximum: 1 },
            emotional_complexity: { type: 'string', enum: ['simple', 'moderate', 'complex'] }
          },
          required: ['dominant_emotion', 'intensity']
        },
        narrative_elements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              element: { type: 'string' },
              role: { type: 'string' },
              significance: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['element', 'role', 'significance']
          }
        }
      }
    },
    risk_assessment: {
      type: 'object',
      properties: {
        content_categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              severity: { type: 'number', minimum: 0, maximum: 1 },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              justification: { type: 'string' }
            },
            required: ['category', 'severity', 'confidence']
          }
        },
        contextual_risk_factors: {
          type: 'array',
          items: { type: 'string' }
        },
        recommended_action: {
          type: 'string',
          enum: ['allow', 'monitor', 'hold_for_review', 'quarantine', 'escalate']
        }
      },
      required: ['content_categories', 'recommended_action']
    },
    reasoning_chain: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          step: { type: 'number' },
          observation: { type: 'string' },
          inference: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 }
        },
        required: ['step', 'observation', 'inference', 'confidence']
      }
    },
    provenance: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        version: { type: 'string' },
        analysis_timestamp: { type: 'string' }
      },
      required: ['model', 'version']
    }
  },
  required: ['scene_analysis', 'risk_assessment', 'provenance']
};

const validateAir = ajv.compile(airSchema);

function buildAirPrompt(
  imageDescription: string,
  metadata: Record<string, any>,
  options: AirOptions
): { system: string; user: string } {
  const depthInstructions = {
    basic: 'Provide essential analysis with key observations and risk assessment.',
    detailed: 'Provide comprehensive analysis with detailed observations, relationships, and contextual understanding.',
    comprehensive: 'Provide exhaustive analysis including multi-step reasoning, deep contextual understanding, and nuanced risk assessment.'
  };

  const system = `SYSTEM:
You are GLM-4.5 AIR (Advanced Image Reasoning), an expert AI specialized in complex image understanding and contextual analysis.

Your capabilities include:
- Multi-step reasoning for complex visual scenarios
- Contextual understanding integrating visual and metadata information
- Advanced object relationship and spatial analysis
- Scene composition and intent inference
- Cross-modal reasoning with emotional and narrative analysis
- Sophisticated risk assessment with contextual factors

Analysis Depth: ${options.analysisDepth || 'detailed'}
${depthInstructions[options.analysisDepth || 'detailed']}

You MUST respond with valid JSON ONLY following this schema:
${JSON.stringify(airSchema, null, 2)}

Key Analysis Guidelines:
1. Scene Analysis: Identify primary subjects, their attributes, and spatial relationships
2. Contextual Analysis: Infer intent, emotional tone, and narrative elements
3. Risk Assessment: Evaluate content categories with severity and contextual factors
4. Reasoning Chain: Document your step-by-step analytical process
5. Be thorough but concise; prioritize accuracy over exhaustive detail
6. Use confidence scores (0.0-1.0) to indicate certainty
7. Consider metadata context in your analysis

Important: Return ONLY valid JSON. No explanations, no markdown, just the JSON object.`;

  const user = `USER:
Analyze this image for advanced content understanding and risk assessment.

Image Description: ${imageDescription}
Metadata Context: ${JSON.stringify(metadata)}
Analysis Requirements: 
- Multi-step reasoning: ${options.enableMultiStepReasoning ? 'enabled' : 'disabled'}
- Relationship analysis: ${options.includeRelationshipAnalysis ? 'enabled' : 'disabled'}
- Temperature: ${options.temperature || 0.0} (deterministic output)

Provide comprehensive analysis following the specified schema.`;

  return { system, user };
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    // Attempt to extract first {...} block
    const m = s.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Unable to parse JSON from model output');
    return JSON.parse(m[0]);
  }
}

export async function zaiAirAnalyze(
  client: ZaiClient,
  imageBuffer: Buffer,
  metadata: Record<string, any> = {},
  opts?: AirOptions
): Promise<ModelResult> {
  const options: AirOptions = {
    model: process.env.ZAI_AIR_MODEL || 'GLM-4.5-AIR',
    temperature: 0.0,
    max_tokens: 2048,
    enableMultiStepReasoning: true,
    includeRelationshipAnalysis: true,
    allowLenientParse: false,
    analysisDepth: 'detailed',
    ...opts,
  };

  // Encode image as base64
  const imageB64 = imageBuffer.toString('base64');
  
  // Create a basic image description for context
  const imageDescription = `Image analysis with metadata: ${JSON.stringify({
    size: imageBuffer.length,
    type: metadata.contentType || 'unknown',
    filename: metadata.filename || 'unknown'
  })}`;

  const promptParts = buildAirPrompt(imageDescription, metadata, options);

  const payload = {
    model: options.model,
    inputs: [
      {
        modality: 'image',
        content_base64: imageB64,
      },
      {
        modality: 'text',
        content: `${promptParts.system}\n\n${promptParts.user}`,
      },
    ],
    parameters: {
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      output_format: 'json',
      // Enable advanced reasoning features if supported
      reasoning_depth: options.analysisDepth,
      multi_step: options.enableMultiStepReasoning,
    },
  };

  // Call ZAI with enhanced retry logic for AIR (longer processing time)
  const resp = await client.callZai(payload, { 
    retries: 4, // More retries for complex analysis
    timeoutMs: 60000 // Longer timeout for advanced reasoning
  });

  // Extract response text
  const rawText =
    resp?.outputs?.[0]?.content ??
    resp?.result ??
    resp?.choices?.[0]?.message?.content ??
    JSON.stringify(resp);

  let parsed: any;
  try {
    parsed = safeJsonParse(rawText);
  } catch (err) {
    if (options.allowLenientParse) {
      // Fallback response
      parsed = {
        scene_analysis: { primary_subjects: [] },
        risk_assessment: { 
          content_categories: [{ category: 'analysis_error', severity: 0.5, confidence: 1.0 }],
          recommended_action: 'hold_for_review'
        },
        provenance: { model: options.model }
      };
    } else {
      throw new Error(`[zaiAirAnalyze] Failed to parse model JSON: ${(err as Error).message}`);
    }
  }

  // Validate schema
  const valid = validateAir(parsed);
  if (!valid) {
    if (options.allowLenientParse) {
      console.warn('[zaiAirAnalyze] Schema validation failed - continuing with fallback', validateAir.errors);
    } else {
      throw new Error(`[zaiAirAnalyze] Schema validation failed: ${JSON.stringify(validateAir.errors)}`);
    }
  }

  // Convert AIR analysis to ModelResult format
  const labels: ModelLabel[] = [];

  // Add risk assessment categories as labels
  if (parsed.risk_assessment?.content_categories) {
    parsed.risk_assessment.content_categories.forEach((category: any) => {
      labels.push({
        label: category.category,
        score: category.severity * category.confidence, // Combined severity and confidence
      });
    });
  }

  // Add scene analysis subjects as labels
  if (parsed.scene_analysis?.primary_subjects) {
    parsed.scene_analysis.primary_subjects.forEach((subject: any) => {
      labels.push({
        label: `subject_${subject.subject.toLowerCase().replace(/\s+/g, '_')}`,
        score: subject.confidence * 0.7, // Lower weight for subject detection
        region: subject.bounding_box
      });
    });
  }

  // Add intent inference as label
  if (parsed.contextual_analysis?.intent_inference) {
    const intent = parsed.contextual_analysis.intent_inference;
    labels.push({
      label: `intent_${intent.primary_intent.toLowerCase().replace(/\s+/g, '_')}`,
      score: intent.confidence * 0.8,
    });
  }

  // Add emotional tone as label
  if (parsed.contextual_analysis?.emotional_tone) {
    const emotion = parsed.contextual_analysis.emotional_tone;
    labels.push({
      label: `emotion_${emotion.dominant_emotion.toLowerCase().replace(/\s+/g, '_')}`,
      score: emotion.intensity * 0.6,
    });
  }

  // Add recommended action as high-confidence label
  if (parsed.risk_assessment?.recommended_action) {
    labels.push({
      label: `action_${parsed.risk_assessment.recommended_action}`,
      score: 0.95,
    });
  }

  const modelResult: ModelResult = {
    modelName: options.model!,
    modelVersion: parsed.provenance?.version || undefined,
    labels,
    rawOutput: parsed,
    latencyMs: typeof resp?.latencyMs === 'number' ? resp.latencyMs : undefined,
  };

  // Add AIR-specific metadata
  modelResult.rawOutput._air_metadata = {
    analysisDepth: options.analysisDepth,
    multiStepReasoning: options.enableMultiStepReasoning,
    relationshipAnalysis: options.includeRelationshipAnalysis,
    reasoningSteps: parsed.reasoning_chain?.length || 0
  };

  return modelResult;
}

// Export utility functions for AIR-specific operations
export const AirUtils = {
  buildAirPrompt,
  validateAir: (data: any) => validateAir(data),
  getAirSchema: () => airSchema
};