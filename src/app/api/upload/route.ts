/**
 * Next.js App Router API route handler for uploading images.
 *
 * Usage:
 *  POST /api/upload
 *  body: form-data (file) or application/octet-stream
 *
 * NOTE: This uses the native Request object available in Next.js route handlers.
 * For production, wire this into authentication, DB, storage SDKs, and queue workers.
 */
import { NextResponse } from 'next/server';
import { analyzeImage, getAnalysisStats } from '../../../services/imageAnalysis';
import { SecureVault, DevKmsClient } from '../../../services/secureVault';
import { enqueueHumanReview, getReviewStats } from '../../../services/humanReview';
import { v4 as uuidv4 } from 'uuid';
import { ImageUploadRequest } from '../../../types/index';
import crypto from 'crypto';

const kms = new DevKmsClient(process.env.PRIVATE_SIGNING_KEY_PEM);
const vault = new SecureVault(kms, process.env.STORAGE_BUCKET || 'ai-premium-staging');

export async function POST(req: Request) {
  try {
    const startTime = Date.now();
    
    // Accept either multipart/form-data or raw body (simplified)
    const contentType = req.headers.get('content-type') || '';
    let filename = `upload-${Date.now()}.bin`;
    let buffer: Buffer;
    let uploaderId: string | undefined;
    let metadata: Record<string, any> = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Simple form-data parsing (production: use formidable / busboy)
      const formData = await req.formData();
      const file = formData.get('file') as any;
      uploaderId = formData.get('uploaderId') as string;
      
      if (!file) {
        return NextResponse.json({ error: 'missing file field' }, { status: 400 });
      }
      
      filename = file.name || filename;
      buffer = Buffer.from(await file.arrayBuffer());
      
      // Extract additional metadata
      const metadataStr = formData.get('metadata') as string;
      if (metadataStr) {
        try {
          metadata = JSON.parse(metadataStr);
        } catch (e) {
          console.warn('Failed to parse metadata:', e);
        }
      }
    } else {
      // treat body as binary
      const ab = await req.arrayBuffer();
      buffer = Buffer.from(ab);
    }
    
    // Basic validations
    if (buffer.length === 0) {
      return NextResponse.json({ error: 'empty file' }, { status: 400 });
    }
    
    if (buffer.length > 50 * 1024 * 1024) { // 50MB limit for MVP
      return NextResponse.json({ error: 'file too large' }, { status: 413 });
    }
    
    // Compute content hash for dedupe/audit
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Build upload descriptor
    const upload: ImageUploadRequest = {
      filename,
      contentType: req.headers.get('content-type') || 'application/octet-stream',
      size: buffer.length,
      uploaderId,
      metadata: {
        ...metadata,
        clientIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        userAgent: req.headers.get('user-agent') || null,
        uploadTimestamp: new Date().toISOString()
      },
    };
    
    console.log(`[upload] Processing upload: ${filename} (${buffer.length} bytes)`);
    
    // 1) Create DEK and wrap with KMS
    const { dek, wrappedKey, dekId } = await vault.generateAndWrapDEK();
    
    // 2) Encrypt image with DEK
    const { ciphertext, iv, tag } = vault.encryptWithDEK(dek, buffer);
    
    // 3) Store encrypted object (TODO: upload ciphertext to object storage)
    const imageId = uuidv4();
    const objectKey = `${imageId}/${filename}.enc`;
    const storageMeta = await vault.storeEncryptedObject({
      imageId,
      objectKey,
      wrappedDEK: wrappedKey,
      dekId,
      ciphertextB64: ciphertext,
      ivB64: iv,
      tagB64: tag,
    });
    
    // 4) Run AI analysis (on plaintext buffer)
    console.log(`[upload] Running AI analysis for ${imageId}`);
    const analysis = await analyzeImage(buffer, upload);
    
    // 5) Determine if human review is needed
    const needsHumanReview = ['quarantine', 'hold_for_review', 'escalate'].includes(
      analysis.consensus.recommendedAction
    );
    
    let reviewItem: any = null;
    if (needsHumanReview) {
      console.log(`[upload] Enqueuing for human review: ${imageId}`);
      reviewItem = await enqueueHumanReview({
        imageId,
        priority: analysis.consensus.score >= 0.9 ? 'high' : 'medium',
        reasons: analysis.consensus.reasons,
        metadata: {
          filename,
          contentType: upload.contentType,
          size: upload.size,
          topLabel: analysis.consensus.topLabel,
          confidence: analysis.consensus.score
        }
      });
    }
    
    // 6) Log processing summary
    const processingTime = Date.now() - startTime;
    console.log(`[upload] Completed processing for ${imageId}:`, {
      filename,
      processingTimeMs: processingTime,
      topLabel: analysis.consensus.topLabel,
      confidence: analysis.consensus.score,
      recommendedAction: analysis.consensus.recommendedAction,
      humanReviewEnqueued: !!reviewItem,
      modelsUsed: analysis.modelResults.map(r => r.modelName)
    });
    
    // 7) Return structured response
    const response = {
      imageId,
      hash,
      storage: storageMeta,
      analysis: {
        imageId: analysis.imageId,
        consensus: analysis.consensus,
        modelResults: analysis.modelResults,
        createdAt: analysis.createdAt
      },
      review: reviewItem ? {
        reviewId: reviewItem.reviewId,
        priority: reviewItem.priority,
        assignedTo: reviewItem.assignedTo,
        reasons: reviewItem.reasons,
        status: 'pending'
      } : null,
      processing: {
        totalLatencyMs: processingTime,
        steps: {
          encryption: 'completed',
          analysis: 'completed',
          humanReview: needsHumanReview ? 'enqueued' : 'not_required'
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (err) {
    console.error('[upload route] error:', err);
    return NextResponse.json({ 
      error: (err as any)?.message || 'unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * GET endpoint for API information and health check
 */
export async function GET() {
  try {
    // Get current system statistics
    const reviewStats = await getReviewStats();
    
    return NextResponse.json({
      service: 'AI Premium Photo Editor API',
      version: '1.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      endpoints: {
        'POST /api/upload': 'Upload and analyze images',
        'GET /api/upload': 'API information and health check',
        'GET /api/reviews': 'Get human review queue',
        'POST /api/reviews/:id/decision': 'Submit review decision',
        'GET /api/reviews/stats': 'Get review statistics',
        'POST /api/delete/:imageId': 'Securely delete image'
      },
      features: [
        'GLM-4.5V visual analysis',
        'GLM-4.5 ensemble reasoning',
        'Envelope encryption (AES-256-GCM)',
        'Human review workflow',
        'Audit logging',
        'Secure deletion with certificates'
      ],
      configuration: {
        maxFileSize: '50MB',
        supportedFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        encryption: 'AES-256-GCM with envelope encryption',
        models: ['GLM-4.5V', 'GLM-4.5'],
        reviewQueue: reviewStats
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('[upload GET] error:', error);
    return NextResponse.json({
      service: 'AI Premium Photo Editor API',
      version: '1.0.0',
      status: 'degraded',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}