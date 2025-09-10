/**
 * OptiMind AI Ecosystem - Tailwind CSS Configuration
 * 
 * Premium enterprise-grade Tailwind configuration with custom design system
 * Optimized for performance, accessibility, and modern development
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode based on system preference
  darkMode: 'media',
  
  // Content paths for Tailwind to scan
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './index.html'
  ],
  
  // Theme customization with design system
  theme: {
    // Extend the default theme
    extend: {
      // Custom color palette with accessibility in mind
      colors: {
        // Brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Semantic colors for better accessibility
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      
      // Enhanced font family system
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'Droid Sans Mono',
          'Courier New',
          'monospace',
        ],
      },
      
      // Extended spacing scale for more granular control
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '128': '32rem',
      },
      
      // Enhanced animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // Custom keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      // Enhanced backdrop blur utilities
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom border radius values
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Enhanced box shadows
      boxShadow: {
        'colored': '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
        'colored-lg': '0 10px 25px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      
      // Transition timing functions
      transitionTimingFunction: {
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      
      // Extended transition duration
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      // Aspect ratio utilities
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
        '5/4': '5 / 4',
        '4/5': '4 / 5',
        '7/9': '7 / 9',
        '9/16': '9 / 16',
        '16/9': '16 / 9',
      },
      
      // Gradient utilities
      gradientColorStops: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
      },
    },
  },
  
  // Custom plugins for enhanced functionality
  plugins: [
    // Plugin for enhanced focus styles
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          outline: 'none',
          ringWidth: '2px',
          ringColor: 'rgb(99 102 241)', // primary-500
          ringOffsetWidth: '2px',
        },
        '.focus-ring-inset': {
          outline: 'none',
          ringWidth: '2px',
          ringColor: 'rgb(99 102 241)', // primary-500
          ringInset: true,
          ringOffsetWidth: '2px',
        },
      });
    },
    
    // Plugin for accessible color combinations
    function({ addUtilities, theme }) {
      const colors = theme('colors');
      const textUtilities = {};
      
      // Generate high contrast text utilities
      Object.keys(colors).forEach(color => {
        if (typeof colors[color] === 'object') {
          textUtilities[`.text-${color}-contrast`] = {
            color: colors[color][900] || colors[color][800] || colors[color][700],
          };
        }
      });
      
      addUtilities(textUtilities);
    },
    
    // Plugin for print optimization
    function({ addUtilities }) {
      addUtilities({
        '.print-hidden': {
          '@media print': {
            display: 'none !important',
          },
        },
        '.print-visible': {
          '@media print': {
            display: 'block !important',
          },
        },
      });
    },
  ],
  
  // Core plugins configuration
  corePlugins: {
    // Enable accessibility-focused plugins
    accessibility: true,
    // Enable performance-optimized plugins
    preflight: true,
    // Enable modern CSS features
    container: true,
    // Enable spacing utilities
    space: true,
    // Enable divide utilities
    divide: true,
    // Enable aspect ratio utilities
    aspectRatio: true,
  },
  
  // Variants configuration for responsive design
  variants: {
    extend: {
      // Enable hover states for touch devices
      hover: ['hover', 'focus'],
      // Enable focus states
      focus: ['focus', 'focus-within'],
      // Enable active states
      active: ['active'],
      // Enable disabled states
      disabled: ['disabled'],
      // Enable visited states
      visited: ['visited'],
      // Enable group hover states
      groupHover: ['group-hover'],
      // Enable focus within states
      focusWithin: ['focus-within'],
      // Enable motion-safe variants
      motionSafe: ['motion-safe'],
      // Enable motion-reduce variants
      motionReduce: ['motion-reduce'],
      // Enable print variants
      print: ['print'],
      // Enable screen reader only variants
      srOnly: ['sr-only'],
      // Enable placeholder variants
      placeholder: ['placeholder'],
    },
  },
  
  // Prefix configuration for browser compatibility
  prefix: '',
  
  // Important configuration
  important: false,
  
  // Future configuration for upcoming features
  future: {
    // Enable hoverOnlyWhenSupported for better touch device support
    hoverOnlyWhenSupported: true,
    // Enable respectPrefersReducedMotion for accessibility
    respectPrefersReducedMotion: true,
    // Enable removeDeprecatedGapUtilities for cleaner output
    removeDeprecatedGapUtilities: true,
    // Enable purgeLayersByDefault for smaller CSS files
    purgeLayersByDefault: true,
    // Enable defaultLineHeights for better typography
    defaultLineHeights: true,
    // Enable standardFontWeights for consistent font weights
    standardFontWeights: true,
  },
  
  // Separator configuration for customizing class separators
  separator: ':',
  
  // Experimental features
  experimental: {
    // Enable optimizeUniversalDefaults for smaller CSS
    optimizeUniversalDefaults: true,
    // Enable optimizeModernColors for better color handling
    optimizeModernColors: true,
  },
};