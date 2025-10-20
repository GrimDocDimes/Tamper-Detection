import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Captcha from './Captcha';

const Login = () => {
  const { login, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaValid, setCaptchaValid] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCaptchaChange = (value, isValid) => {
    setCaptchaValue(value);
    setCaptchaValid(isValid);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!captchaValue) {
      newErrors.captcha = 'Please enter the security code';
    } else if (!captchaValid) {
      newErrors.captcha = 'Invalid security code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Login successful - AuthContext will handle the state update
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || 'Invalid email or password';
      }
      
      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(forgotPasswordEmail);
      setResetEmailSent(true);
      setErrors({});
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email';
      }
      
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            {resetEmailSent ? (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    Password reset instructions have been sent to your email address.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                    setForgotPasswordEmail('');
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => {
                        setForgotPasswordEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 ${
                        errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Regulator Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Legal Metrology Department - Government of India
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <Captcha 
                onCaptchaChange={handleCaptchaChange}
                isValid={captchaValid}
              />
              {errors.captcha && (
                <p className="text-sm text-red-600">{errors.captcha}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </button>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Use your Firebase account credentials to sign in
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
