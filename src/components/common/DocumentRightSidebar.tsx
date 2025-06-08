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

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'expired';
type ExportType = 'pdf' | 'docx' | 'json' | 'xlsx' | 'print' | 'share';
type SaveType = 'final' | 'draft';

interface StatusConfig {
  [key: string]: {
    color: string;
    bgColor: string;
  };
}

interface DocumentRightSidebarProps {
  documentType?: string;
  onPreview?: () => void;
  onExport?: (type: ExportType) => void;
  onSave?: (type: SaveType) => void;
  isSaving?: boolean;
  showExportDropdown?: boolean;
  onExportDropdownToggle?: () => void;
  showSaveDropdown?: boolean;
  onSaveDropdownToggle?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  status?: DocumentStatus;
  lastSaved?: string;
}

const DocumentRightSidebar: React.FC<DocumentRightSidebarProps> = ({
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
  const formatTime = (date: Date): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const statusConfig: StatusConfig = {
    draft: { color: 'text-gray-500', bgColor: 'bg-gray-100' },
    review: { color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    approved: { color: 'text-green-500', bgColor: 'bg-green-100' },
    rejected: { color: 'text-red-500', bgColor: 'bg-red-100' },
    expired: { color: 'text-orange-500', bgColor: 'bg-orange-100' }
  };

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
                          onExport?.('pdf');
                          onExportDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Generate PDF</span>
                      </button>
                      <button 
                        onClick={() => {
                          onExport?.('docx');
                          onExportDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Generate DOCX</span>
                      </button>
                      <button 
                        onClick={() => {
                          onExport?.('json');
                          onExportDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileJson className="w-4 h-4" />
                        <span>Export JSON</span>
                      </button>
                      <button 
                        onClick={() => {
                          onExport?.('xlsx');
                          onExportDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export XLSX</span>
                      </button>
                      <button 
                        onClick={() => {
                          onExport?.('print');
                          onExportDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                      </button>
                      <button 
                        onClick={() => {
                          onExport?.('share');
                          onExportDropdownToggle?.();
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
                          onSave?.('final');
                          onSaveDropdownToggle?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Save as Final</span>
                      </button>
                      <button 
                        onClick={() => {
                          onSave?.('draft');
                          onSaveDropdownToggle?.();
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

          {/* Status and Last Saved */}
          <div className={`border-t border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
            <div className="space-y-2">
              {/* Status */}
              <div className={`text-xs ${isCollapsed ? 'text-center' : ''}`}>
                <span className={`inline-block px-2 py-1 rounded-full ${statusConfig[status]?.bgColor || 'bg-gray-100'} ${statusConfig[status]?.color || 'text-gray-500'}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              {/* Last Saved */}
              <div className={`text-xs text-gray-500 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                {!isCollapsed ? (
                  <>
                    <span>Last saved: </span>
                    <span>{lastSaved ? formatTime(new Date(lastSaved)) : 'Never'}</span>
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px]">Last</span>
                    <span className="text-[10px]">saved</span>
                    <span className="text-[10px]">{lastSaved ? formatTime(new Date(lastSaved)) : 'Never'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
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

export default DocumentRightSidebar; 