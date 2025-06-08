import React from 'react';
import { 
  ChevronLeft, ChevronRight, Save, Send, Download, 
  Printer, Share2, Eye, FileText, CheckCircle2
} from 'lucide-react';

const ContractRightSidebar = ({ 
  onPreview, 
  onExport, 
  onSave, 
  isSaving,
  showExportDropdown,
  onExportDropdownToggle,
  showSaveDropdown,
  onSaveDropdownToggle,
  isCollapsed,
  onToggle,
  status = 'draft'
}) => {
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const statusConfig = {
    draft: { icon: FileText, color: 'text-gray-500', label: 'Draft' },
    review: { icon: Send, color: 'text-yellow-500', label: 'In Review' },
    approved: { icon: CheckCircle2, color: 'text-green-500', label: 'Approved' },
    rejected: { icon: FileText, color: 'text-red-500', label: 'Rejected' },
    expired: { icon: FileText, color: 'text-orange-500', label: 'Expired' }
  };

  const StatusIcon = statusConfig[status]?.icon || FileText;
  const statusColor = statusConfig[status]?.color || 'text-gray-500';
  const statusLabel = statusConfig[status]?.label || 'Draft';

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-l border-gray-200 h-full transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'w-10' : 'w-40'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-4 space-y-4 flex-1 ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed && <h3 className="text-sm font-medium text-gray-900">Actions</h3>}
            
            {/* Status */}
            <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <StatusIcon className={`w-4 h-4 ${statusColor}`} />
              {!isCollapsed && <span className="text-sm text-gray-600">{statusLabel}</span>}
            </div>

            {/* Action Buttons */}
            <div className="space-y-1">
              <button
                onClick={onSave}
                disabled={isSaving}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <Save className="w-4 h-4" />
                {!isCollapsed && <span>{isSaving ? 'Saving...' : 'Save'}</span>}
              </button>

              <button
                onClick={onPreview}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <Eye className="w-4 h-4" />
                {!isCollapsed && <span>Preview</span>}
              </button>

              <button
                onClick={onExport}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <Download className="w-4 h-4" />
                {!isCollapsed && <span>Export</span>}
              </button>

              <button
                onClick={() => {/* Implement print logic */}}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <Printer className="w-4 h-4" />
                {!isCollapsed && <span>Print</span>}
              </button>

              <button
                onClick={() => {/* Implement share logic */}}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <Share2 className="w-4 h-4" />
                {!isCollapsed && <span>Share</span>}
              </button>
            </div>
          </div>

          {/* Last Saved Time */}
          <div className={`border-t border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
            <div className={`text-xs text-gray-500 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              {!isCollapsed ? (
                <>
                  <span>Last saved: </span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[10px]">Last</span>
                  <span className="text-[10px]">saved</span>
                  <span className="text-[10px]">{formatTime(new Date())}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm z-10"
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

export default ContractRightSidebar; 