/**
 * OptiMind AI Ecosystem - Contact Form Component
 * 
 * Fully accessible and functional contact form with validation
 * Features modern design, error handling, and user feedback
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Users,
  Shield,
  Zap,
  MessageCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    budget: '',
    timeline: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must be at least 2 characters and contain only letters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    company: {
      required: false,
      minLength: 2,
      message: 'Company name must be at least 2 characters'
    },
    phone: {
      required: false,
      pattern: /^[\d\s\-\+\(\)]+$/,
      message: 'Please enter a valid phone number'
    },
    subject: {
      required: true,
      minLength: 5,
      message: 'Subject must be at least 5 characters'
    },
    message: {
      required: true,
      minLength: 20,
      message: 'Message must be at least 20 characters'
    },
    budget: {
      required: false,
      message: ''
    },
    timeline: {
      required: false,
      message: ''
    }
  };

  // Budget options
  const budgetOptions = [
    { value: '', label: 'Select Budget Range' },
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: 'over-100k', label: 'Over $100,000' }
  ];

  // Timeline options
  const timelineOptions = [
    { value: '', label: 'Select Timeline' },
    { value: 'immediate', label: 'Immediate (Within 1 month)' },
    { value: '1-3-months', label: '1-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: '6-12-months', label: '6-12 months' },
    { value: 'flexible', label: 'Flexible' }
  ];

  // Validate single field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (value.trim() && rules.minLength && value.length < rules.minLength) {
      return rules.message;
    }

    if (value.trim() && rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    return '';
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setFormSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          budget: '',
          timeline: ''
        });
        setErrors({});
        setTouched({});
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['hello@optimind-ai.com', 'support@optimind-ai.com'],
      description: 'We typically respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 AI Innovation Drive', 'Tech City, TC 12345'],
      description: 'By appointment only'
    }
  ];

  // Service features
  const serviceFeatures = [
    { icon: Shield, title: 'Enterprise Security', description: 'Military-grade encryption' },
    { icon: Zap, title: 'Lightning Fast', description: '<50ms response time' },
    { icon: Users, title: '24/7 Support', description: 'Round-the-clock assistance' },
    { icon: Clock, title: 'Quick Setup', description: 'Start in minutes, not days' }
  ];

  if (formSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Message Sent Successfully!
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for reaching out to OptiMind AI. We've received your message and will get back to you within 24 hours.
              </p>
              
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Message delivered to our team</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Response within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Expert team assigned</span>
                </div>
              </div>
              
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Send Another Message
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20" />
      
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
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Get In Touch
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Get Started with</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              OptiMind AI
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your business? Get in touch with our team and let's discuss how we can help you achieve your goals.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={clsx(
                          'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                          errors.name && touched.name
                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        )}
                        placeholder="Your full name"
                        required
                        aria-invalid={errors.name && touched.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && touched[name] && (
                        <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={clsx(
                          'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                          errors.email && touched.email
                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        )}
                        placeholder="your@email.com"
                        required
                        aria-invalid={errors.email && touched.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && touched.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company and Phone Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={clsx(
                          'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                          errors.company && touched.company
                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        )}
                        placeholder="Your company name"
                        aria-invalid={errors.company && touched.company}
                        aria-describedby={errors.company ? 'company-error' : undefined}
                      />
                      {errors.company && touched.company && (
                        <p id="company-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.company}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={clsx(
                          'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                          errors.phone && touched.phone
                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        )}
                        placeholder="+1 (555) 123-4567"
                        aria-invalid={errors.phone && touched.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && touched.phone && (
                        <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={clsx(
                        'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                        errors.subject && touched.subject
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      )}
                      placeholder="How can we help you?"
                      required
                      aria-invalid={errors.subject && touched.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                    />
                    {errors.subject && touched.subject && (
                      <p id="subject-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Budget and Timeline Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        {budgetOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        {timelineOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={6}
                      className={clsx(
                        'w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none',
                        errors.message && touched.message
                          ? 'border-red-500 bg-red-50 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      )}
                      placeholder="Tell us about your project and requirements..."
                      required
                      aria-invalid={errors.message && touched.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && touched.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {/* Form Level Error */}
                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.submit}</span>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-8">
                  Reach out to us through any of the following channels. We're here to help you succeed.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-700 font-medium">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Service Features */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h4 className="font-semibold mb-4">Why Choose OptiMind AI?</h4>
                <div className="space-y-3">
                  {serviceFeatures.map((feature, index) => (
                    <div key={feature.title} className="flex items-center space-x-3">
                      <feature.icon className="h-5 w-5 text-blue-200" />
                      <div>
                        <div className="font-medium">{feature.title}</div>
                        <div className="text-sm text-blue-100">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="font-semibold text-red-900 mb-2">Emergency Support</h4>
                <p className="text-red-700 text-sm mb-3">
                  For urgent issues requiring immediate attention
                </p>
                <a 
                  href="tel:+15551234567" 
                  className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4" />
                  <span>Emergency Hotline</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;