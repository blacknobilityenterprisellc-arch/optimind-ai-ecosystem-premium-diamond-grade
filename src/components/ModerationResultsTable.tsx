'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  ChevronRight
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

interface ModerationResultsTableProps {
  results: ModerationResult[];
  onViewDetails: (result: ModerationResult) => void;
  onExport: (results: ModerationResult[]) => void;
  loading?: boolean;
}

export function ModerationResultsTable({
  results,
  onViewDetails,
  onExport,
  loading = false
}: ModerationResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ModerationResult>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const itemsPerPage = 20;

  // Sort and paginate results
  const sortedAndPaginatedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => {
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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return sorted.slice(startIndex, endIndex);
  }, [results, sortField, sortDirection, currentPage]);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleSort = (field: keyof ModerationResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
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
  };

  const getActionBadge = (action: string) => {
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
  };

  const toggleResultSelection = (id: string) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedResults(newSelected);
  };

  const exportSelected = () => {
    const selectedData = results.filter(r => selectedResults.has(r.id));
    onExport(selectedData);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Moderation Results</CardTitle>
              <CardDescription>
                {results.length} total results found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedResults.size > 0 && (
                <Button variant="outline" onClick={exportSelected}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedResults.size})
                </Button>
              )}
              <Button variant="outline" onClick={() => onExport(results)}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedResults.size === sortedAndPaginatedResults.length && sortedAndPaginatedResults.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedResults(new Set(sortedAndPaginatedResults.map(r => r.id)));
                        } else {
                          setSelectedResults(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('imageId')}
                  >
                    <div className="flex items-center gap-1">
                      Image ID
                      {sortField === 'imageId' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center gap-1">
                      Confidence
                      {sortField === 'confidence' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Models</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'createdAt' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndPaginatedResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedResults.has(result.id)}
                        onChange={() => toggleResultSelection(result.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {result.imageId}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {result.filename}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(result.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={result.confidence * 100} className="w-16" />
                        <span className="text-sm">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActionBadge(result.recommendedAction)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {result.modelsUsed.slice(0, 2).map((model, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                        {result.modelsUsed.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.modelsUsed.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(result.createdAt).toLocaleDateString()}</div>
                        <div className="text-gray-500">
                          {new Date(result.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(result)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, results.length)} of{' '}
                {results.length} results
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