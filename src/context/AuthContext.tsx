
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (token: string, newPassword: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate verification tokens storage
  const [verificationTokens, setVerificationTokens] = useState<Record<string, string>>({});
  const [resetTokens, setResetTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatar: '/placeholder.svg',
        emailVerified: true,
        provider: 'email'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else if (email === 'user@example.com' && password === 'password') {
      const regularUser: User = {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        avatar: '/placeholder.svg',
        emailVerified: true,
        provider: 'email'
      };
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    setVerificationTokens(prev => ({ ...prev, [email]: verificationToken }));
    
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'user',
      avatar: '/placeholder.svg',
      emailVerified: false,
      provider: 'email'
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Simulate sending verification email
    console.log(`Verification email sent to ${email} with token: ${verificationToken}`);
    toast({
      title: "Registration successful",
      description: "A verification email has been sent to your email address. Please verify your email to access all features.",
    });
    
    setIsLoading(false);
  };

  const sendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);
    setVerificationTokens(prev => ({ ...prev, [email]: verificationToken }));
    
    // Simulate sending verification email
    console.log(`Verification email sent to ${email} with token: ${verificationToken}`);
    toast({
      title: "Verification email sent",
      description: "Please check your email to verify your account.",
    });
    
    setIsLoading(false);
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the email associated with this token
    const entry = Object.entries(verificationTokens).find(([_, value]) => value === token);
    
    if (!entry || !user) {
      setIsLoading(false);
      throw new Error('Invalid or expired verification token');
    }
    
    // Update user's verified status
    const updatedUser = {
      ...user,
      emailVerified: true
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Remove used token
    const [email] = entry;
    setVerificationTokens(prev => {
      const { [email]: _, ...rest } = prev;
      return rest;
    });
    
    toast({
      title: "Email verified",
      description: "Your email has been successfully verified.",
    });
    
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    setResetTokens(prev => ({ ...prev, [email]: resetToken }));
    
    // Simulate sending reset email
    console.log(`Password reset email sent to ${email} with token: ${resetToken}`);
    toast({
      title: "Password reset email sent",
      description: "Please check your email for instructions to reset your password.",
    });
    
    setIsLoading(false);
  };

  const confirmResetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the email associated with this token
    const entry = Object.entries(resetTokens).find(([_, value]) => value === token);
    
    if (!entry) {
      setIsLoading(false);
      throw new Error('Invalid or expired reset token');
    }
    
    // In a real app, we would update the user's password in the database
    // For this demo, we'll just show a success message
    
    // Remove used token
    const [email] = entry;
    setResetTokens(prev => {
      const { [email]: _, ...rest } = prev;
      return rest;
    });
    
    toast({
      title: "Password reset successful",
      description: "Your password has been reset successfully. You can now log in with your new password.",
    });
    
    setIsLoading(false);
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would redirect to the OAuth provider
    // For this demo, we'll simulate a successful login
    
    const providerUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.com`,
      role: 'user',
      avatar: '/placeholder.svg',
      emailVerified: true,
      provider: provider,
      socialId: `${provider}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    setUser(providerUser);
    localStorage.setItem('user', JSON.stringify(providerUser));
    
    toast({
      title: "Social login successful",
      description: `You have successfully logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
    });
    
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = {
        ...user,
        ...updates
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
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
        register,
        updateProfile,
        sendVerificationEmail,
        verifyEmail,
        resetPassword,
        confirmResetPassword,
        socialLogin
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
