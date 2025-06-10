import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Menu } from 'lucide-react';
import DocumentWorkspace from '../workspaces/DocumentWorkspace';
import VersionHistory from '../VersionHistory/VersionHistory';
import ChangesModal from '../modals/ChangesModal';
import { getChanges } from '../../../utils/objectUtils';
import DocumentActions from './DocumentActions';

const DocumentLeftSidebar = ({ 
  isCollapsed, 
  documentType,
  versions = [],
  currentVersion,
  onVersionSelect,
  hasUnsavedChanges,
  onSave,
  lastSavedState,
  document,
  onCollaborationClick,
  onPreview,
  onExport,
  isSaving,
  lastSaved,
  onLeftSidebarToggle
}) => {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (hasUnsavedChanges) {
      setShowChangesModal(true);
    }
  };

  const handleSaveChanges = () => {
    onSave();
    setShowChangesModal(false);
  };

  // Helper to format time as 24-hour HH:mm
  const formatTime = (date, withDate = false) => {
    if (!date) return 'Never';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (!withDate) {
      return `${hours}:${minutes}`;
    }
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Overlay Hamburger Toggle Button */}
      <button
        onClick={onLeftSidebarToggle}
        className="absolute top-1 left-3 w-10 h-10 flex items-center justify-center p-0 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:outline-none z-10"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{ minWidth: '40px', minHeight: '40px' }}
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Sidebar Content (no Actions title) */}
      <div className={`flex-1 ${isCollapsed ? 'px-2 pt-12' : 'p-6 pt-12'}`}>
        <div className="mb-6 mt-0">
          <DocumentActions
            onPreview={onPreview}
            onExport={onExport}
            onSave={onSave}
            isSaving={isSaving}
            showExportDropdown={showExportDropdown}
            onExportDropdownToggle={() => setShowExportDropdown(!showExportDropdown)}
            showSaveDropdown={showSaveDropdown}
            onSaveDropdownToggle={() => setShowSaveDropdown(!showSaveDropdown)}
            lastSaved={lastSaved}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Document Workspace */}
        <div className={isCollapsed ? 'mb-2' : 'mb-6'}>
          <DocumentWorkspace
            selectedWorkspaces={selectedWorkspaces}
            onWorkspaceChange={setSelectedWorkspaces}
            isCollapsed={isCollapsed}
            documentType={documentType}
          />
        </div>

        {/* Upload */}
        <div className={`border-2 border-dashed border-gray-300 rounded-lg ${isCollapsed ? 'p-2' : 'p-6'} text-center ${isCollapsed ? 'mb-2' : 'mb-6'}`}>
          {isCollapsed ? (
            <Upload className="w-5 h-5 mx-auto text-gray-400" />
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drop file here or</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Browse Files</button>
              <p className="text-xs text-gray-500 mt-1">Supported: .xlsx, .xls, .docx, .pdf</p>
            </>
          )}
        </div>

        {/* Last Saved and Status Row */}
        <div className={`${isCollapsed ? 'flex flex-col items-center text-center gap-1 mb-4' : 'flex items-center justify-between gap-2 mb-4'}`}>
          {/* Last Saved */}
          <div className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
            {isCollapsed ? (
               <span>{formatTime(lastSaved)}</span>
            ) : (
              <>
                <span>Last saved: </span>
                <span>{formatTime(lastSaved, true)}</span>
              </>
            )}
          </div>
          {/* Status Button */}
          <div className="relative flex items-center justify-center">
            <div
              onClick={handleStatusClick}
              className={`cursor-pointer ${hasUnsavedChanges ? 'hover:bg-gray-50 rounded-lg p-1' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleStatusClick(e);
                }
              }}
              title="Click to check status"
              onMouseEnter={() => !hasUnsavedChanges && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {hasUnsavedChanges ? (
                <AlertCircle className="w-7 h-7 text-yellow-500 hover:text-yellow-600 transition-colors" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              )}
            </div>
            {showTooltip && !hasUnsavedChanges && (
              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                No unsaved changes
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="border-8 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Version History */}
        <VersionHistory
          versions={versions}
          currentVersion={currentVersion}
          onVersionSelect={onVersionSelect}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50">
          <ChangesModal
            isOpen={showChangesModal}
            onClose={() => setShowChangesModal(false)}
            onSave={handleSaveChanges}
            changes={lastSavedState ? getChanges(lastSavedState, document) : []}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentLeftSidebar;