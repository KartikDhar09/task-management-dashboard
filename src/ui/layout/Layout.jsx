// src/components/layout/Layout.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSelector } from 'react-redux';
export const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className={`min-h-screen w-full ${
      isDarkMode 
        ? "dark bg-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
    }`}>
      <div className={`relative min-h-screen w-full max-w-[2560px] mx-auto ${isAuthenticated?"p-3 sm:p-4 md:p-6 xl:p-8":"p-0"}`}>
        {children}
      </div>
    </div>
  );
};