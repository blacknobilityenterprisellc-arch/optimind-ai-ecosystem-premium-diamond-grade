/**
 * OptiMind AI Ecosystem - Testimonials Section Component
 * 
 * Displays user testimonials with professional design and social proof
 * Features responsive layout, ratings, and credibility indicators
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Quote, 
  CheckCircle, 
  TrendingUp,
  Users,
  Award,
  Building2,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Play,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      company: 'Technology Corporation',
      avatar: 'SJ',
      content: 'OptiMind AI has completely transformed our workflow. The AI integration is seamless, and the performance is outstanding. We\'ve seen a 300% increase in productivity since implementation.',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      industry: 'Technology',
      results: '300% productivity increase',
      video: false
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager, StartupX',
      company: 'StartupX Inc.',
      avatar: 'MC',
      content: 'The most intuitive and powerful AI ecosystem we\'ve ever used. The user interface is clean, the features are robust, and the support team is exceptional. Highly recommended!',
      rating: 5,
      date: '1 month ago',
      verified: true,
      industry: 'Startup',
      results: '50% faster development',
      video: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Development Lead, DevStudio',
      company: 'DevStudio Pro',
      avatar: 'ER',
      content: 'The accessibility features and responsive design make it perfect for our diverse team. The real-time analytics have helped us make data-driven decisions faster than ever before.',
      rating: 5,
      date: '3 weeks ago',
      verified: true,
      industry: 'Development',
      results: 'Improved team collaboration',
      video: false
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'CEO, DataFlow Analytics',
      company: 'DataFlow Analytics',
      avatar: 'DT',
      content: 'Enterprise-grade security combined with lightning-fast performance. OptiMind AI has become the backbone of our data processing pipeline. Absolutely worth every penny.',
      rating: 5,
      date: '1 week ago',
      verified: true,
      industry: 'Analytics',
      results: '99.9% uptime achieved',
      video: true
    },
    {
      id: 5,
      name: 'Lisa Wang',
      role: 'Operations Director, GlobalTech',
      company: 'GlobalTech Solutions',
      avatar: 'LW',
      content: 'The scalability and reliability of OptiMind AI are unmatched. We\'ve scaled from 100 to 10,000 users without any performance degradation. Truly enterprise-grade solution.',
      rating: 5,
      date: '2 months ago',
      verified: true,
      industry: 'Enterprise',
      results: '100x user scaling',
      video: false
    }
  ];

  // Stats data
  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Reviews', value: '4.9/5', icon: Star },
    { label: 'Retention Rate', value: '98%', icon: TrendingUp },
    { label: 'Support Response', value: '<2min', icon: MessageSquare }
  ];

  // Auto-play testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20" />
      
      {/* Decorative Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Customer Success Stories
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Trusted by</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our satisfied customers who have transformed their businesses with OptiMind AI's powerful ecosystem.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Navigation Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.button
                    key={testimonial.id}
                    onClick={() => goToTestimonial(index)}
                    className={clsx(
                      'w-full text-left p-4 rounded-xl transition-all duration-300 group',
                      currentTestimonial === index
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        currentTestimonial === index
                          ? 'bg-white/20'
                          : 'bg-gradient-to-r from-purple-500 to-blue-600'
                      )}>
                        <span className={clsx(
                          'font-semibold text-sm',
                          currentTestimonial === index ? 'text-white' : 'text-white'
                        )}>
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={clsx(
                          'font-semibold truncate',
                          currentTestimonial === index ? 'text-white' : 'text-gray-900'
                        )}>
                          {testimonial.name}
                        </div>
                        <div className={clsx(
                          'text-sm truncate',
                          currentTestimonial === index ? 'text-purple-100' : 'text-gray-600'
                        )}>
                          {testimonial.role}
                        </div>
                      </div>
                      {currentTestimonial === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Main Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center opacity-50">
                  <Quote className="h-10 w-10 text-purple-600" />
                </div>

                {/* Testimonial Content */}
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {testimonials[currentTestimonial].avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {testimonials[currentTestimonial].name}
                      </h3>
                      <p className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {testimonials[currentTestimonial].company}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex space-x-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {testimonials[currentTestimonial].rating}/5.0
                    </span>
                    {testimonials[currentTestimonial].verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  {/* Results */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>{testimonials[currentTestimonial].results}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{testimonials[currentTestimonial].date}</span>
                    </div>
                  </div>

                  {/* Video Testimonial Option */}
                  {testimonials[currentTestimonial].video && (
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                      <Play className="h-4 w-4" />
                      <span>Watch Video Testimonial</span>
                    </button>
                  )}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToTestimonial(index)}
                        className={clsx(
                          'w-2 h-2 rounded-full transition-all duration-200',
                          currentTestimonial === index
                            ? 'bg-purple-600 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recognized by Industry Leaders
            </h3>
            
            <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 md:space-y-0 opacity-60">
              {[
                'G2 Crowd', 'Capterra', 'Software Advice', 'TrustRadius', 'PCMag', 'TechRadar'
              ].map((award, index) => (
                <motion.div
                  key={award}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-lg font-semibold text-gray-700"
                >
                  {award}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20 text-white"
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

export default TestimonialsSection;