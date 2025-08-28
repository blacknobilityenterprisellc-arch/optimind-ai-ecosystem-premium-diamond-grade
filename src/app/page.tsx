"use client";

import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropZone } from "@/components/DropZone";
import { Paywall } from "@/components/Paywall";
import { EncryptedVault } from "@/components/EncryptedVault";
import { AITaggingModule } from "@/components/AITaggingModule";
import { PremiumBadge, PremiumButton, PremiumFeature } from "@/components/PremiumBadge";
import { AIEnhancedPhotoManager } from "@/components/AIEnhancedPhotoManager";
import { MultiModelAIAnalyzer } from "@/components/MultiModelAIAnalyzer";
import { EnterpriseSecurityDashboard } from "@/components/EnterpriseSecurityDashboard";
import { FamilySafetyControls } from "@/components/FamilySafetyControls";
import { OnDeviceAnalyzer } from "@/components/OnDeviceAnalyzer";
import { PINPad } from "@/components/PINPad";
import { SettingsModal } from "@/components/SettingsModal";
import { BlockchainStorage } from "@/components/BlockchainStorage";
import { AIArtGenerator } from "@/components/AIArtGenerator";
import { AIImageOrganizer } from "@/components/AIImageOrganizer";
import { AIPremiumEditor } from "@/components/AIPremiumEditor";
import { AIStyleTransfer } from "@/components/AIStyleTransfer";
import { AIPhotoRestoration } from "@/components/AIPhotoRestoration";
import { AIBackgroundGenerator } from "@/components/AIBackgroundGenerator";
import { PremiumAIServices } from "@/components/PremiumAIServices";
import { scanMultiplePhotos } from "@/lib/scan-photos";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { registerServiceWorker } from "@/lib/cache";
import { useKeyboardShortcut as useNavShortcut } from "@/lib/keyboard-navigation";
import { useTheme, HighContrastToggle } from "@/components/theme-provider";
import { offlineStorage, useOfflineStorage } from "@/lib/offline-storage";
import { 
  Shield, 
  Settings, 
  Image as ImageIcon, 
  Wifi,
  WifiOff,
  Crown,
  Vault,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  Cpu,
  Network,
  Zap,
  BarChart3,
  Lock,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Users,
  Star,
  Award,
  Diamond,
  Rocket,
  ShieldCheck,
  Fingerprint,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Globe,
  Heart,
  ThumbsUp,
  AlertCircle,
  Info,
  Loader2,
  Wand2,
  Palette,
  Crop,
  Layers,
  Eraser,
  Replace,
  Magic,
  Brush,
  ImageDown,
  Wrench,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  file?: File;
  confidence?: number;
  categories?: string[];
  aiAnalysis?: any;
  aiDescription?: string;
  privacyConcerns?: string[];
  privacySuggestions?: string[];
  lastAnalyzed?: Date;
}

interface UsageStats {
  storageUsed: number;
  storageLimit: number;
  photosScanned: number;
  scanLimit: number;
  aiTagsGenerated: number;
  aiTagLimit: number;
  vaultAccess: boolean;
  advancedEditing: boolean;
}

