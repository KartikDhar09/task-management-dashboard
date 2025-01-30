import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { account, ID } from '../appwrite/config.js';
import { fetchUserTasks } from './taskSlice';

const handleAppwriteError = (error) => {
  const errorMap = {
    400: 'Invalid input. Check your details.',
    401: 'Unauthorized. Please log in again.',
    409: 'Resource already exists.',
    429: 'Too many attempts. Try again later.',
    503: 'Service unavailable. Try again later.'
  };
  return errorMap[error.code] || error.message || 'An unexpected error occurred';
};

// ============= Async Thunk Actions =============

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    // Validate input
    if (!email || !password) {
      return rejectWithValue('Email and password are required');
    }
    try {
      // Create session and get user details
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      
      // Store the session/user data first
      const authData = { session, user };
      
      // Wait for the auth state to be updated before fetching tasks
      await dispatch(authSlice.actions.setAuth(authData));
      
      // Now fetch user's tasks
      await dispatch(fetchUserTasks(user.$id));
      
      return authData;
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    // Validate required fields
    if (!email || !password || !name) {
      return rejectWithValue('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return rejectWithValue('Invalid email address');
    }

    // Validate password length
    if (password.length < 8) {
      return rejectWithValue('Password must be 8+ characters');
    }

    try {
      // Create new user account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      return { user };
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession('current');
      return null;
    } catch (error) {
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("Checking authentication...");
      const session = await account.getSession('current');
      const user = await account.get();
      
      console.log("Authentication successful");
      
      // Fetch user's tasks after confirming authentication
      await dispatch(fetchUserTasks(user.$id));
      
      return { user };
    } catch (error) {
      console.log("Authentication check failed:", error);
      return rejectWithValue(handleAppwriteError(error));
    }
  }
);

// ============= Redux Slice =============

const authSlice = createSlice({
  name: 'auth',
  // Initialize state from localStorage if available
  initialState: {
    user: JSON.parse(localStorage.getItem("authUser")) || null,
    loading: false,
    error: null,
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    registrationError: null,
  },
  reducers: {
    // Clear any authentication errors
    clearError: (state) => {
      state.error = null;
    },
    // Manually set authentication state
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Persist auth state to localStorage
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear auth state from localStorage
        localStorage.removeItem("authUser");
        localStorage.removeItem("isAuthenticated");
      })
      // Auth check cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Update localStorage with current auth state
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear auth state from localStorage
        localStorage.removeItem("authUser");
        localStorage.removeItem("isAuthenticated");
      });
  }
});

export const { clearError, setAuthState } = authSlice.actions;
export default authSlice.reducer;