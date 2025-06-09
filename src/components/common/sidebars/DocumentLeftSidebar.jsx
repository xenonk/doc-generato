import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import DocumentWorkspace from '../workspaces/DocumentWorkspace';
import VersionHistory from '../VersionHistory/VersionHistory';
import ChangesModal from '../modals/ChangesModal';
import { getChanges } from '../../../utils/objectUtils';

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
  onCollaborationClick
}) => {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className={`flex-1 ${isCollapsed ? 'px-2' : 'p-6'}`}>
        {/* Import Data */}
        {!isCollapsed && <h3 className="text-sm font-medium text-gray-900 mb-3">Import Data</h3>}
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

        {/* Document Workspace */}
        <div className={isCollapsed ? 'mb-2' : 'mb-6'}>
          <DocumentWorkspace
            selectedWorkspaces={selectedWorkspaces}
            onWorkspaceChange={setSelectedWorkspaces}
            isCollapsed={isCollapsed}
            documentType={documentType}
          />
        </div>

        {/* Version History */}
        <VersionHistory
          versions={versions}
          currentVersion={currentVersion}
          onVersionSelect={onVersionSelect}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Status Indicator */}
      <div className={`border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
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
          title={hasUnsavedChanges ? "Click to view unsaved changes" : "Click to check status"}
          onMouseEnter={() => !hasUnsavedChanges && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {hasUnsavedChanges ? (
            <AlertCircle className="w-7 h-7 text-yellow-500 hover:text-yellow-600 transition-colors" />
          ) : (
            <CheckCircle2 className="w-7 h-7 text-green-500" />
          )}
          
          {/* Tooltip */}
          {showTooltip && !hasUnsavedChanges && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
              No unsaved changes
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-8 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
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