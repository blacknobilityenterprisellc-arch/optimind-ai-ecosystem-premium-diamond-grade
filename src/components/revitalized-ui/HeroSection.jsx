/**
 * OptiMind AI Ecosystem - Hero Section Component
 *
 * Visually striking hero section with compelling headlines and clear call-to-action
 * Features responsive design, smooth animations, and high contrast accessibility
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Shield,
  BarChart3,
  Users,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

const HeroSection = () => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Animated statistics
  const stats = [
    { label: 'AI Models', value: '45+', icon: Brain, color: 'from-blue-500 to-purple-600' },
    {
      label: 'Enterprise Clients',
      value: '1000+',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
    },
    { label: 'Uptime', value: '99.9%', icon: Shield, color: 'from-yellow-500 to-orange-600' },
    { label: 'Response Time', value: '<50ms', icon: Zap, color: 'from-purple-500 to-pink-600' },
  ];

  // Features highlights
  const highlights = [
    'Enterprise-Grade Security',
    'Lightning-Fast Performance',
    '45+ AI Models Integrated',
    '24/7 Premium Support',
    'Scalable Architecture',
    'Real-time Analytics',
  ];

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30" />

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
      </div>

      {/* Content Container */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Enterprise AI Ecosystem
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-gray-900">Transform Your Business with</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl lg:max-w-none"
              >
                Experience the future of AI-powered solutions with our premium, enterprise-grade
                platform designed for maximum performance and security.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <motion.button
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Explore Features</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group relative bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <Zap className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
                  <motion.div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-12"
              >
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">No Credit Card Required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">14-Day Free Trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Cancel Anytime</span>
                  </div>
                </div>

                {/* Customer Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">4.9/5 (2,847 reviews)</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              {/* Main Visual Card */}
              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Stat Display */}
                <div className="text-center mb-8">
                  <motion.div
                    key={currentStatIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center space-x-3 mb-4"
                  >
                    <div
                      className={clsx(
                        'w-16 h-16 rounded-2xl flex items-center justify-center',
                        `bg-gradient-to-r ${stats[currentStatIndex].color}`
                      )}
                    >
                      {React.createElement(stats[currentStatIndex].icon, {
                        className: 'h-8 w-8 text-white',
                      })}
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-gray-900">
                        {stats[currentStatIndex].value}
                      </div>
                      <div className="text-gray-600">{stats[currentStatIndex].label}</div>
                    </div>
                  </motion.div>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Why Choose OptiMind AI?
                  </h3>

                  {highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Demo Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="mt-8 text-center"
                >
                  <button className="group inline-flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                    <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Watch Demo</span>
                  </button>
                </motion.div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <TrendingUp className="h-8 w-8 text-white" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <BarChart3 className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
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

export default HeroSection;
