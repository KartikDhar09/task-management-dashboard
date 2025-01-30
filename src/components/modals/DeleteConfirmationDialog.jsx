import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTasks } from '../../context/TaskContext.jsx';

const DeleteConfirmationDialog = ({
 
}) => {
  const{ isDeleteDialogOpen = false,
    setIsDeleteDialogOpen,
    handleConfirmDelete}=useTasks();
  
  return(
  <AlertDialog
    open={isDeleteDialogOpen}
    onOpenChange={setIsDeleteDialogOpen}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Task</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this task? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirmDelete}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
};

export default DeleteConfirmationDialog;