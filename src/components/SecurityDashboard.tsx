"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSecurityMonitor, SecurityEvent, SecurityAlert } from "@/lib/security-monitor";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity, 
  BarChart3, 
  Download, 
  RefreshCw,
  Eye,
  Lock,
  Database,
  Network,
  UserCheck,
  FileText,
  Trash2,
  Settings,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  XCircle,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SecurityDashboard() {
  const { isPremium } = useSecureSubscription();
  const { 
    events, 
    alerts, 
    metrics, 
    assessment, 
    isLoading,
    resolveEvent,
    resolveAlert,
    performAssessment,
    exportData,
    clearOldData
  } = useSecurityMonitor();
  
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true;
    return event.severity === eventFilter;
  });

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    return alert.severity === alertFilter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100 border-red-200';
      case 'investigating': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'resolved': return 'text-green-600 bg-green-100 border-green-200';
      case 'false_positive': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'auth': return <UserCheck className="w-4 h-4" />;
      case 'access': return <Eye className="w-4 h-4" />;
      case 'scan': return <Activity className="w-4 h-4" />;
      case 'upload': return <Database className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'share': return <Network className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleResolveEvent = useCallback(async (eventId: string) => {
    const action = prompt('Enter action taken to resolve this event:');
    if (action) {
      const success = resolveEvent(eventId, action);
      if (success) {
        toast({
          title: "Event Resolved",
          description: "Security event has been marked as resolved",
        });
      }
    }
  }, [resolveEvent, toast]);

  const handleResolveAlert = useCallback(async (alertId: string, status: 'resolved' | 'false_positive') => {
    const success = resolveAlert(alertId, status);
    if (success) {
      toast({
        title: "Alert Resolved",
        description: `Security alert marked as ${status}`,
      });
    }
  }, [resolveAlert, toast]);

  const handlePerformAssessment = useCallback(async () => {
    await performAssessment();
    toast({
      title: "Assessment Complete",
      description: "Security assessment has been performed",
    });
  }, [performAssessment, toast]);

  const handleExportData = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Security data has been exported successfully",
    });
  }, [exportData, toast]);

  const getThreatLevelColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getThreatLevelText = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced security monitoring and threat detection
            </p>
            <Button className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Security Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time security monitoring and threat detection
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePerformAssessment}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Assess
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Threat Level</p>
                  <p className={`text-2xl font-bold ${getThreatLevelColor(metrics.threatScore)}`}>
                    {getThreatLevelText(metrics.threatScore)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.threatScore.toFixed(1)}/100
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  metrics.threatScore >= 80 ? 'bg-red-100' :
                  metrics.threatScore >= 60 ? 'bg-orange-100' :
                  metrics.threatScore >= 40 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.status === 'active').length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {alerts.length} total alerts
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Events</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {events.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.resolvedEvents} resolved
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.threatScore < 40 ? 'Good' : metrics.threatScore < 70 ? 'Fair' : 'Poor'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Severity Breakdown */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Event Severity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Critical
                  </span>
                  <span>{metrics.criticalEvents} ({metrics.totalEvents > 0 ? ((metrics.criticalEvents / metrics.totalEvents) * 100).toFixed(1) : 0}%)</span>
                </div>
                <Progress value={metrics.totalEvents > 0 ? (metrics.criticalEvents / metrics.totalEvents) * 100 : 0} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    High
                  </span>
                  <span>{metrics.highEvents} ({metrics.totalEvents > 0 ? ((metrics.highEvents / metrics.totalEvents) * 100).toFixed(1) : 0}%)</span>
                </div>
                <Progress value={metrics.totalEvents > 0 ? (metrics.highEvents / metrics.totalEvents) * 100 : 0} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    Medium
                  </span>
                  <span>{metrics.mediumEvents} ({metrics.totalEvents > 0 ? ((metrics.mediumEvents / metrics.totalEvents) * 100).toFixed(1) : 0}%)</span>
                </div>
                <Progress value={metrics.totalEvents > 0 ? (metrics.mediumEvents / metrics.totalEvents) * 100 : 0} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-green-600" />
                    Low
                  </span>
                  <span>{metrics.lowEvents} ({metrics.totalEvents > 0 ? ((metrics.lowEvents / metrics.totalEvents) * 100).toFixed(1) : 0}%)</span>
                </div>
                <Progress value={metrics.totalEvents > 0 ? (metrics.lowEvents / metrics.totalEvents) * 100 : 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Assessment */}
      {assessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Security Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{assessment}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {/* Events Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredEvents.length} of {events.length} events
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="w-12 h-12 mx-auto mb-4" />
                      <p>No security events found</p>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          getSeverityColor(event.severity)
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getEventTypeIcon(event.type)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{event.description}</span>
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(event.severity)}
                            {!event.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveEvent(event.id);
                                }}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alerts Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={alertFilter} onValueChange={setAlertFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAlerts.length} of {alerts.length} alerts
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>No security alerts found</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          getSeverityColor(alert.severity)
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{alert.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getStatusColor(alert.status)}`}>
                                  {alert.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString()}
                              </div>
                              <p className="text-sm mt-1">{alert.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {alert.status === 'active' && (
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolveAlert(alert.id, 'resolved');
                                  }}
                                >
                                  Resolve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolveAlert(alert.id, 'false_positive');
                                  }}
                                >
                                  False Positive
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Security Event Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getEventTypeIcon(selectedEvent.type)}
                  <Badge variant="outline">{selectedEvent.type}</Badge>
                  <Badge className={getSeverityColor(selectedEvent.severity)}>
                    {selectedEvent.severity}
                  </Badge>
                  {selectedEvent.resolved && (
                    <Badge variant="outline" className="text-green-600">
                      Resolved
                    </Badge>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Timestamp</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
                
                {selectedEvent.actionTaken && (
                  <div>
                    <h4 className="font-medium mb-2">Action Taken</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.actionTaken}</p>
                  </div>
                )}
                
                {!selectedEvent.resolved && (
                  <Button
                    onClick={() => {
                      handleResolveEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="w-full"
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Security Alert Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAlert(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <Badge variant="outline">{selectedAlert.type}</Badge>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedAlert.status)}>
                    {selectedAlert.status}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Title</h4>
                  <p className="text-sm">{selectedAlert.title}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Timestamp</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Affected Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlert.affectedResources.map((resource, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommended Actions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedAlert.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedAlert.status === 'active' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleResolveAlert(selectedAlert.id, 'resolved');
                        setSelectedAlert(null);
                      }}
                      className="flex-1"
                    >
                      Mark as Resolved
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleResolveAlert(selectedAlert.id, 'false_positive');
                        setSelectedAlert(null);
                      }}
                      className="flex-1"
                    >
                      False Positive
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}