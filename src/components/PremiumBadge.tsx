"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PINPad } from "@/components/PINPad";
import { useToast } from "@/hooks/use-toast";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  text?: string;
}

export function PremiumBadge({ 
  className, 
  size = "md", 
  animated = true,
  text = "PRO"
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5", 
    lg: "text-base px-4 py-2"
  };

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center font-bold text-white rounded-full",
        "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500",
        "shadow-lg",
        sizeClasses[size],
        animated && "animate-pulse",
        className
      )}
    >
      {/* Glow effect */}
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 opacity-50 blur-md animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-30 blur-sm animate-pulse" />
        </>
      )}
      
      {/* Badge content */}
      <span className="relative z-10 tracking-wider">{text}</span>
      
      {/* Sparkle effect */}
      {animated && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-80 animate-ping" />
      )}
    </div>
  );
}

interface PremiumFeatureProps {
  children: React.ReactNode;
  isPremium?: boolean;
  className?: string;
}

export function PremiumFeature({ 
  children, 
  isPremium = true, 
  className 
}: PremiumFeatureProps) {
  if (!isPremium) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative group", className)}>
      {children}
      <div className="absolute -top-2 -right-2 z-10">
        <PremiumBadge size="sm" text="PRO" />
      </div>
      
      {/* Overlay effect when hovered */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <div className="text-white text-center p-4">
          <PremiumBadge size="sm" text="PRO" />
          <p className="text-sm mt-2 font-medium">Premium Feature</p>
          <p className="text-xs opacity-90">Upgrade to unlock</p>
        </div>
      </div>
    </div>
  );
}

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "glow";
  requireAuth?: boolean;
  onAuthSuccess?: () => void;
}

export function PremiumButton({ 
  children, 
  onClick, 
  className,
  variant = "default",
  requireAuth = false,
  onAuthSuccess
}: PremiumButtonProps) {
  const [showPINPad, setShowPINPad] = useState(false);
  const { toast } = useToast();

  const baseClasses = "relative inline-flex items-center justify-center font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 shadow-lg",
    outline: "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10",
    glow: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
  };

  const handleClick = () => {
    if (requireAuth) {
      setShowPINPad(true);
    } else {
      onClick?.();
    }
  };

  const handleAuthSuccess = () => {
    setShowPINPad(false);
    onAuthSuccess?.();
    toast({
      title: "Authentication Successful",
      description: "Premium access granted",
    });
    onClick?.();
  };

  const handleAuthError = (error: string) => {
    toast({
      title: "Authentication Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(baseClasses, variantClasses[variant], "px-6 py-3", className)}
      >
        {/* Glow effects */}
        {(variant === "default" || variant === "glow") && (
          <>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 opacity-50 blur-md animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-30 blur-sm" />
          </>
        )}
        
        {/* Button content */}
        <span className="relative z-10 tracking-wide">{children}</span>
        
        {/* Sparkle effects */}
        <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-ping" />
        <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-white rounded-full opacity-40 animate-ping delay-300" />
      </button>

      {/* PIN Pad Modal */}
      <PINPad
        isOpen={showPINPad}
        onClose={() => setShowPINPad(false)}
        onSuccess={handleAuthSuccess}
        onError={handleAuthError}
        title="Premium Authentication Required"
        description="Enter your 4-digit PIN to access premium features"
      />
    </>
  );
}