// Keyboard navigation utilities and hooks
import { useEffect, useRef, useCallback } from 'react';

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  activateOn?: 'enter' | 'space' | 'both';
  preventScroll?: boolean;
}

export class KeyboardNavigator {
  private container: HTMLElement;
  private options: KeyboardNavigationOptions;
  private currentIndex: number = 0;
  private items: HTMLElement[] = [];

  constructor(container: HTMLElement, options: KeyboardNavigationOptions = {}) {
    this.container = container;
    this.options = {
      enabled: true,
      loop: true,
      orientation: 'horizontal',
      activateOn: 'both',
      preventScroll: true,
      ...options
    };

    this.init();
  }

  private init() {
    if (!this.options.enabled || typeof window === 'undefined') return;

    this.updateItems();
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Observe DOM changes
    const observer = new MutationObserver(() => this.updateItems());
    observer.observe(this.container, { childList: true, subtree: true });
  }

  private updateItems() {
    this.items = Array.from(
      this.container.querySelectorAll('[data-nav-item], [role="menuitem"], [role="option"], button, a, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>
    ).filter(item => {
      const element = item as HTMLElement;
      return element.offsetParent !== null && !(element as any).disabled;
    });
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.options.enabled) return;

    const key = event.key.toLowerCase();
    const activeElement = document.activeElement as HTMLElement;

    // Check if active element is within our container
    if (!this.container.contains(activeElement)) return;

    switch (key) {
      case 'arrowdown':
      case 'arrowright':
        if (this.options.orientation === 'horizontal' || this.options.orientation === 'grid') {
          event.preventDefault();
          this.moveNext();
        }
        break;

      case 'arrowup':
      case 'arrowleft':
        if (this.options.orientation === 'horizontal' || this.options.orientation === 'grid') {
          event.preventDefault();
          this.movePrevious();
        }
        break;

      case 'home':
        event.preventDefault();
        this.moveToFirst();
        break;

      case 'end':
        event.preventDefault();
        this.moveToLast();
        break;

      case 'enter':
      case ' ':
        if (this.options.activateOn === 'both' || 
            (this.options.activateOn === 'enter' && key === 'enter') ||
            (this.options.activateOn === 'space' && key === ' ')) {
          event.preventDefault();
          this.activateItem(activeElement);
        }
        break;

      case 'escape':
        event.preventDefault();
        this.escape();
        break;
    }
  }

  private moveNext() {
    if (this.items.length === 0) return;

    this.currentIndex = this.findNextIndex();
    this.focusCurrent();
  }

  private movePrevious() {
    if (this.items.length === 0) return;

    this.currentIndex = this.findPreviousIndex();
    this.focusCurrent();
  }

  private moveToFirst() {
    if (this.items.length === 0) return;

    this.currentIndex = 0;
    this.focusCurrent();
  }

  private moveToLast() {
    if (this.items.length === 0) return;

    this.currentIndex = this.items.length - 1;
    this.focusCurrent();
  }

  private findNextIndex(): number {
    let nextIndex = this.currentIndex + 1;
    
    if (this.options.loop) {
      if (nextIndex >= this.items.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = Math.min(nextIndex, this.items.length - 1);
    }

    return nextIndex;
  }

  private findPreviousIndex(): number {
    let prevIndex = this.currentIndex - 1;
    
    if (this.options.loop) {
      if (prevIndex < 0) {
        prevIndex = this.items.length - 1;
      }
    } else {
      prevIndex = Math.max(prevIndex, 0);
    }

    return prevIndex;
  }

  private focusCurrent() {
    const item = this.items[this.currentIndex];
    if (item) {
      item.focus({ preventScroll: this.options.preventScroll });
    }
  }

  private activateItem(element: HTMLElement) {
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      element.click();
    } else {
      // Trigger click event for custom elements
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(clickEvent);
    }
  }

  private escape() {
    // Emit escape event or return focus to parent
    const escapeEvent = new CustomEvent('keyboardNavigationEscape', {
      bubbles: true,
      cancelable: true
    });
    this.container.dispatchEvent(escapeEvent);
  }

