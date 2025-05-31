import type { User } from '../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as User | null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}; 