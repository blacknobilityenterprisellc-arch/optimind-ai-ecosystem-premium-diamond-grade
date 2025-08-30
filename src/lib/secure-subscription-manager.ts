import { SubscriptionPlan, UserSubscription, SubscriptionUsage } from './subscription-manager';

class SecureSubscriptionManager {
  private static instance: SecureSubscriptionManager;
  private subscription: UserSubscription | null = null;
  private isPremium: boolean = false;
  private hasActiveTrialFlag: boolean = false;
  private trialDaysRemaining: number = 0;
  private usage: SubscriptionUsage | null = null;
  private loading: boolean = false;

  private constructor() {
    this.loadSubscription();
  }

  static getInstance(): SecureSubscriptionManager {
    if (!SecureSubscriptionManager.instance) {
      SecureSubscriptionManager.instance = new SecureSubscriptionManager();
    }
    return SecureSubscriptionManager.instance;
  }

  private async loadSubscription(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const sessionToken = sessionStorage.getItem('auth_session');
      if (!sessionToken) {
        this.resetSubscription();
        return;
      }

      const response = await fetch('/api/subscription', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.subscription = data.subscription;
        this.isPremium = data.isPremium;
        this.hasActiveTrialFlag = data.hasActiveTrial;
        this.trialDaysRemaining = data.trialDaysRemaining;
        this.usage = data.usage;
      } else {
        this.resetSubscription();
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
      this.resetSubscription();
    }
  }

  private resetSubscription(): void {
    this.subscription = null;
    this.isPremium = false;
    this.hasActiveTrialFlag = false;
    this.trialDaysRemaining = 0;
    this.usage = {
      storageUsed: 150 * 1024 * 1024,
      storageLimit: 500 * 1024 * 1024,
      photosScanned: 45,
      scanLimit: 100,
      aiTagsGenerated: 120,
      aiTagLimit: 500,
      vaultAccess: false,
      advancedEditing: false,
    };
  }

  // Public Methods
  async subscribe(planId: SubscriptionPlan["id"]): Promise<UserSubscription> {
    if (typeof window === "undefined") {
      throw new Error("Subscription management requires browser context");
    }

    const sessionToken = sessionStorage.getItem('auth_session');
    if (!sessionToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ planId, action: 'subscribe' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Subscription failed');
    }

    const data = await response.json();
    this.subscription = data.subscription;
    this.isPremium = data.isPremium;
    this.hasActiveTrialFlag = data.hasActiveTrial;
    this.trialDaysRemaining = data.trialDaysRemaining;
    
    await this.loadSubscription(); // Refresh usage data
    
    return this.subscription!;
  }

  async startFreeTrial(): Promise<UserSubscription> {
    if (typeof window === "undefined") {
      throw new Error("Subscription management requires browser context");
    }

    const sessionToken = sessionStorage.getItem('auth_session');
    if (!sessionToken) {
      throw new Error("Authentication required");
    }

    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ planId: 'monthly', action: 'trial' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Trial activation failed');
    }

    const data = await response.json();
    this.subscription = data.subscription;
    this.isPremium = data.isPremium;
    this.hasActiveTrialFlag = data.hasActiveTrial;
    this.trialDaysRemaining = data.trialDaysRemaining;
    
    await this.loadSubscription(); // Refresh usage data
    
    return this.subscription!;
  }

  async cancelSubscription(): Promise<void> {
    if (!this.subscription) return;

    // For demo purposes, we'll just update the local state
    // In production, this would call an API endpoint
    this.subscription.cancelAtPeriodEnd = true;
    this.subscription.status = "cancelled";
  }

  async reactivateSubscription(): Promise<void> {
    if (!this.subscription) return;

    // For demo purposes, we'll just update the local state
    // In production, this would call an API endpoint
    this.subscription.cancelAtPeriodEnd = false;
    this.subscription.status = "active";
  }

  getSubscription(): UserSubscription | null {
    return this.subscription;
  }

  isPremiumUser(): boolean {
    return this.isPremium;
  }

  hasActiveTrial(): boolean {
    return this.hasActiveTrialFlag;
  }

  getTrialDaysRemaining(): number {
    return this.trialDaysRemaining;
  }

  canStartTrial(): boolean {
    return !this.subscription && !this.hasActiveTrialFlag;
  }

  getUsage(): SubscriptionUsage {
    return this.usage || {
      storageUsed: 150 * 1024 * 1024,
      storageLimit: 500 * 1024 * 1024,
      photosScanned: 45,
      scanLimit: 100,
      aiTagsGenerated: 120,
      aiTagLimit: 500,
      vaultAccess: false,
      advancedEditing: false,
    };
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
    this.resetSubscription();
  }

  async refreshSubscription(): Promise<void> {
    await this.loadSubscription();
  }
}

// Export singleton instance
export const secureSubscriptionManager = SecureSubscriptionManager.getInstance();

// React hook for secure subscription management
import { useState, useEffect } from "react";

export function useSecureSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateSubscription = async () => {
      setLoading(true);
      await secureSubscriptionManager.refreshSubscription();
      setSubscription(secureSubscriptionManager.getSubscription());
      setIsPremium(secureSubscriptionManager.isPremiumUser());
      setTrialDaysRemaining(secureSubscriptionManager.getTrialDaysRemaining());
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
    const sub = await secureSubscriptionManager.subscribe(planId);
    setSubscription(sub);
    setIsPremium(true);
    return sub;
  };

  const startFreeTrial = async () => {
    const sub = await secureSubscriptionManager.startFreeTrial();
    setSubscription(sub);
    setIsPremium(true);
    setTrialDaysRemaining(30);
    return sub;
  };

  const cancelSubscription = async () => {
    await secureSubscriptionManager.cancelSubscription();
    setSubscription(prev => prev ? { ...prev, status: "cancelled", cancelAtPeriodEnd: true } : null);
  };

  const reactivateSubscription = async () => {
    await secureSubscriptionManager.reactivateSubscription();
    setSubscription(prev => prev ? { ...prev, status: "active", cancelAtPeriodEnd: false } : null);
  };

  const usage = secureSubscriptionManager.getUsage();
  const plans = secureSubscriptionManager.getAvailablePlans();

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
    canStartTrial: secureSubscriptionManager.canStartTrial(),
    hasActiveTrial: secureSubscriptionManager.hasActiveTrial(),
    formatStorage: secureSubscriptionManager.formatStorage.bind(secureSubscriptionManager),
    formatDate: secureSubscriptionManager.formatDate.bind(secureSubscriptionManager),
    refreshSubscription: secureSubscriptionManager.refreshSubscription.bind(secureSubscriptionManager),
  };
}