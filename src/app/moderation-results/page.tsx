'use client';

import { useState, useEffect, useMemo } from 'react';
import { ModerationFilterPanel, FilterState } from '@/components/ModerationFilterPanel';
import { ModerationResultsTable } from '@/components/ModerationResultsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  BarChart3, 
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface ModerationResult {
  id: string;
  imageId: string;
  filename: string;
  status: 'safe' | 'flagged' | 'pending' | 'quarantined';
  category: string;
  confidence: number;
  recommendedAction: string;
  modelsUsed: string[];
  reviewer?: string;
  reviewDate?: string;
  createdAt: string;
  processingTime: number;
  thumbnail?: string;
  reasons: string[];
}

// Mock data for demonstration
const mockResults: ModerationResult[] = [
  {
    id: '1',
    imageId: 'mod_1640995200000_abc123',
    filename: 'image_001.jpg',
    status: 'safe',
    category: 'safe_content',
    confidence: 0.95,
    recommendedAction: 'allow',
    modelsUsed: ['GLM-4.5V', 'GLM-4.5-AIR', 'GLM-4.5'],
    createdAt: '2024-01-15T10:30:00Z',
    processingTime: 3.2,
    reasons: ['No sensitive content detected', 'All models agree on safe classification']
  },
  {
    id: '2',
    imageId: 'mod_1640995260000_def456',
    filename: 'image_002.jpg',
    status: 'flagged',
    category: 'sexual_nudity',
    confidence: 0.87,
    recommendedAction: 'quarantine',
    modelsUsed: ['GLM-4.5V', 'GLM-4.5-AIR', 'GLM-4.5'],
    createdAt: '2024-01-15T10:31:00Z',
    processingTime: 4.1,
    reasons: ['Adult content detected by multiple models', 'High confidence in classification']
  },
  {
    id: '3',
    imageId: 'mod_1640995320000_ghi789',
    filename: 'image_003.jpg',
    status: 'pending',
    category: 'deepfake_suspected',
    confidence: 0.72,
    recommendedAction: 'hold_for_review',
    modelsUsed: ['GLM-4.5V', 'GLM-4.5-AIR'],
    createdAt: '2024-01-15T10:32:00Z',
    processingTime: 5.8,
    reasons: ['Potential deepfake detected', 'Requires human verification', 'Model disagreement on confidence']
  },
  {
    id: '4',
    imageId: 'mod_1640995380000_jkl012',
    filename: 'image_004.jpg',
    status: 'safe',
    category: 'safe_content',
    confidence: 0.91,
    recommendedAction: 'allow',
    modelsUsed: ['GLM-4.5V', 'GLM-4.5'],
    createdAt: '2024-01-15T10:33:00Z',
    processingTime: 2.9,
    reasons: ['Clear safe content', 'No policy violations detected']
  },
  {
    id: '5',
    imageId: 'mod_1640995440000_mno345',
    filename: 'image_005.jpg',
    status: 'quarantined',
    category: 'violence',
    confidence: 0.93,
    recommendedAction: 'quarantine',
    modelsUsed: ['GLM-4.5V', 'GLM-4.5-AIR', 'GLM-4.5'],
    createdAt: '2024-01-15T10:34:00Z',
    processingTime: 3.7,
    reasons: ['Violent content detected', 'Immediate action required', 'All models in agreement']
  }
];

export default function ModerationResultsPage() {
  const [results, setResults] = useState<ModerationResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ModerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ModerationResult | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
      setFilteredResults(mockResults);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...results];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(result => 
        result.imageId.toLowerCase().includes(searchLower) ||
        result.filename.toLowerCase().includes(searchLower) ||
        result.reviewer?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(result => filters.status.includes(result.status));
    }

    // Categories filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(result => filters.categories.includes(result.category));
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(result => new Date(result.createdAt) >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(result => new Date(result.createdAt) <= endDate);
    }

    // Confidence filter
    filtered = filtered.filter(result => 
      result.confidence >= filters.confidence.min / 100 &&
      result.confidence <= filters.confidence.max / 100
    );

    // Models filter
    if (filters.models.length > 0) {
      filtered = filtered.filter(result => 
        filters.models.some(model => result.modelsUsed.includes(model))
      );
    }

    // Actions filter
    if (filters.actions.length > 0) {
      filtered = filtered.filter(result => filters.actions.includes(result.recommendedAction));
    }

    setFilteredResults(filtered);
  };

  const handleExport = (resultsToExport: ModerationResult[]) => {
    // Create CSV content
    const headers = [
      'Image ID', 'Filename', 'Status', 'Category', 'Confidence', 
      'Recommended Action', 'Models Used', 'Created At', 'Processing Time', 'Reasons'
    ];
    
    const csvContent = [
      headers.join(','),
      ...resultsToExport.map(result => [
        result.imageId,
        result.filename,
        result.status,
        result.category,
        result.confidence,
        result.recommendedAction,
        result.modelsUsed.join(';'),
        result.createdAt,
        result.processingTime,
        `"${result.reasons.join('; ')}"`
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moderation_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFilteredResults(results);
  };

  const handleViewDetails = (result: ModerationResult) => {
    setSelectedResult(result);
    // In a real app, this would open a modal or navigate to a detail page
    console.log('View details for:', result);
  };

  const stats = useMemo(() => {
    const total = results.length;
    const safe = results.filter(r => r.status === 'safe').length;
    const flagged = results.filter(r => r.status === 'flagged').length;
    const pending = results.filter(r => r.status === 'pending').length;
    const quarantined = results.filter(r => r.status === 'quarantined').length;
    
    return { total, safe, flagged, pending, quarantined };
  }, [results]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Moderation Results</h1>
            <p className="text-muted-foreground">
              Browse and filter content moderation analysis results
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe</p>
                  <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quarantined</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.quarantined}</p>
                </div>
                <Filter className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Panel */}
      <ModerationFilterPanel
        onFilterChange={handleFilterChange}
        onExport={() => handleExport(filteredResults)}
        onReset={handleReset}
        totalResults={results.length}
        filteredResults={filteredResults.length}
      />

      {/* Results Table */}
      <ModerationResultsTable
        results={filteredResults}
        onViewDetails={handleViewDetails}
        onExport={handleExport}
        loading={loading}
      />

      {/* Selected Result Details (Modal would go here) */}
      {selectedResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result Details</CardTitle>
            <CardDescription>Detailed information for {selectedResult.imageId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Image ID:</strong> {selectedResult.imageId}</div>
                  <div><strong>Filename:</strong> {selectedResult.filename}</div>
                  <div><strong>Status:</strong> {selectedResult.status}</div>
                  <div><strong>Category:</strong> {selectedResult.category}</div>
                  <div><strong>Confidence:</strong> {(selectedResult.confidence * 100).toFixed(1)}%</div>
                  <div><strong>Action:</strong> {selectedResult.recommendedAction}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analysis Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Models Used:</strong> {selectedResult.modelsUsed.join(', ')}</div>
                  <div><strong>Processing Time:</strong> {selectedResult.processingTime}s</div>
                  <div><strong>Created:</strong> {new Date(selectedResult.createdAt).toLocaleString()}</div>
                  {selectedResult.reviewer && (
                    <div><strong>Reviewer:</strong> {selectedResult.reviewer}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Reasons</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {selectedResult.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}