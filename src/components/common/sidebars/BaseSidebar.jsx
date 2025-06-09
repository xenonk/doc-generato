import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BaseSidebar = ({
  children,
  isCollapsed = false,
  onToggle,
  className = '',
  position = 'left', // 'left' or 'right'
  width = {
    expanded: 'w-64',
    collapsed: 'w-16'
  },
  toggleButtonPosition = 'top-4',
  toggleButtonOffset = '-right-3',
  toggleButtonIcon = {
    expanded: ChevronLeft,
    collapsed: ChevronRight
  }
}) => {
  const ExpandedIcon = toggleButtonIcon.expanded;
  const CollapsedIcon = toggleButtonIcon.collapsed;

  return (
    <div className="relative">
      <aside 
        className={`bg-white border-r border-gray-200 min-h-[calc(100vh-50px)] transition-all duration-300 ${
          isCollapsed ? width.collapsed : width.expanded
        } ${className} ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
            {children}
          </div>
        </div>
      </aside>

      <button
        onClick={onToggle}
        className={`absolute ${toggleButtonPosition} ${toggleButtonOffset} w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm z-10`}
      >
        {isCollapsed ? (
          <CollapsedIcon className="w-3.5 h-3.5" />
        ) : (
          <ExpandedIcon className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

export default BaseSidebar; 