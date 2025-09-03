"use client";

import { useState, useCallback } from "react";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Scale,
  FileUp,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { contractWiseService, ContractAnalysisRequest, ContractAnalysisResult } from "@/lib/contractwise-service";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";

interface ContractWiseAIProps {
  className?: string;
  onAnalysisComplete?: (result: ContractAnalysisResult) => void;
}

export function ContractWiseAI({ className = "", onAnalysisComplete }: ContractWiseAIProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contractHistory, setContractHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  
  // Form state
  const [contractTitle, setContractTitle] = useState("");
  const [contractType, setContractType] = useState("");
  const [contractText, setContractText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [industry, setIndustry] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [enableFileUpload, setEnableFileUpload] = useState(false);
  
  const { isPremium } = useSecureSubscription();

  const contractTypes = contractWiseService.getContractTypes();

  const handleAnalyze = useCallback(async () => {
    if (!isPremium) return;
    if (!contractTitle || !contractType) {
      setError("Contract title and type are required");
      return;
    }

    if (!contractText && !extractedText && !fileUrl) {
      setError("Contract text, extracted text, or file URL is required");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const request: ContractAnalysisRequest = {
        contractTitle,
        contractType,
        contractText: contractText || undefined,
        fileUrl: fileUrl || undefined,
        extractedText: extractedText || undefined,
        jurisdiction: jurisdiction || undefined,
        industry: industry || undefined,
        priority
      };

      // Simulate API call (in real implementation, this would call your backend)
      const mockResult: ContractAnalysisResult = {
        overview: {
          contractType,
          totalClauses: 12,
          riskLevel: "medium",
          overallConfidence: 0.87
        },
        riskAssessment: {
          highRiskClauses: [
            {
              clause: "Limitation of Liability",
              risk: "Excessive limitation caps may not be enforceable",
              severity: "high",
              recommendation: "Negotiate higher liability limits or add exceptions"
            }
          ],
          mediumRiskClauses: [
            {
              clause: "Termination Clause",
              risk: "Termination for convenience terms are unfavorable",
              severity: "medium",
              recommendation: "Add notice period requirements and exit conditions"
            }
          ],
          lowRiskClauses: [
            {
              clause: "Confidentiality",
              risk: "Standard confidentiality provisions",
              severity: "low",
              recommendation: "Clause is acceptable as written"
            }
          ]
        },
        clauses: {
          identified: [
            {
              type: "Payment Terms",
              title: "Payment Schedule",
              content: "Net 30 days from invoice date",
              importance: "critical"
            }
          ],
          missing: [
            {
              type: "Force Majeure",
              importance: "important",
              recommendation: "Add force majeure clause for unforeseen events"
            }
          ]
        },
        plainLanguage: {
          summary: "This is a standard service agreement with payment terms, confidentiality provisions, and termination clauses. The contract outlines obligations between parties but lacks some important protections.",
          keyPoints: [
            "Net 30 day payment terms",
            "Confidentiality obligations included",
            "Termination for convenience allowed",
            "Missing force majeure protection"
          ],
          simplifiedClauses: [
            {
              original: "Party A shall provide services as specified in Exhibit A",
              simplified: "Party A will provide the services listed in the attached exhibit"
            }
          ]
        },
        complianceCheck: {
          jurisdiction: jurisdiction || "Unknown",
          compliant: true,
          issues: []
        },
        recommendations: {
          immediate: ["Review liability limitation clause", "Add force majeure provision"],
          shortTerm: ["Negotiate better termination terms", "Add dispute resolution clause"],
          longTerm: ["Implement contract management system", "Regular contract reviews"],
          negotiationPoints: ["Liability limits", "Termination notice period", "Payment terms"]
        },
        metadata: {
          processingTime: 4500,
          modelsUsed: ["GPT-4o", "Claude 3.5 Sonnet", "GLM-4 Flagship"],
          confidence: 0.87,
          cost: 45.5
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAnalysisResult(mockResult);
      onAnalysisComplete?.(mockResult);
      
      // Add to history
      setContractHistory(prev => [
        {
          id: `contract-${Date.now()}`,
          title: contractTitle,
          type: contractType,
          riskLevel: mockResult.overview.riskLevel,
          confidence: mockResult.overview.overallConfidence,
          createdAt: new Date(),
          cost: mockResult.metadata.cost
        },
        ...prev.slice(0, 9) // Keep last 10 items
      ]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Contract analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    contractTitle,
    contractType,
    contractText,
    fileUrl,
    extractedText,
    jurisdiction,
    industry,
    priority,
    isPremium,
    onAnalysisComplete
  ]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return <CheckCircle className="w-4 h-4" />;
      case "medium": return <AlertTriangle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isPremium) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">ContractWise AI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced AI-powered contract analysis, risk assessment, and compliance monitoring for small businesses
            </p>
            <div className="space-y-3 text-left text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Risk assessment and clause analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Plain language translation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Compliance monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Negotiation recommendations</span>
              </div>
            </div>
            <Button className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  ContractWise AI
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Legal AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered contract analysis, risk assessment, and compliance monitoring
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showHistory ? "Hide History" : "Show History"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAnalysisResult(null);
                  setError(null);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contract History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            {contractHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No contract analyses yet
              </p>
            ) : (
              <div className="space-y-3">
                {contractHistory.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contract.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {contract.type} • {contract.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={getRiskLevelColor(contract.riskLevel)}
                      >
                        {getRiskLevelIcon(contract.riskLevel)}
                        {contract.riskLevel} risk
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(contract.confidence * 100)}% confidence
                      </Badge>
                      <Badge variant="outline">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${contract.cost.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze">Analyze Contract</TabsTrigger>
          <TabsTrigger value="templates">Generate Template</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          {!analysisResult ? (
            /* Analysis Form */
            <Card>
              <CardHeader>
                <CardTitle>Analyze Contract</CardTitle>
                <CardDescription>
                  Upload or paste your contract for comprehensive AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractTitle">Contract Title *</Label>
                    <Input
                      id="contractTitle"
                      value={contractTitle}
                      onChange={(e) => setContractTitle(e.target.value)}
                      placeholder="e.g., Service Agreement with ABC Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Contract Type *</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jurisdiction">Jurisdiction</Label>
                    <Input
                      id="jurisdiction"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      placeholder="e.g., California, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Standard analysis</SelectItem>
                      <SelectItem value="medium">Medium - Enhanced analysis</SelectItem>
                      <SelectItem value="high">High - Comprehensive analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fileUpload"
                      checked={enableFileUpload}
                      onCheckedChange={setEnableFileUpload}
                    />
                    <Label htmlFor="fileUpload">Enable File Upload</Label>
                  </div>
                </div>

                {enableFileUpload ? (
                  <div className="space-y-2">
                    <Label htmlFor="fileUrl">File URL</Label>
                    <Input
                      id="fileUrl"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://example.com/contract.pdf"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="contractText">Contract Text</Label>
                    <Textarea
                      id="contractText"
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      placeholder="Paste your contract text here..."
                      rows={8}
                    />
                  </div>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !contractTitle || !contractType || (!contractText && !fileUrl)}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Contract...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Analyze Contract
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Analysis Results
                      <Badge
                        variant="outline"
                        className={getRiskLevelColor(analysisResult.overview.riskLevel)}
                      >
                        {getRiskLevelIcon(analysisResult.overview.riskLevel)}
                        {analysisResult.overview.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {(analysisResult.metadata.processingTime / 1000).toFixed(1)}s
                      </Badge>
                      <Badge variant="outline">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${analysisResult.metadata.cost.toFixed(2)}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(analysisResult.overview.overallConfidence)}>
                        {Math.round(analysisResult.overview.overallConfidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{analysisResult.overview.totalClauses}</p>
                      <p className="text-sm text-muted-foreground">Total Clauses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{analysisResult.riskAssessment.highRiskClauses.length}</p>
                      <p className="text-sm text-muted-foreground">High Risk</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{analysisResult.riskAssessment.mediumRiskClauses.length}</p>
                      <p className="text-sm text-muted-foreground">Medium Risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.riskAssessment.highRiskClauses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">High Risk Clauses</h4>
                      <div className="space-y-2">
                        {analysisResult.riskAssessment.highRiskClauses.map((clause, index) => (
                          <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{clause.clause}</p>
                                <p className="text-sm text-red-700">{clause.risk}</p>
                                <p className="text-sm text-red-600 mt-1">{clause.recommendation}</p>
                              </div>
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                HIGH
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.riskAssessment.mediumRiskClauses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Medium Risk Clauses</h4>
                      <div className="space-y-2">
                        {analysisResult.riskAssessment.mediumRiskClauses.map((clause, index) => (
                          <div key={index} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{clause.clause}</p>
                                <p className="text-sm text-yellow-700">{clause.risk}</p>
                                <p className="text-sm text-yellow-600 mt-1">{clause.recommendation}</p>
                              </div>
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                MEDIUM
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.riskAssessment.lowRiskClauses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Low Risk Clauses</h4>
                      <div className="space-y-2">
                        {analysisResult.riskAssessment.lowRiskClauses.map((clause, index) => (
                          <div key={index} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{clause.clause}</p>
                                <p className="text-sm text-green-700">{clause.risk}</p>
                                <p className="text-sm text-green-600 mt-1">{clause.recommendation}</p>
                              </div>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                LOW
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Immediate Actions</h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.immediate.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2">Short-term Goals</h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.shortTerm.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Long-term Strategy</h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.longTerm.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-purple-600 mb-2">Negotiation Points</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendations.negotiationPoints.map((point, index) => (
                        <Badge key={index} variant="outline" className="text-purple-600 border-purple-600">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Contract Template</CardTitle>
              <CardDescription>
                Create customized contract templates based on your requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateType">Contract Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateJurisdiction">Jurisdiction</Label>
                  <Input
                    id="templateJurisdiction"
                    placeholder="e.g., California, USA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe any special requirements or custom clauses needed..."
                  rows={4}
                />
              </div>

              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}