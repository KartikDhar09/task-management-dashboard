// LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../../context/AuthContext.jsx';

const LoginForm = () => {
  const { setShowRegister, handleLogin, authError, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      setFormError('Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await handleLogin(credentials);
      } catch (err) {
        setFormError(err.message || 'Login failed');
      }
    }
  };

  const handleChange = ({ target: { id, value } }) => {
    setCredentials(prev => ({ ...prev, [id]: value }));
    setFormError('');
  };

  return (
    <Card className="w-full border-0 shadow-none bg-white/95 dark:bg-slate-900/95">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {(authError || formError) && (
          <Alert 
            variant="destructive" 
            className="mb-4 border-red-500/50 dark:border-red-400/50 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10"
          >
            <AlertDescription className="text-red-600 dark:text-red-400 font-medium">
              {authError || formError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {[
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'password', label: 'Password', icon: Lock }
            ].map(({ id, label, icon: Icon }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-sm font-medium">
                  {label}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <Input
                    id={id}
                    type={id === 'password' ? (showPassword ? 'text' : 'password') : id}
                    className="pl-9 pr-12"
                    placeholder={`Enter your ${id}`}
                    value={credentials[id]}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {id === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                New here?
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowRegister(true)}
            className="w-full h-11 border-indigo-600/20 hover:border-indigo-600 hover:bg-indigo-600/5 dark:border-indigo-400/20 dark:hover:border-indigo-400 dark:hover:bg-indigo-400/5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
            disabled={isLoading}
          >
            Create an account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;