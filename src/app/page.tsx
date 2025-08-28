"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Target, 
  Globe, 
  Zap, 
  Shield, 
  BarChart3, 
  Image as ImageIcon, 
  FileText,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Brain,
  Settings,
  Crown,
  User,
  Eye,
  Smartphone,
  Activity,
  AlertTriangle,
  RefreshCw,
  Fingerprint,
  Lock,
  Monitor,
  MousePointer,
  Layers,
  Bolt,
  Sparkles,
  ThumbsUp,
  Loader2,
  Clock,
  Calendar,
  Award,
  Lightbulb,
  EyeOff,
  SmartphoneNfc,
  Battery,
  Wifi,
  WifiOff
} from "lucide-react";
import AIPoweredResearchStrategy from "@/components/AIPoweredResearchStrategy";
import ContentOptimizationRefresh from "@/components/ContentOptimizationRefresh";
import NonTextMultimodalOptimization from "@/components/NonTextMultimodalOptimization";

export default function Home() {
  const [activeTab, setActiveTab] = useState("seo");

  const features = [
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Advanced search engine optimization with AI-powered keyword research and content analysis",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Target,
      title: "AEO Enhancement",
      description: "Answer Engine Optimization to dominate voice search and featured snippets",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Globe,
      title: "GEO Targeting",
      description: "Generalized Engine Optimization for comprehensive digital presence management",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: ImageIcon,
      title: "AI Photo Enhancement",
      description: "Intelligent image enhancement and user-controlled content analysis",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: FileText,
      title: "Content Creation",
      description: "AI-powered content generation optimized for engagement and conversions",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description: "User-controlled privacy settings and customizable content preferences",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Brain,
      title: "AIO Optimization",
      description: "Artificial Intelligence Optimization for advanced automation and intelligent workflows",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Content Optimized", value: "2M+", icon: FileText },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Customer Rating", value: "4.9/5", icon: Star }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp Inc.",
      content: "OptiMind AI transformed our SEO strategy. Our organic traffic increased by 300% in just 3 months!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Content Manager",
      company: "Digital Agency Pro",
      content: "The AI-powered content creation tools are incredible. We've cut content production time by 70% while improving quality.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "E-commerce Manager",
      company: "ShopGlobal",
      content: "The GEO targeting features helped us expand into 5 new international markets. Absolutely essential for global growth.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Inclusive AI Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Advanced Intelligence for All Creators
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Powerful SEO, AEO, GEO, and AIO optimization with user-controlled privacy and content preferences. 
                  Create, optimize, and scale your digital presence with intelligent automation that respects your choices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Schedule Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-sm font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">50,000+</span> businesses trust OptiMind AI
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Optimization Dashboard</h3>
                    <Badge variant="outline">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {stats.slice(0, 3).map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                        <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SEO Score</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Quality</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Powerful AI-Driven Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to optimize your digital presence with user-controlled AI tools that respect your creative freedom
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Optimization Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Comprehensive Optimization Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized AI tools for every aspect of your digital optimization needs, with user-controlled preferences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="aeo">AEO</TabsTrigger>
              <TabsTrigger value="geo">GEO</TabsTrigger>
              <TabsTrigger value="aio">AIO</TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-6 h-6 text-green-600" />
                    SEO Optimization
                  </CardTitle>
                  <CardDescription>
                    Dominate search rankings with our comprehensive SEO suite
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "AI-powered keyword research",
                          "Competitor analysis",
                          "Content optimization",
                          "Technical SEO audits",
                          "Backlink strategy",
                          "Performance tracking"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Results:</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Average ranking improvement</span>
                          <span className="text-sm font-medium text-green-600">+45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Organic traffic growth</span>
                          <span className="text-sm font-medium text-green-600">+180%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion rate increase</span>
                          <span className="text-sm font-medium text-green-600">+65%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aeo" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    AEO Enhancement
                  </CardTitle>
                  <CardDescription>
                    Optimize for voice search and featured snippets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "Voice search optimization",
                          "Featured snippet targeting",
                          "Question-based content",
                          "Natural language processing",
                          "Schema markup generation",
                          "Answer box optimization"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Results:</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Featured snippets won</span>
                          <span className="text-sm font-medium text-blue-600">+85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Voice search visibility</span>
                          <span className="text-sm font-medium text-blue-600">+220%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Answer box appearances</span>
                          <span className="text-sm font-medium text-blue-600">+175%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geo" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-purple-600" />
                    GEO Targeting
                  </CardTitle>
                  <CardDescription>
                    Generalized Engine Optimization for comprehensive digital presence management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "Comprehensive engine optimization",
                          "Multi-platform integration",
                          "Cross-system automation",
                          "Advanced performance tuning",
                          "Unified management dashboard",
                          "Scalable infrastructure optimization"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Results:</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">System performance</span>
                          <span className="text-sm font-medium text-purple-600">+195%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Cross-platform efficiency</span>
                          <span className="text-sm font-medium text-purple-600">+310%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Infrastructure scalability</span>
                          <span className="text-sm font-medium text-purple-600">+125%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aio" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-cyan-600" />
                    AIO Optimization
                  </CardTitle>
                  <CardDescription>
                    Artificial Intelligence Optimization for advanced automation and intelligent workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {[
                          "Advanced AI automation",
                          "Intelligent workflow optimization",
                          "Multi-model ensemble analysis",
                          "Predictive analytics",
                          "User-controlled AI preferences",
                          "Adaptive learning systems"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Results:</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Automation efficiency</span>
                          <span className="text-sm font-medium text-cyan-600">+85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Workflow optimization</span>
                          <span className="text-sm font-medium text-cyan-600">+220%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">AI decision accuracy</span>
                          <span className="text-sm font-medium text-cyan-600">+175%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* AI-Powered Research & Strategy Module */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AIPoweredResearchStrategy />
        </div>
      </section>

      {/* Module 2: Content Optimization & Refresh */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ContentOptimizationRefresh />
        </div>
      </section>

      {/* Module 3: Non-Text & Multimodal Optimization */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <NonTextMultimodalOptimization />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what our customers have to say about their success with OptiMind AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Digital Strategy?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of businesses that are already using OptiMind AI to dominate their digital presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Book a Demo
              </Button>
            </div>
            <p className="text-sm opacity-75">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}