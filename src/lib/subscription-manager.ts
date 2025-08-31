export interface SubscriptionPlan {
  id: "monthly" | "annual" | "lifetime";
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  savings?: string;
  features: string[];
  popular?: boolean;
  highlighted?: boolean;
}

export interface UserSubscription {
  id: string;
  planId: SubscriptionPlan["id"];
  status: "active" | "cancelled" | "expired" | "trial";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  features: string[];
}

export interface SubscriptionUsage {
  storageUsed: number;
  storageLimit: number;
  photosScanned: number;
  scanLimit: number;
  aiTagsGenerated: number;
  aiTagLimit: number;
  vaultAccess: boolean;
  advancedEditing: boolean;
}

class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscription: UserSubscription | null = null;
  private isPremium: boolean = false;
  private hasFreeTrial: boolean = true;
  private trialDaysRemaining: number = 30;

  private constructor() {
    this.loadSubscription();
  }

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  private loadSubscription(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("private_photo_guardian_subscription");
      if (stored) {
        const data = JSON.parse(stored);
        this.subscription = {
          ...data,
          currentPeriodStart: new Date(data.currentPeriodStart),
          currentPeriodEnd: new Date(data.currentPeriodEnd),
          trialEnd: data.trialEnd ? new Date(data.trialEnd) : undefined,
        };
        this.updateSubscriptionStatus();
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  }

  private saveSubscription(): void {
    if (typeof window === "undefined") return;

    try {
      if (this.subscription) {
        localStorage.setItem(
          "private_photo_guardian_subscription",
          JSON.stringify(this.subscription)
        );
      } else {
        localStorage.removeItem("private_photo_guardian_subscription");
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  }

  private updateSubscriptionStatus(): void {
    if (!this.subscription) {
      this.isPremium = false;
      return;
    }

    const now = new Date();
    
    // Check if subscription is expired
    if (this.subscription.currentPeriodEnd < now) {
      this.subscription.status = "expired";
      this.isPremium = false;
      return;
    }

    // Check if trial is active
    if (this.subscription.status === "trial" && this.subscription.trialEnd) {
      if (this.subscription.trialEnd > now) {
        const trialEnd = new Date(this.subscription.trialEnd);
        const diffTime = trialEnd.getTime() - now.getTime();
        this.trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.isPremium = true;
      } else {
        this.subscription.status = "expired";
        this.isPremium = false;
      }
    } else {
      this.isPremium = this.subscription.status === "active";
    }
  }

  // Public Methods
  async subscribe(planId: SubscriptionPlan["id"]): Promise<UserSubscription> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date();
    let currentPeriodEnd: Date;

    switch (planId) {
      case "monthly":
        currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case "annual":
        currentPeriodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        break;
      case "lifetime":
        currentPeriodEnd = new Date(now.getTime() + 50 * 365 * 24 * 60 * 60 * 1000); // 50 years
        break;
    }

    const features = this.getPlanFeatures(planId);

    this.subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      planId,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
      features,
    };

    this.isPremium = true;
    this.hasFreeTrial = false;
    this.saveSubscription();

    return this.subscription;
  }

  async startFreeTrial(): Promise<UserSubscription> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    this.subscription = {
      id: `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      planId: "monthly",
      status: "trial",
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
      trialEnd,
      cancelAtPeriodEnd: false,
      features: this.getPlanFeatures("monthly"),
    };

    this.isPremium = true;
    this.hasFreeTrial = false;
    this.trialDaysRemaining = 30;
    this.saveSubscription();

    return this.subscription;
  }

  async cancelSubscription(): Promise<void> {
    if (!this.subscription) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    this.subscription.cancelAtPeriodEnd = true;
    this.subscription.status = "cancelled";
    this.saveSubscription();
  }

  async reactivateSubscription(): Promise<void> {
    if (!this.subscription) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    this.subscription.cancelAtPeriodEnd = false;
    this.subscription.status = "active";
    this.saveSubscription();
  }

  getSubscription(): UserSubscription | null {
    return this.subscription;
  }

  isPremiumUser(): boolean {
    this.updateSubscriptionStatus();
    return this.isPremium;
  }

  hasActiveTrial(): boolean {
    this.updateSubscriptionStatus();
    return this.subscription?.status === "trial";
  }

  getTrialDaysRemaining(): number {
    this.updateSubscriptionStatus();
    return this.trialDaysRemaining;
  }

  canStartTrial(): boolean {
    return this.hasFreeTrial && !this.subscription;
  }

  getUsage(): SubscriptionUsage {
    // Simulate usage data - in real implementation, this would come from your backend
    const baseUsage = {
      storageUsed: 150 * 1024 * 1024, // 150MB
      storageLimit: this.isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024, // 1TB vs 500MB
      photosScanned: 45,
      scanLimit: this.isPremium ? 10000 : 100,
      aiTagsGenerated: 120,
      aiTagLimit: this.isPremium ? 50000 : 500,
      vaultAccess: this.isPremium,
      advancedEditing: this.isPremium,
    };

    return baseUsage;
  }

  getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: "monthly",
        name: "Monthly",
        price: "$9.99",
        period: "/month",
        features: [
          "Unlimited encrypted cloud storage",
          "AI-powered smart organization",
          "Advanced editing suite",
          "Secure vault with biometric auth",
          "Premium themes & customization",
          "Priority customer support"
        ]
      },
      {
        id: "annual",
        name: "Annual",
        price: "$4.99",
        period: "/month",
        originalPrice: "$9.99",
        savings: "Save 50%",
        features: [
          "Everything in Monthly",
          "2 months FREE",
          "Advanced AI emotion recognition",
          "Private sharing links",
          "Custom AI model training",
          "Early access to new features"
        ],
        popular: true,
        highlighted: true
      },
      {
        id: "lifetime",
        name: "Lifetime",
        price: "$199",
        period: "one-time",
        savings: "Best value",
        features: [
          "Everything in Annual",
          "Lifetime access to all features",
          "All future updates included",
          "Exclusive premium themes",
          "VIP customer support",
          "Special lifetime-only features"
        ]
      }
    ];
  }

  private getPlanFeatures(planId: SubscriptionPlan["id"]): string[] {
    const plans = this.getAvailablePlans();
    const plan = plans.find(p => p.id === planId);
    return plan?.features || [];
  }

  // Feature access methods
  canAccessUnlimitedStorage(): boolean {
    return this.isPremium;
  }

  canAccessAIOrganization(): boolean {
    return this.isPremium;
  }

  canAccessAdvancedEditing(): boolean {
    return this.isPremium;
  }

  canAccessEncryptedVault(): boolean {
    return this.isPremium;
  }

  canAccessPremiumThemes(): boolean {
    return this.isPremium;
  }

  getScanLimit(): number {
    return this.isPremium ? 10000 : 100;
  }

  getStorageLimit(): number {
    return this.isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024; // 1TB vs 500MB
  }

  // Utility methods
  formatStorage(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  clearSubscription(): void {
    this.subscription = null;
    this.isPremium = false;
    this.hasFreeTrial = true;
    this.trialDaysRemaining = 30;
    this.saveSubscription();
  }
}

// Export singleton instance
export const subscriptionManager = SubscriptionManager.getInstance();

// React hook for subscription management
import { useState, useEffect } from "react";

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateSubscription = () => {
      const sub = subscriptionManager.getSubscription();
      setSubscription(sub);
      setIsPremium(subscriptionManager.isPremiumUser());
      setTrialDaysRemaining(subscriptionManager.getTrialDaysRemaining());
      setLoading(false);
    };

    updateSubscription();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      updateSubscription();
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const subscribe = async (planId: SubscriptionPlan["id"]) => {
    const sub = await subscriptionManager.subscribe(planId);
    setSubscription(sub);
    setIsPremium(true);
    return sub;
  };

  const startFreeTrial = async () => {
    const sub = await subscriptionManager.startFreeTrial();
    setSubscription(sub);
    setIsPremium(true);
    setTrialDaysRemaining(30);
    return sub;
  };

  const cancelSubscription = async () => {
    await subscriptionManager.cancelSubscription();
    setSubscription(prev => prev ? { ...prev, status: "cancelled", cancelAtPeriodEnd: true } : null);
  };

  const reactivateSubscription = async () => {
    await subscriptionManager.reactivateSubscription();
    setSubscription(prev => prev ? { ...prev, status: "active", cancelAtPeriodEnd: false } : null);
  };

  const usage = subscriptionManager.getUsage();
  const plans = subscriptionManager.getAvailablePlans();

  return {
    subscription,
    isPremium,
    trialDaysRemaining,
    loading,
    usage,
    plans,
    subscribe,
    startFreeTrial,
    cancelSubscription,
    reactivateSubscription,
    canStartTrial: subscriptionManager.canStartTrial(),
    hasActiveTrial: subscriptionManager.hasActiveTrial(),
    formatStorage: subscriptionManager.formatStorage.bind(subscriptionManager),
    formatDate: subscriptionManager.formatDate.bind(subscriptionManager),
  };
}