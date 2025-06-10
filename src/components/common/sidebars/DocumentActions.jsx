import React from 'react';
import {
  Save,
  Download,
  Printer,
  Share2,
  Eye,
  FileText,
  FileJson,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

const DocumentActions = ({
  onPreview,
  onExport,
  onSave,
  isSaving,
  showExportDropdown,
  onExportDropdownToggle,
  showSaveDropdown,
  onSaveDropdownToggle,
  status = 'draft',
  lastSaved,
  isCollapsed
}) => {
  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="mb-6">
      <div className="space-y-3">
        {/* Preview Button */}
        <button
          onClick={onPreview}
          className={`w-full ${isCollapsed ? 'p-2' : 'px-4 py-2'} text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center space-x-2`}
        >
          <Eye className="w-4 h-4" />
          {!isCollapsed && <span>Preview</span>}
        </button>

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={onExportDropdownToggle}
            className={`w-full bg-green-600 text-white ${isCollapsed ? 'p-2' : 'px-4 py-2'} rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700`}
          >
            <Download className="w-4 h-4" />
            {!isCollapsed && <span>Export</span>}
          </button>
          {showExportDropdown && (
            <div className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}>
              <button 
                onClick={() => { onExport('pdf'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate PDF</span>
              </button>
              <button 
                onClick={() => { onExport('docx'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate DOCX</span>
              </button>
              <button 
                onClick={() => { onExport('json'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileJson className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
              <button 
                onClick={() => { onExport('xlsx'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export XLSX</span>
              </button>
              <button 
                onClick={() => { onExport('print'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button 
                onClick={() => { onExport('share'); onExportDropdownToggle(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="relative">
          <button
            onClick={onSaveDropdownToggle}
            className={`w-full bg-blue-600 text-white ${isCollapsed ? 'p-2' : 'px-4 py-2'} rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700`}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {!isCollapsed && <span>{isSaving ? 'Saving...' : 'Save'}</span>}
          </button>
          {showSaveDropdown && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button 
                  onClick={() => { onSave('final'); onSaveDropdownToggle(); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Save as Final</span>
                </button>
                <button 
                  onClick={() => { onSave('draft'); onSaveDropdownToggle(); }}
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
  );
};

export default DocumentActions; 