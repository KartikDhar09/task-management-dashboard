import React, { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useAuth } from '../../context/AuthContext.jsx';

const RegisterForm = () => {

  const { setShowRegister, handleRegister, authError, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(''); 

 
  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return 'Valid email is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

   // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (!validationError) {
      
      // Remove confirmPassword from data before sending to API
      const { confirmPassword, ...registrationData } = formData;

      registrationData.name = registrationData.username; // Map username to name field
      await handleRegister(registrationData);
    } else {
      setError(validationError);
      setTimeout(() => setError(''), 5000);
    }
  };

  const formFields = [
    { name: 'username', label: 'Username', icon: User, type: 'text' },
    { name: 'email', label: 'Email', icon: Mail, type: 'email' },
    { name: 'password', label: 'Password', icon: Lock, type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password' }
  ];

  return (
    <Card className="w-full bg-white/95 dark:bg-slate-900/95">
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
      </CardHeader>

      <CardContent>
        {(error || authError) && (
          <Alert 
            variant="destructive" 
            className="mb-4 border-red-500/50 dark:border-red-400/50 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10"
          >
            <AlertDescription className="text-red-600 dark:text-red-400 font-medium">
              {error || authError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map(({ name, label, icon: Icon, type }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                
                <Input
                  id={name}
                  name={name}
                  type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                  className="pl-9 pr-12"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  value={formData[name]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                  disabled={isLoading}
                />

                {/* Show/hide password toggle for password fields */}
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>

          {/* Sign in button */}
          <div className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegister(false)}
              className="w-full h-11 border-indigo-600/20 hover:border-indigo-600 hover:bg-indigo-600/5 dark:border-indigo-400/20 dark:hover:border-indigo-400 dark:hover:bg-indigo-400/5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;