"use client";

import { useEffect, useState, useCallback } from "react";
import { Smartphone, Monitor, Zap, Shield, Battery, Wifi, WifiOff } from "lucide-react";

interface MobileOptimizerProps {
  children: React.ReactNode;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  isLowEndDevice: boolean;
  isSlowConnection: boolean;
  batteryLevel?: number;
  isBatterySaving: boolean;
}

export function MobileOptimizer({ children }: MobileOptimizerProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
    isLowEndDevice: false,
    isSlowConnection: false,
    isBatterySaving: false,
  });

  const [performanceMode, setPerformanceMode] = useState<"auto" | "high" | "medium" | "low">("auto");
  const [isOnline, setIsOnline] = useState(true);

  // Detect device capabilities and optimize accordingly
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Device type detection
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // Low-end device detection (simplified heuristic)
      const isLowEndDevice = 
        pixelRatio <= 1 || 
        (navigator as any).deviceMemory <= 2 || 
        (navigator as any).hardwareConcurrency <= 4;
      
      // Connection quality detection
      const connection = (navigator as any).connection;
      const isSlowConnection = connection ? 
        connection.effectiveType.includes('2g') || 
        connection.downlink < 1 : 
        false;
      
      // Battery detection
      const battery = (navigator as any).battery;
      const batteryLevel = battery?.level;
      const isBatterySaving = batteryLevel !== undefined && batteryLevel < 0.2;
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        pixelRatio,
        isLowEndDevice,
        isSlowConnection,
        batteryLevel: batteryLevel ? Math.round(batteryLevel * 100) : undefined,
        isBatterySaving,
      });
      
      // Auto-adjust performance mode based on device capabilities
      if (isLowEndDevice || isSlowConnection || isBatterySaving) {
        setPerformanceMode("low");
      } else if (isMobile) {
        setPerformanceMode("medium");
      } else {
        setPerformanceMode("high");
      }
    };

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial detection
    detectDevice();
    
    // Listen for screen size changes
    window.addEventListener('resize', detectDevice);
    
    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', detectDevice);
    }
    
    // Listen for battery changes
    const battery = (navigator as any).battery;
    if (battery) {
      battery.addEventListener('levelchange', detectDevice);
      battery.addEventListener('chargingchange', detectDevice);
    }
    
    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', detectDevice);
      }
      
      if (battery) {
        battery.removeEventListener('levelchange', detectDevice);
        battery.removeEventListener('chargingchange', detectDevice);
      }
    };
  }, []);

  // Apply performance optimizations based on device capabilities
  useEffect(() => {
    const root = document.documentElement;
    
    switch (performanceMode) {
      case "low":
        // Reduce animations and effects for low-end devices
        root.style.setProperty('--animation-fast', '0ms');
        root.style.setProperty('--animation-normal', '0ms');
        root.style.setProperty('--animation-slow', '0ms');
        
        // Reduce shadow effects
        root.style.setProperty('--shadow-lg', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-xl', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
        
        // Disable complex backdrop filters
        root.style.setProperty('--backdrop-blur', 'none');
        break;
        
      case "medium":
        // Balanced settings for mid-range devices
        root.style.setProperty('--animation-fast', '100ms');
        root.style.setProperty('--animation-normal', '200ms');
        root.style.setProperty('--animation-slow', '300ms');
        
        // Moderate shadows
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-xl', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
        
        // Simple backdrop filters
        root.style.setProperty('--backdrop-blur', 'blur(4px)');
        break;
        
      case "high":
      default:
        // Full effects for high-end devices
        root.style.setProperty('--animation-fast', '150ms');
        root.style.setProperty('--animation-normal', '300ms');
        root.style.setProperty('--animation-slow', '500ms');
        
        // Full shadow effects
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)');
        
        // Full backdrop filters
        root.style.setProperty('--backdrop-blur', 'blur(10px)');
        break;
    }
  }, [performanceMode]);

  // Optimize image loading based on connection and device
  const getOptimizedImageProps = useCallback(() => {
    const baseProps = {
      loading: "lazy" as const,
      fetchPriority: "low" as const,
    };
    
    if (deviceInfo.isSlowConnection || deviceInfo.isLowEndDevice) {
      return {
        ...baseProps,
        quality: 60,
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      };
    }
    
    if (deviceInfo.isMobile) {
      return {
        ...baseProps,
        quality: 80,
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      };
    }
    
    return {
      ...baseProps,
      quality: 90,
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    };
  }, [deviceInfo]);

  // Memory management helper
  const cleanupResources = useCallback(() => {
    // Clear unused image URLs from memory
    if (typeof URL !== 'undefined') {
      // This would be called when photos are deleted or when the component unmounts
    }
    
    // Force garbage collection on low-end devices
    if (deviceInfo.isLowEndDevice && typeof gc !== 'undefined') {
      try {
        (gc as any)();
      } catch (e) {
        // Ignore errors if gc is not available
      }
    }
  }, [deviceInfo.isLowEndDevice]);

  // Touch optimization for mobile devices
  useEffect(() => {
    if (deviceInfo.isMobile) {
      // Increase touch target sizes for better mobile UX
      const style = document.createElement('style');
      style.textContent = `
        button, .clickable {
          min-height: 44px;
          min-width: 44px;
        }
        
        input, select, textarea {
          min-height: 44px;
        }
        
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [deviceInfo.isMobile]);

  // Battery optimization
  useEffect(() => {
    if (deviceInfo.isBatterySaving) {
      // Reduce background activity when battery is low
      const style = document.createElement('style');
      style.textContent = `
        .animate-pulse, .animate-bounce, .animate-spin {
          animation: none !important;
        }
        
        .auto-play {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [deviceInfo.isBatterySaving]);

  const contextValue = {
    deviceInfo,
    performanceMode,
    isOnline,
    getOptimizedImageProps,
    cleanupResources,
    setPerformanceMode,
  };

  return (
    <div className={`mobile-optimizer ${performanceMode}`}>
      {/* Device info overlay for development (hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs space-y-1 max-w-xs">
          <div className="flex items-center gap-2">
            {deviceInfo.isMobile ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
            <span>{deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}</span>
            <span>({deviceInfo.screenWidth}x{deviceInfo.screenHeight})</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            <span>Performance: {performanceMode}</span>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-red-400" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {deviceInfo.batteryLevel !== undefined && (
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3" />
              <span>Battery: {deviceInfo.batteryLevel}%</span>
            </div>
          )}
          {deviceInfo.isLowEndDevice && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Shield className="w-3 h-3" />
              <span>Low-end device detected</span>
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
}

// Hook for using mobile optimizer in components
export function useMobileOptimizer() {
  const context = typeof window !== 'undefined' ? 
    (window as any).__mobileOptimizerContext : null;
  
  if (!context) {
    throw new Error('useMobileOptimizer must be used within a MobileOptimizer');
  }
  
  return context;
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private thresholds: Map<string, number> = new Map();

  private constructor() {
    this.initializeThresholds();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeThresholds() {
    this.thresholds.set('render', 16.67); // 60fps
    this.thresholds.set('apiCall', 1000); // 1 second
    this.thresholds.set('imageLoad', 3000); // 3 seconds
    this.thresholds.set('animation', 33.33); // 30fps
  }

  startMeasure(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      this.metrics.get(name)!.push(duration);
      
      // Check if performance is degraded
      const threshold = this.thresholds.get(name);
      if (threshold && duration > threshold) {
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
        this.reportPerformanceIssue(name, duration);
      }
    };
  }

  private reportPerformanceIssue(metric: string, duration: number) {
    // Send performance metrics to analytics or monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_issue', {
        metric_name: metric,
        duration: Math.round(duration),
        device_type: this.getDeviceType(),
      });
    }
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  getMetrics(): Record<string, { average: number; min: number; max: number; count: number }> {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        result[name] = {
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      }
    });
    
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}