"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Astrologer } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Astrologer | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Astrologer | null>(null);

  const login = useCallback(async (email: string, pass: string) => {
    // Mock login logic
    if (email === 'astro@gem.com' && pass === 'password') {
      const mockUser: Astrologer = { id: 'astro_1', name: 'Dr. Ramesh Kumar', email: 'astro@gem.com' };
      setUser(mockUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
