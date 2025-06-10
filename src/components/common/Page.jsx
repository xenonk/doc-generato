import React from 'react';
import Header from '../Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

const Page = ({
  // Header props
  showHeader = true,
  
  // Sidebar props
  leftSidebar,
  
  // Content props
  children,
  className = '',
  
  // Breadcrumbs props
  showBreadcrumbs = false,
  breadcrumbs = [],
  
  // Layout props
  fullHeight = true,
  contentClassName = '',
  
  // Sidebar toggle props
  isLeftSidebarCollapsed = false,
  onLeftSidebarToggle,
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 w-full">
        {/* Left Sidebar */}
        <aside
          className={`w-full flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300
            ${isLeftSidebarCollapsed ? 'md:w-16' : 'md:w-80'}`}
        >
          {leftSidebar}
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Page; 