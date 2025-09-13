// AI-Generated Lazy Loading Utility
import { lazy, Suspense } from 'react';

export const createLazyComponent = (importFn: any, fallback?: any) => {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const createLazyLib = (importFn: any) => {
  let cachedPromise: any = null;
  
  return () => {
    if (!cachedPromise) {
      cachedPromise = importFn();
    }
    return cachedPromise;
  };
};