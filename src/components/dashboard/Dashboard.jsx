import React from 'react';

import TaskDistributionGraph from './TaskDistributionGraph.jsx';
import PriorityDistribution from './PriorityDistribution.jsx';
import StatisticsDashboard from './StatisticsDashboard.jsx';

export const Dashboard = ({ statusData, statistics }) => {
  return (
    
    <div className="grid grid-cols-1 place-items-center lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
      {/* Task Distribution Graph */}
      <TaskDistributionGraph 
        key="task-distribution-graph" 
        statusData={statusData} 
      />

      {/* Priority Distribution Chart */}
      <PriorityDistribution 
        key="priority-distribution" 
        statistics={statistics} 
      />

      {/* Statistics Dashboard */}
      <StatisticsDashboard 
        key="statistics-dashboard" 
        statistics={statistics} 
      />
    </div>
  );
};