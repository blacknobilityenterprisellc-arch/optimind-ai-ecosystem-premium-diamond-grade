/**
 * Premium Diamond Grade AI Capabilities Data
 *
 * Enterprise-grade AI capabilities configuration with
 * optimized performance and scalability.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

import {
  FileText,
  ImageIcon,
  Code,
  Search,
  Shield,
  Database,
} from "lucide-react";
import { AICapability } from "./DashboardDataHooks";

export const aiCapabilities: AICapability[] = [
  {
    id: "content-creation",
    title: "AI Content Creation",
    description: "Generate high-quality content with advanced AI models",
    icon: FileText,
    color: "text-blue-600",
    badge: "Premium",
    stats: "1,247 items",
    status: "active",
  },
  {
    id: "image-analysis",
    title: "Multi-Model Image Analysis",
    description: "Advanced image recognition and content moderation",
    icon: ImageIcon,
    color: "text-purple-600",
    badge: "Enterprise",
    stats: "99.2% accuracy",
    status: "active",
  },
  {
    id: "code-assistance",
    title: "AI Code Assistant",
    description: "Intelligent code generation and optimization",
    icon: Code,
    color: "text-green-600",
    stats: "45 languages",
    status: "active",
  },
  {
    id: "research-analysis",
    title: "Research & Analysis",
    description: "Deep research and competitive analysis",
    icon: Search,
    color: "text-orange-600",
    badge: "Beta",
    stats: "Real-time",
    status: "beta",
  },
  {
    id: "security-monitoring",
    title: "Security Monitoring",
    description: "Advanced threat detection and security analysis",
    icon: Shield,
    color: "text-red-600",
    badge: "Enterprise",
    stats: "24/7 monitoring",
    status: "active",
  },
  {
    id: "blockchain-storage",
    title: "Blockchain Storage",
    description: "Secure decentralized storage solutions",
    icon: Database,
    color: "text-indigo-600",
    stats: "Immutable",
    status: "coming-soon",
  },
];
