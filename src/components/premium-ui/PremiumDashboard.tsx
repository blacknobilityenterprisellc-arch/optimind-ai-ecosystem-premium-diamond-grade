/**
 * Premium Dashboard Component
 *
 * A sophisticated dashboard featuring the latest UI/UX patterns including
 * real-time data visualization, interactive widgets, personalized insights,
 * and intelligent user experience optimization.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Crown,
  Zap,
  BarChart3,
  Shield,
  Target,
  Globe,
  Search,
  Image as ImageIcon,
  FileText,
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  Star,
  Diamond,
  TrendingUp,
  Award,
  Rocket,
  Eye,
  Heart,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Filter,
  Grid,
  List,
  Moon,
  Sun,
  Monitor,
  Activity,
  Users,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Signal,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Mic,
  Camera,
  Music,
  BookOpen,
  Code,
  Palette,
  Calculator,
  Terminal,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  PieChart,
  LineChart,
  BarChart as BarChartIcon,
  AreaChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
  CandlestickChart,
  FunnelChart,
  Sankey,
  TreeMap,
  Timeline,
  Gantt,
  Kanban,
  Table,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Datepicker,
  Timepicker,
  Colorpicker,
  Fileupload,
  Dropzone,
  Dragdrop,
  Resizable,
  Splitpane,
  Tabs,
  Accordion,
  Collapse,
  Modal,
  Dialog,
  Drawer,
  Popover,
  Tooltip,
  Toast,
  Notification,
  Badge,
  Avatar,
  Skeleton,
  Spinner,
  Progress,
  Pagination,
  Breadcrumb,
  Steps,
  Tag,
  Chip,
  Button,
  IconButton,
  FloatingButton,
  SpeedDial,
  Card,
  List as ListIcon,
  Masonry,
  Carousel,
  Swiper,
  Lightbox,
  Gallery,
  Zoom,
  Pan,
  Rotate,
  Flip,
  Crop,
  Filter as FilterIcon,
  Adjust,
  Brightness,
  Contrast,
  Saturation,
  Hue,
  Blur,
  Sharpen,
  Noise,
  Vignette,
  Frame,
  Border,
  Shadow,
  Gradient,
  Pattern,
  Texture,
  Overlay,
  Mask,
  Clip,
  Transform,
  Transition,
  Animation,
  Keyframe,
  Spring,
  Physics,
  Collision,
  Gravity,
  Friction,
  Elasticity,
  Damping,
  Stiffness,
  Mass,
  Velocity,
  Acceleration,
  Deceleration,
  Easing,
  Timing,
  Duration,
  Delay,
  Loop,
  Reverse,
  Alternate,
  Direction,
  Mode,
  PlayState,
  FillMode,
  IterationCount,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  Move,
  Move3D,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  ExitFullscreen,
  Expand,
  Shrink,
  GripVertical,
  GripHorizontal,
  MoreVertical,
  MoreHorizontal,
  Ellipsis,
  Menu,
  Home,
  Inbox,
  Send,
  Paperclip,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Heart as HeartIcon,
  ThumbsUp,
  ThumbsDown,
  Star as StarIcon,
  Flag,
  Bookmark,
  Check,
  X,
  Plus,
  Minus,
  Divide,
  Multiply,
  Equal,
  NotEqual,
  GreaterThan,
  LessThan,
  GreaterThanOrEqual,
  LessThanOrEqual,
  Percent,
  Hash,
  AtSign,
  Slash,
  Backslash,
  Pipe,
  Underscore,
  Hyphen,
  Colon,
  Semicolon,
  Comma,
  Period,
  QuestionMark,
  Exclamation,
  Quote,
  DoubleQuote,
  SingleQuote,
  Backtick,
  Tilde,
  Grave,
  Circumflex,
  Acute,
  Diaeresis,
  Cedilla,
  Breve,
  Caron,
  Ring,
  Ogonek,
  Dot,
  Hook,
  Horn,
  Stroke,
  DoubleAcute,
  DoubleGrave,
  InvertedBreve,
  DoubleBreve,
  MiddleDot,
  GreekAcute,
  GreekDiaeresis,
  GreekSmooth,
  GreekRough,
  GreekDiaeresisSmooth,
  GreekDiaeresisRough,
  GreekDiaeresisSmoothRough,
  GreekPerispomeni,
  GreekDiaeresisPerispomeni,
  GreekSmoothPerispomeni,
  GreekRoughPerispomeni,
  GreekDiaeresisSmoothPerispomeni,
  GreekDiaeresisRoughPerispomeni,
  GreekDiaeresisSmoothRoughPerispomeni,
  GreekTonos,
  GreekDialytikaTonos,
  GreekVaria,
  GreekOxia,
  GreekAlpha,
  GreekBeta,
  GreekGamma,
  GreekDelta,
  GreekEpsilon,
  GreekZeta,
  GreekEta,
  GreekTheta,
  GreekIota,
  GreekKappa,
  GreekLambda,
  GreekMu,
  GreekNu,
  GreekXi,
  GreekOmicron,
  GreekPi,
  GreekRho,
  GreekSigma,
  GreekTau,
  GreekUpsilon,
  GreekPhi,
  GreekChi,
  GreekPsi,
  GreekOmega,
  GreekAlphaAccent,
  GreekEpsilonAccent,
  GreekEtaAccent,
  GreekIotaAccent,
  GreekOmicronAccent,
  GreekUpsilonAccent,
  GreekOmegaAccent,
  GreekAlphaDiaeresis,
  GreekEpsilonDiaeresis,
  GreekEtaDiaeresis,
  GreekIotaDiaeresis,
  GreekOmicronDiaeresis,
  GreekUpsilonDiaeresis,
  GreekOmegaDiaeresis,
  GreekAlphaTonos,
  GreekEpsilonTonos,
  GreekEtaTonos,
  GreekIotaTonos,
  GreekOmicronTonos,
  GreekUpsilonTonos,
  GreekOmegaTonos,
  GreekAlphaOxia,
  GreekEpsilonOxia,
  GreekEtaOxia,
  GreekIotaOxia,
  GreekOmicronOxia,
  GreekUpsilonOxia,
  GreekOmegaOxia,
  GreekAlphaVaria,
  GreekEpsilonVaria,
  GreekEtaVaria,
  GreekIotaVaria,
  GreekOmicronVaria,
  GreekUpsilonVaria,
  GreekOmegaVaria,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/components/theme-provider';

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar: string;
  color: string;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'ai-models',
    title: 'AI Models',
    value: '45',
    change: 12,
    changeType: 'positive',
    icon: Brain,
    color: 'text-purple-500',
    description: 'Active AI models',
    trend: 'up',
  },
  {
    id: 'active-users',
    title: 'Active Users',
    value: '15.2K',
    change: 8.5,
    changeType: 'positive',
    icon: Users,
    color: 'text-blue-500',
    description: 'Currently online',
    trend: 'up',
  },
  {
    id: 'api-calls',
    title: 'API Calls',
    value: '2.1M',
    change: -2.1,
    changeType: 'negative',
    icon: Activity,
    color: 'text-green-500',
    description: 'Today',
    trend: 'down',
  },
  {
    id: 'uptime',
    title: 'Uptime',
    value: '99.9%',
    change: 0.1,
    changeType: 'positive',
    icon: Shield,
    color: 'text-emerald-500',
    description: 'This month',
    trend: 'stable',
  },
  {
    id: 'response-time',
    title: 'Response Time',
    value: '124ms',
    change: -15.3,
    changeType: 'positive',
    icon: Zap,
    color: 'text-yellow-500',
    description: 'Average',
    trend: 'up',
  },
  {
    id: 'satisfaction',
    title: 'Satisfaction',
    value: '4.9★',
    change: 2.2,
    changeType: 'positive',
    icon: Star,
    color: 'text-orange-500',
    description: 'User rating',
    trend: 'up',
  },
];

const activityItems: ActivityItem[] = [
  {
    id: '1',
    user: 'Alex Chen',
    action: 'used',
    target: 'GLM Orchestrator',
    timestamp: '2 minutes ago',
    avatar: '/avatars/01.png',
    color: 'text-purple-500',
  },
  {
    id: '2',
    user: 'Sarah Johnson',
    action: 'created',
    target: 'Premium Content',
    timestamp: '5 minutes ago',
    avatar: '/avatars/02.png',
    color: 'text-blue-500',
  },
  {
    id: '3',
    user: 'Mike Rodriguez',
    action: 'analyzed',
    target: 'Vision Intelligence',
    timestamp: '8 minutes ago',
    avatar: '/avatars/03.png',
    color: 'text-green-500',
  },
  {
    id: '4',
    user: 'Emma Wilson',
    action: 'optimized',
    target: 'Performance Engine',
    timestamp: '12 minutes ago',
    avatar: '/avatars/04.png',
    color: 'text-orange-500',
  },
  {
    id: '5',
    user: 'David Kim',
    action: 'tested',
    target: 'Security Shield',
    timestamp: '15 minutes ago',
    avatar: '/avatars/05.png',
    color: 'text-red-500',
  },
  {
    id: '6',
    user: 'Lisa Anderson',
    action: 'deployed',
    target: 'AI Model',
    timestamp: '18 minutes ago',
    avatar: '/avatars/06.png',
    color: 'text-indigo-500',
  },
];

const performanceMetrics: PerformanceMetric[] = [
  {
    id: 'cpu-usage',
    name: 'CPU Usage',
    value: 65,
    target: 80,
    unit: '%',
    status: 'good',
  },
  {
    id: 'memory-usage',
    name: 'Memory Usage',
    value: 78,
    target: 85,
    unit: '%',
    status: 'good',
  },
  {
    id: 'disk-usage',
    name: 'Disk Usage',
    value: 45,
    target: 90,
    unit: '%',
    status: 'excellent',
  },
  {
    id: 'network-latency',
    name: 'Network Latency',
    value: 120,
    target: 200,
    unit: 'ms',
    status: 'excellent',
  },
  {
    id: 'error-rate',
    name: 'Error Rate',
    value: 0.2,
    target: 1,
    unit: '%',
    status: 'excellent',
  },
  {
    id: 'throughput',
    name: 'Throughput',
    value: 850,
    target: 1000,
    unit: 'req/s',
    status: 'good',
  },
];

const PremiumDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    setLastRefresh(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/10';
      case 'good':
        return 'bg-blue-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'critical':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-purple-500/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Premium Dashboard
                </h1>
                <p className="text-sm text-gray-400">Real-time analytics and insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-gray-400 hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Select
                  value={refreshInterval.toString()}
                  onValueChange={value => setRefreshInterval(parseInt(value))}
                >
                  <SelectTrigger className="w-24 bg-gray-800/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1s</SelectItem>
                    <SelectItem value="5000">5s</SelectItem>
                    <SelectItem value="10000">10s</SelectItem>
                    <SelectItem value="30000">30s</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Last Refresh */}
              <div className="text-sm text-gray-400">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          {dashboardMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gray-700/50 group-hover:bg-purple-600/20 transition-colors`}
                    >
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    {getChangeIcon(metric.changeType)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{metric.value}</h3>
                      <span className={`text-sm ${getChangeColor(metric.changeType)}`}>
                        {metric.change > 0 ? '+' : ''}
                        {metric.change}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Performance */}
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      <span>System Performance</span>
                    </CardTitle>
                    <CardDescription>Real-time system metrics and health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceMetrics.map(metric => (
                      <div key={metric.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{metric.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${getStatusColor(metric.status)}`}>
                              {metric.value}
                              {metric.unit}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getStatusBg(metric.status)} border-0 text-xs`}
                            >
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress
                          value={(metric.value / metric.target) * 100}
                          className="h-2 bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0{metric.unit}</span>
                          <span>
                            Target: {metric.target}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription>Rapid access to essential features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                      <Brain className="h-4 w-4 mr-2" />
                      Launch GLM Orchestrator
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Content
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Analyze Image
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Optimize Performance
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-blue-400" />
                      <span>Server Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">99.9%</div>
                          <div className="text-sm text-gray-400">Uptime</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">124ms</div>
                          <div className="text-sm text-gray-400">Avg Response</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CPU Usage</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2 bg-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Memory Usage</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2 bg-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-green-400" />
                      <span>Database Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">99.8%</div>
                          <div className="text-sm text-gray-400">Query Success</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">45ms</div>
                          <div className="text-sm text-gray-400">Avg Query Time</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Connections</span>
                          <span>234</span>
                        </div>
                        <Progress value={75} className="h-2 bg-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Cache Hit Rate</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest user activities and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityItems.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                            {activity.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {activity.user} <span className="text-gray-400">{activity.action}</span>{' '}
                            <span className={activity.color}>{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-purple-400" />
                      <span>Usage Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-8 bg-gray-700/30 rounded-lg">
                        <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-400">Usage distribution chart</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-600/20 rounded-lg">
                          <div className="text-lg font-bold text-purple-400">45%</div>
                          <div className="text-xs text-gray-400">Content Creation</div>
                        </div>
                        <div className="text-center p-3 bg-blue-600/20 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">30%</div>
                          <div className="text-xs text-gray-400">Research & Analysis</div>
                        </div>
                        <div className="text-center p-3 bg-green-600/20 rounded-lg">
                          <div className="text-lg font-bold text-green-400">15%</div>
                          <div className="text-xs text-gray-400">Optimization</div>
                        </div>
                        <div className="text-center p-3 bg-orange-600/20 rounded-lg">
                          <div className="text-lg font-bold text-orange-400">10%</div>
                          <div className="text-xs text-gray-400">Security</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LineChart className="h-5 w-5 text-green-400" />
                      <span>Growth Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-8 bg-gray-700/30 rounded-lg">
                        <LineChart className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-400">Growth trend chart</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">User Growth</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">+23%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">API Usage</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">+45%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Revenue</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">+67%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default PremiumDashboard;
