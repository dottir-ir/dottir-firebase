import type { UserRole } from '../../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to unauthorized page if user doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is a doctor, check verification status
  if (currentUser.role === 'doctor' && currentUser.doctorVerificationStatus === 'pending') {
    return <Navigate to="/verification-pending" replace />;
  }

  return <>{children}</>;
} 