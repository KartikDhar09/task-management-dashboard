// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import taskReducer from './taskSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,  // Add the task reducer
  },
});