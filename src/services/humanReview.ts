/**
 * humanReview.ts
 * Minimal human-in-the-loop queue + assignment logic.
 * Replace in-memory queue with Redis/Bull and DB persistence in production.
 */
import { v4 as uuidv4 } from 'uuid';
import { ReviewItem } from '../types/index';

// In-memory queue for dev
const reviewQueue: ReviewItem[] = [];

// Simple reviewer pool example (in prod use DB + RBAC)
const REVIEWERS = [
  { id: 'rev-1', name: 'Alice', specialties: ['nudity', 'deepfake'], maxConcurrent: 5, currentLoad: 0 },
  { id: 'rev-2', name: 'Bob', specialties: ['violence', 'hate'], maxConcurrent: 5, currentLoad: 0 },
  { id: 'rev-3', name: 'Carol', specialties: ['nudity', 'violence', 'hate'], maxConcurrent: 3, currentLoad: 0 },
];

/**
 * Intelligent reviewer assignment based on specialties and workload
 */
function pickReviewer(priority: string, reasons: string[]): string {
  // Extract content categories from reasons
  const contentCategories = reasons.map(reason => 
    reason.toLowerCase().match(/(nudity|deepfake|violence|hate|sexual|explicit|weapon|blood|discrimination)/)?.[0]
  ).filter(Boolean);

  // Find reviewers with matching specialties
  const availableReviewers = REVIEWERS.filter(reviewer => {
    // Check if reviewer has capacity
    if (reviewer.currentLoad >= reviewer.maxConcurrent) return false;
    
    // Check if reviewer has relevant specialties
    if (contentCategories.length === 0) return true;
    
    return contentCategories.some(category => 
      reviewer.specialties.some(specialty => 
        specialty.toLowerCase().includes(category)
      )
    );
  });

  if (availableReviewers.length === 0) {
    // Fallback to any available reviewer
    const anyAvailable = REVIEWERS.filter(r => r.currentLoad < r.maxConcurrent);
    if (anyAvailable.length === 0) {
      // All reviewers at capacity, return least loaded
      return REVIEWERS.reduce((min, reviewer) => 
        reviewer.currentLoad < min.currentLoad ? reviewer : min
      ).id;
    }
    return anyAvailable[Math.floor(Math.random() * anyAvailable.length)].id;
  }

  // Pick the reviewer with the most relevant specialties and lowest load
  const scoredReviewers = availableReviewers.map(reviewer => {
    let score = 0;
    
    // Score based on specialty matches
    contentCategories.forEach(category => {
      if (reviewer.specialties.some(specialty => 
        specialty.toLowerCase().includes(category)
      )) {
        score += 10;
      }
    });
    
    // Score based on availability (lower load = higher score)
    score += (reviewer.maxConcurrent - reviewer.currentLoad) * 2;
    
    // Priority weighting
    const priorityWeight = { critical: 5, high: 3, medium: 2, low: 1 }[priority] || 1;
    score *= priorityWeight;
    
    return { reviewer, score };
  });

  // Return the highest-scoring reviewer
  scoredReviewers.sort((a, b) => b.score - a.score);
  const selectedReviewer = scoredReviewers[0].reviewer;
  
  // Update reviewer load
  selectedReviewer.currentLoad++;
  
  return selectedReviewer.id;
}

/**
 * Enqueue an item for human review
 */
export async function enqueueHumanReview(opts: {
  imageId: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  metadata?: Record<string, any>;
}): Promise<ReviewItem> {
  const reviewId = uuidv4();
  const assignedTo = pickReviewer(opts.priority || 'medium', opts.reasons);
  
  const item: ReviewItem = {
    reviewId,
    imageId: opts.imageId,
    priority: opts.priority || 'medium',
    assignedTo,
    reasons: opts.reasons,
    createdAt: new Date().toISOString(),
  };
  
  reviewQueue.push(item);
  
  console.log(`[humanReview] enqueued ${reviewId} for image ${opts.imageId}, assigned to ${assignedTo}`);
  
  // In production, this would trigger notifications, database writes, etc.
  return item;
}

/**
 * List all pending reviews
 */
export async function listPendingReviews(filters?: {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  limit?: number;
}): Promise<ReviewItem[]> {
  let filtered = [...reviewQueue];
  
  if (filters?.priority) {
    filtered = filtered.filter(item => item.priority === filters.priority);
  }
  
  if (filters?.assignedTo) {
    filtered = filtered.filter(item => item.assignedTo === filters.assignedTo);
  }
  
  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  // Sort by priority (critical first) then by creation time (oldest first)
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  filtered.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  
  return filtered;
}

/**
 * Remove a review from the queue (when completed)
 */
