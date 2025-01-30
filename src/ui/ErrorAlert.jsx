// src/components/common/ErrorAlert.jsx
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
      <Alert className={`
        w-full max-w-md transform transition-all duration-300 ease-in-out
        shadow-lg rounded-lg pointer-events-auto
        animate-in slide-in-from-top
        ${message.includes("success")
          ? "bg-green-100 text-green-500 border-green-200"
          : "bg-red-100 text-red-500 border-red-200"
        }
      `}>
        <AlertDescription className="text-sm sm:text-base break-words">
          {message}
        </AlertDescription>
      </Alert>
    </div>
  );
};