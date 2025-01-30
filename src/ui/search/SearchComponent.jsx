import React, { useState, useCallback, memo } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchResults } from './SearchResults.jsx';

export const SearchComponent = memo(({
  onSearchUpdate,
  tasks,
  className,
  onClose,
  isMobile = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchUpdate = useCallback((query) => {
    setSearchQuery(query);
    if (!query) {
      onSearchUpdate([], false);
      return;
    }

    const terms = query.toLowerCase().split(" ").filter(Boolean);
    const matches = tasks.filter(task => {
      const searchText = [
        task.title,
        task.description,
        task.priority,
        ...(task.assignees || []),
      ].join(" ").toLowerCase();
      
      return terms.every(term => searchText.includes(term));
    });

    onSearchUpdate(matches, true);
  }, [tasks, onSearchUpdate]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    onSearchUpdate([], false);
  }, [onSearchUpdate]);

  const handleSearchFocus = useCallback((focused) => {
    setIsSearchFocused(focused);
    if (!focused && !searchQuery) {
      onSearchUpdate([], false);
    }
  }, [searchQuery, onSearchUpdate]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Search 
          className={`absolute ${isMobile ? 'left-10' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500`} 
        />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearchUpdate(e.target.value)}
          onFocus={() => handleSearchFocus(true)}
          onBlur={() => setTimeout(() => handleSearchFocus(false), 200)}
          placeholder="Search tasks..."
          className={`${isMobile ? 'pl-16' : 'pl-10'} pr-8 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/20`}
        />
        {searchQuery && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isSearchFocused && searchQuery && (
        <SearchResults 
          searchQuery={searchQuery} 
          tasks={tasks} 
          isSearchFocused={isSearchFocused} 
        />
      )}
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';
