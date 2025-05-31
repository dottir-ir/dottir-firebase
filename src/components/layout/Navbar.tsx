import type { User } from 'lucide-react';
import { Home, TrendingUp, Star, Upload } from 'lucide-react';

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
  const { theme, isDarkMode, toggleTheme } = useTheme();
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
      className={`
        bg-${theme.colors.background}
        border-b border-gray-200
        sticky top-0 z-40
      `}
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
                  className={`
                    inline-flex items-center px-1 pt-1
                    text-sm font-medium
                    ${isActive(item.href)
                      ? `text-${theme.colors.primary} border-b-2 border-${theme.colors.primary}`
                      : `text-${theme.colors.text} border-b-2 border-transparent hover:text-${theme.colors.primary} hover:border-${theme.colors.primary}`
                    }
                  `}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDarkMode ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </Button>

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
                className={`
                  flex items-center px-3 py-2
                  text-base font-medium
                  ${isActive(item.href)
                    ? `text-${theme.colors.primary} bg-${theme.colors.surface}`
                    : `text-${theme.colors.text} hover:bg-${theme.colors.surface} hover:text-${theme.colors.primary}`
                  }
                `}
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