export default function Home() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningPhoto, setCurrentScanningPhoto] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showPINPad, setShowPINPad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isEnhancedUI, setIsEnhancedUI] = useState(true);
  
  // Force recompilation - updated
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const { toast } = useToast();
  const { isPremium, hasActiveTrial, trialDaysRemaining, subscribe, startFreeTrial, usage } = useSecureSubscription();
  const { isOnline: offlineStatus } = useOfflineStorage();
  const { isHighContrast, toggleHighContrast } = useTheme();

  // Enhanced analytics data
  const analyticsData = useMemo(() => {
    const totalPhotos = photos.length;
    const safePhotos = photos.filter(p => p.status === "safe").length;
    const flaggedPhotos = photos.filter(p => p.status === "flagged").length;
    const scannedPhotos = photos.filter(p => p.scanDate).length;
    const pendingPhotos = photos.filter(p => p.status === "pending").length;
    
    return {
      totalPhotos,
      safePhotos,
      flaggedPhotos,
      scannedPhotos,
      pendingPhotos,
      safetyRate: totalPhotos > 0 ? (safePhotos / totalPhotos) * 100 : 0,
      scanCompletion: totalPhotos > 0 ? (scannedPhotos / totalPhotos) * 100 : 0,
      avgConfidence: photos.filter(p => p.confidence).reduce((sum, p) => sum + (p.confidence || 0), 0) / photos.filter(p => p.confidence).length || 0
    };
  }, [photos]);

  // Premium features showcase
  const premiumFeatures = useMemo(() => [
    {
      icon: <Diamond className="w-6 h-6" />,
      title: "Unlimited Storage",
      description: "From 500MB to 1TB encrypted cloud storage",
      gradient: "gradient-premium"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Organization",
      description: "Smart tagging and facial recognition",
      gradient: "gradient-primary"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Military Security",
      description: "AES-256 encryption and biometric protection",
      gradient: "gradient-safety"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for mobile and desktop performance",
      gradient: "gradient-accent"
    }
  ], []);

  const startScanning = useCallback(async () => {
    const pendingPhotos = photos.filter(p => p.status === "pending" && p.file);
    if (pendingPhotos.length === 0) {
      toast({
        title: "No Photos to Scan",
        description: "All photos have been scanned or are being processed",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setCurrentScanningPhoto("");

    try {
      setPhotos(prev => 
        prev.map(photo => 
          photo.status === "pending" 
            ? { ...photo, status: "scanning" as const }
            : photo
        )
      );

      const files = pendingPhotos.map(p => p.file!);
      const results = await scanMultiplePhotos(
        pendingPhotos, 
        files, 
        (progress, currentPhoto) => {
          setScanProgress(progress);
          setCurrentScanningPhoto(currentPhoto);
        }
      );

      setPhotos(prev => 
        prev.map(photo => {
          const result = results.find(r => r.photoId === photo.id);
          if (!result) return photo;

          return {
            ...photo,
            status: result.isNsfw ? "flagged" : "safe",
            scanDate: new Date(),
            confidence: result.confidence,
            categories: result.categories,
          };
        })
      );

      const flaggedCount = results.filter(r => r.isNsfw).length;
      const safeCount = results.filter(r => !r.isNsfw).length;

      toast({
        title: "Scanning Complete",
        description: `Analyzed ${results.length} photos: ${safeCount} safe, ${flaggedCount} flagged`,
      });

    } catch (error) {
      console.error("Scanning error:", error);
      toast({
        title: "Scanning Failed",
        description: error instanceof Error ? error.message : "An error occurred during scanning",
        variant: "destructive",
      });

      setPhotos(prev => 
        prev.map(photo => 
          photo.status === "scanning" 
            ? { ...photo, status: "pending" as const }
            : photo
        )
      );
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentScanningPhoto("");
    }
  }, [photos, toast]);

  useEffect(() => {
    registerServiceWorker();
    
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced keyboard shortcuts
  useNavShortcut({
    key: 's',
    ctrl: true,
    preventDefault: true,
    action: () => {
      if (!isScanning && photos.filter(p => p.status === "pending").length > 0) {
        startScanning();
      }
    }
  }, [isScanning, photos, startScanning]);

  useNavShortcut({
    key: 'u',
    ctrl: true,
    preventDefault: true,
    action: () => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }, []);

  useNavShortcut({
    key: 'v',
    ctrl: true,
    preventDefault: true,
    action: () => {
      setShowVault(true);
    }
  }, []);

  useNavShortcut({
    key: 'p',
    ctrl: true,
    preventDefault: true,
    action: () => {
      setShowPINPad(true);
    }
  }, []);

  useNavShortcut({
    key: ',',
    ctrl: true,
    preventDefault: true,
    action: () => {
      setShowSettings(true);
    }
  }, []);

  useNavShortcut({
    key: 'Escape',
    preventDefault: true,
    action: () => {
      if (showPaywall) setShowPaywall(false);
      if (showVault) setShowVault(false);
      if (showPINPad) setShowPINPad(false);
      if (showSettings) setShowSettings(false);
    }
  }, [showPaywall, showVault, showPINPad, showSettings]);

  const handleSubscribe = async (plan: "monthly" | "annual" | "lifetime") => {
    try {
      await subscribe(plan);
      toast({
        title: "Welcome to Premium!",
        description: "You now have access to all premium features.",
      });
      setShowPaywall(false);
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Unable to complete subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartTrial = async () => {
    try {
      await startFreeTrial();
      toast({
        title: "Trial Started!",
        description: "Enjoy 30 days of premium features for free.",
      });
      setShowPaywall(false);
    } catch (error) {
      toast({
        title: "Trial Activation Failed",
        description: "Unable to start trial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePINSuccess = () => {
    setShowPINPad(false);
    toast({
      title: "PIN Verified",
      description: "Access granted to premium features.",
    });
  };

  const handleFilesAdded = useCallback((files: File[]) => {
    const newPhotos: PhotoItem[] = files.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: "pending",
      fileSize: file.size,
      file: file,
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    toast({
      title: "Photos Added",
      description: `${files.length} photo${files.length > 1 ? 's' : ''} uploaded successfully`,
    });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap min-w-0 flex-1">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                  <div className="w-full h-full bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                  AI Premium Photo Editor
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Advanced AI-powered photo editing & organization suite</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isPremium && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">PRO</span>
                  </div>
                )}
                {hasActiveTrial && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {trialDaysRemaining}d trial
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <HighContrastToggle className="p-2.5 h-10 w-10 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" />
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <WifiOff className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Offline</span>
                  </>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowVault(true)}
                className="p-2.5 h-10 w-10 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Open vault"
              >
                <Vault className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(true)}
                className="p-2.5 h-10 w-10 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-900 shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Create & Edit
                    </h2>
                    <p className="text-lg text-white/80">
                      Professional AI-powered photo editing, generation, and organization
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <DropZone onFilesAdded={handleFilesAdded} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={startScanning}
                    disabled={isScanning || photos.filter(p => p.status === "pending").length === 0}
                    className="flex-1 bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-3" />
                        Start Analyzing
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowVault(true)}
                    className="flex-1 bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    <Vault className="w-5 h-5 mr-3" />
                    Secure Vault
                  </Button>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6" />
                    AI Studio Dashboard
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">
                        {analyticsData.totalPhotos}
                      </div>
                      <div className="text-sm text-white/70">Total Photos</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-emerald-300 mb-1">
                        {analyticsData.safePhotos}
                      </div>
                      <div className="text-sm text-white/70">Safe</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-red-300 mb-1">
                        {analyticsData.flaggedPhotos}
                      </div>
                      <div className="text-sm text-white/70">Flagged</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold text-blue-300 mb-1">
                        {Math.round(analyticsData.safetyRate)}%
                      </div>
                      <div className="text-sm text-white/70">Safety Rate</div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-white/80 mb-2">
                        <span>Storage Used</span>
                        <span>{formatFileSize(usage.storageUsed)} / {formatFileSize(usage.storageLimit)}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-indigo-400 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage(usage.storageUsed, usage.storageLimit)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-white/80 mb-2">
                        <span>Scans Used</span>
                        <span>{usage.photosScanned} / {usage.scanLimit}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-green-400 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage(usage.photosScanned, usage.scanLimit)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scanning Progress */}
        {isScanning && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            <div className="relative z-10 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Shield className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        AI Analysis in Progress
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Advanced analysis powered by multiple AI models
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">
                      {Math.round(scanProgress)}%
                    </div>
                    <div className="text-sm text-blue-100">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-green-400 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                {currentScanningPhoto && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-white flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-200" />
                      <span className="font-medium">Currently analyzing:</span>
                      <span className="text-blue-100 truncate">{currentScanningPhoto}</span>
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-blue-200" />
                      <div>
                        <div className="text-sm font-medium text-white">AI Content Analysis</div>
                        <div className="text-xs text-blue-100">Deep learning models</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-emerald-200" />
                      <div>
                        <div className="text-sm font-medium text-white">Privacy Detection</div>
                        <div className="text-xs text-blue-100">Advanced security</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-yellow-200" />
                      <div>
                        <div className="text-sm font-medium text-white">Real-time Processing</div>
                        <div className="text-xs text-blue-100">Instant results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-2 bg-transparent h-auto">
              <TabsTrigger 
                value="gallery" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm font-medium">Gallery</span>
              </TabsTrigger>
              <TabsTrigger 
                value="organization" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-purple-200 dark:data-[state=active]:border-purple-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Brain className="w-6 h-6" />
                <span className="text-sm font-medium">AI Org</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ondevice" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 data-[state=active]:border-green-200 dark:data-[state=active]:border-green-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Cpu className="w-6 h-6" />
                <span className="text-sm font-medium">On-Device</span>
              </TabsTrigger>
              <TabsTrigger 
                value="multimodel" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-900/20 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:border-orange-200 dark:data-[state=active]:border-orange-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Network className="w-6 h-6" />
                <span className="text-sm font-medium">Multi-Model</span>
              </TabsTrigger>
              <TabsTrigger 
                value="premium" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-amber-50 dark:data-[state=active]:bg-amber-900/20 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:border-amber-200 dark:data-[state=active]:border-amber-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Crown className="w-6 h-6" />
                <span className="text-sm font-medium">Premium</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-red-50 dark:data-[state=active]:bg-red-900/20 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400 data-[state=active]:border-red-200 dark:data-[state=active]:border-red-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="art-generator" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-purple-200 dark:data-[state=active]:border-purple-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Wand2 className="w-6 h-6" />
                <span className="text-sm font-medium">Art Gen</span>
              </TabsTrigger>
              <TabsTrigger 
                value="style-transfer" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-pink-50 dark:data-[state=active]:bg-pink-900/20 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 data-[state=active]:border-pink-200 dark:data-[state=active]:border-pink-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Palette className="w-6 h-6" />
                <span className="text-sm font-medium">Style</span>
              </TabsTrigger>
              <TabsTrigger 
                value="background" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/20 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-200 dark:data-[state=active]:border-indigo-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Crop className="w-6 h-6" />
                <span className="text-sm font-medium">Background</span>
              </TabsTrigger>
              <TabsTrigger 
                value="enterprise-security" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-200 dark:data-[state=active]:border-emerald-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="text-sm font-medium">Enterprise</span>
              </TabsTrigger>
              <TabsTrigger 
                value="family-safety" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-cyan-50 dark:data-[state=active]:bg-cyan-900/20 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-200 dark:data-[state=active]:border-cyan-800 rounded-xl border border-transparent transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Family</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <Suspense fallback={
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Gallery</h3>
                <p className="text-slate-500 dark:text-slate-400">Preparing your photo collection...</p>
              </div>
            }>
              <AIEnhancedPhotoManager
                photos={photos}
                onPhotosUpdate={setPhotos}
                isPremium={isPremium}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  AI Organization
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Smart tagging and intelligent photo organization powered by advanced AI
                </p>
              </div>
              <AIImageOrganizer 
                photos={photos}
                onPhotosUpdate={setPhotos}
                isPremium={isPremium}
              />
              <AITaggingModule
                photos={photos.map(p => ({
                  ...p,
                  tags: p.categories?.map(cat => ({
                    id: `tag-${cat}`,
                    name: cat,
                    type: "custom" as const,
                    confidence: 0.8,
                    color: "bg-purple-500/20 text-purple-400 border-purple-500/50"
                  })) || []
                }))}
                onTagsUpdate={(photoId, tags) => {
                  setPhotos(prev => prev.map(p => 
                    p.id === photoId 
                      ? { ...p, categories: tags.map(t => t.name) }
                      : p
                  ));
                }}
                isPremium={isPremium}
              />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="ondevice" className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                On-Device AI
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Private analysis with GLM 4.5 - no server required, complete privacy
              </p>
            </div>
            <OnDeviceAnalyzer 
              onAnalysisComplete={(result, confidence) => {
                toast({
                  title: "Analysis Complete",
                  description: `On-device analysis completed with ${(confidence * 100).toFixed(1)}% confidence`,
                });
              }}
            />
          </TabsContent>

          <TabsContent value="multimodel" className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Network className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                Multi-Model AI
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Advanced analysis with GLM-4.5V, AIR, and ensemble capabilities
              </p>
            </div>
            
            {photos.length > 0 ? (
              <div className="space-y-6">
                {photos.map((photo) => (
                  photo.file && (
                    <MultiModelAIAnalyzer
                      key={photo.id}
                      photoId={photo.id}
                      file={photo.file}
                      onAnalysisComplete={(result) => {
                        console.log('Multi-model analysis complete:', result);
                        toast({
                          title: "Multi-Model Analysis Complete",
                          description: "Advanced AI analysis with multiple models finished successfully",
                        });
                      }}
                    />
                  )
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Network className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">No Photos for Analysis</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Upload photos to enable multi-model AI analysis
                </p>
                <Button 
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }} 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Upload Photos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="w-full h-full bg-repeat" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '80px 80px'
                }}></div>
              </div>
              <div className="relative z-10 p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                    <Crown className="w-14 h-14 text-white animate-float" />
                  </div>
                  
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Premium Experience
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Unlock infinite space, intelligent control, and unbreakable security with our premium features
                  </p>

                  {isPremium ? (
                    <div className="space-y-8">
                      <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                        <CheckCircle className="w-6 h-6 text-emerald-300" />
                        <span className="text-lg font-semibold text-white">
                          Premium Active - Enjoy All Features
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {premiumFeatures.map((feature, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                              {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/80">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {hasActiveTrial ? (
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                          <Clock className="w-6 h-6 text-amber-300" />
                          <span className="text-lg font-semibold text-white">
                            {trialDaysRemaining} days left in trial
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                          <Sparkles className="w-6 h-6 text-emerald-300" />
                          <span className="text-lg font-semibold text-white">
                            30-day free trial available
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {premiumFeatures.map((feature, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                              {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/80">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-6 justify-center">
                        <Button
                          onClick={() => setShowPINPad(true)}
                          className="bg-white text-orange-600 hover:bg-white/90 font-bold text-lg py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                        >
                          {hasActiveTrial ? "Upgrade Now" : "Start Free Trial"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowVault(true)}
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-bold text-lg py-4 px-10 rounded-2xl transition-all duration-300"
                        >
                          <Vault className="w-5 h-5 mr-2" />
                          Try Secure Vault
                        </Button>
                      </div>
                      
                      {/* Blockchain Storage Section */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <Database className="w-8 h-8" />
                          Blockchain Storage
                        </h3>
                        <BlockchainStorage 
                          photoId={photos.length > 0 ? photos[0]?.id : undefined}
                          file={photos.length > 0 ? photos[0]?.file : undefined}
                          onStorageComplete={(result) => {
                            if (result.success) {
                              console.log('Photo stored as NFT:', result.transactionHash);
                            }
                          }}
                        />
                      </div>
                      
                      {/* Premium AI Services Section */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <Brain className="w-8 h-8" />
                          Advanced AI Services
                        </h3>
                        <PremiumAIServices 
                          photos={photos.map(p => ({ id: p.id, file: p.file!, url: p.url }))}
                          onProcessingComplete={(results) => {
                            console.log('AI processing completed:', results);
                          }}
                        />
                      </div>

                      {/* AI Premium Editor Section */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <Wrench className="w-8 h-8" />
                          Professional Photo Editor
                        </h3>
                        <AIPremiumEditor />
                      </div>

                      {/* AI Photo Restoration Section */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <ImageDown className="w-8 h-8" />
                          Photo Restoration & Enhancement
                        </h3>
                        <AIPhotoRestoration />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <EnterpriseSecurityDashboard />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="art-generator" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <AIArtGenerator />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="style-transfer" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <AIStyleTransfer />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="background" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <AIBackgroundGenerator />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="enterprise-security" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <EnterpriseSecurityDashboard />
            </PremiumFeature>
          </TabsContent>

          <TabsContent value="family-safety" className="space-y-6">
            <PremiumFeature isPremium={!isPremium}>
              <FamilySafetyControls />
            </PremiumFeature>
          </TabsContent>
        </Tabs>
        </div>
      </main>

      {/* Enhanced Modals */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={handleSubscribe}
        hasFreeTrial={!hasActiveTrial}
      />

      <EncryptedVault
        isOpen={showVault}
        onClose={() => setShowVault(false)}
        isPremium={isPremium}
      />

      <PINPad
        isOpen={showPINPad}
        onClose={() => setShowPINPad(false)}
        onSuccess={handlePINSuccess}
        title="Premium Access"
        description="Enter your 4-digit PIN to access premium features"
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}