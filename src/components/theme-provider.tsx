'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast' | 'premium-diamond' | 'enterprise-blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleHighContrast: () => void;
  isHighContrast: boolean;
  prefersReducedMotion: boolean;
  isScreenReaderActive: boolean;
  isPremiumMode: boolean;
  performanceMode: 'standard' | 'high-performance' | 'ultra-fast';
  setPerformanceMode: (mode: 'standard' | 'high-performance' | 'ultra-fast') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [performanceMode, setPerformanceModeState] = useState<
    'standard' | 'high-performance' | 'ultra-fast'
  >('high-performance');

  // Premium mode detection
  const isPremiumMode = theme === 'premium-diamond' || theme === 'enterprise-blue';

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const storedPerformanceMode = localStorage.getItem('performance-mode') as
      | 'standard'
      | 'high-performance'
      | 'ultra-fast';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemPrefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    const initialTheme =
      storedTheme ||
      (systemPrefersHighContrast
        ? 'high-contrast'
        : systemPrefersDark
          ? 'dark'
          : 'premium-diamond'); // Default to premium-diamond

    setThemeState(initialTheme);

    if (storedPerformanceMode) {
      setPerformanceModeState(storedPerformanceMode);
    }

    // Check for reduced motion preference
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Check for screen reader (heuristic)
    setIsScreenReaderActive(detectScreenReader());

    // Listen for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const highContrastMediaQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleSystemThemeChange = () => {
      if (!localStorage.getItem('theme')) {
        if (highContrastMediaQuery.matches) {
          setThemeState('high-contrast');
        } else if (darkModeMediaQuery.matches) {
          setThemeState('dark');
        } else {
          setThemeState('premium-diamond');
        }
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
    highContrastMediaQuery.addEventListener('change', handleSystemThemeChange);
    reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
      highContrastMediaQuery.removeEventListener('change', handleSystemThemeChange);
      reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'premium-diamond', 'enterprise-blue');

    // Add current theme class
    root.classList.add(theme);

    // Store theme preference
    localStorage.setItem('theme', theme);

    // Apply premium diamond theme styles
    if (theme === 'premium-diamond') {
      root.style.setProperty('--background', '#0f0f0f');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--card', '#1a1a1a');
      root.style.setProperty('--card-foreground', '#ffffff');
      root.style.setProperty('--primary', '#8b5cf6');
      root.style.setProperty('--primary-foreground', '#ffffff');
      root.style.setProperty('--secondary', '#ec4899');
      root.style.setProperty('--secondary-foreground', '#ffffff');
      root.style.setProperty('--muted', '#262626');
      root.style.setProperty('--muted-foreground', '#a1a1aa');
      root.style.setProperty('--accent', '#8b5cf6');
      root.style.setProperty('--accent-foreground', '#ffffff');
      root.style.setProperty('--border', '#374151');
      root.style.setProperty('--input', '#262626');
      root.style.setProperty('--ring', '#8b5cf6');

      // Add premium diamond specific styles
      const style = document.createElement('style');
      style.id = 'premium-diamond-styles';
      style.textContent = `
        .premium-diamond {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%) !important;
        }
        
        .premium-diamond .premium-gradient {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
        }
        
        .premium-diamond .diamond-border {
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
        }
        
        .premium-diamond .glow-effect {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3) !important;
        }
      `;

      // Remove existing styles
      const existingStyle = document.querySelector('#premium-diamond-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    } else if (theme === 'enterprise-blue') {
      root.style.setProperty('--background', '#0c1426');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--card', '#1a2332');
      root.style.setProperty('--card-foreground', '#ffffff');
      root.style.setProperty('--primary', '#3b82f6');
      root.style.setProperty('--primary-foreground', '#ffffff');
      root.style.setProperty('--secondary', '#06b6d4');
      root.style.setProperty('--secondary-foreground', '#ffffff');
      root.style.setProperty('--muted', '#1e293b');
      root.style.setProperty('--muted-foreground', '#94a3b8');
      root.style.setProperty('--accent', '#3b82f6');
      root.style.setProperty('--accent-foreground', '#ffffff');
      root.style.setProperty('--border', '#334155');
      root.style.setProperty('--input', '#1e293b');
      root.style.setProperty('--ring', '#3b82f6');

      // Remove premium diamond styles
      const existingStyle = document.querySelector('#premium-diamond-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    } else if (theme === 'high-contrast') {
      root.style.setProperty('--background', 'black');
      root.style.setProperty('--foreground', 'white');
      root.style.setProperty('--card', 'black');
      root.style.setProperty('--card-foreground', 'white');
      root.style.setProperty('--primary', 'yellow');
      root.style.setProperty('--primary-foreground', 'black');
      root.style.setProperty('--secondary', 'white');
      root.style.setProperty('--secondary-foreground', 'black');
      root.style.setProperty('--muted', 'black');
      root.style.setProperty('--muted-foreground', 'white');
      root.style.setProperty('--accent', 'yellow');
      root.style.setProperty('--accent-foreground', 'black');
      root.style.setProperty('--border', 'white');
      root.style.setProperty('--input', 'white');
      root.style.setProperty('--ring', 'yellow');

      // Add high contrast specific styles
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      style.textContent = `
        .high-contrast {
          filter: contrast(2) !important;
        }
        
        .high-contrast img,
        .high-contrast video {
          filter: contrast(1.5) brightness(1.2) !important;
        }
        
        .high-contrast button,
        .high-contrast input,
        .high-contrast select,
        .high-contrast textarea {
          border: 2px solid white !important;
          outline: 2px solid transparent !important;
        }
        
        .high-contrast button:focus,
        .high-contrast input:focus,
        .high-contrast select:focus,
        .high-contrast textarea:focus {
          outline: 2px solid yellow !important;
          outline-offset: 2px !important;
        }
        
        .high-contrast a {
          text-decoration: underline !important;
          color: yellow !important;
        }
        
        .high-contrast a:focus,
        .high-contrast a:hover {
          color: white !important;
          background-color: yellow !important;
          color: black !important;
        }
        
        .high-contrast .sr-only:not(:focus):not(:active) {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `;

      // Remove existing high contrast styles
      const existingStyle = document.querySelector('#high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    } else {
      // Remove premium and high contrast styles
      const existingStyle = document.querySelector('#premium-diamond-styles');
      const highContrastStyle = document.querySelector('#high-contrast-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      if (highContrastStyle) {
        highContrastStyle.remove();
      }

      // Reset CSS custom properties for light/dark themes
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--secondary-foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--muted-foreground');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--border');
      root.style.removeProperty('--input');
      root.style.removeProperty('--ring');
    }

    // Apply performance mode settings
    let transitionDuration = '150ms';
    let animationDuration = '300ms';

    if (performanceMode === 'high-performance') {
      transitionDuration = '100ms';
      animationDuration = '200ms';
    } else if (performanceMode === 'ultra-fast') {
      transitionDuration = '50ms';
      animationDuration = '100ms';
    }

    if (prefersReducedMotion) {
      transitionDuration = '0ms';
      animationDuration = '0ms';
    }

    root.style.setProperty('--transition-duration', transitionDuration);
    root.style.setProperty('--animation-duration', animationDuration);
  }, [theme, prefersReducedMotion, performanceMode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setPerformanceMode = (mode: 'standard' | 'high-performance' | 'ultra-fast') => {
    setPerformanceModeState(mode);
    localStorage.setItem('performance-mode', mode);
  };

  const toggleHighContrast = () => {
    setThemeState(currentTheme => {
      if (currentTheme === 'high-contrast') {
        return (localStorage.getItem('last-normal-theme') as Theme) || 'premium-diamond';
      } else {
        localStorage.setItem('last-normal-theme', theme);
        return 'high-contrast';
      }
    });
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleHighContrast,
    isHighContrast: theme === 'high-contrast',
    prefersReducedMotion,
    isScreenReaderActive,
    isPremiumMode,
    performanceMode,
    setPerformanceMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new EnhancedError('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to detect screen readers (heuristic)
function detectScreenReader(): boolean {
  // Create a test element
  const testElement = document.createElement('div');
  testElement.setAttribute('aria-hidden', 'true');
  testElement.textContent = 'screen reader test';
  document.body.appendChild(testElement);

  // Check if aria-hidden is respected
  const isHidden = testElement.getAttribute('aria-hidden') === 'true';
  document.body.removeChild(testElement);

  // If aria-hidden was ignored, screen reader might be active
  return !isHidden;
}

// High contrast mode utility component
interface HighContrastToggleProps {
  className?: string;
}

export function HighContrastToggle({ className }: HighContrastToggleProps) {
  const { isHighContrast, toggleHighContrast } = useTheme();

  return (
    <button
      onClick={toggleHighContrast}
      className={className}
      aria-pressed={isHighContrast}
      aria-label="Toggle high contrast mode"
      title={isHighContrast ? 'Disable high contrast' : 'Enable high contrast'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
      </svg>
    </button>
  );
}

// Utility hook for accessibility features
export function useAccessibility() {
  const { isHighContrast, prefersReducedMotion, isScreenReaderActive } = useTheme();

  const getAccessibleProps = (baseProps: any = {}) => {
    const props = { ...baseProps };

    if (isHighContrast) {
      props.className = `${props.className || ''} high-contrast`.trim();
    }

    if (prefersReducedMotion) {
      props.style = {
        ...props.style,
        transition: 'none',
        animation: 'none',
      };
    }

    // Add screen reader specific attributes
    if (isScreenReaderActive) {
      props['aria-live'] = props['aria-live'] || 'polite';
      props['aria-atomic'] = props['aria-atomic'] || 'true';
    }

    return props;
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    isHighContrast,
    prefersReducedMotion,
    isScreenReaderActive,
    getAccessibleProps,
    announceToScreenReader,
  };
}

// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
    };
  }
}
