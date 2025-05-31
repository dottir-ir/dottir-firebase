import React from 'react';
import type { FC, ReactNode } from 'react';
import { mockUser } from './data';

interface AuthContextType {
  user: typeof mockUser | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {}
});

interface MockAuthProviderProps {
  children: ReactNode;
  user?: typeof mockUser | null;
  loading?: boolean;
  error?: Error | null;
}

export const MockAuthProvider: FC<MockAuthProviderProps> = ({
  children,
  user = mockUser,
  loading = false,
  error = null
}) => {
  const value = {
    user,
    loading,
    error,
    signIn: async () => {},
    signOut: async () => {},
    signUp: async () => {},
    resetPassword: async () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 