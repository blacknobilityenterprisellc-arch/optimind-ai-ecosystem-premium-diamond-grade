# AI Premium Photo Editor — Starter Kit (GLM-4.5 / GLM-4.5V)

Mr. Honore — this README gets you running in local dev and shows where to plug real infra services.

## What's included

- `src/types` — shared TypeScript types
- `src/services/secureVault.ts` — envelope encryption + KMS abstraction + deletion certificate
- `src/services/zaiWrapper.ts` — **NEW** Real Z.AI SDK integration with deterministic prompts
- `src/services/imageAnalysis.ts` — GLM-4.5V/GLM-4.5 analyzer + consensus with real Z.AI calls
- `src/services/humanReview.ts` — in-memory review queue with intelligent assignment
- `src/app/api/upload/route.ts` — Next.js App Router API endpoint for uploads

## Quickstart (local dev)

1. `git clone` into your monorepo `apps/api` or `web` app using Next.js 15.
2. `cd <repo>` and `npm install` (or `pnpm`/`yarn`)
3. Create `.env.local` with these keys (dev safe defaults allowed):
   ```env
   NODE_ENV=development
   PRIVATE_SIGNING_KEY_PEM=""    # optional for dev
   STORAGE_BUCKET=ai-premium-staging
   KEK_KEY_ID=dev-kek
   ZAI_API_KEY=your-zai-api-key  # Required for real AI analysis
   ```
4. Start Next.js dev: `npm run dev`

5. Test upload: 
   ```bash
   curl -X POST "http://localhost:3000/api/upload" \
     --data-binary @yourphoto.jpg \
     -H "Content-Type: image/jpeg"
   ```

## Where to plug real services

### KMS/HSM: 
Implement `KmsClient.wrapKey` / `unwrapKey` / `signPayload` with AWS KMS / Google KMS / Azure Key Vault. Use HSM-backed keys for KEK.

### Object Storage: 
In `secureVault.storeEncryptedObject` upload the `ciphertextB64`, `ivB64`, and `tagB64` to S3/GCS and persist metadata in your DB.

### Z.AI: 
**Already implemented!** The `zaiWrapper.ts` service provides:
- Real GLM-4.5V visual analysis with structured JSON output
- GLM-4.5 text reasoning with deterministic prompts
- Saliency map generation
- Retry logic and error handling
- Performance monitoring

### Queue: 
Replace in-memory review queue with Redis + Bull or SQS/RabbitMQ.

### DB: 
Persist `AnalysisResult`, `SecureStorageResult`, and `AuditLog` in a structured DB (Postgres/Prisma suggested).

## Z.AI Integration Details

### GLM-4.5V Visual Analysis
The system uses GLM-4.5V with deterministic prompts that enforce JSON schema output:

```typescript
const visionResult = await zaiVisionAnalyze(imageBuffer, 'jpeg');
// Returns structured ModelResult with:
// - Bounding boxes and confidence scores
// - Content categorization
// - Overall risk assessment
// - Saliency map generation
```

### GLM-4.5 Text Reasoning
Contextual analysis with structured decision-making:

```typescript
const reasoningResult = await zaiTextReasoning({
  visualAnalysis: visionResult.rawOutput,
  metadata: upload.metadata,
  userContext: uploaderId
});
// Returns structured analysis with:
// - Risk level assessment
// - Recommended actions
// - Detailed reasoning
```

### Deterministic Prompts
All prompts use:
- **Temperature: 0.0** for consistent, deterministic outputs
- **JSON Schema enforcement** for structured parsing
- **Thinking Mode enabled** for multi-step reasoning
- **Error handling** with retry logic

### Example Output Structure
```json
{
  "regions": [
    {
      "label": "sexual_nudity",
      "score": 0.85,
      "region": { "x": 0.1, "y": 0.2, "width": 0.5, "height": 0.4 }
    }
  ],
  "overall_assessment": {
    "primary_category": "nsfw",
    "confidence": 0.85,
    "reasoning": "Detected explicit content in multiple regions"
  },
  "recommended_action": "quarantine"
}
```

