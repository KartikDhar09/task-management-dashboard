import React, { useState, useCallback, useMemo } from "react";
import {
  Plus,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Inbox,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard.jsx";
import EmptyState from "./EmptyState.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";
import LoadingScreen from "../LoadingScreen.jsx";
// Moved outside component to avoid recreation
const BOARD_COLORS = {
  newTasks: "violet",
  inProgress: "amber",
  done: "emerald",
};

// Moved outside component to avoid recreation


const TaskBoard = ({
  filteredBoards,
  
  isMobile,
 
}) => {
  const{isDarkMode}=useTheme()
  const [selectedBoardView, setSelectedBoardView] = useState("newTasks");
  const [expandedBoards, setExpandedBoards] = useState({});
const{ handleAddCard,
  handleEditClick,
  handleDeleteClick,
  handleMoveTask,
  getPriorityStyles,loading}=useTasks()
  const getBoardColor = useCallback((boardId) => {
    return BOARD_COLORS[boardId] || "slate";
  }, []);

  const toggleBoard = useCallback((boardId) => {
    setExpandedBoards((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
  }, []);

  // Memoize board buttons for mobile view
  const mobileBoardButtons = useMemo(() => {
    if (!isMobile) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-2 px-2 py-2 sticky top-0 z-10 bg-inherit">
        {filteredBoards.map((board) => (
          <MobileBoardButton
            key={board.id}
            board={board}
            selectedBoardView={selectedBoardView}
            isDarkMode={isDarkMode}
            getBoardColor={getBoardColor}
            onSelect={setSelectedBoardView}
          />
        ))}
      </div>
    );
  }, [filteredBoards, selectedBoardView, isDarkMode, isMobile]);

  return (
    <div className="flex flex-col h-full">
      {loading&&<LoadingScreen message={"loading tasks..."}/>}
      {mobileBoardButtons}
      <ScrollArea className="flex-1">
        <div className="px-4 py-6">
          <div className="flex flex-col gap-4 max-w-[1920px] mx-auto">
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
                selectedBoardView={selectedBoardView}
                isExpanded={expandedBoards[board.id]}
                handleAddCard={handleAddCard}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleMoveTask={handleMoveTask}
                getPriorityStyles={getPriorityStyles}
                getBoardColor={getBoardColor}
                onToggle={() => toggleBoard(board.id)}
                filteredBoards={filteredBoards}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Extracted to separate component for better memoization
const MobileBoardButton = React.memo(({ 
  board, 
  selectedBoardView, 
  isDarkMode, 
  getBoardColor, 
  onSelect 
}) => {
  const boardColor = getBoardColor(board.id);
  
  return (
    <Button
      variant={selectedBoardView === board.id ? "default" : "outline"}
      onClick={() => onSelect(board.id)}
      className={`
        w-auto max-w-[45%] flex-grow-0 flex-shrink-0 
        transition-all duration-200 text-sm
        ${
          selectedBoardView === board.id
            ? `bg-${boardColor}-500 hover:bg-${boardColor}-600 
               ${isDarkMode ? "text-white" : "text-black"} 
               shadow-md scale-100 md:scale-105 
               ring-1 md:ring-2 ring-${boardColor}-600`
            : isDarkMode
            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
            : "bg-gray-300 text-gray-700 hover:bg-gray-100"
        }
        overflow-hidden whitespace-nowrap text-ellipsis
      `}
    >
      <span className="truncate max-w-[100px]">{board.title}</span>
      <span className="inline-flex items-center justify-center min-w-[1.5rem] min-h-[1.5rem] px-1.5 py-0.5 text-[0.6rem] rounded-full bg-black/20 leading-none">
        {board.tasks.length}
      </span>
    </Button>
  );
});

// Extracted Board Card component
const BoardCard = React.memo(({
  board,
  isDarkMode,
  isMobile,
  selectedBoardView,
  isExpanded,
  handleAddCard,
  handleEditClick,
  handleDeleteClick,
  handleMoveTask,
  getPriorityStyles,
  getBoardColor,
  onToggle,
  filteredBoards,
}) => {
  const boardColor = getBoardColor(board.id);

  if (isMobile && board.id !== selectedBoardView) {
    return null;
  }

  return (
    <Card
      className={`
        flex flex-col
        backdrop-blur-sm backdrop-saturate-150
        transition-all duration-300 relative group
        ${
          isDarkMode
            ? "bg-gray-900/90 hover:bg-gray-900/95 border-gray-800"
            : "bg-white/90 hover:bg-white border-gray-200"
        }
      `}
    >
      <div
        className={`
          absolute inset-x-0 top-0 h-1 rounded-t-lg transition-colors
          bg-${boardColor}-500/80
          group-hover:bg-${boardColor}-500
        `}
      />
      <BoardHeader
        board={board}
        isDarkMode={isDarkMode}
        handleAddCard={handleAddCard}
        getBoardColor={getBoardColor}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <BoardContent
          board={board}
          isDarkMode={isDarkMode}
          handleAddCard={handleAddCard}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleMoveTask={handleMoveTask}
          getPriorityStyles={getPriorityStyles}
          filteredBoards={filteredBoards}
        />
      )}
    </Card>
  );
});

const BoardHeader = React.memo(({
  board,
  isDarkMode,
  handleAddCard,
  getBoardColor,
  isExpanded,
  onToggle,
}) => {
  const color = getBoardColor(board.id);

  // Select icon based on board type
  const BoardIcon =
    {
      newTasks: Clipboard,
      inProgress: Clock,
      done: CheckCircle,
    }[board.id] || Inbox; // Default to Inbox if no match

  return (
    <div
      onClick={onToggle}
      className={`
          flex items-center justify-between p-4 border-b cursor-pointer
          backdrop-blur-md transition-all duration-300
          ${
            isDarkMode
              ? "border-gray-800/40 bg-gray-900/95 hover:bg-gray-800/80"
              : "border-gray-200/40 bg-white/95 hover:bg-gray-50/80"
          }
        `}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <BoardIcon
            className={`
              w-5 h-5 opacity-60 
              transition-opacity duration-200
              ${isDarkMode ? "text-gray-400" : "text-gray-500"}
            `}
          />
          <div className="flex items-baseline gap-3">
            <h3
              className={`
                font-semibold text-base sm:text-lg tracking-tight
                transition-colors duration-200
                ${isDarkMode ? "text-gray-100" : "text-gray-900"}
              `}
            >
              {board.title}
            </h3>
            <span
              className={`
                px-2.5 py-1 text-xs font-medium rounded-full
                transition-all duration-200 
                ${
                  isDarkMode
                    ? `bg-${color}-500/10 text-${color}-300 ring-1 ring-${color}-500/20`
                    : `bg-${color}-50 text-${color}-700 ring-1 ring-${color}-200/50`
                }
                ${
                  board.tasks.length > 0
                    ? "opacity-100 scale-100"
                    : "opacity-80 scale-95"
                }
              `}
            >
              {board.tasks.length} {board.tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {board.id === "newTasks" && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddCard(board.id);
                  }}
                  className={`
                      p-2 rounded-lg transition-all duration-200
                      hover:shadow-sm active:scale-95 group
                      ${
                        isDarkMode
                          ? `hover:bg-${color}-500/20 text-${color}-400 hover:text-${color}-300`
                          : `hover:bg-${color}-50 text-${color}-600 hover:text-${color}-700`
                      }
                    `}
                >
                  <Plus
                    className={`
                      w-5 h-5 transition-transform duration-200
                      group-hover:scale-110 group-active:scale-90
                    `}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className={`
                    text-sm font-medium px-3 py-1.5
                    animate-in fade-in-0 zoom-in-95
                    ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-900 text-gray-100"
                    }
                  `}
              >
                Add new task
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 opacity-60" />
        ) : (
          <ChevronDown className="w-5 h-5 opacity-60" />
        )}
      </div>
    </div>
  );
});

const BoardContent =React.memo( ({
  board,
  isDarkMode,
  handleAddCard,
  handleEditClick,
  handleDeleteClick,
  handleMoveTask,
  getPriorityStyles,
  filteredBoards,
}) => (
  <div className="p-4">
    <div className="space-y-4">
      {board.tasks.length === 0 ? (
        <EmptyState
          boardId={board.id}
          isDarkMode={isDarkMode}
          onAddTask={() => handleAddCard(board.id)}
        />
      ) : (
        <div className="space-y-3">
          {board.tasks.map((task, taskIndex) => (
            <div
              key={`task-${task.id}-${board.id}-${taskIndex}`}
              className={`
                transition-all duration-200 transform
                hover:-translate-y-1 hover:shadow-lg
                ${taskIndex !== board.tasks.length - 1 ? "pb-2" : ""}
              `}
            >
              <TaskCard
                task={task}
                board={board}
                filteredBoards={filteredBoards}
                isDarkMode={isDarkMode}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleMoveTask={handleMoveTask}
                getPriorityStyles={getPriorityStyles}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
));

export default React.memo(TaskBoard);
