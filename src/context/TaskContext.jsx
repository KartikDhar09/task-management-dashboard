import React, { createContext, useContext, useState, useEffect } from 'react'; // Added useEffect
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, deleteTask, clearAllTasks, fetchUserTasks } from '../Store/taskSlice.js'; // Added fetchUserTasks

const TaskContext = createContext(null);

export const TaskProvider = ({ children, isDarkMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  
  // Fetch tasks when component mounts or user changes
  useEffect(() => {
    if (user?.$id) {
      dispatch(fetchUserTasks(user.$id));
    }
  }, [dispatch, user?.$id]);

  // Task-related state
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({ title: "", assignee: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    assignees: [],
    priority: "Low",
    status: "newTasks",
    description: "",
  });

  // Helper function to show errors
  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  // Form validation
  const validateForm = (task) => {
    const errors = {
      title: "",
      assignees: "",
    };

    if (!task.title.trim()) {
      errors.title = "Title is required";
    } else if (task.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!task.assignees || task.assignees.length === 0) {
      errors.assignees = "At least one assignee is required";
    }

    return errors;
  };

  // Task CRUD operations with loading state handling
  const handleSubmitCard = async () => {
    const errors = validateForm(newTask);
    setFormErrors(errors);

    if (errors.title || errors.assignees) return;

    try {
      if (!user?.$id) {
        throw new Error("User ID is not available");
      }

      const result = await dispatch(
        addTask({
          taskData: {
            title: newTask.title,
            assignees: newTask.assignees,
            priority: newTask.priority,
            status: newTask.status,
            description: newTask.description,
          },
          userId: user.$id,
        })
      ).unwrap();

      if (!loading && !error) {
        setIsAddCardModalOpen(false);
        setNewTask({
          title: "",
          assignees: [],
          priority: "Low",
          status: "newTasks",
          description: "",
        });
      }
    } catch (error) {
      showError(error.message || "Failed to add task");
    }
  };

  const handleEditSubmit = async () => {
    if (!taskToEdit.title || !taskToEdit.assignees?.length) return;

    try {
      const result = await dispatch(
        updateTask({
          taskId: taskToEdit.$id,
          updates: {
            title: taskToEdit.title,
            assignees: taskToEdit.assignees,
            priority: taskToEdit.priority,
            status: taskToEdit.status,
            description: taskToEdit.description,
          },
        })
      ).unwrap();

      if (!loading && !error) {
        setIsEditModalOpen(false);
        setTaskToEdit(null);
      }
    } catch (error) {
      showError("Failed to update task");
    }
  };

  const handleMoveTask = async (taskId, fromBoardId, toBoardId) => {
    if (fromBoardId === toBoardId) return;

    try {
      await dispatch(
        updateTask({
          taskId,
          updates: { status: toBoardId },
        })
      ).unwrap();

      if (error) {
        showError("Failed to move task");
      }
    } catch (error) {
      showError("Failed to move task");
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await dispatch(deleteTask(taskToDelete.taskId)).unwrap();
      
      if (!loading && !error) {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    } catch (error) {
      showError("Failed to delete task");
    }
  };

  const clearTasks = async () => {
    try {
      await dispatch(clearAllTasks()).unwrap();
      
      if (!loading && !error) {
        setErrorMessage("All tasks cleared successfully");
        setTimeout(() => setErrorMessage(""), 1000);
      }
    } catch (error) {
      showError("Failed to clear tasks");
    }
  };

  // UI handlers
  const handleAddCard = (boardId) => {
    if (boardId !== "newTasks") return;
    setIsAddCardModalOpen(true);
    setNewTask({
      title: "",
      assignee: "",
      priority: "Low",
      status: "newTasks",
      description: "",
    });
    setFormErrors({ title: "", assignee: "" });
  };

  const handleEditClick = (task, boardId) => {
    setTaskToEdit({ ...task, boardId });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (taskId, boardId) => {
    setTaskToDelete({ taskId, boardId });
    setIsDeleteDialogOpen(true);
  };

  // Priority styles
  const getPriorityStyles = (priority) => {
    const styles = {
      High: {
        light: {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-100",
          dot: "bg-red-400",
        },
        dark: {
          bg: "bg-red-500/10",
          text: "text-red-300",
          border: "border-red-500/30",
          dot: "bg-red-400",
        },
      },
      Medium: {
        light: {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          border: "border-yellow-100",
          dot: "bg-yellow-400",
        },
        dark: {
          bg: "bg-yellow-500/10",
          text: "text-yellow-300",
          border: "border-yellow-500/30",
          dot: "bg-yellow-400",
        },
      },
      Low: {
        light: {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-100",
          dot: "bg-green-400",
        },
        dark: {
          bg: "bg-green-500/10",
          text: "text-green-300",
          border: "border-green-500/30",
          dot: "bg-green-400",
        },
      },
    };
    return isDarkMode ? styles[priority].dark : styles[priority].light;
  };

  // Calculate boards
  const boards = [
    { id: "newTasks", title: "New Tasks", tasks: [] },
    { id: "inProgress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ].map((board) => ({
    ...board,
    tasks: tasks.filter((task) => task.status === board.id),
  }));

  const value = {
    // State
    isAddCardModalOpen,
    setIsAddCardModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    taskToEdit,
    setTaskToEdit,
    taskToDelete,
    setTaskToDelete,
    errorMessage,
    setErrorMessage,
    formErrors,
    newTask,
    setNewTask,
    boards,
    loading,
    error,
    setFormErrors,
    // Handlers
    handleSubmitCard,
    handleEditSubmit,
    handleMoveTask,
    handleConfirmDelete,
    clearTasks,
    handleAddCard,
    handleEditClick,
    handleDeleteClick,
    getPriorityStyles,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};