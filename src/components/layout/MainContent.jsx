import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext.jsx';

import { Dashboard } from '../dashboard/Dashboard.jsx';
import { ErrorAlert } from '../ErrorAlert.jsx';
import Header from '../Header.jsx';
import TaskBoard from '../taskboard/TaskBoard.jsx';
import AddTaskModal from '../modals/AddTaskModal.jsx';
import EditTaskModal from '../modals/EditTaskModal.jsx';
import DeleteConfirmationDialog from '../modals/DeleteConfirmationDialog.jsx';

export const MainContent = ({ 
  isMobile, 
  searchResults, 
  isSearching, 
  handleSearchUpdate 
}) => {
  const { boards, errorMessage } = useTasks();

  const filteredBoards = useMemo(() => {
    if (!isSearching) return boards;
    return boards.map((board) => ({
      ...board,
      tasks: board.tasks.filter((task) => 
        searchResults.some(result => result.$id === task.$id)
      ),
    }));
  }, [boards, searchResults, isSearching]);

  const statusData = useMemo(() => {
    return boards.map((board) => ({
      name: board.title,
      value: board.tasks.length,
      color: board.id === "newTasks" 
        ? "#9333ea"  
        : board.id === "inProgress"
        ? "#eab308"  
        : "#16a34a", 
    }));
  }, [boards]);

  const statistics = useMemo(() => {
    const totalTasks = boards.reduce((total, board) => total + board.tasks.length, 0);
    const newTasks = boards.find((b) => b.id === "newTasks")?.tasks.length || 0;
    const inProgressTasks = boards.find((b) => b.id === "inProgress")?.tasks.length || 0;
    const completedTasks = boards.find((b) => b.id === "done")?.tasks.length || 0;
    
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    const priorities = boards
      .flatMap((board) => board.tasks.map((task) => task.priority))
      .reduce((acc, priority) => {
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

    return {
      totalTasks,
      newTasks,
      inProgressTasks,
      completedTasks,
      completionPercentage,
      priorities,
    };
  }, [boards]);

  return (
    <div className="space-y-6">
      <ErrorAlert message={errorMessage} />
      <Header onSearchUpdate={handleSearchUpdate} />
      <Dashboard statusData={statusData} statistics={statistics} />
      <TaskBoard filteredBoards={filteredBoards} isMobile={isMobile} />
      {/* Modal components for task management */}
      <AddTaskModal />
      <EditTaskModal />
      <DeleteConfirmationDialog />
    </div>
  );
};