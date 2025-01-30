import React, { useRef, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const SearchResultItem = memo(({ task }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors duration-200"
  >
    <div className="flex items-start justify-between ">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
          {task.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
          {task.description}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          PRIORITY_STYLES[task.priority]
        } whitespace-nowrap`}
      >
        {task.priority}
      </span>
    </div>
    {task.assignees?.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {task.assignees.map((assignee, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            <User className="w-3 h-3 mr-1" />
            {assignee}
          </span>
        ))}
      </div>
    )}
  </motion.div>
));

export const SearchResults = memo(({ searchQuery, tasks, isSearchFocused }) => {
  const parentRef = useRef(null);

  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    const terms = searchQuery.toLowerCase().split(" ").filter(Boolean);
    return tasks.filter(task => {
      const searchText = [
        task.title,
        task.description,
        task.priority,
        ...(task.assignees || []),
      ].join(" ").toLowerCase();
      return terms.every(term => searchText.includes(term));
    });
  }, [searchQuery, tasks]);

  const getResultHeight = useCallback((result) => {
    return result.assignees?.length > 0 ? 128 : 88;
  }, []);

  const virtualizer = useVirtualizer({
    count: filteredResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => getResultHeight(filteredResults[index]),
    overscan: 5,
  });

  const getMaxHeight = useCallback(() => {
    const totalResults = filteredResults.length;
    if (totalResults === 0) return 0;
    const maxItems = Math.min(totalResults, 5);
    const estimatedHeight = filteredResults
      .slice(0, maxItems)
      .reduce((acc, result) => acc + getResultHeight(result), 0);
    return Math.min(estimatedHeight, 400);
  }, [filteredResults, getResultHeight]);

  if (!isSearchFocused || !searchQuery) return null;

  return (
    <Card className="absolute z-50 mt-2 w-full shadow-lg border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        {filteredResults.length > 0 ? (
          <ScrollArea
            ref={parentRef}
            className="overflow-auto"
            style={{ height: `${getMaxHeight()}px` }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={filteredResults[virtualRow.index].$id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <SearchResultItem task={filteredResults[virtualRow.index]} />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No results found
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SearchResults.displayName = 'SearchResults';
SearchResultItem.displayName = 'SearchResultItem';
