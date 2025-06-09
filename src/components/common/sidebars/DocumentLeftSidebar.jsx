import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Building2, History, User, 
  Search, X, CheckCircle2, AlertCircle, Save, XCircle,
  ChevronDown, ChevronRight, ChevronLeft
} from 'lucide-react';
import VersionHistory from '../VersionHistory/VersionHistory';
import { getChanges } from '../../../utils/objectUtils';
import DocumentWorkspace from '../workspaces/DocumentWorkspace';
import ChangesModal from '../modals/ChangesModal';

// Main DocumentSidebarContent Component
const DocumentSidebarContent = ({ 
  documentType = 'Document',
  versions = [], 
  currentVersion,
  onVersionSelect,
  hasUnsavedChanges,
  isCollapsed,
  onSave,
  lastSavedState,
  document,
  onCollaborationClick
}) => {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([
    { id: 1, name: `Current ${documentType}`, documents: 1 }
  ]);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStatusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasUnsavedChanges) {
      setShowChangesModal(true);
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await onSave('draft');
      setShowChangesModal(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`p-6 flex-1 transition-all duration-300 ${isCollapsed ? 'px-3' : ''}`}>
        {/* Import Data */}
        <div className={`mb-6 ${isCollapsed ? '' : ''}`}>
          {!isCollapsed && <h3 className="text-sm font-medium text-gray-900 mb-3">Import Data</h3>}
          <div className={`border-2 border-dashed border-gray-300 rounded-lg ${isCollapsed ? 'p-2' : 'p-6'} text-center`}>
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
        </div>

        {/* Document Workspace */}
        <div className={isCollapsed ? '' : 'mb-6'}>
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
      <div className={`border-t border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`text-xs text-gray-500 ${isCollapsed ? 'text-center' : ''} relative`}>
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
          >
            {hasUnsavedChanges ? (
              <div className="flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-yellow-500 hover:text-yellow-600 transition-colors" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          {showTooltip && !hasUnsavedChanges && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
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
        <ChangesModal
          isOpen={showChangesModal}
          onClose={() => setShowChangesModal(false)}
          onSave={handleSaveChanges}
          changes={lastSavedState ? getChanges(lastSavedState, document) : []}
        />
      )}
    </div>
  );
};

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
  return (
    <div className={`h-full bg-white border-r border-gray-200 ${isCollapsed ? 'w-12' : 'w-64'} transition-all duration-300`}>
      <DocumentSidebarContent
        isCollapsed={isCollapsed}
        documentType={documentType}
        versions={versions}
        currentVersion={currentVersion}
        onVersionSelect={onVersionSelect}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={onSave}
        lastSavedState={lastSavedState}
        document={document}
        onCollaborationClick={onCollaborationClick}
      />
    </div>
  );
};

export default DocumentLeftSidebar; 