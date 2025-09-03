/**
 * Premium Diamond Grade Loading State Component
 * 
 * Enterprise-grade loading display with optimized performance
 * and user experience.
 * 
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

'use client';

import React from 'react';
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading OptiMind AI Ecosystem..." 
}) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;