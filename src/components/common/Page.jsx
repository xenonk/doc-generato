import React from 'react';
import Header from '../Header';
import BaseSidebar from './sidebars/BaseSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Page = ({
  // Header props
  showHeader = true,
  
  // Sidebar props
  leftSidebar,
  rightSidebar,
  isLeftSidebarCollapsed = false,
  isRightSidebarCollapsed = false,
  onLeftSidebarToggle,
  onRightSidebarToggle,
  leftSidebarWidth = {
    expanded: 'w-80',
    collapsed: 'w-16'
  },
  rightSidebarWidth = {
    expanded: 'w-64',
    collapsed: 'w-16'
  },
  
  // Content props
  children,
  className = '',
  
  // Breadcrumbs props
  showBreadcrumbs = false,
  breadcrumbs = [],
  
  // Layout props
  fullHeight = true,
  contentClassName = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main Layout */}
      <div className="grid grid-cols-[20rem_1fr_16rem] items-stretch w-full">
        {/* Left Sidebar */}
        {leftSidebar && (
          <BaseSidebar
            className=""
            isCollapsed={isLeftSidebarCollapsed}
            onToggle={onLeftSidebarToggle}
            position="left"
            width={leftSidebarWidth}
            toggleButtonPosition="top-4"
            toggleButtonOffset="-right-3"
            toggleButtonIcon={{
              expanded: ChevronLeft,
              collapsed: ChevronRight
            }}
          >
            {leftSidebar}
          </BaseSidebar>
        )}
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ${contentClassName}`}>
          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                      )}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className={`text-sm ${
                            index === breadcrumbs.length - 1
                              ? 'text-gray-900 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-900 font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
        
        {/* Right Sidebar */}
        {rightSidebar && (
          <BaseSidebar
            className=""
            isCollapsed={isRightSidebarCollapsed}
            onToggle={onRightSidebarToggle}
            position="right"
            width={rightSidebarWidth}
            toggleButtonPosition="top-4"
            toggleButtonOffset="-left-3"
            toggleButtonIcon={{
              expanded: ChevronRight,
              collapsed: ChevronLeft
            }}
          >
            {rightSidebar}
          </BaseSidebar>
        )}
      </div>
    </div>
  );
};

export default Page; 