import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { AuthProvider } from '../../context/AuthContext.jsx';
import { TaskProvider } from '../../context/TaskContext.jsx';

import { useResponsive } from '../../hooks/useResponsive.js';

import { MainContent } from './MainContent.jsx';
import AuthPage from '../authPage/AuthPage.jsx';

export const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  
  const { isMobile } = useResponsive();
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Auth state fully updated:", { isAuthenticated, user });
    }
  }, [isAuthenticated, user]);

  const handleSearchUpdate = (results, isActive) => {
    setSearchResults(results);
    setIsSearching(isActive);
  };

  if (!isAuthenticated) {
    return (
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    )
  }

  return (
    <TaskProvider>
      <MainContent 
        isMobile={isMobile}
        searchResults={searchResults}
        isSearching={isSearching}
        handleSearchUpdate={handleSearchUpdate}
      />
    </TaskProvider>
  );
};