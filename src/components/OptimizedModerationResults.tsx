'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  VirtualList,
  ProgressiveImage,
  LazyLoadComponent,
  useDebounce,
  useThrottle,
  useVirtualScroll
} from '@/lib/performance-optimization.tsx';
import { 
  Eye, 
  Download, 
  MoreHorizontal, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  BarChart3,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

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

interface OptimizedModerationResultsProps {
  results: ModerationResult[];
  onViewDetails: (result: ModerationResult) => void;
  onExport: (results: ModerationResult[]) => void;
  loading?: boolean;
  itemHeight?: number;
  containerHeight?: number;
}

export function OptimizedModerationResults({
  results,
  onViewDetails,
  onExport,
  loading = false,
  itemHeight = 80,
  containerHeight = 600
}: OptimizedModerationResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ModerationResult>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    categories: [] as string[]
  });

  const itemsPerPage = 50;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter and sort results with memoization
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
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

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(result => filters.categories.includes(result.category));
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [results, debouncedSearchTerm, filters, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(startIndex, endIndex);

  // Throttled handlers
  const handleSort = useThrottle((field: keyof ModerationResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, 300);

  const toggleResultSelection = useCallback((id: string) => {
    setSelectedResults(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const exportSelected = useCallback(() => {
    const selectedData = results.filter(r => selectedResults.has(r.id));
    onExport(selectedData);
  }, [results, selectedResults, onExport]);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'safe':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Safe
          </Badge>
        );
      case 'flagged':
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'quarantined':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Shield className="h-3 w-3 mr-1" />
            Quarantined
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  }, []);

  const getActionBadge = useCallback((action: string) => {
    const colors: Record<string, string> = {
      allow: 'bg-green-100 text-green-800',
      monitor: 'bg-blue-100 text-blue-800',
      quarantine: 'bg-red-100 text-red-800',
      hold_for_review: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colors[action] || 'bg-gray-100 text-gray-800'}>
        {action.replace('_', ' ')}
      </Badge>
    );
  }, []);

  // Optimized row renderer for virtual list
  const renderResultRow = useCallback((result: ModerationResult, index: number) => (
    <div
      key={result.id}
      className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selectedResults.has(result.id)}
        onChange={() => toggleResultSelection(result.id)}
        className="rounded border-gray-300"
      />

      {/* Thumbnail */}
      <div className="w-12 h-12 flex-shrink-0">
        {result.thumbnail ? (
          <ProgressiveImage
            src={result.thumbnail}
            alt={result.filename}
            className="w-full h-full object-cover rounded"
            strategy={{ type: 'lazy' }}
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">No img</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-sm truncate">{result.imageId}</span>
          {getStatusBadge(result.status)}
        </div>
        <p className="text-sm text-gray-600 truncate">{result.filename}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {result.category.replace('_', ' ')}
          </Badge>
          {getActionBadge(result.recommendedAction)}
        </div>
      </div>

      {/* Confidence */}
      <div className="w-24">
        <Progress value={result.confidence * 100} className="h-2" />
        <span className="text-xs text-gray-500 mt-1 block text-center">
          {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>

      {/* Models */}
      <div className="w-32">
        <div className="flex flex-wrap gap-1">
          {result.modelsUsed.slice(0, 2).map((model, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {model}
            </Badge>
          ))}
          {result.modelsUsed.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{result.modelsUsed.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="w-32 text-sm">
        <div>{new Date(result.createdAt).toLocaleDateString()}</div>
        <div className="text-gray-500">
          {new Date(result.createdAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(result)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ), [selectedResults, toggleResultSelection, getStatusBadge, getActionBadge, onViewDetails]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Optimized Results</CardTitle>
              <CardDescription>
                {filteredAndSortedResults.length} results found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedResults.size > 0 && (
                <Button variant="outline" onClick={exportSelected}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedResults.size})
                </Button>
              )}
              <Button variant="outline" onClick={() => onExport(filteredAndSortedResults)}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by image ID, filename, or reviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Quick Filters */}
            <select
              multiple
              value={filters.status}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, status: selected }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="safe">Safe</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
              <option value="quarantined">Quarantined</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Virtual List for Results */}
      <Card>
        <CardContent className="p-0">
          <LazyLoadComponent strategy={{ type: 'eager' }}>
            <VirtualList
              items={paginatedResults}
              itemHeight={itemHeight}
              containerHeight={containerHeight}
              renderItem={renderResultRow}
              overscan={5}
              className="border rounded-lg"
            />
          </LazyLoadComponent>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedResults.length)} of{' '}
                {filteredAndSortedResults.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}