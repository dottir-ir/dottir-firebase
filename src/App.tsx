import { Toaster } from 'react-hot-toast';

// Placeholder components - you'll need to create these
const Dashboard = () => <div>Dashboard</div>;
const Unauthorized = () => <div>Unauthorized Access</div>;
const VerificationPending = () => <div>Your verification is pending</div>;

function App() {
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
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/verification-pending" element={<VerificationPending />} />

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

            {/* Patient-only routes */}
            {/*
            <Route
              path="/patient/*"
              element={
                <ProtectedRoute requiredRole="patient">
                  <div>Patient Dashboard</div>
                </ProtectedRoute>
              }
            />
            */}

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
        </AuthProvider>
      </Router>
    </>
  );
}

export default App; 