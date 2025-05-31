import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-600">Welcome, {currentUser?.displayName}</p>
          </div>
          <nav className="mt-4">
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/doctor-verification"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Doctor Verification
            </Link>
            <Link
              to="/admin/content-moderation"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Content Moderation
            </Link>
            <Link
              to="/admin/analytics"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Analytics
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 