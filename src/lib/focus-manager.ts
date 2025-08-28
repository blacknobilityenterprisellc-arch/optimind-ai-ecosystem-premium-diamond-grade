// Focus management utilities for better screen reader experience
import { useRef, useCallback, useEffect } from 'react';

export interface FocusOptions {
  preventScroll?: boolean;
  focusVisible?: boolean;
}

export class FocusManager {
  private static instance: FocusManager;
  private focusHistory: HTMLElement[] = [];
  private activeElement: HTMLElement | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Track focus changes
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
    
    // Handle programmatic focus changes
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (this.isFocusableElement(target)) {
      this.activeElement = target;
      this.addToHistory(target);
    }
  }

  private handleFocusOut(event: FocusEvent) {
    this.activeElement = null;
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Handle Tab key for better focus management
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  private handleTabKey(event: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = focusableElements.indexOf(activeElement);
    
    if (currentIndex === -1) return;

    const isShiftTab = event.shiftKey;
    const nextIndex = isShiftTab ? currentIndex - 1 : currentIndex + 1;
    
    // Check if we're at the boundaries
    if (nextIndex < 0 || nextIndex >= focusableElements.length) {
      // Allow natural tab behavior at boundaries
      return;
    }

    // Prevent default tab behavior
    event.preventDefault();
    
    // Focus the next element
    this.focusElement(focusableElements[nextIndex], {
      preventScroll: false,
      focusVisible: true
    });
  }

  private isFocusableElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const tabIndex = element.getAttribute('tabindex');
    
    // Check if element is inherently focusable
    const inherentlyFocusable = [
      'a', 'button', 'input', 'select', 'textarea', 'iframe'
    ].includes(tagName);
    
    // Check if element has explicit tabindex
    const hasTabIndex = tabIndex !== null && tabIndex !== '-1';
    
    // Check if element is disabled or hidden
    const isDisabled = element.hasAttribute('disabled');
    const isHidden = element.offsetParent === null || 
                     element.getAttribute('aria-hidden') === 'true' ||
                     element.style.display === 'none' ||
                     element.style.visibility === 'hidden';
    
    return (inherentlyFocusable || hasTabIndex) && !isDisabled && !isHidden;
  }

  private getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector) as NodeListOf<HTMLElement>)
      .filter(element => this.isFocusableElement(element));
  }

  private addToHistory(element: HTMLElement) {
    // Remove element if it already exists in history
    this.focusHistory = this.focusHistory.filter(el => el !== element);
    
    // Add element to the beginning of history
    this.focusHistory.unshift(element);
    
    // Keep only last 50 elements
    if (this.focusHistory.length > 50) {
      this.focusHistory = this.focusHistory.slice(0, 50);
    }
  }

  // Public methods
  focusElement(element: HTMLElement, options: FocusOptions = {}): void {
    if (!this.isFocusableElement(element)) return;

    const opts = {
      preventScroll: false,
      focusVisible: false,
      ...options
    };

    try {
      element.focus({
        preventScroll: opts.preventScroll
      });

      // Add focus visible class if needed
      if (opts.focusVisible) {
        element.classList.add('focus-visible');
        setTimeout(() => {
          element.classList.remove('focus-visible');
        }, 100);
      }

      this.addToHistory(element);
    } catch (error) {
      console.warn('Failed to focus element:', error);
    }
  }

  focusFirst(container: HTMLElement, options: FocusOptions = {}): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return false;

    this.focusElement(focusableElements[0], options);
    return true;
  }

  focusLast(container: HTMLElement, options: FocusOptions = {}): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return false;

    this.focusElement(focusableElements[focusableElements.length - 1], options);
    return true;
  }

  focusNext(options: FocusOptions = {}): boolean {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return false;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    
    let nextIndex = currentIndex + 1;
    if (nextIndex >= focusableElements.length) {
      nextIndex = 0; // Loop to beginning
    }

    this.focusElement(focusableElements[nextIndex], options);
    return true;
  }

  focusPrevious(options: FocusOptions = {}): boolean {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return false;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = focusableElements.length - 1; // Loop to end
    }

    this.focusElement(focusableElements[prevIndex], options);
    return true;
  }

  restoreFocus(): boolean {
    if (this.focusHistory.length === 0) return false;

    // Find the most recent focusable element in history
    for (const element of this.focusHistory) {
      if (this.isFocusableElement(element) && element.offsetParent !== null) {
        this.focusElement(element);
        return true;
      }
    }

    return false;
  }

  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && this.isFocusableElement(activeElement)) {
      this.addToHistory(activeElement);
    }
  }

  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  manageFocus(container: HTMLElement): void {
    // Add ARIA attributes for better screen reader support
    if (!container.hasAttribute('role')) {
      container.setAttribute('role', 'region');
    }

    if (!container.hasAttribute('aria-label') && !container.hasAttribute('aria-labelledby')) {
      const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const id = heading.id || `heading-${Date.now()}`;
        heading.id = id;
        container.setAttribute('aria-labelledby', id);
      }
    }

    // Ensure all interactive elements have proper ARIA attributes
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach(element => {
      const el = element as HTMLElement;
      
      // Add aria-label if missing and no other label exists
      if (!el.hasAttribute('aria-label') && 
          !el.hasAttribute('aria-labelledby') &&
          !el.hasAttribute('title') &&
          el.textContent?.trim() === '') {
        
        // Generate a label based on element type and context
        const label = this.generateAccessibleLabel(el);
        if (label) {
          el.setAttribute('aria-label', label);
        }
      }
    });
  }

  private generateAccessibleLabel(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'button':
        const icon = element.querySelector('[class*="icon"], svg');
        if (icon) {
          const iconClass = icon.className || '';
          if (iconClass.includes('close')) return 'Close';
          if (iconClass.includes('menu')) return 'Menu';
          if (iconClass.includes('search')) return 'Search';
          if (iconClass.includes('settings')) return 'Settings';
          if (iconClass.includes('user')) return 'User profile';
          if (iconClass.includes('home')) return 'Home';
        }
        return 'Button';
      
      case 'a':
        return 'Link';
      
      case 'input':
        const type = element.getAttribute('type') || 'text';
        const placeholder = element.getAttribute('placeholder') || '';
        return placeholder || `${type} input field`;
      
      default:
        return 'Interactive element';
    }
  }

  // High contrast mode detection
  isHighContrastMode(): boolean {
    // Check for Windows high contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      return true;
    }

    // Check for forced colors mode
    if (window.matchMedia('(forced-colors: active)').matches) {
      return true;
    }

    // Check for high contrast theme via CSS
    const testElement = document.createElement('div');
    testElement.style.color = 'rgb(255, 0, 0)';
    testElement.style.backgroundColor = 'rgb(0, 255, 0)';
    document.body.appendChild(testElement);
    
    const computedColor = window.getComputedStyle(testElement).color;
    const computedBgColor = window.getComputedStyle(testElement).backgroundColor;
    
    document.body.removeChild(testElement);
    
    // If colors are forced to high contrast, they might be different
    return computedColor !== 'rgb(255, 0, 0)' || computedBgColor !== 'rgb(0, 255, 0)';
  }

  // Reduced motion detection
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Screen reader detection
  isScreenReaderActive(): boolean {
    // This is a heuristic - no 100% reliable way to detect screen readers
    const testElement = document.createElement('div');
    testElement.setAttribute('aria-hidden', 'true');
    testElement.textContent = 'screen reader test';
    document.body.appendChild(testElement);
    
    const isHidden = testElement.getAttribute('aria-hidden') === 'true';
    document.body.removeChild(testElement);
    
    return !isHidden; // If aria-hidden was ignored, screen reader might be active
  }
}

