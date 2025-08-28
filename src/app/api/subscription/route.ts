import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get session token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Validate session
    const session = await db.session.findFirst({
      where: {
        token: sessionToken,
        expires_at: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get subscription
    const subscription = await db.subscription.findFirst({
      orderBy: {
        created_at: 'desc'
      }
    });

    let subscriptionData: any = null;
    let isPremium = false;
    let hasActiveTrial = false;
    let trialDaysRemaining = 0;

    if (subscription) {
      subscriptionData = subscription;
      const now = new Date();
      
      // Check subscription status
      if (subscription.current_period_end < now) {
        subscriptionData.status = 'expired';
        isPremium = false;
      } else if (subscription.status === 'trial' && subscription.trial_end) {
        if (subscription.trial_end > now) {
          const trialEnd = new Date(subscription.trial_end);
          const diffTime = trialEnd.getTime() - now.getTime();
          trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isPremium = true;
          hasActiveTrial = true;
        } else {
          subscriptionData.status = 'expired';
          isPremium = false;
        }
      } else {
        isPremium = subscription.status === 'active';
      }
    }

    // Get usage data
    const usage = await db.subscriptionUsage.findFirst({
      orderBy: {
        created_at: 'desc'
      }
    });

    let usageData: any = {
      storageUsed: 150 * 1024 * 1024, // 150MB
      storageLimit: isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024, // 1TB vs 500MB
      photosScanned: 45,
      scanLimit: isPremium ? 10000 : 100,
      aiTagsGenerated: 120,
      aiTagLimit: isPremium ? 50000 : 500,
      vaultAccess: isPremium,
      advancedEditing: isPremium,
    };

    if (usage) {
      usageData = {
        ...usage,
        storageLimit: isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024,
        scanLimit: isPremium ? 10000 : 100,
        aiTagLimit: isPremium ? 50000 : 500,
        vaultAccess: isPremium,
        advancedEditing: isPremium,
      };
    }

    return NextResponse.json({
      subscription: subscriptionData,
      isPremium,
      hasActiveTrial,
      trialDaysRemaining,
      usage: usageData
    });

  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Validate session
    const session = await db.session.findFirst({
      where: {
        token: sessionToken,
        expires_at: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { planId, action } = await request.json();
    
    if (!planId || !['subscribe', 'trial'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const now = new Date();
    let currentPeriodEnd: Date;
    let status: string;
    let trialEnd: Date | null = null;

    if (action === 'trial') {
      currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      trialEnd = currentPeriodEnd;
      status = 'trial';
    } else {
      switch (planId) {
        case 'monthly':
          currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 'annual':
          currentPeriodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          break;
        case 'lifetime':
          currentPeriodEnd = new Date(now.getTime() + 50 * 365 * 24 * 60 * 60 * 1000); // 50 years
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid plan ID' },
            { status: 400 }
          );
      }
      status = 'active';
    }

    // Create subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.subscription.create({
      data: {
        id: subscriptionId,
        plan_id: planId,
        status,
        current_period_start: now,
        current_period_end: currentPeriodEnd,
        trial_end: trialEnd,
        cancel_at_period_end: false,
        created_at: now,
        updated_at: now
      }
    });

    // Create or update usage record
    const usageId = `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isPremium = true;
    
    await db.subscriptionUsage.create({
      data: {
        id: usageId,
        subscription_id: subscriptionId,
        storage_used: 150 * 1024 * 1024, // 150MB
        storage_limit: isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024, // 1TB vs 500MB
        photos_scanned: 45,
        scan_limit: isPremium ? 10000 : 100,
        ai_tags_generated: 120,
        ai_tag_limit: isPremium ? 50000 : 500,
        vault_access: isPremium,
        advanced_editing: isPremium,
        created_at: now,
        updated_at: now
      }
    });

    const subscriptionData = {
      id: subscriptionId,
      plan_id: planId,
      status,
      current_period_start: now,
      current_period_end: currentPeriodEnd,
      trial_end: trialEnd,
      cancel_at_period_end: false,
      created_at: now,
      updated_at: now
    };

    return NextResponse.json({
      subscription: subscriptionData,
      isPremium: true,
      hasActiveTrial: action === 'trial',
      trialDaysRemaining: action === 'trial' ? 30 : 0
    });

  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}