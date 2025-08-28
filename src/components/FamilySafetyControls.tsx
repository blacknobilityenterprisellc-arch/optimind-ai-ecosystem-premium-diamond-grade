"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Users, 
  Clock, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Baby,
  User,
  UserCheck,
  UserX,
  Calendar,
  MapPin,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Thermometer,
  Gauge,
  Target,
  Award,
  Star,
  Crown,
  Diamond,
  Rocket,
  ShieldCheck,
  Fingerprint,
  Key,
  FileText,
  BarChart3,
  Activity,
  Zap,
  Cpu,
  Network,
  Cloud,
  Globe,
  Heart,
  ThumbsUp,
  AlertCircle,
  Info,
  Loader2,
  Settings,
  Download,
  Upload,
  Trash2,
  Archive,
  Search,
  Filter,
  Camera,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Folder,
  HardDrive,
  Bell,
  BellOff,
  MessageSquare,
  MessageCircle,
  Phone,
  Mail,
  Gamepad2,
  Tv,
  BookOpen,
  Palette,
  Music as MusicIcon,
  Film,
  Camera as CameraIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Globe as GlobeIcon,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Loader2 as Loader2Icon,
  Wand2 as Wand2Icon,
  Crop as CropIcon,
  Layers as LayersIcon,
  Eraser as EraserIcon,
  Replace as ReplaceIcon,
  Wand2 as MagicIcon,
  Brush as BrushIcon,
  ImageDown as ImageDownIcon,
  Wrench as WrenchIcon,
  UserPlus,
  UserMinus,
  Clock3,
  Timer,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  CalendarDays,
  CalendarRange,
  MapPinned,
  Navigation,
  Radio,
  RadioReceiver,
  SmartphoneNfc,
  Tablet,
  Laptop,
  Desktop,
  Tv as TvIcon,
  Speaker,
  Headphones,
  Gamepad2 as GamepadIcon,
  BookOpen as BookIcon,
  GraduationCap,
  School,
  Palette as PaletteIcon,
  Music as MusicNote,
  Film as FilmIcon,
  Camera as CameraIcon2,
  Image as ImageIcon2,
  File as FileIcon,
  Folder as FolderIcon,
  HardDrive as HardDriveIcon,
  Cloud as CloudIcon2,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Network as NetworkIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Battery as BatteryIcon,
  BatteryCharging as BatteryChargingIcon,
  Thermometer as ThermometerIcon,
  Gauge as GaugeIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Star as StarIcon,
  Crown as CrownIcon,
  Diamond as DiamondIcon,
  Rocket as RocketIcon,
  ShieldCheck as ShieldCheckIcon,
  Fingerprint as FingerprintIcon,
  Key as KeyIcon,
  FileText as FileTextIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Cpu as CpuIcon,
  Network as NetworkIcon2,
  Cloud as CloudIcon3,
  Globe as GlobeIcon2,
  Heart as HeartIcon2,
  ThumbsUp as ThumbsUpIcon2,
  AlertCircle as AlertCircleIcon2,
  Info as InfoIcon2,
  Loader2 as Loader2Icon2,
  Wand2 as Wand2Icon2,
  Crop as CropIcon2,
  Layers as LayersIcon2,
  Eraser as EraserIcon2,
  Replace as ReplaceIcon2,
  Wand2 as MagicIcon2,
  Brush as BrushIcon2,
  ImageDown as ImageDownIcon2,
  Wrench as WrenchIcon2
} from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: 'parent' | 'child' | 'teenager';
  avatar: string;
  isOnline: boolean;
  lastActive: Date;
  safetyScore: number;
  deviceCount: number;
  restrictions: UserRestrictions;
}

interface UserRestrictions {
  contentFiltering: boolean;
  screenTime: {
    enabled: boolean;
    dailyLimit: number; // minutes
    bedtimeStart: string;
    bedtimeEnd: string;
    allowedDays: number[];
  };
  appBlocking: string[];
  webFiltering: {
    enabled: boolean;
    blockedCategories: string[];
    customBlockedSites: string[];
  };
  locationTracking: boolean;
  socialMedia: {
    enabled: boolean;
    timeLimit: number;
    blockedPlatforms: string[];
  };
  messaging: {
    enabled: boolean;
    contactsOnly: boolean;
    blockedContacts: string[];
  };
  purchases: {
    enabled: boolean;
    requireApproval: boolean;
    monthlyLimit: number;
  };
}

