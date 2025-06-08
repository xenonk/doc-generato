import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ 
  children, 
  isCollapsed = false, 
  onToggle, 
  className = '' 
}) => {
  return (
    <div 
      className={`relative bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } ${className}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 