  public updateCurrentIndex(element: HTMLElement) {
    const index = this.items.indexOf(element);
    if (index !== -1) {
      this.currentIndex = index;
    }
  }

  public destroy() {
    this.container.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}

// React hook for keyboard navigation
export function useKeyboardNavigation(
  options: KeyboardNavigationOptions = {}
) {
  const containerRef = useRef<HTMLElement>(null);
  const navigatorRef = useRef<KeyboardNavigator | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      navigatorRef.current = new KeyboardNavigator(containerRef.current, options);
    }

    return () => {
      if (navigatorRef.current) {
        navigatorRef.current.destroy();
      }
    };
  }, [options]);

  const updateCurrentIndex = useCallback((element: HTMLElement) => {
    if (navigatorRef.current) {
      navigatorRef.current.updateCurrentIndex(element);
    }
  }, []);

  return { containerRef, updateCurrentIndex };
}

// Focus trap utility for modals and dialogs
export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.activate();
  }

  private activate() {
    if (typeof window === 'undefined') return;
    
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    // Focus first focusable element
    const firstFocusable = this.getFocusableElements()[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Add event listener
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(this.container.querySelectorAll(selector));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    // Tab + Shift
    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  public deactivate() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
}

// React hook for focus trap
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      focusTrapRef.current = new FocusTrap(containerRef.current);
    }

    return () => {
      if (focusTrapRef.current) {
        focusTrapRef.current.deactivate();
      }
    };
  }, [isActive]);

  return containerRef;
}

// Modal focus management for accessibility
export function useModalFocus(isActive: boolean = true) {
  const modalRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!isActive || !modalRef.current || typeof window === 'undefined') return;
    
    const modal = modalRef.current;
    
    // Announce modal opening to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Modal opened';
    document.body.appendChild(announcement);
    
    // Remove announcement after it's read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusable) {
      firstFocusable.focus();
    }
    
    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActive]);
  
  return modalRef;
}

// Keyboard shortcuts utility
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  action: () => void;
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey; // Treat cmd as ctrl on Mac
    const alt = event.altKey;
    const shift = event.shiftKey;
    const meta = event.metaKey;

    // Generate shortcut key
    const shortcutKey = this.generateShortcutKey(key, ctrl, alt, shift, meta);
    
    const shortcut = this.shortcuts.get(shortcutKey);
    if (shortcut) {
      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      shortcut.action();
    }
  }

  private generateShortcutKey(
    key: string,
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
    meta: boolean
  ): string {
    const parts: string[] = [];
    
    if (ctrl) parts.push('ctrl');
    if (alt) parts.push('alt');
    if (shift) parts.push('shift');
    if (meta) parts.push('meta');
    
    parts.push(key);
    
    return parts.join('+');
  }

  public add(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(
      shortcut.key.toLowerCase(),
      shortcut.ctrl || false,
      shortcut.alt || false,
      shortcut.shift || false,
      shortcut.meta || false
    );
    
    this.shortcuts.set(key, shortcut);
  }

  public remove(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(
      shortcut.key.toLowerCase(),
      shortcut.ctrl || false,
      shortcut.alt || false,
      shortcut.shift || false,
      shortcut.meta || false
    );
    
    this.shortcuts.delete(key);
  }

  public clear(): void {
    this.shortcuts.clear();
  }
}

// Global shortcut manager instance - only initialize in browser context
export let shortcutManager: KeyboardShortcutManager | null = null;

if (typeof window !== 'undefined') {
  shortcutManager = new KeyboardShortcutManager();
}

// React hook for keyboard shortcuts
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  dependencies: any[] = []
) {
  useEffect(() => {
    if (shortcutManager) {
      shortcutManager.add(shortcut);
    }

    return () => {
      if (shortcutManager) {
        shortcutManager.remove(shortcut);
      }
    };
  }, dependencies);
}