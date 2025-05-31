import type { UserRole } from '../services/AuthService';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, role: UserRole, userData: Partial<AppUser>) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  // Add any other methods referenced in your components
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: any) => err?.message || 'An error occurred';

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole,
    userData: Partial<AppUser>
  ): Promise<UserCredential> => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...userData
      });
      return userCredential;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const updateProfile = async (data: Partial<AppUser>) => {
    if (!currentUser) return;
    try {
      setError(null);
      await updateDoc(doc(db, 'users', currentUser.id), {
        ...data,
        updatedAt: new Date(),
      });
      setCurrentUser({ ...currentUser, ...data, updatedAt: new Date() });
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              ...userDoc.data() as Omit<AppUser, 'id' | 'email'>,
            });
          } else {
            setCurrentUser(null);
            setError('User profile not found');
          }
        } catch (err) {
          setError(getErrorMessage(err));
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
    register,
    resetPassword,
    error,
    clearError,
    updateProfile,
    // Add any other methods referenced in your components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 