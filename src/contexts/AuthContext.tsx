import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/user';
import { UserService } from '../firebase/services/UserService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userService = useMemo(() => new UserService(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        userService.getUserById(firebaseUser.uid).then(user => {
          if (user) {
            setCurrentUser(user);
          } else {
            // Create a new user profile if it doesn't exist
            const newUser: Partial<User> = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
              role: 'patient', // Default role
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLoginAt: new Date()
            };
            userService.createUser(firebaseUser.uid, newUser).then(() => {
              setCurrentUser(newUser as User);
            });
          }
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userService]);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await userService.getUserById(userCredential.user.uid);
    if (user) {
      setCurrentUser(user);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: Partial<User> = {
      ...userData,
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: userCredential.user.displayName || '',
      photoURL: userCredential.user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };
    await userService.createUser(userCredential.user.uid, newUser);
    setCurrentUser(newUser as User);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 