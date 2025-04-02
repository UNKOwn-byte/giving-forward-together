
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage in this demo)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would be a real API call in production
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - in production this would validate with a backend
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatar: '/placeholder.svg'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else if (email === 'user@example.com' && password === 'password') {
      const regularUser: User = {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        avatar: '/placeholder.svg'
      };
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    // This would be a real API call in production
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration - in production this would register with a backend
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'user',
      avatar: '/placeholder.svg'
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
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
