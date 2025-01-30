import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth, loginUser, registerUser } from '../Store/authSlice.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [showRegister, setShowRegister] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Initial state set to true
  const [displayError, setDisplayError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        localStorage.removeItem("authUser");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("isAuthenticated") === "true") {
      checkSession();
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    setDisplayError(authError);
    const timer = authError ? setTimeout(() => setDisplayError(null), 2000) : null;
    return () => timer && clearTimeout(timer);
  }, [authError]);

  useEffect(() => {
    setDisplayError(null);
  }, [showRegister]);

  const handleRegister = async (registerData) => {
    try {
      setIsLoading(true);
      const resultAction = await dispatch(registerUser(registerData));
  
      if (registerUser.rejected.match(resultAction)) {
        const error = resultAction.payload;
        setAuthError(error || 'Registration failed. Please try again.');
        return;
      }
      
      setShowRegister(false);
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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

      if (response.user) {
        localStorage.setItem("authUser", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");
      }
    } catch (error) {
      setAuthError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

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