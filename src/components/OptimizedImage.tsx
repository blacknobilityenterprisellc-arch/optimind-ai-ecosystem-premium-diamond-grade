"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  aspectRatio?: number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "blur",
  blurDataURL,
  onLoad,
  onError,
  fallback,
  aspectRatio,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate blur data URL if not provided
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    // Simple blur placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJiIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsdGVyPSJ1cmwoI2IpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=";
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Calculate dimensions if aspect ratio is provided
  const calculatedHeight = aspectRatio && width ? width / aspectRatio : height;
  const calculatedWidth = aspectRatio && height ? height * aspectRatio : width;

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-gray-100",
        isLoading && "animate-pulse",
        className
      )}
      style={{
        width: calculatedWidth || width,
        height: calculatedHeight || height,
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
      }}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={calculatedWidth || width || 0}
          height={calculatedHeight || height || 0}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{ objectFit }}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === "blur" ? generateBlurDataURL() : undefined}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Photo grid component with optimized images
interface PhotoGridProps {
  photos: Array<{
    id: string;
    url: string;
    name: string;
    status: "safe" | "flagged" | "pending" | "scanning";
  }>;
  onPhotoClick?: (photoId: string) => void;
  className?: string;
}

export function PhotoGrid({ photos, onPhotoClick, className }: PhotoGridProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onClick={() => onPhotoClick?.(photo.id)}
        >
          <OptimizedImage
            src={photo.url}
            alt={photo.name}
            width={300}
            height={300}
            aspectRatio={1}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Status overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute top-2 right-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  photo.status === "safe" && "bg-green-500",
                  photo.status === "flagged" && "bg-red-500",
                  photo.status === "pending" && "bg-yellow-500",
                  photo.status === "scanning" && "bg-blue-500 animate-pulse"
                )}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs truncate">{photo.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Lazy loaded component wrapper
interface LazyLoadProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
  height?: number;
}

export function LazyLoad({ children, placeholder, className, height = 200 }: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: height }}
    >
      {isInView ? children : placeholder || (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}