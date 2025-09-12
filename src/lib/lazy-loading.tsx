// AI-Generated Lazy Loading Utility - Production Ready
import { lazy, Suspense, ComponentType, ReactNode } from 'react';

export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode = <div>Loading...</div>
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export function createLazyLib<T>(importFn: () => Promise<T>) {
  let cachedPromise: Promise<T> | null = null;
  
  return function getLazyLib(): Promise<T> {
    if (!cachedPromise) {
      cachedPromise = importFn();
    }
    return cachedPromise;
  };
}
