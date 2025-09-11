
// AI-Generated Lazy Loading Utility
import { lazy, Suspense } from 'react';

export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const createLazyLib = <T>(importFn: () => Promise<T>) => {
  let cachedPromise: Promise<T> | null = null;
  
  return () => {
    if (!cachedPromise) {
      cachedPromise = importFn();
    }
    return cachedPromise;
  };
};
