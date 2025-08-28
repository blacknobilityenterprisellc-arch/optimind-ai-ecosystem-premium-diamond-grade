"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { 
  Settings, 
  Shield, 
  Brain, 
  Monitor, 
  Smartphone, 
  Database, 
  Wifi, 
  WifiOff,
  Bell,
  Lock,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Save,
  X
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  autoScan: boolean;
  notifications: boolean;
  darkMode: boolean;
  highContrast: boolean;
  autoBackup: boolean;
  offlineMode: boolean;
  aiModel: string;
  scanSensitivity: 'low' | 'medium' | 'high';
  storageLocation: string;
  maxFileSize: number;
  language: string;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { toast } = useToast();
  const { theme, setTheme, isHighContrast, toggleHighContrast } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    autoScan: true,
    notifications: true,
    darkMode: theme === 'dark',
    highContrast: isHighContrast,
    autoBackup: false,
    offlineMode: false,
    aiModel: 'glm-45v',
    scanSensitivity: 'medium',
    storageLocation: 'local',
    maxFileSize: 10,
    language: 'en'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Apply theme settings
      if (settings.darkMode !== (theme === 'dark')) {
        setTheme(settings.darkMode ? 'dark' : 'light');
      }
      
      if (settings.highContrast !== isHighContrast) {
        toggleHighContrast();
      }

      // Save other settings to localStorage
      localStorage.setItem('app-settings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, theme, setTheme, isHighContrast, toggleHighContrast, toast, onClose]);

  const handleReset = useCallback(() => {
    setSettings({
      autoScan: true,
      notifications: true,
      darkMode: theme === 'dark',
      highContrast: isHighContrast,
      autoBackup: false,
      offlineMode: false,
      aiModel: 'glm-45v',
      scanSensitivity: 'medium',
      storageLocation: 'local',
      maxFileSize: 10,
      language: 'en'
    });
    
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults.",
    });
  }, [theme, isHighContrast, toast]);

  const handleClearCache = useCallback(() => {
    if (confirm('Are you sure you want to clear all cached data? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear service worker cache if available
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
        });
      }
      
      toast({
        title: "Cache Cleared",
        description: "All cached data has been cleared.",
      });
    }
  }, []);

  const exportData = useCallback(() => {
    const data = {
      settings: localStorage.getItem('app-settings'),
      photos: localStorage.getItem('photo-data'),
      preferences: localStorage.getItem('user-preferences'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photo-guardian-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Improve visibility</p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive app notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Scan</Label>
                    <p className="text-sm text-muted-foreground">Automatically scan new photos</p>
                  </div>
                  <Switch
                    checked={settings.autoScan}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoScan: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Backup photos to cloud</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Work without internet</p>
                  </div>
                  <Switch
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, offlineMode: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Scan Sensitivity</Label>
                  <Select value={settings.scanSensitivity} onValueChange={(value: 'low' | 'medium' | 'high') => setSettings(prev => ({ ...prev, scanSensitivity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Fewer false positives)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Maximum protection)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={exportData} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={handleClearCache} variant="outline" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>• Export: Download your settings and data</p>
                  <p>• Clear Cache: Remove all cached data and reset preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={settings.aiModel} onValueChange={(value) => setSettings(prev => ({ ...prev, aiModel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="glm-45v">GLM-4.5V (Vision)</SelectItem>
                      <SelectItem value="glm-45-auto-think">GLM-4.5 Auto-Think</SelectItem>
                      <SelectItem value="glm-45-flagship">GLM-4.5 Flagship</SelectItem>
                      <SelectItem value="air">AIR Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Storage Location</Label>
                  <Select value={settings.storageLocation} onValueChange={(value) => setSettings(prev => ({ ...prev, storageLocation: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Local + Cloud)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Maximum File Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) || 10 }))}
                    min="1"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cache Size</Label>
                    <Badge variant="outline">Calculating...</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Database Size</Label>
                    <Badge variant="outline">Calculating...</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Network Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={navigator.onLine ? "default" : "secondary"}>
                      {navigator.onLine ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                      {navigator.onLine ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Debug Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>App Version</Label>
                  <Badge variant="outline">1.0.0</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label>Browser</Label>
                  <Badge variant="outline">{navigator.userAgent}</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Device Type</Label>
                  <Badge variant="outline">
                    {/Mobile|Android|iPhone/.test(navigator.userAgent) ? <Smartphone className="w-3 h-3 mr-1" /> : <Monitor className="w-3 h-3 mr-1" />}
                    {/Mobile|Android|iPhone/.test(navigator.userAgent) ? "Mobile" : "Desktop"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}