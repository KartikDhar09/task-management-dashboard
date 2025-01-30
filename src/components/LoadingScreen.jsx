import React, { memo } from 'react';

import { Loader2 } from "lucide-react";

import { useTheme } from '../context/ThemeContext.jsx';

const LoadingScreen = memo(({  message  }) => {
const{isDarkMode}=useTheme();
  return(
    <div 
    className={`
      fixed inset-0 z-50 
      flex items-center justify-center 
      backdrop-blur-sm
      transition-colors duration-300
      ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}
    `}
  >
    <div className="flex flex-col items-center space-y-4">
      <Loader2 
        className={`
          animate-spin 
          ${isDarkMode ? 'text-white' : 'text-gray-800'}
        `} 
        size={64} 
      />
      <p 
        className={`
          text-xl font-semibold
          ${isDarkMode ? 'text-white' : 'text-gray-800'}
        `}
      >
        {message}
      </p>
    </div>
  </div>
  )
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;