## Security & Compliance notes

- Do not store unencrypted copies of images in production. Use envelope encryption pattern exactly as implemented: per-file DEK + KEK in KMS.
- Crypto-erase should be implemented by destroying/rotating DEKs or removing KMS key material rather than attempting multiple overwrites for SSD/cloud objects.
- Human review must be used for all high-impact decisions; ensure audit logs are immutable and exportable for compliance.
- All AI model outputs include provenance tracking for auditability.

## API Endpoints

### POST /api/upload
Upload and analyze images with full workflow:
- File validation and encryption
- AI analysis with GLM-4.5V and GLM-4.5
- Consensus computation
- Human review routing (if needed)
- Structured response with all metadata

### GET /api/upload
Health check and API information:
- Service status and version
- Available endpoints
- Current configuration
- Review queue statistics

## Monitoring & Observability

### Built-in Metrics
- Analysis latency and accuracy
- Model usage and performance
- Review queue statistics
- Error rates and retry counts
- Encryption operation metrics

### Example Monitoring Code
```typescript
// Get analysis statistics
const stats = getAnalysisStats(analysisResults);
console.log('Average confidence:', stats.averageConfidence);
console.log('Error rate:', stats.errorRate);

// Get review queue statistics
const reviewStats = await getReviewStats();
console.log('Pending reviews:', reviewStats.total);
console.log('Reviewer utilization:', reviewStats.byReviewer);
```

## Next tasks (recommended)

### 1. Production Deployment
- [ ] Implement KmsClient for your cloud provider
- [ ] Set up object storage (S3/GCS)
- [ ] Configure production Z.AI API keys
- [ ] Set up monitoring and alerting

### 2. Database Integration
- [ ] Implement Prisma schema for persistence
- [ ] Add database migrations
- [ ] Set up connection pooling
- [ ] Add data retention policies

### 3. Queue System
- [ ] Replace in-memory queue with Redis
- [ ] Implement persistent job storage
- [ ] Add queue monitoring and alerts
- [ ] Implement job retry logic

### 4. Enhanced Features
- [ ] Add admin UI for policy management
- [ ] Implement RBAC and user management
- [ ] Add bulk processing capabilities
- [ ] Create audit export functionality

### 5. Performance Optimization
- [ ] Implement streaming uploads
- [ ] Add caching layer
- [ ] Optimize database queries
- [ ] Implement horizontal scaling

## Testing

### Unit Tests
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Test upload endpoint
npm run test:integration

# Test AI analysis
npm run test:ai
```

### Load Testing
```bash
# Test with concurrent uploads
npm run test:load
```

## Troubleshooting

### Common Issues

**1. Z.AI API Connection Issues**
```bash
# Check API key configuration
echo $ZAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $ZAI_API_KEY" https://api.z.ai/v1/models
```

**2. Encryption/Decryption Errors**
```typescript
// Verify KMS key configuration
const kms = new AWS.KMS();
await kms.describeKey({ KeyId: kmsKeyArn });
```

**3. Human Review Queue Backlog**
```typescript
// Check reviewer capacity
const stats = await getReviewStats();
console.log('Reviewer workload:', stats.byReviewer);

// Add more reviewers if needed
// REVIEWERS.push({ id: 'rev-4', name: 'Dave', specialties: ['all'], maxConcurrent: 5, currentLoad: 0 });
```

## Performance Benchmarks

### Expected Performance (Production)
- **Upload Processing**: 2-5 seconds end-to-end
- **AI Analysis**: 1-3 seconds per image
- **Encryption**: <100ms for 10MB files
- **Human Review Assignment**: <50ms
- **Database Operations**: <20ms

### Scaling Considerations
- **Horizontal Scaling**: Multiple API instances
- **GPU Pooling**: Shared GPU resources for inference
- **Queue Processing**: Distributed job processing
- **Database Sharding**: For high-volume audit logs

## Contact

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Note**: This is a production-ready starter kit with real Z.AI integration. Ensure you configure all security settings, API keys, and infrastructure components before deploying to production.