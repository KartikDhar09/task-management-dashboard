import React, { useState, useMemo } from 'react';

import { AlertTriangle, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';


const PRIORITY_CONFIGS = {
  High: { color: '#ef4444', icon: AlertCircle },     // Red for high priority
  Medium: { color: '#f59e0b', icon: AlertTriangle }, // Amber for medium priority
  Low: { color: '#22c55e', icon: CheckCircle2 }      // Green for low priority
};


const CustomTooltip = ({ active, payload, totalTasks }) => {
  if (!active || !payload?.length) return null;

  const { name, value, color } = payload[0].payload;
  const percentage = ((value / totalTasks) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full shadow-md"
            style={{ backgroundColor: color }}
          />
          <p className="font-bold text-gray-800 dark:text-gray-200">{name}</p>
        </div>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>Tasks: {value}</p>
          <p>Percentage: {percentage}%</p>
        </div>
      </div>
    </div>
  );
};


const PriorityDistribution = ({ statistics }) => {

  const [isOpen, setIsOpen] = useState(false);
  
  const priorityData = useMemo(() => 
    Object.entries(PRIORITY_CONFIGS).map(([priority, config]) => ({
      name: `${priority} Priority`,
      value: statistics.priorities[priority] || 0,
      color: config.color,
      icon: config.icon
    })), [statistics.priorities]
  );
  
  const totalTasks = useMemo(() => 
    priorityData.reduce((sum, item) => sum + item.value, 0),
    [priorityData]
  );

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="w-full shadow-xl dark:bg-gray-900 dark:border-gray-800">
        <CollapsibleTrigger asChild>
          <CardHeader 
            className="pb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Priority Distribution
              </CardTitle>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4">
            <div className="relative w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius="55%"    
                    outerRadius="80%"
                    paddingAngle={5}     
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    animationDuration={1000}
                    role="img"
                    aria-label="Priority distribution pie chart"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-75"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <CustomTooltip {...props} totalTasks={totalTasks} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {priorityData.map(({ name, value, color, icon: Icon }) => (
                <div
                  key={name}
                  className="transform transition-transform hover:scale-105 active:scale-95"
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm"
                    style={{
                      borderColor: color,
                      backgroundColor: `${color}15`, 
                    }}
                  >
                    <Icon 
                      className="w-4 h-4" 
                      color={color} 
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({value})
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PriorityDistribution;