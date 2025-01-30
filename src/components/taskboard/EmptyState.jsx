import React, { useMemo } from 'react';

import { Plus, ArrowRight, Info, MoveRight, ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { useTheme } from '../../context/ThemeContext.jsx';

const EMPTY_STATES = {
  newTasks: {
    icon: ClipboardList, 
    title: "Start Your Task List", 
    description: "Ready to get organized? Create your first task to get started.",
    hasButton: true 
  },
  inProgress: {
    icon: MoveRight, 
    title: "No Tasks In Progress",
    description: "Move tasks here when you start working on them.",
    message: "Tasks will appear here when in progress"
  },
  completed: {
    icon: Info, 
    title: "No Completed Tasks",
    description: "Tasks will appear here once they're done.",
    message: "Move tasks here when they're completed"
  }
};

const EmptyState = ({ boardId = 'completed', onAddTask }) => {
 const{isDarkMode}=useTheme()
  const content = useMemo(() => EMPTY_STATES[boardId] || EMPTY_STATES.completed, [boardId]);

  const themeClasses = {
    container: cn(
      'relative p-8 rounded-xl border-2 border-dashed',
      'transition-all duration-300 transform hover:scale-[1.02]', // Adds a hover effect for slight scaling.
      isDarkMode ? 'border-gray-700 bg-gray-800/50 text-gray-300' : 'border-gray-200 bg-gray-50/80 text-gray-600'
    ),
    iconWrapper: cn(
      'p-4 rounded-full',
      isDarkMode ? 'bg-gray-700/50 text-purple-400' : 'bg-purple-50 text-purple-500'
    ),
    title: cn(
      'text-xl font-semibold bg-clip-text text-transparent',
      isDarkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-purple-600 to-blue-600'
    ),
    description: cn(
      'text-sm max-w-sm text-center',
      isDarkMode ? 'text-gray-400' : 'text-gray-500'
    ),
    button: cn(
      'mt-6',
      isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
    )
  };

  const IconComponent = content.icon;

  const renderAction = () => {
    if (content.hasButton) {
      return (
        <Button onClick={onAddTask} className={themeClasses.button}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Task
        </Button>
      );
    }

    return (
      <div className="mt-6 flex items-center justify-center text-sm">
        <ArrowRight className="w-4 h-4 mr-2" />
        <span>{content.message}</span>
      </div>
    );
  };

  return (
    <div className={themeClasses.container}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={themeClasses.iconWrapper}>
          <IconComponent className="w-12 h-12" />
        </div>
        <h3 className={themeClasses.title}>{content.title}</h3>
        <p className={themeClasses.description}>{content.description}</p>
        {renderAction()}
      </div>
    </div>
  );
};

export default EmptyState;
