'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Mouse, 
  Keyboard, 
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Contrast,
  Zap,
  Accessibility,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTheme, useAccessibility } from '@/components/theme-provider';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusVisible: boolean;
  largeClickTargets: boolean;
  keyboardNavigation: boolean;
  colorBlind: {
    enabled: boolean;
    type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  };
  textToSpeech: {
    enabled: boolean;
    rate: number;
    pitch: number;
    volume: number;
  };
}

export function AccessibilitySettings() {
  const { theme, setTheme, isHighContrast, toggleHighContrast, prefersReducedMotion } = useTheme();
  const { announceToScreenReader } = useAccessibility();
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    highContrast: isHighContrast,
    reducedMotion: prefersReducedMotion,
    screenReader: false,
    focusVisible: true,
    largeClickTargets: false,
    keyboardNavigation: true,
    colorBlind: {
      enabled: false,
      type: 'deuteranopia'
    },
    textToSpeech: {
      enabled: false,
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8
    }
  });

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    announceToScreenReader(`${key} updated`);
  };

  const updateNestedSetting = <K extends keyof AccessibilitySettings['colorBlind'] | keyof AccessibilitySettings['textToSpeech']>(
    parent: 'colorBlind' | 'textToSpeech',
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
    announceToScreenReader(`${parent} ${key} updated`);
  };

  const applySettings = () => {
    const root = document.documentElement;
    
    // Apply font settings
    root.style.setProperty('--font-size', `${settings.fontSize}px`);
    root.style.setProperty('--line-height', settings.lineHeight.toString());
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    
    // Apply color blind filter
    if (settings.colorBlind.enabled) {
      const filters = {
        protanopia: 'url(#protanopia)',
        deuteranopia: 'url(#deuteranopia)',
        tritanopia: 'url(#tritanopia)',
        achromatopsia: 'grayscale(100%)'
      };
      root.style.filter = filters[settings.colorBlind.type];
    } else {
      root.style.filter = '';
    }
    
    // Apply focus styles
    if (settings.focusVisible) {
      root.style.setProperty('--focus-ring', '2px solid #3b82f6');
      root.style.setProperty('--focus-offset', '2px');
    }
    
    // Apply large click targets
    if (settings.largeClickTargets) {
      root.style.setProperty('--min-target-size', '44px');
    } else {
      root.style.setProperty('--min-target-size', '24px');
    }
    
    // Add CSS custom properties for text-to-speech indicators
    root.style.setProperty('--tts-indicator', settings.textToSpeech.enabled ? 'block' : 'none');
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    announceToScreenReader('Accessibility settings applied successfully');
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      highContrast: isHighContrast,
      reducedMotion: prefersReducedMotion,
      screenReader: false,
      focusVisible: true,
      largeClickTargets: false,
      keyboardNavigation: true,
      colorBlind: {
        enabled: false,
        type: 'deuteranopia'
      },
      textToSpeech: {
        enabled: false,
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8
      }
    });
    
    // Reset CSS custom properties
    const root = document.documentElement;
    root.style.removeProperty('--font-size');
    root.style.removeProperty('--line-height');
    root.style.removeProperty('--letter-spacing');
    root.style.filter = '';
    root.style.removeProperty('--focus-ring');
    root.style.removeProperty('--focus-offset');
    root.style.removeProperty('--min-target-size');
    root.style.removeProperty('--tts-indicator');
    
    localStorage.removeItem('accessibility-settings');
    announceToScreenReader('Accessibility settings reset to defaults');
  };

  // Load settings from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings();
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-6 w-6" />
            Accessibility Settings
          </CardTitle>
          <CardDescription>
            Customize the interface to match your accessibility needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isHighContrast ? "default" : "outline"}>
                {isHighContrast ? "High Contrast On" : "High Contrast Off"}
              </Badge>
              <Badge variant={prefersReducedMotion ? "default" : "outline"}>
                {prefersReducedMotion ? "Reduced Motion On" : "Reduced Motion Off"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={applySettings}>
                <Save className="h-4 w-4 mr-2" />
                Apply Settings
              </Button>
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="visual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="motion">Motion</TabsTrigger>
          <TabsTrigger value="interaction">Interaction</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        {/* Visual Settings */}
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visual Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={isHighContrast ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleHighContrast}
                  >
                    <Contrast className="h-4 w-4 mr-2" />
                    High Contrast
                  </Button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Font Size: {settings.fontSize}px
                </label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>12px</span>
                  <span>18px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Line Height: {settings.lineHeight}
                </label>
                <Slider
                  value={[settings.lineHeight]}
                  onValueChange={([value]) => updateSetting('lineHeight', value)}
                  min={1.0}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Letter Spacing */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Letter Spacing: {settings.letterSpacing}px
                </label>
                <Slider
                  value={[settings.letterSpacing]}
                  onValueChange={([value]) => updateSetting('letterSpacing', value)}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Color Blind Support */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Color Blind Support</label>
                  <Switch
                    checked={settings.colorBlind.enabled}
                    onCheckedChange={(checked) => 
                      updateNestedSetting('colorBlind', 'enabled', checked)
                    }
                  />
                </div>
                {settings.colorBlind.enabled && (
                  <div className="space-y-2">
                    <label className="text-sm">Color Vision Type:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'protanopia', label: 'Protanopia' },
                        { value: 'deuteranopia', label: 'Deuteranopia' },
                        { value: 'tritanopia', label: 'Tritanopia' },
                        { value: 'achromatopsia', label: 'Achromatopsia' }
                      ].map(type => (
                        <Button
                          key={type.value}
                          variant={settings.colorBlind.type === type.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateNestedSetting('colorBlind', 'type', type.value)}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Motion Settings */}
        <TabsContent value="motion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Motion & Animation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Reduce Motion</label>
                  <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Focus Visible</label>
                  <p className="text-xs text-gray-500">Show clear focus indicators</p>
                </div>
                <Switch
                  checked={settings.focusVisible}
                  onCheckedChange={(checked) => updateSetting('focusVisible', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction Settings */}
        <TabsContent value="interaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mouse className="h-5 w-5" />
                Interaction & Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Large Click Targets</label>
                  <p className="text-xs text-gray-500">Increase button and link sizes</p>
                </div>
                <Switch
                  checked={settings.largeClickTargets}
                  onCheckedChange={(checked) => updateSetting('largeClickTargets', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Keyboard Navigation</label>
                  <p className="text-xs text-gray-500">Enhance keyboard accessibility</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Screen Reader Mode</label>
                  <p className="text-xs text-gray-500">Optimize for screen readers</p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Settings */}
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Enable Text-to-Speech</label>
                  <p className="text-xs text-gray-500">Read text content aloud</p>
                </div>
                <Switch
                  checked={settings.textToSpeech.enabled}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('textToSpeech', 'enabled', checked)
                  }
                />
              </div>

              {settings.textToSpeech.enabled && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Speech Rate: {settings.textToSpeech.rate}x
                    </label>
                    <Slider
                      value={[settings.textToSpeech.rate]}
                      onValueChange={([value]) => 
                        updateNestedSetting('textToSpeech', 'rate', value)
                      }
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Pitch: {settings.textToSpeech.pitch}
                    </label>
                    <Slider
                      value={[settings.textToSpeech.pitch]}
                      onValueChange={([value]) => 
                        updateNestedSetting('textToSpeech', 'pitch', value)
                      }
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Volume: {Math.round(settings.textToSpeech.volume * 100)}%
                    </label>
                    <Slider
                      value={[settings.textToSpeech.volume]}
                      onValueChange={([value]) => 
                        updateNestedSetting('textToSpeech', 'volume', value)
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Color Blind Filters SVG */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0,     0, 0
                                           0.558, 0.442, 0,     0, 0
                                           0,     0.242, 0.758, 0, 0
                                           0,     0,     0,     1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0,   0, 0
                                           0.7,   0.3,   0,   0, 0
                                           0,     0.3,   0.7, 0, 0
                                           0,     0,     0,   1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05,  0,     0, 0
                                           0,    0.433, 0.567, 0, 0
                                           0,    0.475, 0.525, 0, 0
                                           0,    0,     0,     1, 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}