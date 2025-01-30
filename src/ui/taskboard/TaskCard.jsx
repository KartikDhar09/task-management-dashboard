import React, { useState, useCallback, useMemo } from 'react';
import { Edit, Trash2, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Move color mapping outside component to prevent recreation
const ASSIGNEE_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800'
];

// Separate components for better organization and reusability
const TaskHeader = ({ title, isDarkMode, onEdit, task }) => (
  <h4 className={`font-semibold text-lg truncate ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
    {title}
  </h4>
);

const TaskDescription = ({ description, isExpanded, setIsExpanded, isDarkMode }) => (
  <div className={`rounded-md w-full overflow-hidden ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"}`}>
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center justify-between
        ${isDarkMode ? "hover:bg-gray-700/50 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
    >
      <span className="text-sm font-medium">Description</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
    </button>
    
    {isExpanded && (
      <div className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        <div className="text-sm break-words">
          <p className="whitespace-pre-wrap break-all w-full overflow-wrap-anywhere">
            {description}
          </p>
        </div>
      </div>
    )}
  </div>
);

const TaskCard = ({
  task,
  board,
  filteredBoards,
  isDarkMode,
  handleEditClick,
  handleDeleteClick,
  handleMoveTask,
  getPriorityStyles,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMoveDropdownOpen, setIsMoveDropdownOpen] = useState(false);

  if (!task?.$id) return null;

  const taskKey = task.$id || task.id || `${task.title}-${Date.now()}`;

  // Memoize the assignee color calculation
  const getAssigneeColor = useCallback((name) => {
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return ASSIGNEE_COLORS[charSum % ASSIGNEE_COLORS.length];
  }, []);

  // Memoize the filtered boards to prevent unnecessary recalculations
  const availableBoards = useMemo(() => 
    filteredBoards.filter(b => b.id !== board.id),
    [filteredBoards, board.id]
  );

  const performMoveTask = useCallback((targetBoardId) => {
    handleMoveTask(task.$id, board.id, targetBoardId);
    setIsMoveDropdownOpen(false);
  }, [task.$id, board.id, handleMoveTask]);

  const priorityStyles = useMemo(() => 
    getPriorityStyles(task.priority),
    [task.priority, getPriorityStyles]
  );

  return (
    <Card
      key={taskKey}
      className={`
        group hover:shadow-xl transition-all duration-300 border-l-4 max-w-full
        ${priorityStyles.border}
        ${isDarkMode ? 'bg-gray-800/60 border-opacity-70' : 'bg-white border-opacity-100'}
      `}
    >
      <CardContent className="p-4 pb-2">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between">
                <TaskHeader 
                  title={task.title} 
                  isDarkMode={isDarkMode} 
                  onEdit={() => handleEditClick(task)}
                />
                
                <TooltipProvider>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClick(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Task</TooltipContent>
                    </Tooltip>

                    <DropdownMenu 
                      open={isMoveDropdownOpen} 
                      onOpenChange={setIsMoveDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          Move to
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent align="end" className="w-48">
                        {availableBoards.map((b) => (
                          <DropdownMenuItem
                            key={b.id}
                            onSelect={() => performMoveTask(b.id)}
                            className="cursor-pointer"
                          >
                            {b.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(task.$id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Task</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>

              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`${priorityStyles.bg} ${priorityStyles.text} text-xs font-medium`}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>

          {task.description && (
            <TaskDescription
              description={task.description}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isDarkMode={isDarkMode}
            />
          )}

          {task.assignees?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5">
                <Users className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                {task.assignees.map((assignee, index) => (
                  <Badge
                    key={`${assignee}-${index}`}
                    variant="secondary"
                    className={`${getAssigneeColor(assignee)} text-xs font-medium`}
                  >
                    {assignee}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;