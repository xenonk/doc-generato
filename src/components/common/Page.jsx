import React from 'react';
import Header from '../Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  contentClassName = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 w-full">
        {/* Left Sidebar */}
        {leftSidebar && (
          <aside className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white">
            {leftSidebar}
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
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
        </main>
      </div>
    </div>
  );
};

export default Page; 