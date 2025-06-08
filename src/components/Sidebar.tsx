import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  children,
  className = ''
}) => {
  return (
    <div className="relative">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 min-h-[calc(100vh-50px)] transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${className}`}
      >
        {children}
      </aside>

      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

export default Sidebar; 