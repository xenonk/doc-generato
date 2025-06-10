import React from 'react';
import { Menu } from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, children }) => {
  return (
    <>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
      <div className="flex flex-col h-full bg-white border-r border-gray-200 px-4">
        {children}
      </div>
    </>
  );
};

export default Sidebar; 