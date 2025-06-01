import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NewsfeedPage } from './pages/Newsfeed';
import CaseUploadPage from './pages/CaseUploadPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentModeration from './pages/admin/ContentModeration';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import VerificationRequests from './pages/admin/VerificationRequests';
import { ProfilePage } from './pages/ProfilePage';
import { Dashboard } from './components/Dashboard';
import { Unauthorized } from './components/Unauthorized';
import { VerificationPending } from './components/VerificationPending';
import { useEffect } from 'react';
import { getApps } from 'firebase/app';
import { checkFirebaseInstances } from './utils/firebaseDebug';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/verification-pending" element={currentUser ? <VerificationPending user={currentUser} /> : <Navigate to="/login" />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NewsfeedPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Doctor-only routes */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute requiredRole="doctor">
            <Routes>
              <Route path="upload-case" element={<CaseUploadPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="verification-requests/*" element={<VerificationRequests />} />
              <Route path="content-moderation" element={<ContentModeration />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Check for multiple Firebase initializations
    checkFirebaseInstances();
    console.log('App mounted - Firebase apps count:', getApps().length);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4aed88',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ff4b4b',
              color: '#fff',
            },
          },
        }}
      />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App; 