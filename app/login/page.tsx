"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('astro@gem.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
        router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-primary tracking-wider">AstroGems</h1>
            <p className="mt-2 text-text-light">B2B Portal for Astrologers</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-main">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password-_id" className="text-sm font-medium text-text-main">Password</label>
            <input
              id="password-_id"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: <strong>astro@gem.com</strong></p>
          <p>Password: <strong>password</strong></p>
        </div>
        <div className="text-center text-sm">
          <Link href="/" className="font-medium text-primary hover:text-primary-focus transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
