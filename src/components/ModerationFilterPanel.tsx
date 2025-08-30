'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Tag, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

export interface FilterState {
  search: string;
  status: string[];
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
  confidence: {
    min: number;
    max: number;
  };
  models: string[];
  actions: string[];
  reviewers: string[];
}

interface ModerationFilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  onExport: () => void;
  onReset: () => void;
  totalResults: number;
  filteredResults: number;
}

export function ModerationFilterPanel({
  onFilterChange,
  onExport,
  onReset,
  totalResults,
  filteredResults
}: ModerationFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    categories: [],
    dateRange: {
      start: '',
      end: ''
    },
    confidence: {
      min: 0,
      max: 100
    },
    models: [],
    actions: [],
    reviewers: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'safe', label: 'Safe', color: 'bg-green-100 text-green-800' },
    { value: 'flagged', label: 'Flagged', color: 'bg-red-100 text-red-800' },
    { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'quarantined', label: 'Quarantined', color: 'bg-orange-100 text-orange-800' }
  ];

  const categoryOptions = [
    'sexual_nudity',
    'child_exposed',
    'violence',
    'hate_speech',
    'deepfake_suspected',
    'harassment',
    'spam',
    'copyright',
    'misinformation',
    'self_harm'
  ];

  const modelOptions = [
    'GLM-4.5V',
    'GLM-4.5-AIR',
    'GLM-4.5',
    'Consensus'
  ];

  const actionOptions = [
    'allow',
    'monitor',
    'quarantine',
    'hold_for_review'
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const hasActiveFilters = () => {
    return filters.search !== '' ||
           filters.status.length > 0 ||
           filters.categories.length > 0 ||
           filters.dateRange.start !== '' ||
           filters.dateRange.end !== '' ||
           filters.models.length > 0 ||
           filters.actions.length > 0 ||
           filters.reviewers.length > 0;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    count += filters.status.length;
    count += filters.categories.length;
    if (filters.dateRange.start) count++;
    if (filters.dateRange.end) count++;
    count += filters.models.length;
    count += filters.actions.length;
    count += filters.reviewers.length;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Quick Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by image ID, filename, or reviewer..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: {filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              {filters.status.map(status => (
                <Badge key={status} variant="outline" className="flex items-center gap-1">
                  Status: {status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('status', status)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="outline" className="flex items-center gap-1">
                  Category: {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('categories', category)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
            <CardDescription>
              Filter moderation results by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['status', 'categories']} className="space-y-4">
              
              {/* Status Filter */}
              <AccordionItem value="status">
                <AccordionTrigger className="text-sm font-medium">
                  Status
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statusOptions.map(option => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.status.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('status', option.value)}
                        />
                        <Badge variant="outline" className={option.color}>
                          {option.label}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Categories Filter */}
              <AccordionItem value="categories">
                <AccordionTrigger className="text-sm font-medium">
                  Content Categories
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {categoryOptions.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleArrayFilter('categories', category)}
                        />
                        <span className="text-sm">{category.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Date Range Filter */}
              <AccordionItem value="date">
                <AccordionTrigger className="text-sm font-medium">
                  Date Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Models Filter */}
              <AccordionItem value="models">
                <AccordionTrigger className="text-sm font-medium">
                  AI Models
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {modelOptions.map(model => (
                      <label key={model} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.models.includes(model)}
                          onCheckedChange={() => toggleArrayFilter('models', model)}
                        />
                        <span className="text-sm">{model}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Actions Filter */}
              <AccordionItem value="actions">
                <AccordionTrigger className="text-sm font-medium">
                  Recommended Actions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {actionOptions.map(action => (
                      <label key={action} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.actions.includes(action)}
                          onCheckedChange={() => toggleArrayFilter('actions', action)}
                        />
                        <span className="text-sm capitalize">{action.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Showing </span>
                <span className="font-semibold">{filteredResults.toLocaleString()}</span>
                <span className="text-sm text-gray-600"> of </span>
                <span className="font-semibold">{totalResults.toLocaleString()}</span>
                <span className="text-sm text-gray-600"> results</span>
              </div>
              {hasActiveFilters() && (
                <Badge variant="outline">
                  {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}