// Export singleton instance - only initialize in browser context
export let focusManager: FocusManager | null = null;

if (typeof window !== 'undefined') {
  focusManager = FocusManager.getInstance();
}

// React hook for focus management
export function useFocusManagement() {
  const containerRef = useRef<HTMLElement>(null);

  const focusFirst = useCallback((options?: FocusOptions) => {
    if (containerRef.current && focusManager) {
      return focusManager.focusFirst(containerRef.current, options);
    }
    return false;
  }, []);

  const focusLast = useCallback((options?: FocusOptions) => {
    if (containerRef.current && focusManager) {
      return focusManager.focusLast(containerRef.current, options);
    }
    return false;
  }, []);

  const manageFocus = useCallback(() => {
    if (containerRef.current && focusManager) {
      focusManager.manageFocus(containerRef.current);
    }
  }, []);

  const announce = useCallback((message: string, priority?: 'polite' | 'assertive') => {
    if (focusManager) {
      focusManager.announceToScreenReader(message, priority);
    }
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    manageFocus,
    announce,
    isHighContrastMode: focusManager?.isHighContrastMode() ?? false,
    prefersReducedMotion: focusManager?.prefersReducedMotion() ?? false,
    isScreenReaderActive: focusManager?.isScreenReaderActive() ?? false
  };
}

// React hook for managing focus within modals and dialogs
export function useModalFocus(isOpen: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first element in modal
      if (focusManager) {
        focusManager.focusFirst(containerRef.current);
      }
      
      // Manage focus within modal
      if (focusManager) {
        focusManager.manageFocus(containerRef.current);
      }
    }

    return () => {
      if (!isOpen && previousFocusRef.current) {
        // Restore focus when modal closes
        if (focusManager) {
          focusManager.focusElement(previousFocusRef.current);
        }
      }
    };
  }, [isOpen]);

  return containerRef;
}