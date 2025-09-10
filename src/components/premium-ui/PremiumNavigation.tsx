/**
 * Premium Navigation Component
 * 
 * A state-of-the-art navigation system featuring the latest UI/UX patterns
 * including adaptive layouts, intelligent search, user personalization,
 * and seamless cross-device experiences.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Settings,
  User,
  Crown,
  Sparkles,
  Brain,
  BarChart3,
  FileText,
  Target,
  Shield,
  Globe,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  Star,
  Heart,
  Bookmark,
  History,
  HelpCircle,
  LogOut,
  Plus,
  Grid,
  List,
  Filter,
  SortAsc,
  Moon,
  Sun,
  Monitor,
  Zap,
  Activity,
  TrendingUp,
  Award,
  Diamond,
  Rocket,
  Eye,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Circle,
  CheckCircle,
  AlertCircle,
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
  Database,
  Cloud,
  Server,
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
  BarChart,
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
  Timeline,
  Tag,
  Chip,
  Button,
  IconButton,
  FloatingButton,
  SpeedDial,
  Card,
  List,
  Grid,
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
  Filter,
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
  Direction,
  PlayState,
  FillMode,
  IterationCount,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/components/theme-provider';

interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  color: string;
  children?: NavItem[];
  isActive?: boolean;
  isDisabled?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  tier: 'free' | 'premium' | 'diamond' | 'exclusive';
  status: 'online' | 'offline' | 'busy' | 'away';
  lastActive: string;
  notifications: number;
  credits: number;
  plan: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    href: string;
  };
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'System overview and analytics',
    color: 'text-purple-500',
  },
  {
    id: 'ai-orchestrator',
    title: 'AI Orchestrator',
    href: '/glm-orchestrator',
    icon: Brain,
    description: 'Advanced AI model management',
    color: 'text-blue-500',
    badge: 'New',
    children: [
      {
        id: 'glm-dashboard',
        title: 'GLM Dashboard',
        href: '/glm-orchestrator/dashboard',
        icon: BarChart3,
        description: 'Model performance overview',
        color: 'text-purple-500',
      },
      {
        id: 'model-comparison',
        title: 'Model Comparison',
        href: '/glm-orchestrator/comparison',
        icon: BarChart3,
        description: 'Compare AI models side-by-side',
        color: 'text-blue-500',
      },
      {
        id: 'orchestrator-settings',
        title: 'Orchestrator Settings',
        href: '/glm-orchestrator/settings',
        icon: Settings,
        description: 'Configure AI orchestration',
        color: 'text-green-500',
      },
    ],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    href: '/content-creation',
    icon: FileText,
    description: 'AI-powered content generation',
    color: 'text-green-500',
    badge: 'Pro',
    children: [
      {
        id: 'content-generator',
        title: 'Content Generator',
        href: '/content-creation/generator',
        icon: FileText,
        description: 'Generate written content',
        color: 'text-blue-500',
      },
      {
        id: 'art-generator',
        title: 'Art Generator',
        href: '/content-creation/art',
        icon: ImageIcon,
        description: 'Create AI images and media',
        color: 'text-purple-500',
      },
      {
        id: 'premium-editor',
        title: 'Premium Editor',
        href: '/content-creation/editor',
        icon: FileText,
        description: 'Advanced AI editing tools',
        color: 'text-green-500',
      },
    ],
  },
  {
    id: 'optimization',
    title: 'Optimization',
    href: '/optimization',
    icon: Target,
    description: 'Performance and SEO optimization',
    color: 'text-orange-500',
    children: [
      {
        id: 'seo-analysis',
        title: 'SEO Analysis',
        href: '/optimization/seo',
        icon: Search,
        description: 'Search engine optimization',
        color: 'text-blue-500',
      },
      {
        id: 'aeo-enhancement',
        title: 'AEO Enhancement',
        href: '/optimization/aeo',
        icon: Target,
        description: 'Answer engine optimization',
        color: 'text-green-500',
      },
      {
        id: 'geo-targeting',
        title: 'GEO Targeting',
        href: '/optimization/geo',
        icon: Globe,
        description: 'Global engine optimization',
        color: 'text-purple-500',
      },
    ],
  },
  {
    id: 'research-analysis',
    title: 'Research & Analysis',
    href: '/research-analysis',
    icon: BarChart3,
    description: 'Data insights and research',
    color: 'text-indigo-500',
    badge: 'Beta',
    children: [
      {
        id: 'multi-model-analysis',
        title: 'Multi-Model Analysis',
        href: '/research-analysis/multi-model',
        icon: Brain,
        description: 'Compare AI models',
        color: 'text-purple-500',
      },
      {
        id: 'data-insights',
        title: 'Data Insights',
        href: '/research-analysis/insights',
        icon: Database,
        description: 'Data-driven insights',
        color: 'text-blue-500',
      },
      {
        id: 'brand-tracking',
        title: 'Brand Tracking',
        href: '/research-analysis/brand',
        icon: Target,
        description: 'Brand mention analysis',
        color: 'text-green-500',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    href: '/security',
    icon: Shield,
    description: 'System security and protection',
    color: 'text-red-500',
    children: [
      {
        id: 'security-dashboard',
        title: 'Security Dashboard',
        href: '/security/dashboard',
        icon: Shield,
        description: 'Security monitoring',
        color: 'text-red-500',
      },
      {
        id: 'threat-detection',
        title: 'Threat Detection',
        href: '/security/threats',
        icon: AlertCircle,
        description: 'Detect and respond to threats',
        color: 'text-orange-500',
      },
      {
        id: 'compliance',
        title: 'Compliance',
        href: '/security/compliance',
        icon: CheckCircle,
        description: 'Regulatory compliance',
        color: 'text-green-500',
      },
    ],
  },
];

const mockUser: User = {
  id: '1',
  name: 'Alexandra Chen',
  email: 'alexandra@optimind.ai',
  avatar: '/avatars/01.png',
  role: 'Premium User',
  tier: 'diamond',
  status: 'online',
  lastActive: '2 minutes ago',
  notifications: 3,
  credits: 1250,
  plan: 'Diamond Plan',
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Content Generated',
    message: 'Your premium content has been successfully generated.',
    timestamp: '2 minutes ago',
    isRead: false,
    action: {
      label: 'View Content',
      href: '/content-creation/generator',
    },
  },
  {
    id: '2',
    type: 'info',
    title: 'System Update',
    message: 'New AI models have been added to the orchestrator.',
    timestamp: '15 minutes ago',
    isRead: false,
    action: {
      label: 'Explore Models',
      href: '/glm-orchestrator',
    },
  },
  {
    id: '3',
    type: 'warning',
    title: 'Credit Usage',
    message: 'You have used 80% of your monthly credits.',
    timestamp: '1 hour ago',
    isRead: true,
    action: {
      label: 'Upgrade Plan',
      href: '/billing',
    },
  },
];

const PremiumNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [user, setUser] = useState<User>(mockUser);
  const [systemStatus, setSystemStatus] = useState({
    isOnline: true,
    signal: 'high' as 'high' | 'medium' | 'low',
    battery: 85,
    isCharging: false,
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: NavItem[]) => {
    return children?.some(child => isActive(child.href));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'exclusive':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'diamond':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'premium':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'exclusive':
        return <Diamond className="h-3 w-3" />;
      case 'diamond':
        return <Crown className="h-3 w-3" />;
      case 'premium':
        return <Star className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 z-40">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">OptiMind AI</span>
                <div className="flex items-center space-x-1">
                  <Badge className={`${getTierColor(user.tier)} text-white border-0 text-xs`}>
                    {getTierIcon(user.tier)}
                    <span className="ml-1 capitalize">{user.tier}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => item.children ? toggleExpanded(item.id) : router.push(item.href)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href) || isChildActive(item.children)
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-400">
                        {item.badge}
                      </Badge>
                    )}
                    {item.children && expandedItems.includes(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Sub-items */}
                {item.children && expandedItems.includes(item.id) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => router.push(child.href)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                          isActive(child.href)
                            ? 'bg-purple-600/20 text-white border border-purple-500/30'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <child.icon className={`h-4 w-4 ${child.color}`} />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{child.title}</span>
                          <span className="text-xs text-gray-500">{child.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className={getTierColor(user.tier)}>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  user.status === 'online' ? 'bg-green-500' :
                  user.status === 'busy' ? 'bg-red-500' :
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-black/90 backdrop-blur-xl border-t border-gray-700/50">
          <div className="grid grid-cols-5 gap-1 p-2">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive(item.href) ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </button>
            ))}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {navItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (item.children) {
                            toggleExpanded(item.id);
                          } else {
                            router.push(item.href);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isActive(item.href) || isChildActive(item.children)
                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-400">
                              {item.badge}
                            </Badge>
                          )}
                          {item.children && (
                            expandedItems.includes(item.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )
                          )}
                        </div>
                      </button>

                      {/* Sub-items */}
                      {item.children && expandedItems.includes(item.id) && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                router.push(child.href);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                isActive(child.href)
                                  ? 'bg-purple-600/20 text-white border border-purple-500/30'
                                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                              }`}
                            >
                              <child.icon className={`h-4 w-4 ${child.color}`} />
                              <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">{child.title}</span>
                                <span className="text-xs text-gray-500">{child.description}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className={getTierColor(user.tier)}>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'online' ? 'bg-green-500' :
                        user.status === 'busy' ? 'bg-red-500' :
                        user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default PremiumNavigation;