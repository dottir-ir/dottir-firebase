import { useTheme } from '../../contexts/ThemeContext';

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: string[];
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  userRole?: string;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  userRole,
  isCollapsed = false,
  onCollapse,
}) => {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const filteredItems = items.filter(
    (item) => !item.roles || item.roles.includes(userRole || '')
  );

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);

    return (
      <div key={item.label}>
        <a
          href={item.href}
          className={`
            flex items-center px-4 py-2
            text-sm font-medium
            text-${theme.colors.text}
            hover:bg-${theme.colors.surface}
            hover:text-${theme.colors.primary}
            ${level > 0 ? 'pl-' + (level * 4 + 4) : ''}
          `}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleItem(item.label);
            }
          }}
        >
          {item.icon && (
            <span className="mr-3 flex-shrink-0">{item.icon}</span>
          )}
          {!isCollapsed && (
            <>
              <span className="flex-grow">{item.label}</span>
              {hasChildren && (
                <svg
                  className={`h-4 w-4 transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </>
          )}
        </a>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children?.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full
        bg-${theme.colors.background}
        border-r border-gray-200
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <span className="text-xl font-bold text-primary">MedCase</span>
          )}
          <button
            onClick={onCollapse}
            className={`
              p-2 rounded-md
              text-${theme.colors.text}
              hover:bg-${theme.colors.surface}
            `}
          >
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
                d={
                  isCollapsed
                    ? 'M13 5l7 7-7 7M5 5l7 7-7 7'
                    : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                }
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredItems.map((item) => renderItem(item))}
        </nav>
      </div>
    </aside>
  );
}; 