interface SafetyAlert {
  id: string;
  type: 'content_warning' | 'screen_time' | 'location' | 'app_usage' | 'web_filter';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId: string;
  timestamp: Date;
  resolved: boolean;
  actionTaken?: string;
}

interface ActivityReport {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  screenTime: number;
  appsUsed: string[];
  websitesVisited: string[];
  contentFiltered: number;
  alertsTriggered: number;
  safetyScore: number;
  generatedAt: Date;
}

interface FamilySettings {
  familyName: string;
  safetyLevel: 'strict' | 'moderate' | 'relaxed';
  emergencyContacts: string[];
  locationSharing: boolean;
  contentFiltering: boolean;
  screenTimeLimits: boolean;
  appBlocking: boolean;
  webFiltering: boolean;
  socialMediaMonitoring: boolean;
  purchaseControls: boolean;
  notifications: {
    alerts: boolean;
    reports: boolean;
    location: boolean;
    screenTime: boolean;
  };
}

export function FamilySafetyControls() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Mock family members
  const familyMembers: FamilyMember[] = useMemo(() => [
    {
      id: 'parent_1',
      name: 'Sarah Johnson',
      age: 35,
      role: 'parent',
      avatar: '/api/placeholder/100/100',
      isOnline: true,
      lastActive: new Date(Date.now() - 1000 * 60 * 5),
      safetyScore: 98,
      deviceCount: 3,
      restrictions: {
        contentFiltering: true,
        screenTime: {
          enabled: false,
          dailyLimit: 0,
          bedtimeStart: '22:00',
          bedtimeEnd: '06:00',
          allowedDays: [0, 1, 2, 3, 4, 5, 6]
        },
        appBlocking: [],
        webFiltering: {
          enabled: true,
          blockedCategories: [],
          customBlockedSites: []
        },
        locationTracking: true,
        socialMedia: {
          enabled: false,
          timeLimit: 0,
          blockedPlatforms: []
        },
        messaging: {
          enabled: true,
          contactsOnly: false,
          blockedContacts: []
        },
        purchases: {
          enabled: true,
          requireApproval: false,
          monthlyLimit: 1000
        }
      }
    },
    {
      id: 'child_1',
      name: 'Emma Johnson',
      age: 8,
      role: 'child',
      avatar: '/api/placeholder/100/100',
      isOnline: true,
      lastActive: new Date(Date.now() - 1000 * 60 * 2),
      safetyScore: 95,
      deviceCount: 1,
      restrictions: {
        contentFiltering: true,
        screenTime: {
          enabled: true,
          dailyLimit: 120,
          bedtimeStart: '20:00',
          bedtimeEnd: '07:00',
          allowedDays: [0, 1, 2, 3, 4, 5, 6]
        },
        appBlocking: ['social-media', 'games'],
        webFiltering: {
          enabled: true,
          blockedCategories: ['social-media', 'adult', 'violence'],
          customBlockedSites: ['youtube.com', 'tiktok.com']
        },
        locationTracking: true,
        socialMedia: {
          enabled: false,
          timeLimit: 0,
          blockedPlatforms: ['facebook', 'instagram', 'tiktok']
        },
        messaging: {
          enabled: true,
          contactsOnly: true,
          blockedContacts: []
        },
        purchases: {
          enabled: false,
          requireApproval: true,
          monthlyLimit: 0
        }
      }
    },
    {
      id: 'teen_1',
      name: 'Jake Johnson',
      age: 14,
      role: 'teenager',
      avatar: '/api/placeholder/100/100',
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      safetyScore: 85,
      deviceCount: 2,
      restrictions: {
        contentFiltering: true,
        screenTime: {
          enabled: true,
          dailyLimit: 240,
          bedtimeStart: '22:00',
          bedtimeEnd: '06:00',
          allowedDays: [0, 1, 2, 3, 4, 5, 6]
        },
        appBlocking: ['adult-content'],
        webFiltering: {
          enabled: true,
          blockedCategories: ['adult', 'violence', 'gambling'],
          customBlockedSites: []
        },
        locationTracking: true,
        socialMedia: {
          enabled: true,
          timeLimit: 120,
          blockedPlatforms: []
        },
        messaging: {
          enabled: true,
          contactsOnly: false,
          blockedContacts: []
        },
        purchases: {
          enabled: true,
          requireApproval: true,
          monthlyLimit: 50
        }
      }
    }
  ], []);

  // Mock safety alerts
  const safetyAlerts: SafetyAlert[] = useMemo(() => [
    {
      id: '1',
      type: 'content_warning',
      severity: 'medium',
      title: 'Inappropriate Content Blocked',
      description: 'Attempted access to blocked website was prevented',
      userId: 'child_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      resolved: true,
      actionTaken: 'Content blocked and logged'
    },
    {
      id: '2',
      type: 'screen_time',
      severity: 'low',
      title: 'Screen Time Limit Reached',
      description: 'Daily screen time limit has been reached',
      userId: 'child_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      resolved: true,
      actionTaken: 'Device locked until tomorrow'
    },
    {
      id: '3',
      type: 'location',
      severity: 'high',
      title: 'Location Alert',
      description: 'Jake arrived at school safely',
      userId: 'teen_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      resolved: true,
      actionTaken: 'Location verified and logged'
    }
  ], []);

  // Mock family settings
  const familySettings: FamilySettings = useMemo(() => ({
    familyName: 'Johnson Family',
    safetyLevel: 'moderate',
    emergencyContacts: ['555-0123', '555-0456'],
    locationSharing: true,
    contentFiltering: true,
    screenTimeLimits: true,
    appBlocking: true,
    webFiltering: true,
    socialMediaMonitoring: true,
    purchaseControls: true,
    notifications: {
      alerts: true,
      reports: true,
      location: true,
      screenTime: true
    }
  }), []);

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Family Safety Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Protect your family with advanced safety controls and monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isEditingSettings ? 'Cancel' : 'Settings'}
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Family Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMember?.id === member.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {member.role === 'parent' && <User className="w-6 h-6 text-white" />}
                      {member.role === 'child' && <Baby className="w-6 h-6 text-white" />}
                      {member.role === 'teenager' && <User className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {member.role} • {member.age} years old
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Safety Score</span>
                      <span className={`font-semibold ${getSafetyScoreColor(member.safetyScore)}`}>
                        {member.safetyScore}%
                      </span>
                    </div>
                    <Progress value={member.safetyScore} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {member.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Devices</span>
                      <span className="text-sm font-medium">{member.deviceCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="controls">Safety Controls</TabsTrigger>
            <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Family Settings</TabsTrigger>
          </TabsList>

          {/* Safety Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            {selectedMember ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Safety Controls for {selectedMember.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Content Filtering */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">Content Filtering</span>
                      </div>
                      <Switch
                        checked={selectedMember.restrictions.contentFiltering}
                        onCheckedChange={(checked) => {
                          // Update content filtering
                        }}
                      />
                    </div>
                    {selectedMember.restrictions.contentFiltering && (
                      <div className="ml-7 space-y-3">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Automatically filters inappropriate content based on age and safety settings
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-green-100 text-green-800">Violence</Badge>
                          <Badge className="bg-green-100 text-green-800">Adult Content</Badge>
                          <Badge className="bg-green-100 text-green-800">Hate Speech</Badge>
                          <Badge className="bg-green-100 text-green-800">Drugs</Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Screen Time */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Screen Time Limits</span>
                      </div>
                      <Switch
                        checked={selectedMember.restrictions.screenTime.enabled}
                        onCheckedChange={(checked) => {
                          // Update screen time
                        }}
                      />
                    </div>
                    {selectedMember.restrictions.screenTime.enabled && (
                      <div className="ml-7 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-slate-600 dark:text-slate-400">Daily Limit</Label>
                            <Input
                              type="number"
                              value={selectedMember.restrictions.screenTime.dailyLimit}
                              onChange={(e) => {
                                // Update daily limit
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-slate-600 dark:text-slate-400">Bedtime Start</Label>
                            <Input
                              type="time"
                              value={selectedMember.restrictions.screenTime.bedtimeStart}
                              onChange={(e) => {
                                // Update bedtime
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Current usage: {formatScreenTime(selectedMember.restrictions.screenTime.dailyLimit * 0.7)} / {formatScreenTime(selectedMember.restrictions.screenTime.dailyLimit)}
                        </div>
                        <Progress 
                          value={(selectedMember.restrictions.screenTime.dailyLimit * 0.7) / selectedMember.restrictions.screenTime.dailyLimit * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </div>

                  {/* App Blocking */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        <span className="font-medium">App Blocking</span>
                      </div>
                      <Switch
                        checked={selectedMember.restrictions.appBlocking.length > 0}
                        onCheckedChange={(checked) => {
                          // Update app blocking
                        }}
                      />
                    </div>
                    {selectedMember.restrictions.appBlocking.length > 0 && (
                      <div className="ml-7 space-y-3">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Blocked apps and categories:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.restrictions.appBlocking.map((app, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Tracking */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">Location Tracking</span>
                      </div>
                      <Switch
                        checked={selectedMember.restrictions.locationTracking}
                        onCheckedChange={(checked) => {
                          // Update location tracking
                        }}
                      />
                    </div>
                    {selectedMember.restrictions.locationTracking && (
                      <div className="ml-7 space-y-3">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Real-time location tracking and geofencing enabled
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">Last known: Home</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Select a Family Member
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose a family member to view and manage their safety controls
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Safety Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Safety Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safetyAlerts.map((alert) => {
                    const user = familyMembers.find(m => m.id === alert.userId);
                    return (
                      <div key={alert.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {formatTimeAgo(alert.timestamp)}
                            </span>
                          </div>
                          {alert.resolved ? (
                            <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Pending</Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">User:</span>
                          <span className="text-sm font-medium">{user?.name}</span>
                        </div>
                        {alert.actionTaken && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              Action taken: {alert.actionTaken}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Family Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          {member.role === 'parent' && <User className="w-5 h-5 text-white" />}
                          {member.role === 'child' && <Baby className="w-5 h-5 text-white" />}
                          {member.role === 'teenager' && <User className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{member.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Last active {formatTimeAgo(member.lastActive)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {member.restrictions.screenTime.enabled ? formatScreenTime(member.restrictions.screenTime.dailyLimit * 0.7) : 'Unlimited'}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Screen Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {member.restrictions.appBlocking.length}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Apps Blocked</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {safetyAlerts.filter(a => a.userId === member.id).length}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Safety Alerts</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${getSafetyScoreColor(member.safetyScore)}`}>
                            {member.safetyScore}%
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Safety Score</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Family Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-900 dark:text-white">
                        Family Name
                      </Label>
                      <Input
                        value={familySettings.familyName}
                        onChange={(e) => {
                          // Update family name
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-900 dark:text-white">
                        Safety Level
                      </Label>
                      <div className="flex gap-2 mt-2">
                        {(['strict', 'moderate', 'relaxed'] as const).map((level) => (
                          <Button
                            key={level}
                            variant={familySettings.safetyLevel === level ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              // Update safety level
                            }}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-900 dark:text-white">
                        Emergency Contacts
                      </Label>
                      <div className="space-y-2 mt-2">
                        {familySettings.emergencyContacts.map((contact, index) => (
                          <Input
                            key={index}
                            value={contact}
                            onChange={(e) => {
                              // Update emergency contact
                            }}
                          />
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          Add Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Safety Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'locationSharing', label: 'Location Sharing', icon: MapPin },
                      { key: 'contentFiltering', label: 'Content Filtering', icon: Eye },
                      { key: 'screenTimeLimits', label: 'Screen Time Limits', icon: Clock },
                      { key: 'appBlocking', label: 'App Blocking', icon: Smartphone },
                      { key: 'webFiltering', label: 'Web Filtering', icon: Globe },
                      { key: 'socialMediaMonitoring', label: 'Social Media Monitoring', icon: MessageCircle },
                      { key: 'purchaseControls', label: 'Purchase Controls', icon: CreditCard },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <feature.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{feature.label}</span>
                        </div>
                        <Switch
                          checked={familySettings[feature.key as keyof FamilySettings] as boolean}
                          onCheckedChange={(checked) => {
                            // Update feature setting
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(familySettings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => {
                            // Update notification setting
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button variant="outline">
                    Cancel
                  </Button>
                  <Button>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}