import React from 'react';
import { ChevronLeft, ChevronRight, Save, Share2, Download, Printer, MoreVertical } from 'lucide-react';

interface RightSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onMore: () => void;
  children?: React.ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isCollapsed,
  onToggle,
  onSave,
  onShare,
  onDownload,
  onPrint,
  onMore,
  children
}) => {
  return (
    <div className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Save className="w-4 h-4" />
              {!isCollapsed && <span>Save</span>}
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              {!isCollapsed && <span>Share</span>}
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              {!isCollapsed && <span>Download</span>}
            </button>
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              {!isCollapsed && <span>Print</span>}
            </button>
            <button
              onClick={onMore}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <MoreVertical className="w-4 h-4" />
              {!isCollapsed && <span>More</span>}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}; 