export async function popReview(reviewId: string, action?: string, notes?: string): Promise<boolean> {
  const idx = reviewQueue.findIndex((r) => r.reviewId === reviewId);
  if (idx === -1) return false;
  
  const review = reviewQueue[idx];
  
  // Update reviewer load
  const reviewer = REVIEWERS.find(r => r.id === review.assignedTo);
  if (reviewer && reviewer.currentLoad > 0) {
    reviewer.currentLoad--;
  }
  
  // Remove from queue
  reviewQueue.splice(idx, 1);
  
  console.log(`[humanReview] completed review ${reviewId} with action: ${action || 'unknown'}`);
  
  // In production, this would update database, send notifications, etc.
  return true;
}

/**
 * Get review queue statistics
 */
export async function getReviewStats(): Promise<{
  total: number;
  byPriority: Record<string, number>;
  byReviewer: Array<{
    reviewerId: string;
    reviewerName: string;
    currentLoad: number;
    maxConcurrent: number;
    utilization: number;
  }>;
  averageAge: number;
}> {
  const total = reviewQueue.length;
  
  // Count by priority
  const byPriority = reviewQueue.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Reviewer statistics
  const byReviewer = REVIEWERS.map(reviewer => ({
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    currentLoad: reviewer.currentLoad,
    maxConcurrent: reviewer.maxConcurrent,
    utilization: Math.round((reviewer.currentLoad / reviewer.maxConcurrent) * 100)
  }));
  
  // Calculate average age of reviews in queue
  const now = Date.now();
  const totalAge = reviewQueue.reduce((sum, item) => {
    return sum + (now - new Date(item.createdAt).getTime());
  }, 0);
  const averageAge = total > 0 ? total / reviewQueue.length : 0;
  
  return {
    total,
    byPriority,
    byReviewer,
    averageAge: Math.round(averageAge / 1000 / 60) // Convert to minutes
  };
}

/**
 * Reassign a review to a different reviewer
 */
export async function reassignReview(reviewId: string, newReviewerId?: string): Promise<boolean> {
  const review = reviewQueue.find(r => r.reviewId === reviewId);
  if (!review) return false;
  
  // Release current reviewer
  const currentReviewer = REVIEWERS.find(r => r.id === review.assignedTo);
  if (currentReviewer && currentReviewer.currentLoad > 0) {
    currentReviewer.currentLoad--;
  }
  
  // Assign to new reviewer
  const newReviewerIdFinal = newReviewerId || pickReviewer(review.priority, review.reasons);
  review.assignedTo = newReviewerIdFinal;
  
  // Update new reviewer load
  const newReviewer = REVIEWERS.find(r => r.id === newReviewerIdFinal);
  if (newReviewer) {
    newReviewer.currentLoad++;
  }
  
  console.log(`[humanReview] reassigned ${reviewId} from ${currentReviewer?.name} to ${newReviewer?.name}`);
  
  return true;
}

/**
 * Escalate a review to higher priority
 */
export async function escalateReview(reviewId: string, reason: string): Promise<boolean> {
  const review = reviewQueue.find(r => r.reviewId === reviewId);
  if (!review) return false;
  
  const priorityEscalation = {
    low: 'medium',
    medium: 'high',
    high: 'critical',
    critical: 'critical' // Already at highest
  } as const;
  
  const newPriority = priorityEscalation[review.priority];
  if (newPriority !== review.priority) {
    review.priority = newPriority;
    review.reasons.push(`Escalated: ${reason}`);
    
    // Reassign to potentially more specialized reviewer
    await reassignReview(reviewId);
    
    console.log(`[humanReview] escalated ${reviewId} to ${newPriority}: ${reason}`);
  }
  
  return true;
}

/**
 * Clean up old reviews (for maintenance)
 */
export async function cleanupOldReviews(maxAgeHours: number = 24): Promise<number> {
  const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  const initialLength = reviewQueue.length;
  
  // Remove reviews older than cutoff time
  for (let i = reviewQueue.length - 1; i >= 0; i--) {
    if (new Date(reviewQueue[i].createdAt) < cutoffTime) {
      const review = reviewQueue[i];
      
      // Release reviewer load
      const reviewer = REVIEWERS.find(r => r.id === review.assignedTo);
      if (reviewer && reviewer.currentLoad > 0) {
        reviewer.currentLoad--;
      }
      
      reviewQueue.splice(i, 1);
    }
  }
  
  const cleanedCount = initialLength - reviewQueue.length;
  if (cleanedCount > 0) {
    console.log(`[humanReview] cleaned up ${cleanedCount} old reviews`);
  }
  
  return cleanedCount;
}