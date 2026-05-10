import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5001/api';

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  bio?: string;
  name?: string; // For compatibility
  avatar?: string; // For compatibility
  savedDestinations?: string[]; // For compatibility
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        // Add compatibility fields
        user.name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
        user.avatar = user.profile_picture_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
        user.savedDestinations = user.savedDestinations || [];
        setUser(user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Check auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const user = data.user;
        user.name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
        user.avatar = user.profile_picture_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
        user.savedDestinations = user.savedDestinations || [];
        setUser(user);
      } else {
        throw new Error(data.error || 'Invalid username or password');
      }
    } catch (err: any) {
      const msg = (err.message === 'Failed to fetch' || err.message === 'Load failed') 
        ? 'Invalid username or password' 
        : (err.message || 'Invalid username or password');
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (userData: any) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const user = data.user;
        user.name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
        user.avatar = user.profile_picture_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
        user.savedDestinations = user.savedDestinations || [];
        setUser(user);
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (err: any) {
      const msg = (err.message === 'Failed to fetch' || err.message === 'Load failed')
        ? 'Could not connect to server. Please make sure the backend is running.'
        : (err.message || 'Signup failed. Please try again.');
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
