"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PremiumBadge, PremiumButton } from "@/components/PremiumBadge";
import { 
  X, 
  Shield, 
  Zap, 
  Infinity, 
  Crown, 
  Star,
  CheckCircle,
  Sparkles,
  Lock,
  Cloud,
  Brain,
  Palette
} from "lucide-react";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: "monthly" | "annual" | "lifetime") => void;
  hasFreeTrial?: boolean;
}

interface SubscriptionPlan {
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

export function Paywall({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  hasFreeTrial = true 
}: PaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | "lifetime">("annual");

  const plans: SubscriptionPlan[] = [
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40"
        >
          <X className="w-5 h-5" />
        </Button>

        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative p-8 text-center bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-orange-500/20">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-orange-500/10 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <PremiumBadge size="lg" text="PREMIUM" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Unlock Premium Features
                </h1>
                
                <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                  Experience infinite space, intelligent control, and unbreakable security for your precious memories
                </p>

                {hasFreeTrial && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">
                      30-day free trial included
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features Overview */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Infinity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Unlimited Storage</h3>
                  <p className="text-sm text-gray-400">Endless encrypted cloud space for all your photos</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Organization</h3>
                  <p className="text-sm text-gray-400">Smart tagging, face recognition, and emotion detection</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Military Security</h3>
                  <p className="text-sm text-gray-400">End-to-end encryption with biometric protection</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium Themes</h3>
                  <p className="text-sm text-gray-400">Exclusive themes and customization options</p>
                </div>
              </div>

              <Separator className="my-8 bg-gray-700" />

              {/* Subscription Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      plan.highlighted
                        ? "border-yellow-500 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl shadow-yellow-500/20 transform scale-105"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-center py-2">
                        <span className="text-sm font-bold text-white">MOST POPULAR</span>
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-400 line-through">{plan.originalPrice}{plan.period}</span>
                            <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/50">
                              {plan.savings}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <PremiumButton
                        onClick={() => onSubscribe(plan.id)}
                        variant={plan.highlighted ? "glow" : "default"}
                        className="w-full"
                        requireAuth={plan.id === "lifetime"}
                        onAuthSuccess={() => {
                          // Additional auth success handling for lifetime plan
                          console.log("Lifetime plan authentication successful");
                        }}
                      >
                        {hasFreeTrial ? "Start Free Trial" : "Subscribe Now"}
                      </PremiumButton>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>4.8/5 user rating</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Terms of Service and Privacy Policy. 
                  Subscription will automatically renew unless canceled at least 24 hours before the end of the current period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}