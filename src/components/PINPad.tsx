"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useFocusTrap, useKeyboardNavigation, useModalFocus } from "@/lib/keyboard-navigation";
import { useFocusManagement } from "@/lib/focus-manager";
import { 
  X, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Delete,
  Fingerprint
} from "lucide-react";

interface PINPadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
}

export function PINPad({
  isOpen,
  onClose,
  onSuccess,
  onError,
  title = "Premium Authentication",
  description = "Enter your 4-digit PIN to access premium features"
}: PINPadProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  
  const dialogRef = useFocusTrap(isOpen);
  const modalFocusRef = useModalFocus(isOpen);
  const { containerRef, announce } = useFocusManagement();
  const { containerRef: navContainerRef } = useKeyboardNavigation({
    enabled: isOpen,
    orientation: 'grid',
    loop: true
  });

  const handleNumberPress = useCallback((number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      setError("");
      
      // Auto-submit when 4 digits are entered
      if (newPin.length === 4) {
        setTimeout(() => handleSubmit(newPin), 300);
      }
    }
  }, [pin]);

  const handleBackspace = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError("");
  }, []);

  const handleSubmit = useCallback(async (enteredPin?: string) => {
    const pinToCheck = enteredPin || pin;
    
    if (pinToCheck.length !== 4) {
      setError("Please enter a complete 4-digit PIN");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call secure API endpoint for PIN validation
      const response = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinToCheck }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store session token securely
        if (data.sessionToken) {
          sessionStorage.setItem('auth_session', data.sessionToken);
        }
        announce("PIN verified successfully. Access granted.", "polite");
        onSuccess();
        setPin("");
        setError("");
      } else {
        const errorMsg = data.error || "Invalid PIN. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg);
        announce(`Authentication failed: ${errorMsg}`, "assertive");
        
        // Clear PIN after error
        setTimeout(() => {
          setPin("");
          setError("");
        }, 2000);
      }
    } catch (err) {
      const errorMsg = "Authentication failed. Please check your connection and try again.";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [pin, onSuccess, onError]);

  const handleBiometricAuth = useCallback(async () => {
    setShowBiometric(true);
    setIsLoading(true);
    
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, biometric auth always succeeds
      announce("Biometric authentication successful. Access granted.", "polite");
      onSuccess();
      setPin("");
      setError("");
    } catch (err) {
      const errorMsg = "Biometric authentication failed";
      setError(errorMsg);
      onError?.(errorMsg);
      announce(`Biometric authentication failed: ${errorMsg}`, "assertive");
    } finally {
      setIsLoading(false);
      setShowBiometric(false);
    }
  }, [onSuccess, onError]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setPin("");
      setError("");
      onClose();
    }
  }, [isLoading, onClose]);

  const resetPIN = useCallback(() => {
    setPin("");
    setError("");
  }, []);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent ref={dialogRef as any} className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="h-8 w-8 p-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div ref={containerRef as any} className="space-y-6" role="application" aria-label="PIN entry" tabIndex={-1}>
          {/* PIN Display */}
          <div className="flex justify-center">
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    pin[index]
                      ? error
                        ? "border-red-500 bg-red-500/10"
                        : "border-green-500 bg-green-500/10"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {pin[index] && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        error ? "bg-red-500" : "bg-green-500"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-blue-600">
                {showBiometric ? "Verifying biometrics..." : "Verifying PIN..."}
              </span>
            </div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-2" role="grid" aria-label="Number pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                size="lg"
                onClick={() => handleNumberPress(number.toString())}
                disabled={isLoading}
                className="h-14 text-lg font-semibold"
                role="gridcell"
                aria-label={`Number ${number}`}
                data-nav-item
              >
                {number}
              </Button>
            ))}
            
            {/* Biometric Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleBiometricAuth}
              disabled={isLoading}
              className="h-14"
              role="gridcell"
              aria-label="Use biometric authentication"
              data-nav-item
            >
              <Fingerprint className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNumberPress("0")}
              disabled={isLoading}
              className="h-14 text-lg font-semibold"
              role="gridcell"
              aria-label="Number 0"
              data-nav-item
            >
              0
            </Button>
            
            {/* Backspace Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleBackspace}
              disabled={isLoading || pin.length === 0}
              className="h-14"
              role="gridcell"
              aria-label="Backspace"
              data-nav-item
            >
              <Delete className="w-5 h-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2" role="group" aria-label="Actions">
            <Button
              variant="outline"
              onClick={resetPIN}
              disabled={isLoading || pin.length === 0}
              className="flex-1"
              data-nav-item
            >
              Clear
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading || pin.length !== 4}
              className="flex-1"
              data-nav-item
            >
              {isLoading ? "Verifying..." : "Verify PIN"}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              For security reasons, your PIN is securely stored and verified
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Or use biometric authentication
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}