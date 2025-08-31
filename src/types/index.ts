/**
 * Core shared types for AI Premium Photo Editor starter kit
 * Mr. Honore — keep these strict; they form the contract between services & agents.
 */
export type UUID = string;
export type Timestamp = string; // ISO-8601

export interface ImageUploadRequest {
  filename: string;
  contentType: string;
  size: number;
  uploaderId?: string;
  metadata?: Record<string, any>;
}

export interface ModelLabel {
  label: string;            // e.g. "sexual_nudity"
  score: number;            // 0..1 confidence
  region?: {                // optional bounding box
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ModelResult {
  modelName: string;        // e.g. "GLM-4.5V"
  modelVersion?: string;
  labels: ModelLabel[];
  rawOutput?: any;          // provider-specific payload
  latencyMs?: number;
  saliencyUrl?: string;     // link to heatmap (optional)
}

export interface ConsensusResult {
  topLabel: string;
  score: number;            // aggregated confidence 0..1
  spread: number;           // measure of agreement
  allLabels: Array<{ label: string; score: number }>;
  provenance: {
    models: { name: string; version?: string }[];
    timestamp: Timestamp;
  };
  recommendedAction: PolicyAction;
  reasons: string[];        // human readable reasons
}

export type PolicyAction = 'allow' | 'monitor' | 'quarantine' | 'hold_for_review' | 'escalate' | 'delete_pending_appeal';

export interface AnalysisResult {
  imageId: UUID;
  upload: ImageUploadRequest;
  consensus: ConsensusResult;
  modelResults: ModelResult[];
  createdAt: Timestamp;
}

export interface SecureStorageResult {
  imageId: UUID;
  bucket: string;
  objectKey: string;
  dekWrapped: string;       // encrypted/wrapped DEK (base64)
  dekId?: string;           // key identifier in KMS/HSM (if applicable)
  createdAt: Timestamp;
}

export interface DeletionCertificate {
  imageId: UUID;
  deletedBy: string;        // actor (system/user id)
  deletedAt: Timestamp;
  signature: string;        // signed payload (base64)
  reason?: string;
}

export interface ReviewItem {
  reviewId: UUID;
  imageId: UUID;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  reasons: string[];
  createdAt: Timestamp;
}

export interface AuditLog {
  id: UUID;
  event: string;
  actor?: string;
  payload?: any;
  createdAt: Timestamp;
}