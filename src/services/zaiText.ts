// src/services/zaiText.ts
/**
 * zaiText.ts
 * Wrapper for GLM-4.5 text reasoning / agent orchestration.
 * Designed to accept a visual description or metadata and return structured JSON
 * with labels + reasoning and confidence. Deterministic (temperature 0).
 *
 * Returns a ModelResult compatible with ModelResult type.
 */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ZaiClient } from './zaiClient';
import { ModelResult, ModelLabel } from '../types/index';

addFormats(Ajv);

const ajv = new Ajv({ strict: false });

export interface TextOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  allowLenientParse?: boolean;
}

/** JSON schema for text reasoning output */
const textSchema = {
  type: 'object',
  properties: {
    labels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          score: { type: 'number' },
        },
        required: ['label', 'score'],
      },
    },
    reasons: { type: 'array', items: { type: 'string' } },
    provenance: { type: 'object', properties: { model: { type: 'string' }, version: { type: 'string' } }, required: ['model'] },
  },
  required: ['labels', 'provenance'],
};

const validateText = ajv.compile(textSchema);

function buildTextPrompt(contextDescription: string) {
  const system = `
SYSTEM:
You are a content policy reasoning agent. You receive visual descriptors, OCR, EXIF, and metadata.
Produce ONLY valid JSON that matches the schema:
{ "labels": [{"label":"string","score":float}], "reasons":[ "short reason strings" ], "provenance":{ "model":"GLM-4.5", "version":"..." } }
Do not provide step-by-step internal reasoning or chain-of-thought. Output only JSON.
`;

  const user = `
USER:
Context: ${contextDescription}
Return the JSON as specified. Prioritize accuracy; use score 0.0-1.0.
`;

  return `${system}\n\n${user}`;
}

export async function zaiTextReasoning(
  client: ZaiClient, 
  contextDescription: string, 
  opts?: TextOptions
): Promise<ModelResult> {
  const options: TextOptions = {
    model: process.env.ZAI_TEXT_MODEL || 'GLM-4.5',
    temperature: 0.0,
    max_tokens: 800,
    allowLenientParse: false,
    ...opts,
  };

  const prompt = buildTextPrompt(contextDescription);

  const payload = {
    model: options.model,
    inputs: [
      {
        modality: 'text',
        content: prompt,
      },
    ],
    parameters: {
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      output_format: 'json',
    },
  };

  const resp = await client.callZai(payload, { retries: 2 });

  const rawText =
    resp?.outputs?.[0]?.content ??
    resp?.result ??
    resp?.choices?.[0]?.message?.content ??
    JSON.stringify(resp);

  // parse and validate
  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    // attempt to extract JSON block
    const m = rawText.match(/\{[\s\S]*\}/);
    if (!m) {
      if (options.allowLenientParse) {
        parsed = { labels: [], reasons: [], provenance: { model: options.model } };
      } else {
        throw new Error('[zaiTextReasoning] Could not parse model output to JSON');
      }
    } else {
      parsed = JSON.parse(m[0]);
    }
  }

  const valid = validateText(parsed);
  if (!valid) {
    if (!options.allowLenientParse) {
      throw new Error(`[zaiTextReasoning] Schema validation failed: ${JSON.stringify(validateText.errors)}`);
    } else {
      console.warn('[zaiTextReasoning] schema failed but continue (lenient).', validateText.errors);
    }
  }

  const labels: ModelLabel[] = (parsed.labels || []).map((l: any) => ({ 
    label: String(l.label), 
    score: Number(l.score) 
  }));

  const result: ModelResult = {
    modelName: options.model!,
    modelVersion: parsed.provenance?.version || undefined,
    labels,
    rawOutput: parsed,
    latencyMs: typeof resp?.latencyMs === 'number' ? resp.latencyMs : undefined,
  };

  return result;
}