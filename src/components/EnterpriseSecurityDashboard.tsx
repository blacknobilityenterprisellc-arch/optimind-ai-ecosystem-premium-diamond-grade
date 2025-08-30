"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Server,
  Database,
  Fingerprint,
  Key,
  FileText,
  BarChart3,
  Activity,
  Zap,
  Cpu,
  Network,
  Cloud,
  Smartphone,
  Monitor,
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
  Calendar,
  MapPin,
  Mail,
  Phone,
  Camera,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Folder,
  HardDrive,
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
  Fingerprint as FingerprintIcon,
  Database as DatabaseIcon,
  Cloud as CloudIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Globe as GlobeIcon,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Loader2 as Loader2Icon,
  Wand2 as Wand2Icon,
  Palette as PaletteIcon,
  Crop as CropIcon,
  Layers as LayersIcon,
  Eraser as EraserIcon,
  Replace as ReplaceIcon,
  Magic as MagicIcon,
  Brush as BrushIcon,
  ImageDown as ImageDownIcon,
  Wrench as WrenchIcon
} from "lucide-react";

interface SecurityMetrics {
  totalPhotos: number;
  safePhotos: number;
  flaggedPhotos: number;
  quarantinedItems: number;
  deletedItems: number;
  securityScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastScan: Date;
  nextScan: Date;
  encryptionStrength: number;
  systemHealth: number;
  activeUsers: number;
  totalStorage: number;
  usedStorage: number;
  backupStatus: 'completed' | 'in-progress' | 'failed' | 'pending';
  complianceScore: number;
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'threat_detected' | 'quarantine' | 'deletion' | 'access_violation' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  itemId?: string;
  userId?: string;
  ipAddress?: string;
  resolved: boolean;
  actionTaken?: string;
}

interface UserActivity {
  userId: string;
  username: string;
  role: 'admin' | 'moderator' | 'user' | 'child';
  lastActive: Date;
  actionsCount: number;
  threatsDetected: number;
  complianceScore: number;
}

interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  activeConnections: number;
  responseTime: number;
  errorRate: number;
}

interface ComplianceReport {
  id: string;
  generatedAt: Date;
  period: string;
  totalScans: number;
  threatsDetected: number;
  actionsTaken: number;
  complianceScore: number;
  recommendations: string[];
  status: 'compliant' | 'non-compliant' | 'partial';
}

