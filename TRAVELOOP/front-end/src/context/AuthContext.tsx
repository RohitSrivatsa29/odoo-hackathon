import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_USER } from '../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  savedDestinations: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    // Simulate API call
    console.log('Logging in...', email);
    // Create a simple user object from email
    const name = email.split('@')[0];
    setUser({
      id: `user_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      avatar: '',
      bio: '',
      savedDestinations: []
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
