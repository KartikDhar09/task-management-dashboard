import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth, loginUser, registerUser } from '../Store/authSlice.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  // State to toggle between login and register forms
  const [showRegister, setShowRegister] = useState(false);
  // State for storing authentication errors
  const [authError, setAuthError] = useState("");
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);
  // State for displaying temporary error messages
  const [displayError, setDisplayError] = useState("");

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verify if the current session is valid
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        // Clear local storage if session is invalid
        localStorage.removeItem("authUser");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false);
      }
    };

    // Only check session if user was previously authenticated
    if (localStorage.getItem("isAuthenticated") === "true") {
      checkSession();
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Effect to handle temporary error message display
  useEffect(() => {
    setDisplayError(authError);
    // Clear error message after 2 seconds
    const timer = authError ? setTimeout(() => setDisplayError(null), 2000) : null;
    return () => timer && clearTimeout(timer);
  }, [authError]);

  // Clear error message when switching between login and register forms
  useEffect(() => {
    setDisplayError(null);
  }, [showRegister]);

  const handleRegister = async (registerData) => {
    try {
      setIsLoading(true);
      const resultAction = await dispatch(registerUser(registerData));
  
      // Check if registration was rejected
      if (registerUser.rejected.match(resultAction)) {
        const error = resultAction.payload;
        setAuthError(error || 'Registration failed. Please try again.');
        return;
      }
      
      setShowRegister(false);
    } catch (error) {
      setAuthError(error||'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      // Clear error message after 5 seconds
      setTimeout(() => {
        setAuthError('');
      }, 5000);
    }
  };

  const handleLogin = async (loginData) => {
    try {
      setIsLoading(true);
      setAuthError("");

      const response = await dispatch(loginUser(loginData)).unwrap();

      // Store user data in local storage if login successful
      if (response.user) {
        localStorage.setItem("authUser", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");
      }
    } catch (error) {
      setAuthError(error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Context value object containing all necessary state and handlers
  const value = {
    showRegister,
    setShowRegister,
    authError: displayError,
    isLoading,
    handleRegister,
    handleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};