import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
 
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') { // Check if running in browser environment
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      // If no saved preference, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light mode in non-browser environment
  });

  // Effect to update localStorage and body class when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save theme preference to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      // Update body class to apply theme styles
      document.body.className = isDarkMode ? 'dark' : '';
    }
  }, [isDarkMode]);

  // Effect to handle system theme preference changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Update theme when system preference changes, but only if user hasn't set a preference
      const handleChange = (e) => {
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches);
        }
      };

      // Add listener for system theme changes
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup listener on component unmount
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Function to toggle between light and dark mode
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Context value object containing theme state and functions
  const value = {
    isDarkMode,      
    setIsDarkMode,   
    toggleTheme      
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};