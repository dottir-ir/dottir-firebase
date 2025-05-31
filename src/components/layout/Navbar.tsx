import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { Home, TrendingUp, Star, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: string[];
}

interface NavbarProps {
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Trending',
      href: '/?sort=trending',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Popular',
      href: '/?sort=popular',
      icon: <Star className="w-5 h-5" />,
    },
    {
      label: 'Upload Case',
      href: '/doctor/upload-case',
      icon: <Upload className="w-5 h-5" />,
      roles: ['doctor'],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole || '')
  );

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                MedCase
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive(item.href) ? 'text-primary border-b-2 border-primary' : 'text-gray-700 border-b-2 border-transparent hover:text-primary hover:border-primary'}`}
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {userRole && (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/profile/${userRole}`}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                {onLogout && (
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${isActive(item.href) ? 'text-primary bg-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
              >
                {item.icon && (
                  <span className="mr-3">{item.icon}</span>
                )}
                {item.label}
              </Link>
            ))}
          </div>
          {userRole && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <Link
                  to={`/profile/${userRole}`}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                {onLogout && (
                  <div className="ml-3">
                    <Button variant="outline" size="sm" onClick={onLogout}>
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}; 