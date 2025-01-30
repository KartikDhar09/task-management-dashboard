import React, { useState, memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useSelector } from 'react-redux';
import {useTasks} from '../../context/TaskContext.jsx';
import LoadingScreen from '../LoadingScreen.jsx';
const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }
];

const AddTaskModal = ({
  
  
}) => {
  const{isAddCardModalOpen,
    setIsAddCardModalOpen,
    newTask,
    setNewTask,
    formErrors,
    handleSubmitCard,
  loading
}=useTasks();
  const [assigneeInput, setAssigneeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const{isLoading}=useSelector(
  (state)=>state.auth
)
  // Consolidated task update handler
  const updateTaskField = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  // Simplified assignee handlers
  const handleAssignee = (e) => {
    e.preventDefault();
    const trimmedInput = assigneeInput.trim();
    if (trimmedInput) {
      updateTaskField('assignees', [...(newTask.assignees || []), trimmedInput]);
      setAssigneeInput("");
    }
  };

  const removeAssignee = (assigneeToRemove) => {
    updateTaskField('assignees', 
      (newTask.assignees || []).filter(assignee => assignee !== assigneeToRemove)
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleSubmitCard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isLoading || isSubmitting || !newTask.title.trim() || !newTask.assignees?.length;

  return (
    <Dialog open={isAddCardModalOpen} onOpenChange={setIsAddCardModalOpen}>
    <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      {loading && <LoadingScreen message={"Adding task..."}/>}
      
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-xl sm:text-2xl">Add New Task</DialogTitle>
        <DialogDescription className="sr-only">
          Modal for creating a new task
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
          <Input
            id="title"
            value={newTask.title}
            onChange={(e) => updateTaskField('title', e.target.value)}
            className={`w-full ${formErrors.title ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {formErrors.title && (
            <p className="text-sm text-red-500">{formErrors.title}</p>
          )}
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
          <Textarea
            id="description"
            value={newTask.description}
            onChange={(e) => updateTaskField('description', e.target.value)}
            placeholder="Add task description..."
            className="w-full min-h-[80px]"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Assignees Input */}
        <div className="space-y-2">
          <Label htmlFor="assignees" className="text-sm sm:text-base">Assignees</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="assignees"
              value={assigneeInput}
              onChange={(e) => setAssigneeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAssignee(e)}
              placeholder="Add assignee and press Enter"
              className={`flex-1 ${formErrors.assignees ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            <Button 
              onClick={handleAssignee}
              type="button" 
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Add
            </Button>
          </div>
          {formErrors.assignees && (
            <p className="text-sm text-red-500">{formErrors.assignees}</p>
          )}
          
          {/* Assignee List */}
          {newTask.assignees?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {newTask.assignees.map((assignee, index) => (
                <Badge 
                  key={`${assignee}-${index}`}
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1 text-sm"
                >
                  <span className="max-w-[150px] truncate">{assignee}</span>
                  <button
                    onClick={() => removeAssignee(assignee)}
                    className="ml-1 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${assignee}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Priority Select */}
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm sm:text-base">Priority</Label>
          <Select
            value={newTask.priority}
            onValueChange={(value) => updateTaskField('priority', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="sm:flex-row gap-3">
        <Button 
          onClick={handleSubmit} 
          disabled={isButtonDisabled}
          className="w-full sm:w-auto relative"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            'Add Task'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

export default memo(AddTaskModal);