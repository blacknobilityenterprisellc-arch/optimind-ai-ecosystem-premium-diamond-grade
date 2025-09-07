'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Brain,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Code,
  MessageSquare,
  Palette,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterOptions {
  status: string[];
  type: string[];
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export default function SearchAndFilter({
  onSearch,
  onFilter,
  onClearFilters,
  totalResults,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    type: [],
    dateRange: 'all',
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const statusOptions = [
    {
      value: 'success',
      label: 'Success',
      color: 'bg-green-100 text-green-800',
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-800',
    },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'info', label: 'Info', color: 'bg-gray-100 text-gray-800' },
  ];

  const typeOptions = [
    { value: 'content', label: 'Content', icon: FileText },
    { value: 'optimization', label: 'Optimization', icon: Target },
    { value: 'research', label: 'Research', icon: Brain },
    { value: 'image', label: 'Image', icon: ImageIcon },
    { value: 'voice', label: 'Voice', icon: Mic },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'design', label: 'Design', icon: Palette },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'type', label: 'Type' },
    { value: 'status', label: 'Status' },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];

    const newFilters = { ...filters, status: newStatuses };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];

    const newFilters = { ...filters, type: newTypes };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDateRangeChange = (dateRange: string) => {
    const newFilters = { ...filters, dateRange };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = {
      ...filters,
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc',
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    const resetFilters: FilterOptions = {
      status: [],
      type: [],
      dateRange: 'all',
      sortBy: 'timestamp',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    setSearchQuery('');
    onClearFilters();
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.type.length > 0 ||
    filters.dateRange !== 'all' ||
    searchQuery;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{totalResults} results</span>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search activities, alerts, or metrics..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="space-y-6 border-t pt-4">
            {/* Status Filters */}
            <div>
              <h4 className="text-sm font-medium mb-3">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant={filters.status.includes(option.value) ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      filters.status.includes(option.value) ? option.color : ''
                    }`}
                    onClick={() => handleStatusToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <h4 className="text-sm font-medium mb-3">Type</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {typeOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <Badge
                      key={option.value}
                      variant={filters.type.includes(option.value) ? 'default' : 'outline'}
                      className="cursor-pointer justify-center p-2"
                      onClick={() => handleTypeToggle(option.value)}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {option.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Date Range and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Date Range</h4>
                <div className="flex flex-wrap gap-2">
                  {dateRangeOptions.map(option => (
                    <Badge
                      key={option.value}
                      variant={filters.dateRange === option.value ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleDateRangeChange(option.value)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map(option => (
                    <Badge
                      key={option.value}
                      variant={filters.sortBy === option.value ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                      {filters.sortBy === option.value && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center">
                Search: "{searchQuery}"
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleSearch('')} />
              </Badge>
            )}
            {filters.status.map(status => {
              const option = statusOptions.find(opt => opt.value === status);
              return (
                <Badge key={status} variant="secondary" className="flex items-center">
                  Status: {option?.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => handleStatusToggle(status)}
                  />
                </Badge>
              );
            })}
            {filters.type.map(type => {
              const option = typeOptions.find(opt => opt.value === type);
              return (
                <Badge key={type} variant="secondary" className="flex items-center">
                  Type: {option?.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => handleTypeToggle(type)}
                  />
                </Badge>
              );
            })}
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center">
                Date: {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => handleDateRangeChange('all')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
