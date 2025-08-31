// src/services/zaiVision.ts
/**
 * zaiVision.ts
 * Wrapper that calls GLM-4.5V (multimodal vision model) to produce deterministic JSON
 * that matches the ModelResult type in src/types/index.ts.
 *
 * - Uses ZaiClient.callZai
 * - Validates output with AJV
 * - Error handling + retry fallback
 *
 * Example usage:
 *   const client = new ZaiClient({ apiKey: process.env.ZAI_API_KEY });
 *   const result = await zaiVisionAnalyze(client, imageBuffer, { temperature: 0.0 });
 */
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { ZaiClient } from './zaiClient';
import { ModelResult, ModelLabel } from '../types/index';

addFormats(Ajv);

export interface VisionOptions {
  model?: string; // default GLM-4.5V
  temperature?: number;
  max_tokens?: number;
  // extra flag to include saliency base64 in response; many providers prefer returning as image URL; default false
  includeSaliencyBase64?: boolean;
  // allow returning best-effort even if schema validation fails
  allowLenientParse?: boolean;
}

/** JSON schema we instruct the model to follow exactly */
const visionSchema = {
  type: 'object',
  properties: {
    labels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          score: { type: 'number' },
          region: {
            type: 'object',
            nullable: true,
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
            },
            required: ['x', 'y', 'width', 'height'],
          },
        },
        required: ['label', 'score'],
      },
    },
    saliency_base64: { type: 'string', nullable: true },
    provenance: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['model'],
    },
  },
  required: ['labels', 'provenance'],
  additionalProperties: true,
} as const;

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateVision = ajv.compile(visionSchema);

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    // attempt to extract first {...}
    const m = s.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Unable to parse JSON from model output');
    return JSON.parse(m[0]);
  }
}

/**
 * Build the deterministic system + user prompt for vision moderation.
 * Note: We instruct the model to *only* output valid JSON identical to the schema.
 */
function buildVisionPrompt(opts: VisionOptions) {
  const system = `
SYSTEM:
You are a vision moderation assistant. DO NOT provide free-form text.
Output MUST be valid JSON ONLY and adhere to the schema described below.
Schema: { "labels":[{"label":"string","score":float,"region":{"x":0..1,"y":0..1,"width":0..1,"height":0..1}}], "saliency_base64":<nullable string>, "provenance":{"model":"GLM-4.5V","version":"..."} }
Labels: include categories such as "sexual_nudity", "partial_nudity", "suggestive", "violence", "self_harm", "hate_symbols", "non-sexual_adult_content", "child_exposed", "deepfake".
Scores must be between 0 and 1 (0.0-1.0). Regions must be normalized (x,y,width,height) relative to image dimensions.
If you cannot detect any label with confidence, return labels: [].
Return BASE64 saliency map only if requested via includeSaliencyBase64.
  `.trim();

  const user = `
USER:
Analyze the attached image and return JSON only. Do not include commentary or chain-of-thought.
Return labels sorted by descending score.
`;

  return { system, user };
}

export async function zaiVisionAnalyze(
  client: ZaiClient,
  imageBuffer: Buffer,
  opts?: VisionOptions
): Promise<ModelResult> {
  const options: VisionOptions = {
    model: process.env.ZAI_VISION_MODEL || 'GLM-4.5V',
    temperature: 0.0,
    max_tokens: 1200,
    includeSaliencyBase64: false,
    allowLenientParse: false,
    ...opts,
  };

  // encode the image as base64 for the request; if your provider supports multipart or binary, adapt accordingly.
  const imageB64 = imageBuffer.toString('base64');
  const promptParts = buildVisionPrompt(options);

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
      // instruct the model to disable verbose content; provider-specific parameter names may vary
      output_format: 'json',
      // We ask the model to respond with the JSON body only
    },
  };

  // call ZAI
  const resp = await client.callZai(payload, { retries: 3 });

  // Model SDKs differ. We assume the API returns an object { outputs: [{ content: "..." }] } or similar.
  const rawText =
    resp?.outputs?.[0]?.content ??
    resp?.result ??
    resp?.choices?.[0]?.message?.content ??
    JSON.stringify(resp); // fallback to raw JSON for debugging

  let parsed: any;
  try {
    parsed = safeJsonParse(rawText);
  } catch (err) {
    if (options.allowLenientParse) {
      // best-effort: return empty labels
      parsed = { labels: [], provenance: { model: options.model } };
    } else {
      throw new Error('[zaiVisionAnalyze] failed to parse model JSON: ' + (err as Error).message);
    }
  }

  // Validate
  const valid = validateVision(parsed);
  if (!valid) {
    if (options.allowLenientParse) {
      // log and fallback
      console.warn('[zaiVisionAnalyze] schema validation failed - falling back', validateVision.errors);
    } else {
      throw new Error(`[zaiVisionAnalyze] schema validation failed: ${JSON.stringify(validateVision.errors)}`);
    }
  }

  // Map to ModelResult type
  const labels: ModelLabel[] = (parsed.labels || []).map((l: any) => ({
    label: String(l.label),
    score: Number(l.score),
    region: l.region ? { 
      x: Number(l.region.x), 
      y: Number(l.region.y), 
      width: Number(l.region.width), 
      height: Number(l.region.height) 
    } : undefined,
  }));

  const modelResult: ModelResult = {
    modelName: options.model!,
    modelVersion: parsed.provenance?.version || undefined,
    labels,
    rawOutput: parsed,
    latencyMs: typeof resp?.latencyMs === 'number' ? resp.latencyMs : undefined,
    saliencyUrl: undefined, // if parsed.saliency_base64 present, handle storage upload outside this function
  };

  // If we have a base64 saliency map, caller can upload it to storage and set saliencyUrl
  if (parsed.saliency_base64) {
    // TODO: upload parsed.saliency_base64 to object store and set modelResult.saliencyUrl
    modelResult.rawOutput._saliency_b64 = parsed.saliency_base64;
  }

  return modelResult;
}