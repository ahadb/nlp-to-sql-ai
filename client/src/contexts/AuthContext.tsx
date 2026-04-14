import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type User, type AuthResponse, type SignUpRequest, type SignInRequest } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (request: SignInRequest) => Promise<AuthResponse>;
  signUp: (request: SignUpRequest) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Try to get current user info
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid auth state
        await authService.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (request: SignInRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signIn(request);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (request: SignUpRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signUp(request);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await signOut();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
