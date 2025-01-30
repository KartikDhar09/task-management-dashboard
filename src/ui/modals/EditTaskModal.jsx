import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTasks } from '../../context/TaskContext.jsx';
import { ErrorAlert } from '../ErrorAlert.jsx';
import LoadingScreen from '../LoadingScreen.jsx';

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
];

const EditTaskModal = () => {
  const [newAssignee, setNewAssignee] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isEditModalOpen, 
    setIsEditModalOpen, 
    taskToEdit, 
    setTaskToEdit, 
    handleEditSubmit,loading
  } = useTasks();

  useEffect(() => {
    let timeoutId;
    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage]);

  const handleAddAssignee = useCallback(() => {
    if (newAssignee.trim()) {
      setTaskToEdit(prev => ({
        ...prev,
        assignees: [...(prev.assignees || []), newAssignee.trim()]
      }));
      setNewAssignee("");
      setErrorMessage("");
    }
  }, [newAssignee, setTaskToEdit]);

  const handleRemoveAssignee = useCallback((assigneeToRemove) => {
    setTaskToEdit(prev => ({
      ...prev,
      assignees: prev.assignees.filter(assignee => assignee !== assigneeToRemove)
    }));
  }, [setTaskToEdit]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAssignee();
    }
  }, [handleAddAssignee]);

  const handleSubmit = useCallback(() => {
    if (!taskToEdit?.title) {
      setErrorMessage("Please add a title for the task");
      return;
    }
    
    if (!taskToEdit?.assignees?.length) {
      setErrorMessage("Please add at least one assignee to the task");
      return;
    }
    
    handleEditSubmit({
      ...taskToEdit,
      assignees: taskToEdit.assignees
    });
    setErrorMessage("");
  }, [taskToEdit, handleEditSubmit]);

  const handleInputChange = useCallback((field) => (e) => {
    setTaskToEdit((prev) => ({ ...prev, [field]: e.target.value }));
  }, [setTaskToEdit]);

  const handlePriorityChange = useCallback((value) => {
    setTaskToEdit((prev) => ({ ...prev, priority: value }));
  }, [setTaskToEdit]);

  const assigneesList = useMemo(() => (
    taskToEdit?.assignees?.map((assignee, index) => (
      <div
        key={`${assignee}-${index}`}
        className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
      >
        <span className="text-sm">{assignee}</span>
        <button
          onClick={() => handleRemoveAssignee(assignee)}
          className="p-1 hover:text-red-500 transition-colors"
          aria-label={`Remove ${assignee}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ))
  ), [taskToEdit?.assignees, handleRemoveAssignee]);

  return (
    
      
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
    <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      {loading && <LoadingScreen message={"Saving changes..."}/>}

      <DialogHeader className="space-y-2">
        <DialogTitle className="text-xl sm:text-2xl">Edit Task</DialogTitle>
        <DialogDescription className="sr-only">
          Edit task details including title, description, assignees, and priority
        </DialogDescription>
      </DialogHeader>

      <ErrorAlert message={errorMessage} />

      <div className="space-y-4 py-4">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
          <Input
            id="title"
            value={taskToEdit?.title || ""}
            onChange={handleInputChange('title')}
            required
            className="w-full"
          />
        </div>
        
        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
          <Textarea
            id="description"
            value={taskToEdit?.description || ""}
            onChange={handleInputChange('description')}
            placeholder="Add task description..."
            className="w-full min-h-[80px]"
            rows={3}
          />
        </div>

        {/* Assignees Input */}
        <div className="space-y-2">
          <Label htmlFor="assignees" className="text-sm sm:text-base">Assignees</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="assignees"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add assignee"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddAssignee}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {assigneesList}
          </div>
        </div>
      
        {/* Priority Select */}
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm sm:text-base">Priority</Label>
          <Select
            value={taskToEdit?.priority || "Low"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="sm:flex-row gap-3">
        <Button 
          onClick={handleSubmit}
          className="w-full sm:w-auto"
        >
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    
  );
};

export default EditTaskModal;