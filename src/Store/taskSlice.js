import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, Query, ID } from '../appwrite/config.js';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const TASKS_COLLECTION_ID = import.meta.env.VITE_USER_TASKS_COLLECTION;

const AppwriteErrors = {
  INVALID_INPUT: 'INVALID_INPUT',    
  UNAUTHORIZED: 'UNAUTHORIZED',       
  DUPLICATE: 'DUPLICATE',            
  RATE_LIMIT: 'RATE_LIMIT',         
  SERVICE_ERROR: 'SERVICE_ERROR'     
};

const handleAppwriteError = (error) => {
  const errorMap = {
    400: AppwriteErrors.INVALID_INPUT,
    401: AppwriteErrors.UNAUTHORIZED,
    409: AppwriteErrors.DUPLICATE,
    429: AppwriteErrors.RATE_LIMIT,
    503: AppwriteErrors.SERVICE_ERROR
  };
  return {
    type: errorMap[error.code] || 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred'
  };
};

const validateUserId = (userId) => {
  if (!userId) throw new Error('User ID is required');
  return true;
};

const validateTaskId = (taskId) => {
  if (!taskId) throw new Error('Task ID is required');
  return true;
};

const TasksAPI = {
  // Deletes all tasks in the collection
  async clearAll() {
    const { documents } = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID);
    return Promise.all(
      documents.map(task => databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, task.$id))
    );
  },

  // Fetches all tasks for a specific user
  async fetchTasks(userId) {
    return databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
  },

  // Creates a new task document
  async createTask(documentData) {
    return databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      documentData
    );
  },

  // Updates an existing task
  async updateTask(taskId, updates) {
    return databases.updateDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId,
      updates
    );
  },

  // Deletes a specific task
  async deleteTask(taskId) {
    return databases.deleteDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId
    );
  }
};

// Redux Thunk Actions

export const clearAllTasks = createAsyncThunk(
  'tasks/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await TasksAPI.clearAll();
      return true;
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const fetchUserTasks = createAsyncThunk(
  'tasks/fetch',
  async (userId, { rejectWithValue, signal }) => {
    try {
      validateUserId(userId);
      const response = await TasksAPI.fetchTasks(userId);
      return response.documents;
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/add',
  async ({ userId, taskData }, { rejectWithValue }) => {
    try {
      validateUserId(userId);
      const documentData = {
        userId,
        title: taskData.title,
        assignees: Array.isArray(taskData.assignees) ? taskData.assignees : [taskData.assignees].filter(Boolean),
        priority: taskData.priority,
        status: taskData.status,
        description: taskData.description || null,
      };
      
      return await TasksAPI.createTask(documentData);
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, updates }, { rejectWithValue, getState }) => {
    try {
      validateTaskId(taskId);
      // Filter out undefined values and handle assignee/assignees field naming
      const cleanUpdates = Object.entries(updates)
        .filter(([, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({
          ...acc,
          [key === 'assignee' ? 'assignees' : key]: 
            key === 'assignees' ? (Array.isArray(value) ? value : [value]) : value
        }), {});

      if (Object.keys(cleanUpdates).length === 0) {
        return getState().tasks.tasks.find(task => task.$id === taskId);
      }

      return await TasksAPI.updateTask(taskId, cleanUpdates);
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId, { rejectWithValue }) => {
    try {
      validateTaskId(taskId);
      await TasksAPI.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],         
    loading: false,   
    error: null        
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  // Handle all async thunk actions
  extraReducers: (builder) => {
    builder
      // Fetch tasks cases
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add task cases
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task cases
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.$id === action.payload.$id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task cases
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.$id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear all tasks cases
      .addCase(clearAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAllTasks.fulfilled, (state) => {
        state.loading = false;
        state.tasks = [];
        state.error = null;
      })
      .addCase(clearAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;