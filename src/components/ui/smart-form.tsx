'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface FormField {
  name: string;
  value: string;
  type: string;
  required?: boolean;
  validation?: string;
}

interface ValidationResults {
  overallScore: number;
  fieldValidations: Array<{
    fieldName: string;
    isValid: boolean;
    issues: string[];
    suggestions: string[];
    improvedValue?: string;
  }>;
  recommendations: string[];
  summary: string;
}

interface SmartFormProps {
  className?: string;
}

export function SmartForm({ className }: SmartFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '',
    website: ''
  });

  const [enhancementType, setEnhancementType] = useState('professional');
  const [enhancedText, setEnhancedText] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [enhancementInfo, setEnhancementInfo] = useState<{
    model: string;
    cost: number;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  } | null>(null);

  const formFields: FormField[] = [
    { name: 'name', value: formData.name, type: 'text', required: true },
    { name: 'email', value: formData.email, type: 'email', required: true, validation: 'email format' },
    { name: 'phone', value: formData.phone, type: 'tel', validation: 'phone format' },
    { name: 'message', value: formData.message, type: 'textarea', required: true },
    { name: 'company', value: formData.company, type: 'text' },
    { name: 'website', value: formData.website, type: 'url', validation: 'url format' }
  ];

  const enhancementTypes = [
    { value: 'grammar', label: 'Grammar & Spelling' },
    { value: 'clarity', label: 'Clarity & Readability' },
    { value: 'professional', label: 'Professional Tone' },
    { value: 'creative', label: 'Creative Writing' },
    { value: 'concise', label: 'More Concise' },
    { value: 'expand', label: 'More Detailed' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const enhanceText = async (text: string) => {
    if (!text.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          enhancement: enhancementType,
          context: 'Form field enhancement for better user experience'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEnhancedText(data.enhancedText);
        setEnhancementInfo({
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to enhance text: ' + data.error);
      }
    } catch (error) {
      console.error('Error enhancing text:', error);
      alert('Error enhancing text');
    } finally {
      setIsEnhancing(false);
    }
  };

  const validateForm = async () => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: formFields,
          formType: 'contact',
          context: 'Contact form for business inquiries'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setValidationResults(data.validationResults);
      } else {
        alert('Failed to validate form: ' + data.error);
      }
    } catch (error) {
      console.error('Error validating form:', error);
      alert('Error validating form');
    } finally {
      setIsValidating(false);
    }
  };

  const applyEnhancedText = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: enhancedText }));
    setEnhancedText('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Smart Form</TabsTrigger>
          <TabsTrigger value="enhance">Text Enhancement</TabsTrigger>
          <TabsTrigger value="validate">Form Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Contact Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => enhanceText(formData.name)}
                      disabled={isEnhancing || !formData.name}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => enhanceText(formData.email)}
                      disabled={isEnhancing || !formData.email}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => enhanceText(formData.phone)}
                      disabled={isEnhancing || !formData.phone}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => enhanceText(formData.company)}
                      disabled={isEnhancing || !formData.company}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => enhanceText(formData.website)}
                    disabled={isEnhancing || !formData.website}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message *</label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => enhanceText(formData.message)}
                    disabled={isEnhancing || !formData.message}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={validateForm} disabled={isValidating}>
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate Form'
                  )}
                </Button>
                <Button variant="outline">Submit Form</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Enhancement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enhancement Type</label>
                <Select value={enhancementType} onValueChange={setEnhancementType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enhancementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Text to Enhance</label>
                <Textarea
                  placeholder="Enter text to enhance..."
                  value={enhancedText || ''}
                  onChange={(e) => setEnhancedText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => enhanceText(enhancedText)} 
                disabled={isEnhancing || !enhancedText}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Enhance Text
                  </>
                )}
              </Button>

              {enhancedText && enhancementInfo && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Model: {enhancementInfo.model}</Badge>
                    <Badge variant="secondary">Cost: ${enhancementInfo.cost.toFixed(4)}</Badge>
                    <Badge variant="secondary">Tokens: {enhancementInfo.usage.totalTokens}</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enhanced Text</label>
                    <div className="p-4 border rounded-md bg-muted">
                      <p className="whitespace-pre-wrap">{enhancedText}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Apply to the most recently edited field
                        const lastField = Object.keys(formData).reduce((a, b) => 
                          formData[a as keyof typeof formData] ? a : b
                        );
                        applyEnhancedText(lastField);
                      }}
                    >
                      Apply to Form Field
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {validationResults ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">
                      Score: <span className={getScoreColor(validationResults.overallScore)}>
                        {validationResults.overallScore}/100
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            validationResults.overallScore >= 80 ? 'bg-green-500' :
                            validationResults.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${validationResults.overallScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{validationResults.summary}</AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Field-by-Field Analysis</h4>
                    {validationResults.fieldValidations.map((field, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{field.fieldName}</span>
                          {field.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {field.issues.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-red-600">Issues:</span>
                            <ul className="text-sm text-red-600 list-disc list-inside">
                              {field.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {field.suggestions.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-blue-600">Suggestions:</span>
                            <ul className="text-sm text-blue-600 list-disc list-inside">
                              {field.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {field.improvedValue && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-green-600">Improved Value:</span>
                            <p className="text-sm bg-green-50 p-2 rounded mt-1">{field.improvedValue}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {validationResults.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">General Recommendations</h4>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        {validationResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No validation results yet. Click "Validate Form" to analyze your form data.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}