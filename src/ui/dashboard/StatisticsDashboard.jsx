import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardList, CheckCircle, Clock, ListTodo, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTheme } from '../../context/ThemeContext.jsx';

// Move stats configuration outside component to prevent recreation
const STATS_CONFIG = [
  {
    title: 'Total Tasks',
    key: 'totalTasks',
    Icon: ClipboardList,
    color: '#3b82f6',
  },
  {
    title: 'Completed',
    key: 'completedTasks',
    Icon: CheckCircle,
    color: '#22c55e',
  },
  {
    title: 'In Progress',
    key: 'inProgressTasks',
    Icon: Clock,
    color: '#f59e0b',
  },
  {
    title: 'New Tasks',
    key: 'newTasks',
    Icon: ListTodo,
    color: '#a855f7',
  }
];

const StatCard = ({ title, value, Icon, color }) => (
  <div
    className="p-4 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 active:scale-95"
    style={{ 
      backgroundColor: `${color}15`,
      borderLeft: `4px solid ${color}`
    }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium" style={{ color }}>
          {title}
        </p>
        <p className="text-2xl font-bold mt-2" style={{ color }}>
          {value}
        </p>
      </div>
      <Icon 
        className="w-10 h-10 opacity-30" 
        color={color} 
        strokeWidth={1.5}
      />
    </div>
  </div>
);

const StatisticsDashboard = ({ statistics }) => {
  const [isOpen, setIsOpen] = useState(false);
const{isDarkMode}=useTheme()
  const statsData = useMemo(() => 
    STATS_CONFIG.map(config => ({
      ...config,
      value: statistics[config.key] ?? 0
    })),
    [statistics]
  );

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full max-w-4xl mx-auto"
    >
      <Card className={`w-full shadow-xl transition-colors duration-200 ${
        isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white'
      }`}>
        <CollapsibleTrigger asChild>
          <CardHeader 
            className="pb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyPress}
            aria-expanded={isOpen}
            aria-controls="stats-content"
          >
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Task Statistics
              </CardTitle>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent id="stats-content">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
              {statsData.map(({ key, ...statProps }) => (
                <StatCard
                  key={key}
                  {...statProps}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default StatisticsDashboard;