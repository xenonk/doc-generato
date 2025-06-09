import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Download,
  Printer,
  Share2,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import BaseSidebar from './BaseSidebar';

const DocumentRightSidebar = ({
  documentType = 'Document',
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
  status = 'draft',
  lastSaved
}) => {
  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const statusConfig = {
    draft: { color: 'text-gray-500', bgColor: 'bg-gray-100' },
    review: { color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    approved: { color: 'text-green-500', bgColor: 'bg-green-100' },
    rejected: { color: 'text-red-500', bgColor: 'bg-red-100' },
    expired: { color: 'text-orange-500', bgColor: 'bg-orange-100' }
  };

  return (
    <BaseSidebar
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      position="right"
      width={{
        expanded: 'w-40',
        collapsed: 'w-10'
      }}
      toggleButtonPosition="top-4"
      toggleButtonOffset="-left-3"
      toggleButtonIcon={{
        expanded: ChevronRight,
        collapsed: ChevronLeft
      }}
    >
      <div className="flex flex-col h-full">
        <div className={`p-4 space-y-4 flex-1 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && <h3 className="text-sm font-medium text-gray-900">Actions</h3>}
          <div className="space-y-3">
            {/* Preview Button */}
            <button
              onClick={onPreview}
              className={`w-full ${isCollapsed ? 'p-2' : 'px-4 py-2'} text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center space-x-2`}
              title={isCollapsed ? "Preview" : undefined}
            >
              <Eye className="w-4 h-4" />
              {!isCollapsed && <span>Preview</span>}
            </button>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={onExportDropdownToggle}
                className={`w-full bg-green-600 text-white ${isCollapsed ? 'p-2' : 'px-4 py-2'} rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700`}
                title={isCollapsed ? "Export" : undefined}
              >
                <Download className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span>Export</span>
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </button>
              {showExportDropdown && (
                <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0 mt-2'} w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10`}>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        onExport('pdf');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate PDF</span>
                    </button>
                    <button 
                      onClick={() => {
                        onExport('docx');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate DOCX</span>
                    </button>
                    <button 
                      onClick={() => {
                        onExport('json');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileJson className="w-4 h-4" />
                      <span>Export JSON</span>
                    </button>
                    <button 
                      onClick={() => {
                        onExport('xlsx');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export XLSX</span>
                    </button>
                    <button 
                      onClick={() => {
                        onExport('print');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                    <button 
                      onClick={() => {
                        onExport('share');
                        onExportDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="relative">
              <button
                onClick={onSaveDropdownToggle}
                className={`w-full bg-blue-600 text-white ${isCollapsed ? 'p-2' : 'px-4 py-2'} rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700`}
                disabled={isSaving}
                title={isCollapsed ? (isSaving ? "Saving..." : "Save") : undefined}
              >
                {isCollapsed ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <>
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </button>
              {showSaveDropdown && (
                <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0 mt-2'} w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10`}>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        onSave('final');
                        onSaveDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Save as Final</span>
                    </button>
                    <button 
                      onClick={() => {
                        onSave('draft');
                        onSaveDropdownToggle();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Last Saved Time */}
        <div className={`border-t border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`text-xs text-gray-500 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {!isCollapsed ? (
              <>
                <span>Last saved: </span>
                <span>{lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}</span>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[10px]">Last</span>
                <span className="text-[10px]">saved</span>
                <span className="text-[10px]">{lastSaved ? formatTime(lastSaved) : 'Never'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSidebar>
  );
};

export default DocumentRightSidebar; 