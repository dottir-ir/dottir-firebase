import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
export const Sidebar = ({ items, userRole, isCollapsed = false, onCollapse, }) => {
    const { theme } = useTheme();
    const [expandedItems, setExpandedItems] = useState([]);
    const toggleItem = (label) => {
        setExpandedItems((prev) => prev.includes(label)
            ? prev.filter((item) => item !== label)
            : [...prev, label]);
    };
    const filteredItems = items.filter((item) => !item.roles || item.roles.includes(userRole || ''));
    const renderItem = (item, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.label);
        return (_jsxs("div", { children: [_jsxs("a", { href: item.href, className: `
            flex items-center px-4 py-2
            text-sm font-medium
            text-${theme.colors.text}
            hover:bg-${theme.colors.surface}
            hover:text-${theme.colors.primary}
            ${level > 0 ? 'pl-' + (level * 4 + 4) : ''}
          `, onClick: (e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            toggleItem(item.label);
                        }
                    }, children: [item.icon && (_jsx("span", { className: "mr-3 flex-shrink-0", children: item.icon })), !isCollapsed && (_jsxs(_Fragment, { children: [_jsx("span", { className: "flex-grow", children: item.label }), hasChildren && (_jsx("svg", { className: `h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }))] }))] }), hasChildren && isExpanded && !isCollapsed && (_jsx("div", { className: "mt-1", children: item.children?.map((child) => renderItem(child, level + 1)) }))] }, item.label));
    };
    return (_jsx("aside", { className: `
        fixed left-0 top-0 h-full
        bg-${theme.colors.background}
        border-r border-gray-200
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `, children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between p-4", children: [!isCollapsed && (_jsx("span", { className: "text-xl font-bold text-primary", children: "MedCase" })), _jsx("button", { onClick: onCollapse, className: `
              p-2 rounded-md
              text-${theme.colors.text}
              hover:bg-${theme.colors.surface}
            `, children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: isCollapsed
                                        ? 'M13 5l7 7-7 7M5 5l7 7-7 7'
                                        : 'M11 19l-7-7 7-7m8 14l-7-7 7-7' }) }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4", children: filteredItems.map((item) => renderItem(item)) })] }) }));
};
