// src/services/zaiClient.ts
import fetch from 'node-fetch'; // optional: in Node18+ global fetch exists; keep for compatibility
import AbortController from 'abort-controller';

export interface ZaiClientConfig {
  apiKey: string;
  apiUrl?: string; // default endpoint - override if your environment differs
  defaultModel?: string;
  timeoutMs?: number;
  maxRetries?: number;
  backoffBaseMs?: number;
}

const DEFAULT_CONFIG: Partial<ZaiClientConfig> = {
  apiUrl: process.env.ZAI_API_URL || 'https://api.z.ai/v1/generate',
  defaultModel: process.env.ZAI_DEFAULT_MODEL || 'GLM-4.5',
  timeoutMs: 30_000,
  maxRetries: 3,
  backoffBaseMs: 500,
};

export class ZaiClient {
  config: ZaiClientConfig;
  
  constructor(cfg: Partial<ZaiClientConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...cfg } as ZaiClientConfig;
    if (!this.config.apiKey) {
      throw new Error('ZAI API key required in ZaiClient config');
    }
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  /**
   * Generic call to Z.AI generate endpoint. Retries on 5xx or network errors.
   * `payload` shape is generic: { model, input, parameters, modalities, ... }
   */
  async callZai(payload: any, options?: { retries?: number; timeoutMs?: number }) {
    const retries = options?.retries ?? this.config.maxRetries ?? 3;
    const timeoutMs = options?.timeoutMs ?? this.config.timeoutMs ?? 30_000;
    let attempt = 0;
    let lastErr: any = null;

    while (++attempt <= retries) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const res = await fetch(this.config.apiUrl!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (res.ok) {
          const json = await res.json();
          return json;
        }

        // Retry on server error
        if (res.status >= 500 && attempt < retries) {
          lastErr = new Error(`ZAI server ${res.status} ${res.statusText}`);
          const backoff = (this.config.backoffBaseMs ?? 500) * Math.pow(2, attempt - 1);
          await this.sleep(backoff);
          continue;
        }

        // For client errors, parse body and throw immediately
        const text = await res.text();
        throw new Error(`ZAI API error status=${res.status} body=${text}`);
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        
        // Retry on network errors or aborts
        if (attempt < retries) {
          const backoff = (this.config.backoffBaseMs ?? 500) * Math.pow(2, attempt - 1);
          await this.sleep(backoff);
          continue;
        }
        throw lastErr;
      }
    }
    throw lastErr;
  }
}