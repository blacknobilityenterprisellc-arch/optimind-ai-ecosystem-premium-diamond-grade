/**
 * performance-optimization.ts
 * Utilities for progressive loading, lazy rendering, and performance optimization
 */

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';

interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface LoadingStrategy {
  type: 'lazy' | 'eager' | 'progressive';
  priority?: 'high' | 'medium' | 'low';
  placeholder?: React.ReactNode;
  skeleton?: React.ReactNode;
}

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  componentSize?: number;
}

// Global performance tracking
const performanceMetrics = new Map<string, PerformanceMetrics[]>();

/**
 * Hook for intersection observer based lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, rootMargin, triggerOnce]);

  return isIntersecting;
}

/**
 * Hook for lazy loading components
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LoadingStrategy = { type: 'lazy' }
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const importedModule = await importFn();
      setComponent(() => importedModule.default);
      
      // Track performance metrics
      const loadTime = performance.now() - startTime;
      trackPerformance('lazy_component', { loadTime, renderTime: 0 });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [importFn, Component, isLoading]);

  useEffect(() => {
    if (options.type === 'eager') {
      loadComponent();
    }
  }, [loadComponent, options.type]);

  const LazyComponent = useMemo(() => {
    if (!Component) {
      return null;
    }

    const WrappedComponent = (props: Parameters<T>[0]) => {
      const renderStartTime = performance.now();
      
      useEffect(() => {
        const renderTime = performance.now() - renderStartTime;
        trackPerformance('lazy_component_render', { loadTime: 0, renderTime });
      }, []);

      return React.createElement(Component, props);
    };
    
    return WrappedComponent;
  }, [Component]);

  return {
    LazyComponent,
    isLoading,
    error,
    loadComponent
  };
}

/**
 * Hook for progressive image loading
 */
export function useProgressiveImage(
  src: string,
  placeholderSrc?: string,
  options: LoadingStrategy = { type: 'lazy' }
) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const isIntersecting = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (!isIntersecting || options.type !== 'lazy') return;

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      
      // Track performance metrics
      const loadTime = performance.now() - startTime;
      trackPerformance('image_load', { loadTime, renderTime: 0 });
    };

    img.onerror = () => {
      setError(new Error('Failed to load image'));
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isIntersecting, options.type]);

  // Eager loading
  useEffect(() => {
    if (options.type === 'eager' && !currentSrc) {
      const img = new Image();
      img.onload = () => setCurrentSrc(src);
      img.src = src;
    }
  }, [src, options.type, currentSrc]);

  return {
    src: currentSrc,
    isLoading,
    error,
    imgRef
  };
}

/**
 * Hook for virtual scrolling (large lists)
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    scrollTop
  };
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled functions
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Performance monitoring utilities
 */
export function trackPerformance(
  componentName: string,
  metrics: Partial<PerformanceMetrics>
) {
  if (!performanceMetrics.has(componentName)) {
    performanceMetrics.set(componentName, []);
  }

  const componentMetrics = performanceMetrics.get(componentName)!;
  componentMetrics.push({
    loadTime: metrics.loadTime || 0,
    renderTime: metrics.renderTime || 0,
    memoryUsage: metrics.memoryUsage,
    componentSize: metrics.componentSize
  });

  // Keep only last 100 measurements
  if (componentMetrics.length > 100) {
    componentMetrics.shift();
  }

  // Log performance warnings
  if (metrics.loadTime && metrics.loadTime > 1000) {
    console.warn(`[Performance] ${componentName} slow load: ${metrics.loadTime}ms`);
  }
  if (metrics.renderTime && metrics.renderTime > 100) {
    console.warn(`[Performance] ${componentName} slow render: ${metrics.renderTime}ms`);
  }
}

/**
 * Get performance metrics for a component
 */
export function getPerformanceMetrics(componentName: string) {
  const metrics = performanceMetrics.get(componentName) || [];
  
  if (metrics.length === 0) return null;

  const avgLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
  const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
  const maxLoadTime = Math.max(...metrics.map(m => m.loadTime));
  const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));

  return {
    count: metrics.length,
    avgLoadTime,
    avgRenderTime,
    maxLoadTime,
    maxRenderTime,
    recentMetrics: metrics.slice(-10)
  };
}

/**
 * Memory usage monitoring
 */
export function useMemoryUsage() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000);
    updateMemoryUsage();

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
}

/**
 * Component for lazy loading with skeleton
 */
export function LazyLoadComponent({
  children,
  placeholder,
  skeleton,
  strategy = { type: 'lazy' },
  className = ''
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  skeleton?: React.ReactNode;
  strategy?: LoadingStrategy;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, {
    threshold: 0.1,
    triggerOnce: true
  });

  const shouldLoad = strategy.type === 'eager' || isIntersecting;

  return React.createElement('div', { ref, className }, 
    shouldLoad ? children : React.createElement('div', { className: 'lazy-loading-placeholder' },
      skeleton || placeholder || React.createElement('div', { className: 'animate-pulse' },
        React.createElement('div', { className: 'h-4 bg-gray-200 rounded w-3/4 mb-2' }),
        React.createElement('div', { className: 'h-4 bg-gray-200 rounded w-1/2 mb-2' }),
        React.createElement('div', { className: 'h-4 bg-gray-200 rounded w-5/6' })
      )
    )
  );
}

/**
 * Progressive image component
 */
export function ProgressiveImage({
  src,
  alt,
  placeholderSrc,
  className = '',
  onLoad,
  onError,
  strategy = { type: 'lazy' }
}: {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  strategy?: LoadingStrategy;
}) {
  const { src: currentSrc, isLoading, error, imgRef } = useProgressiveImage(
    src,
    placeholderSrc,
    strategy
  );

  return (
    <div className={`progressive-image-container ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        onLoad={onLoad}
        onError={onError}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-red-600 text-sm">Failed to load image</div>
        </div>
      )}
    </div>
  );
}

/**
 * Virtual list component for large datasets
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}) {
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualScroll(
    items,
    itemHeight,
    containerHeight,
    overscan
  );

  return (
    <div
      className={`virtual-list-container ${className}`}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
          {visibleItems.map((item, index) => {
            const originalIndex = items.indexOf(item);
            return (
              <div key={originalIndex} style={{ height: itemHeight }}>
                {renderItem(item, originalIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}