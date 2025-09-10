/**
 * OptiMind AI Ecosystem - Features Section Component
 * 
 * Displays 3-4 key features using professional cards with icons
 * Features responsive grid layout, hover effects, and accessibility
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3,
  Users,
  Cpu,
  Database,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';

const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Main features data
  const features = [
    {
      id: 'ai-intelligence',
      icon: Brain,
      title: 'Advanced AI Intelligence',
      description: 'Harness the power of 45+ AI models with intelligent orchestration and optimization for maximum efficiency.',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stats: { label: 'AI Models', value: '45+' },
      highlights: [
        'Multi-Model Processing',
        'Intelligent Routing',
        'Real-time Optimization',
        'Scalable Architecture'
      ]
    },
    {
      id: 'enterprise-security',
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Military-grade encryption with zero-trust architecture and comprehensive compliance frameworks.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stats: { label: 'Security Score', value: 'A+' },
      highlights: [
        'Zero-Trust Architecture',
        'SOC 2 Compliant',
        'End-to-End Encryption',
        '24/7 Monitoring'
      ]
    },
    {
      id: 'lightning-performance',
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Sub-2 second load times with optimized caching, responsive design, and global CDN delivery.',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      stats: { label: 'Response Time', value: '<50ms' },
      highlights: [
        'Global CDN',
        'Advanced Caching',
        'Optimized Assets',
        'Real-time Monitoring'
      ]
    },
    {
      id: 'real-time-analytics',
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with live metrics, predictive insights, and customizable reporting.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      stats: { label: 'Data Points', value: '1M+' },
      highlights: [
        'Live Dashboards',
        'Predictive Analytics',
        'Custom Reports',
        'Data Visualization'
      ]
    }
  ];

  // Additional features
  const additionalFeatures = [
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless team workflows with real-time collaboration tools.'
    },
    {
      icon: Cpu,
      title: 'Smart Automation',
      description: 'AI-powered automation for repetitive tasks and workflows.'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Secure data storage with advanced backup and recovery.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Worldwide infrastructure with multi-region deployment.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      
      {/* Decorative Shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Powerful Features for</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive suite of tools and capabilities that make OptiMind AI the perfect choice for organizations seeking excellence in AI-powered solutions.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={clsx(
                'relative h-full rounded-2xl p-6 border-2 transition-all duration-300',
                'bg-white shadow-lg hover:shadow-2xl',
                feature.borderColor,
                hoveredFeature === feature.id ? 'border-blue-400 scale-105' : 'hover:border-blue-300'
              )}>
                {/* Feature Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                    `bg-gradient-to-r ${feature.color}`
                  )}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Feature Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stats Badge */}
                <div className={clsx(
                  'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium mb-4',
                  feature.bgColor
                )}>
                  <span className="text-gray-700">{feature.stats.label}</span>
                  <span className={clsx(
                    'font-bold',
                    feature.color.includes('blue') ? 'text-blue-600' :
                    feature.color.includes('green') ? 'text-green-600' :
                    feature.color.includes('yellow') ? 'text-yellow-600' :
                    'text-purple-600'
                  )}>
                    {feature.stats.value}
                  </span>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute top-6 right-6"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: hoveredFeature === feature.id ? 1 : 0,
                    x: hoveredFeature === feature.id ? 0 : -10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Even More Powerful Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore additional capabilities that make OptiMind AI the comprehensive solution for your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Seamless Integration
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              OptiMind AI integrates seamlessly with your existing tools and workflows, ensuring a smooth transition and immediate productivity gains.
            </p>
            
            <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 md:space-y-0">
              {[
                'Slack', 'Microsoft Teams', 'Google Workspace', 'Salesforce', 'HubSpot', 'Zapier'
              ].map((tool, index) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 font-medium"
                >
                  {tool}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20 text-gray-50"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default FeaturesSection;