export function EnterpriseSecurityDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [showDetails, setShowDetails] = useState(false);

  // Mock security metrics
  const securityMetrics: SecurityMetrics = useMemo(() => ({
    totalPhotos: 15420,
    safePhotos: 14850,
    flaggedPhotos: 570,
    quarantinedItems: 89,
    deletedItems: 23,
    securityScore: 94,
    threatLevel: 'low',
    lastScan: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    nextScan: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    encryptionStrength: 256,
    systemHealth: 98,
    activeUsers: 247,
    totalStorage: 1024 * 1024 * 1024 * 10, // 10GB
    usedStorage: 1024 * 1024 * 1024 * 6.7, // 6.7GB
    backupStatus: 'completed',
    complianceScore: 96
  }), []);

  // Mock security events
  const securityEvents: SecurityEvent[] = useMemo(() => [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'threat_detected',
      severity: 'high',
      description: 'NSFW content detected in uploaded image',
      itemId: 'img_001',
      userId: 'user_123',
      resolved: true,
      actionTaken: 'Quarantined'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'quarantine',
      severity: 'medium',
      description: 'Auto-quarantine triggered for suspicious content',
      itemId: 'img_002',
      resolved: true,
      actionTaken: 'Moved to secure vault'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'access_violation',
      severity: 'critical',
      description: 'Unauthorized access attempt to quarantined items',
      userId: 'user_456',
      ipAddress: '192.168.1.100',
      resolved: false,
      actionTaken: 'Access blocked, user notified'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      type: 'system_alert',
      severity: 'low',
      description: 'Scheduled maintenance completed successfully',
      resolved: true,
      actionTaken: 'System updated'
    }
  ], []);

  // Mock user activity
  const userActivity: UserActivity[] = useMemo(() => [
    {
      userId: 'user_001',
      username: 'John Doe',
      role: 'admin',
      lastActive: new Date(Date.now() - 1000 * 60 * 2),
      actionsCount: 145,
      threatsDetected: 12,
      complianceScore: 98
    },
    {
      userId: 'user_002',
      username: 'Jane Smith',
      role: 'moderator',
      lastActive: new Date(Date.now() - 1000 * 60 * 5),
      actionsCount: 89,
      threatsDetected: 8,
      complianceScore: 95
    },
    {
      userId: 'user_003',
      username: 'Bob Johnson',
      role: 'user',
      lastActive: new Date(Date.now() - 1000 * 60 * 10),
      actionsCount: 34,
      threatsDetected: 2,
      complianceScore: 92
    }
  ], []);

  // Mock system status
  const systemStatus: SystemStatus = useMemo(() => ({
    cpu: 45,
    memory: 67,
    disk: 73,
    network: 23,
    uptime: '15 days, 4 hours',
    activeConnections: 1247,
    responseTime: 145,
    errorRate: 0.02
  }), []);

  // Mock compliance reports
  const complianceReports: ComplianceReport[] = useMemo(() => [
    {
      id: '1',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      period: 'Last 24 hours',
      totalScans: 15420,
      threatsDetected: 570,
      actionsTaken: 89,
      complianceScore: 96,
      recommendations: [
        'Consider increasing scan frequency for high-risk users',
        'Review quarantine policies for optimization',
        'Update user training materials'
      ],
      status: 'compliant'
    },
    {
      id: '2',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      period: 'Last 7 days',
      totalScans: 108450,
      threatsDetected: 3890,
      actionsTaken: 623,
      complianceScore: 94,
      recommendations: [
        'Implement additional security layers',
        'Schedule system maintenance',
        'Review user access permissions'
      ],
      status: 'compliant'
    }
  ], []);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Enterprise Security Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Advanced security monitoring and compliance management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Security Score
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {securityMetrics.securityScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Progress value={securityMetrics.securityScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Threats Detected
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {securityMetrics.flaggedPhotos}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(securityMetrics.threatLevel)}`} />
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {securityMetrics.threatLevel} risk
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Quarantined Items
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {securityMetrics.quarantinedItems}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Archive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                Securely isolated
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    System Health
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {securityMetrics.systemHealth}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <Progress value={securityMetrics.systemHealth} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Photos</span>
                    <span className="font-semibold">{securityMetrics.totalPhotos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Safe Photos</span>
                    <span className="font-semibold text-green-600">{securityMetrics.safePhotos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Flagged Photos</span>
                    <span className="font-semibold text-orange-600">{securityMetrics.flaggedPhotos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Encryption Strength</span>
                    <span className="font-semibold">AES-{securityMetrics.encryptionStrength}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Users</span>
                    <span className="font-semibold">{securityMetrics.activeUsers}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Storage & Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Storage Usage</span>
                      <span className="text-sm font-medium">
                        {formatBytes(securityMetrics.usedStorage)} / {formatBytes(securityMetrics.totalStorage)}
                      </span>
                    </div>
                    <Progress 
                      value={(securityMetrics.usedStorage / securityMetrics.totalStorage) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Backup Status</span>
                    <Badge 
                      variant={securityMetrics.backupStatus === 'completed' ? 'default' : 'secondary'}
                      className={
                        securityMetrics.backupStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {securityMetrics.backupStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Scan</span>
                    <span className="text-sm font-medium">{formatTimeAgo(securityMetrics.lastScan)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Scan</span>
                    <span className="text-sm font-medium">{formatTimeAgo(securityMetrics.nextScan)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(event.severity)}`} />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{event.description}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formatTimeAgo(event.timestamp)} • {event.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        {event.resolved ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Security Events Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatTimeAgo(event.timestamp)}
                          </span>
                        </div>
                        {event.resolved ? (
                          <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Pending</Badge>
                        )}
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white mb-2">
                        {event.description}
                      </p>
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p>Type: {event.type.replace('_', ' ')}</p>
                        {event.itemId && <p>Item ID: {event.itemId}</p>}
                        {event.userId && <p>User: {event.userId}</p>}
                        {event.ipAddress && <p>IP: {event.ipAddress}</p>}
                        {event.actionTaken && <p>Action: {event.actionTaken}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Activity Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Activity Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivity.map((user) => (
                    <div key={user.userId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{user.username}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.role} • Last active {formatTimeAgo(user.lastActive)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Actions:</span>
                          <span className="font-medium">{user.actionsCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Threats:</span>
                          <span className="font-medium text-orange-600">{user.threatsDetected}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Compliance:</span>
                          <span className="font-medium text-green-600">{user.complianceScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</span>
                      <span className="text-sm font-medium">{systemStatus.cpu}%</span>
                    </div>
                    <Progress value={systemStatus.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</span>
                      <span className="text-sm font-medium">{systemStatus.memory}%</span>
                    </div>
                    <Progress value={systemStatus.memory} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</span>
                      <span className="text-sm font-medium">{systemStatus.disk}%</span>
                    </div>
                    <Progress value={systemStatus.disk} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Network Usage</span>
                      <span className="text-sm font-medium">{systemStatus.network}%</span>
                    </div>
                    <Progress value={systemStatus.network} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Network & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">System Uptime</span>
                    <span className="font-medium">{systemStatus.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Connections</span>
                    <span className="font-medium">{systemStatus.activeConnections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Response Time</span>
                    <span className="font-medium">{systemStatus.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Error Rate</span>
                    <span className="font-medium">{(systemStatus.errorRate * 100).toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Compliance Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceReports.map((report) => (
                    <div key={report.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{report.period}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generated {formatTimeAgo(report.generatedAt)}
                          </p>
                        </div>
                        <Badge 
                          className={
                            report.status === 'compliant' 
                              ? 'bg-green-100 text-green-800' 
                              : report.status === 'non-compliant'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{report.totalScans}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Total Scans</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{report.threatsDetected}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Threats Detected</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{report.actionsTaken}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Actions Taken</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{report.complianceScore}%</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Compliance Score</p>
                        </div>
                      </div>
                      
                      {report.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-2">Recommendations</h4>
                          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {report.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}