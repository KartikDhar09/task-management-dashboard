// src/components/dashboard/Dashboard.jsx
import React from 'react';
import TaskDistributionGraph from './TaskDistributionGraph.jsx';
import PriorityDistribution from './PriorityDistribution.jsx';
import StatisticsDashboard from './StatisticsDashboard.jsx';

export const Dashboard = ({ statusData, statistics }) => {
  return (
    <div className="grid grid-cols-1 place-items-center lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
      <TaskDistributionGraph key="task-distribution-graph" statusData={statusData} />
      <PriorityDistribution key="priority-distribution" statistics={statistics} />
      <StatisticsDashboard key="statistics-dashboard" statistics={statistics} />
    </div>
  );
};
