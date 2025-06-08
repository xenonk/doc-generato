import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Building2, History, User, 
  Search, X, CheckCircle2, AlertCircle, Save, XCircle,
  ChevronDown, ChevronRight, ChevronLeft
} from 'lucide-react';
import VersionHistory from '../VersionHistory/VersionHistory';

// Helper function to compare objects and get changes
const getChanges = (oldObj, newObj, prefix = '') => {
  const changes = [];
  
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      changes.push(...getChanges(oldObj[key] || {}, newObj[key], `${prefix}${key}.`));
    } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      changes.push(`${prefix}${fieldName} changed from "${oldObj[key] || 'empty'}" to "${newObj[key] || 'empty'}"`);
    }
  }
  
  return changes;
};

// Document Workspace Component
const DocumentWorkspace = ({ selectedWorkspaces, onWorkspaceChange, isCollapsed, documentType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Mock workspaces data - in real app this would come from an API
  const allWorkspaces = [
    { id: 1, name: `Current ${documentType}`, documents: 1 },
    { id: 2, name: `Q1 2024 ${documentType}s`, documents: 5 },
    { id: 3, name: 'Client Templates', documents: 3 },
    { id: 4, name: 'Pending Reviews', documents: 2 },
    { id: 5, name: `Archived ${documentType}s`, documents: 12 },
    { id: 6, name: `Draft ${documentType}s`, documents: 4 },
    { id: 7, name: `Approved ${documentType}s`, documents: 8 },
    { id: 8, name: 'Client A Projects', documents: 3 },
    { id: 9, name: 'Client B Projects', documents: 6 },
    { id: 10, name: 'Urgent Documents', documents: 2 }
  ];

  const filteredWorkspaces = allWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspaceToggle = (workspace) => {
    const isSelected = selectedWorkspaces.some(w => w.id === workspace.id);
    if (isSelected) {
      onWorkspaceChange(selectedWorkspaces.filter(w => w.id !== workspace.id));
    } else {
      onWorkspaceChange([...selectedWorkspaces, workspace]);
    }
  };

  const handleRemoveWorkspace = (workspaceId) => {
    onWorkspaceChange(selectedWorkspaces.filter(w => w.id !== workspaceId));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isCollapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div 
          onMouseEnter={() => setIsOpen(true)}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          title="Workspaces"
        >
          <Building2 className="w-5 h-5 text-gray-500" />
        </div>
        {isOpen && (
          <div 
            onMouseLeave={() => setIsOpen(false)}
            className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workspaces..."
                  className="w-full pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedWorkspaces.map(workspace => (
                  <div
                    key={workspace.id}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                  >
                    <span>{workspace.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWorkspace(workspace.id);
                      }}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredWorkspaces.map(workspace => (
                  <div
                    key={workspace.id}
                    onClick={() => handleWorkspaceToggle(workspace)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      selectedWorkspaces.some(w => w.id === workspace.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{workspace.name}</span>
                      <span className="text-xs text-gray-500">({workspace.documents})</span>
                    </div>
                    {selectedWorkspaces.some(w => w.id === workspace.id) && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Document Workspace</h3>
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[40px] border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <div className="flex flex-wrap gap-2">
            {selectedWorkspaces.length > 0 ? (
              selectedWorkspaces.map(workspace => (
                <div
                  key={workspace.id}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  <span>{workspace.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWorkspace(workspace.id);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Select workspaces...</span>
            )}
          </div>
          <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workspaces..."
                  className="w-full pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-48">
              {filteredWorkspaces.length > 0 ? (
                filteredWorkspaces.map(workspace => (
                  <div
                    key={workspace.id}
                    onClick={() => handleWorkspaceToggle(workspace)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      selectedWorkspaces.some(w => w.id === workspace.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{workspace.name}</span>
                      <span className="text-xs text-gray-500">({workspace.documents})</span>
                    </div>
                    {selectedWorkspaces.some(w => w.id === workspace.id) && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">No workspaces found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Changes Modal Component
const ChangesModal = ({ isOpen, onClose, onSave, changes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-3">
            {changes.map((change, index) => (
              <div key={index} className="text-sm text-gray-600">
                {change}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default DocumentSidebarContent; 