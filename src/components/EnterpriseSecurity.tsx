"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  Key, 
  Database, 
  Cloud,
  Smartphone,
  Monitor,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Users,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Server,
  Cpu,
  HardDrive,
  Zap
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: 'login' | 'file_access' | 'scan' | 'vault_access' | 'settings_change' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

interface SecurityMetrics {
  threatLevel: number;
  scansPerformed: number;
  threatsDetected: number;
  dataEncrypted: boolean;
  authMethods: string[];
  lastSecurityUpdate: Date;
  systemHealth: number;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastActive: Date;
  isCurrentDevice: boolean;
  location?: string;
  ipAddress?: string;
}

export function EnterpriseSecurity() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatLevel: 0,
    scansPerformed: 0,
    threatsDetected: 0,
    dataEncrypted: true,
    authMethods: ['PIN', 'Biometric'],
    lastSecurityUpdate: new Date(),
    systemHealth: 100,
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Initialize security monitoring
  useEffect(() => {
    loadSecurityData();
    startRealTimeMonitoring();
    
    return () => {
      stopRealTimeMonitoring();
    };
  }, []);

  const loadSecurityData = useCallback(() => {
    // Simulate loading security metrics
    setSecurityMetrics({
      threatLevel: Math.random() * 20, // Low threat level for demo
      scansPerformed: 1247,
      threatsDetected: 3,
      dataEncrypted: true,
      authMethods: ['PIN', 'Biometric', 'Two-Factor'],
      lastSecurityUpdate: new Date(),
      systemHealth: 98,
    });

    // Simulate security events
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        severity: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        description: 'Successful login from trusted device',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/91.0',
        location: 'New York, US',
      },
      {
        id: '2',
        type: 'scan',
        severity: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        description: 'AI photo scan completed - 25 photos analyzed',
      },
      {
        id: '3',
        type: 'vault_access',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        description: 'Encrypted vault accessed',
        ipAddress: '192.168.1.100',
      },
      {
        id: '4',
        type: 'threat_detected',
        severity: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        description: 'Suspicious activity detected - unusual login pattern',
        ipAddress: '203.0.113.1',
        location: 'Unknown Location',
      },
    ];

    setSecurityEvents(mockEvents);

    // Simulate connected devices
    const mockDevices: DeviceInfo[] = [
      {
        id: '1',
        name: 'Samsung Galaxy A16 5G',
        type: 'mobile',
        lastActive: new Date(),
        isCurrentDevice: true,
        location: 'New York, US',
        ipAddress: '192.168.1.100',
      },
      {
        id: '2',
        name: 'MacBook Pro',
        type: 'desktop',
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isCurrentDevice: false,
        location: 'San Francisco, US',
        ipAddress: '192.168.1.101',
      },
      {
        id: '3',
        name: 'iPad Pro',
        type: 'tablet',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isCurrentDevice: false,
        location: 'London, UK',
        ipAddress: '192.168.1.102',
      },
    ];

    setConnectedDevices(mockDevices);
  }, []);

  const startRealTimeMonitoring = useCallback(() => {
    if (!isRealTimeMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time security updates
      setSecurityMetrics(prev => ({
        ...prev,
        threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() - 0.5) * 2)),
        systemHealth: Math.max(0, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 1)),
      }));

      // Occasionally add new security events
      if (Math.random() < 0.1) { // 10% chance every interval
        const newEvent: SecurityEvent = {
          id: Date.now().toString(),
          type: ['scan', 'login', 'file_access'][Math.floor(Math.random() * 3)] as SecurityEvent['type'],
          severity: ['low', 'medium'][Math.floor(Math.random() * 2)] as SecurityEvent['severity'],
          timestamp: new Date(),
          description: 'Real-time security event detected',
        };
        
        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only last 10 events
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isRealTimeMonitoring]);

  const stopRealTimeMonitoring = useCallback(() => {
    // Cleanup any monitoring intervals
  }, []);

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getSeverityIcon = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const runSecurityScan = useCallback(() => {
    // Simulate security scan
    setSecurityMetrics(prev => ({
      ...prev,
      scansPerformed: prev.scansPerformed + 1,
      systemHealth: Math.min(100, prev.systemHealth + 2),
    }));

    // Add scan event
    const scanEvent: SecurityEvent = {
      id: Date.now().toString(),
      type: 'scan',
      severity: 'low',
      timestamp: new Date(),
      description: 'Manual security scan completed - all systems secure',
    };

    setSecurityEvents(prev => [scanEvent, ...prev]);
  }, []);

  const toggleRealTimeMonitoring = useCallback(() => {
    setIsRealTimeMonitoring(!isRealTimeMonitoring);
  }, [isRealTimeMonitoring]);

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <Badge variant="outline" className="text-blue-600">
                {securityMetrics.threatLevel.toFixed(1)}%
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">Threat Level</h3>
            <Progress value={securityMetrics.threatLevel} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {securityMetrics.threatLevel < 10 ? 'Low Risk' : 
               securityMetrics.threatLevel < 30 ? 'Moderate Risk' : 'High Risk'}
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <Badge variant="outline" className="text-green-600">
                {securityMetrics.systemHealth.toFixed(0)}%
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">System Health</h3>
            <Progress value={securityMetrics.systemHealth} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <Badge variant="outline" className="text-purple-600">
                {securityMetrics.scansPerformed}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">Scans Performed</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {securityMetrics.threatsDetected} threats detected
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Lock className="w-5 h-5 text-orange-600" />
              <Badge variant="outline" className={securityMetrics.dataEncrypted ? "text-green-600" : "text-red-600"}>
                {securityMetrics.dataEncrypted ? "Encrypted" : "Not Encrypted"}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">Data Protection</h3>
            <p className="text-xs text-muted-foreground mt-1">
              AES-256 encryption active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Controls */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Security Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={runSecurityScan} className="premium-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Security Scan
            </Button>
            <Button 
              variant={isRealTimeMonitoring ? "default" : "outline"}
              onClick={toggleRealTimeMonitoring}
            >
              {isRealTimeMonitoring ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Monitoring Active
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Security Report
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Security Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Security Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Connected Devices
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Advanced Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    {getSeverityIcon(event.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{event.description}</p>
                      {showSensitiveData && event.ipAddress && (
                        <div className="text-xs text-muted-foreground mt-1">
                          IP: {event.ipAddress} {event.location && `• ${event.location}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                >
                  {showSensitiveData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSensitiveData ? 'Hide Sensitive Data' : 'Show Sensitive Data'}
                </Button>
                <Button variant="outline" size="sm">
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div key={device.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {device.type === 'mobile' ? <Smartphone className="w-5 h-5" /> :
                       device.type === 'tablet' ? <Monitor className="w-5 h-5" /> :
                       <Monitor className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{device.name}</h4>
                        {device.isCurrentDevice && (
                          <Badge variant="outline" className="text-blue-600">Current Device</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Last active: {formatTimeAgo(device.lastActive)}</p>
                        {showSensitiveData && device.ipAddress && (
                          <p>IP: {device.ipAddress} {device.location && `• ${device.location}`}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Security Tip</span>
                </div>
                <p className="text-xs text-blue-700">
                  Regularly review your connected devices and remove any you don't recognize. 
                  Enable two-factor authentication for added security.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Encryption Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data at Rest</span>
                    <Badge className="text-green-600">AES-256</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data in Transit</span>
                    <Badge className="text-green-600">TLS 1.3</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Key Management</span>
                    <Badge className="text-green-600">HSM</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backup Encryption</span>
                    <Badge className="text-green-600">Active</Badge>
                  </div>
                </div>
                
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    All data is encrypted with industry-standard algorithms. 
                    Encryption keys are managed securely and rotated regularly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network I/O</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Authentication Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityMetrics.authMethods.map((method, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                    <Key className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{method}</span>
                    <Badge variant="outline" className="text-green-600 ml-auto">Active</Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Authentication
                </Button>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Firewall Status</span>
                    <Badge className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>DDoS Protection</span>
                    <Badge className="text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SSL Certificate</span>
                    <Badge className="text-green-600">Valid</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rate Limiting</span>
                    <Badge className="text-green-600">Active</Badge>
                  </div>
                </div>
                
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Network security measures are active and protecting your data.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}