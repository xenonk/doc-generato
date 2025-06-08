import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  ChevronDown, Upload, Plus, Trash2, FileText, 
  Download, FileJson, FileSpreadsheet, Settings, Moon, LogOut, User, Building2, Mail, History,
  Search, X, CheckCircle2, AlertCircle, Save, XCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { getUserProfile } from '../utils/auth';
import Header from '../components/Header';
import BaseSidebar from '../components/common/sidebars/BaseSidebar';
import WarningDialog from '../components/WarningDialog';

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

// Helper function to format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

// Version History Item Component
const VersionHistoryItem = ({ version, isCurrent, onClick, isCollapsed }) => {
  const getStatusColor = (isCurrent) => isCurrent ? 'bg-green-500' : 'bg-gray-300';
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? `${version.name} - ${version.user.name} (${formatDateTime(version.created_at)})` : undefined}
    >
      <div className={`w-2 h-2 ${getStatusColor(isCurrent)} rounded-full`}></div>
      {!isCollapsed && (
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
              {version.name}
            </p>
            <span className="text-xs text-gray-500">{formatDateTime(version.created_at)}</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
              {version.user.avatar ? (
                <img src={version.user.avatar} alt={version.user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3 h-3 text-gray-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">{version.user.name}</p>
          </div>
        </div>
      )}
    </button>
  );
};

// Version History Component
const VersionHistory = ({ versions, currentVersion, onVersionSelect, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
          title="Version History"
        >
          <History className="w-5 h-5 text-gray-500" />
        </div>
        {isOpen && (
          <div 
            onMouseLeave={() => setIsOpen(false)}
            className="absolute left-full top-0 ml-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Version History</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {versions.map((version) => (
                <VersionHistoryItem
                  key={version.id}
                  version={version}
                  isCurrent={version.id === currentVersion?.id}
                  onClick={() => {
                    onVersionSelect(version);
                    setIsOpen(false);
                  }}
                  isCollapsed={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Version History</h3>
        <History className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-1">
        {versions.map((version) => (
          <VersionHistoryItem
            key={version.id}
            version={version}
            isCurrent={version.id === currentVersion?.id}
            onClick={() => onVersionSelect(version)}
            isCollapsed={false}
          />
        ))}
      </div>
    </div>
  );
};

// Document Workspace Component
const DocumentWorkspace = ({ selectedWorkspaces, onWorkspaceChange, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Mock workspaces data - in real app this would come from an API
  const allWorkspaces = [
    { id: 1, name: 'Current Invoice', documents: 1 },
    { id: 2, name: 'Q1 2024 Invoices', documents: 5 },
    { id: 3, name: 'Client Templates', documents: 3 },
    { id: 4, name: 'Pending Reviews', documents: 2 },
    { id: 5, name: 'Archived Invoices', documents: 12 },
    { id: 6, name: 'Draft Invoices', documents: 4 },
    { id: 7, name: 'Approved Invoices', documents: 8 },
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

  // Close dropdown when clicking outside
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
                        onWorkspaceChange(selectedWorkspaces.filter(w => w.id !== workspace.id));
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
        {/* Selected Workspaces Display */}
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

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-hidden">
            {/* Search Input */}
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

            {/* Workspace List */}
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

// Invoice Sidebar Content Component
const InvoiceSidebarContent = ({ 
  versions = [], 
  currentVersion,
  onVersionSelect,
  hasUnsavedChanges,
  isCollapsed,
  onSave,
  lastSavedState,
  invoice
}) => {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([
    { id: 1, name: 'Current Invoice', documents: 1 }
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
      setTimeout(() => setShowTooltip(false), 2000); // Hide tooltip after 2 seconds
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
                <p className="text-sm text-gray-600">Drop XLSX file here or</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Browse Files</button>
                <p className="text-xs text-gray-500 mt-1">Supported: .xlsx, .xls</p>
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

      {showChangesModal && (
        <ChangesModal
          isOpen={showChangesModal}
          onClose={() => setShowChangesModal(false)}
          onSave={handleSaveChanges}
          changes={lastSavedState ? getChanges(lastSavedState, invoice) : []}
        />
      )}
    </div>
  );
};

// Right Sidebar Action Bar Component
const RightSidebar = ({ 
  onPreview, 
  onExport, 
  onSave, 
  isSaving,
  showExportDropdown,
  onExportDropdownToggle,
  showSaveDropdown,
  onSaveDropdownToggle,
  isCollapsed,
  onToggle
}) => {
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
                <FileText className="w-4 h-4" />
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
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
                {showExportDropdown && (
                  <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0 mt-2'} w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10`}>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate PDF</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate DOCX</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <FileJson className="w-4 h-4" />
                        <span>Export JSON</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export XLSX</span>
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
                      <ChevronDown className="w-4 h-4" />
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

// Invoice Form Component
const InvoiceForm = ({ 
  invoice, 
  companies, 
  contracts, 
  onFieldChange, 
  onContractChange, 
  onCompanyChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onSave,
  isSaving
}) => {
  const [selectedContract, setSelectedContract] = useState('');
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const handleContractSelect = (contractId) => {
    setSelectedContract(contractId);
    onContractChange(contractId);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Invoice Header Block */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Professional Invoice Document</p>
          </div>
        </div>

        {/* Invoice Number and Date */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoice.number}
              onChange={(e) => onFieldChange('number', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => onFieldChange('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Contract Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contract</label>
          <div className="relative">
            <select
              value={selectedContract}
              onChange={(e) => handleContractSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 appearance-none bg-white"
            >
              <option value="">Select Contract</option>
              {contracts.map(contract => (
                <option key={contract.id} value={contract.id}>
                  {contract.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* From/To Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">From (Seller)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={invoice.seller?.company || ''}
                  onChange={(e) => onCompanyChange('seller', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoice.seller?.address || ''}
                  onChange={(e) => onFieldChange('seller.address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                  <input
                    type="text"
                    value={invoice.seller?.director || ''}
                    onChange={(e) => onFieldChange('seller.director', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoice.seller?.email || ''}
                    onChange={(e) => onFieldChange('seller.email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">To (Buyer)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={invoice.buyer?.company || ''}
                  onChange={(e) => onCompanyChange('buyer', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={invoice.buyer?.address || ''}
                  onChange={(e) => onFieldChange('buyer.address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={invoice.buyer?.contactPerson || ''}
                    onChange={(e) => onFieldChange('buyer.contactPerson', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoice.buyer?.email || ''}
                    onChange={(e) => onFieldChange('buyer.email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Information</label>
          <textarea
            value={invoice.bankDetails}
            onChange={(e) => onFieldChange('bankDetails', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
            placeholder="Enter bank account details..."
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
          <button
            onClick={onAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Weight</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Item name"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.grossWeight}
                      onChange={(e) => onUpdateItem(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.netWeight}
                      onChange={(e) => onUpdateItem(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => onUpdateItem(item.id, 'amount', parseInt(e.target.value) || 1)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500">{invoice.currency}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-sm">${item.total.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax (10%):</span>
                <span className="font-medium">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock version history data
const MOCK_VERSIONS = [
  {
    id: 'current',
    name: 'Current Version',
    created_at: new Date().toISOString(),
    user: {
      id: 1,
      name: 'John Smith',
      avatar: null,
      role: 'Admin'
    },
    data: {
      number: 'INV-2024-001',
      date: new Date().toISOString().split('T')[0],
      seller: {
        company: '',
        address: '',
        director: '',
        email: ''
      },
      buyer: {
        company: '',
        address: '',
        contactPerson: '',
        email: ''
      },
      bankDetails: '',
      items: [],
      currency: 'USD',
      subtotal: 0,
      tax: 0,
      total: 0
    }
  },
  {
    id: 'v3',
    name: 'Auto-save',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: {
      id: 1,
      name: 'John Smith',
      avatar: null,
      role: 'Admin'
    },
    data: {
      number: 'INV-2024-001',
      date: new Date().toISOString().split('T')[0],
      seller: {
        company: 'TechCorp Solutions Ltd.',
        address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
        director: 'John Smith',
        email: 'john@techcorp.com'
      },
      buyer: {
        company: 'Acme Corporation',
        address: '456 Corporate Blvd\nFloor 25\nLos Angeles, CA 90210',
        contactPerson: 'Jane Doe',
        email: 'jane@acme.com'
      },
      bankDetails: 'Chase Bank - Account: ****1234',
      items: [
        { id: 1, name: 'Software License', grossWeight: 0.5, netWeight: 0.5, unitPrice: 1200.00, amount: 1, total: 1200.00 },
        { id: 2, name: 'Consulting Services', grossWeight: 0, netWeight: 0, unitPrice: 150.00, amount: 8, total: 1200.00 }
      ],
      currency: 'USD',
      subtotal: 2400.00,
      tax: 240.00,
      total: 2640.00
    }
  },
  {
    id: 'v2',
    name: 'Version 2',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    user: {
      id: 2,
      name: 'Sarah Johnson',
      avatar: null,
      role: 'Editor'
    },
    data: {
      number: 'INV-2024-001',
      date: new Date().toISOString().split('T')[0],
      seller: {
        company: 'TechCorp Solutions Ltd.',
        address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
        director: 'John Smith',
        email: 'john@techcorp.com'
      },
      buyer: {
        company: 'Acme Corporation',
        address: '456 Corporate Blvd\nFloor 25\nLos Angeles, CA 90210',
        contactPerson: 'Jane Doe',
        email: 'jane@acme.com'
      },
      bankDetails: 'Chase Bank - Account: ****1234',
      items: [
        { id: 1, name: 'Software License', grossWeight: 0.5, netWeight: 0.5, unitPrice: 1000.00, amount: 1, total: 1000.00 }
      ],
      currency: 'USD',
      subtotal: 1000.00,
      tax: 100.00,
      total: 1100.00
    }
  },
  {
    id: 'v1',
    name: 'Initial Version',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 3,
      name: 'Michael Brown',
      avatar: null,
      role: 'Viewer'
    },
    data: {
      number: 'INV-2024-001',
      date: new Date().toISOString().split('T')[0],
      seller: {
        company: 'TechCorp Solutions Ltd.',
        address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
        director: 'John Smith',
        email: 'john@techcorp.com'
      },
      buyer: {
        company: 'Acme Corporation',
        address: '456 Corporate Blvd\nFloor 25\nLos Angeles, CA 90210',
        contactPerson: 'Jane Doe',
        email: 'jane@acme.com'
      },
      bankDetails: '',
      items: [],
      currency: 'USD',
      subtotal: 0,
      tax: 0,
      total: 0
    }
  }
];

const InvoiceCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  const [invoice, setInvoice] = useState({
    number: 'INV-2024-001',
    date: new Date().toISOString().split('T')[0],
    seller: {
      company: '',
      address: '',
      director: '',
      email: ''
    },
    buyer: {
      company: '',
      address: '',
      contactPerson: '',
      email: ''
    },
    bankDetails: '',
    items: [],
    currency: 'USD',
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Fetch companies and contracts
  const { data: companies = [], error: companiesError } = useQuery(
    'companies',
    () => documentService.getCompanies(),
    {
      onError: (error) => {
        toast.error(`Failed to load companies: ${error.message}`);
      }
    }
  );

  const { data: contracts = [], error: contractsError } = useQuery(
    'contracts',
    () => documentService.getContracts(),
    {
      onError: (error) => {
        toast.error(`Failed to load contracts: ${error.message}`);
      }
    }
  );

  // Replace the versions query with mock data temporarily
  const { data: versions = MOCK_VERSIONS, isLoading: isLoadingVersions } = useQuery(
    ['versions', id],
    () => Promise.resolve(MOCK_VERSIONS), // Simulate API call
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(`Failed to load versions: ${error.message}`);
      }
    }
  );

  // Set initial state from current version when component mounts
  useEffect(() => {
    if (versions.length > 0) {
      const currentVersion = versions[0]; // First version is always current
      setInvoice(currentVersion.data);
      setLastSavedState(currentVersion.data);
    }
  }, [versions]);

  // Track changes
  useEffect(() => {
    if (lastSavedState) {
      const changes = getChanges(lastSavedState, invoice);
      setHasUnsavedChanges(changes.length > 0);
    }
  }, [invoice, lastSavedState]);

  // Save mutations
  const createMutation = useMutation(
    (data) => documentService.createInvoice(data),
    {
      onSuccess: () => {
        toast.success('Invoice created successfully');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(`Failed to create invoice: ${error.message}`);
      }
    }
  );

  const updateMutation = useMutation(
    (data) => documentService.updateInvoice(id, data),
    {
      onSuccess: () => {
        toast.success('Invoice updated successfully');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(`Failed to update invoice: ${error.message}`);
      }
    }
  );

  // Update save handler to handle both draft and final saves
  const handleSave = async (type) => {
    try {
      const mutation = isEditing ? updateMutation : createMutation;
      await mutation.mutateAsync({ ...invoice, status: type });
      setLastSavedState(JSON.parse(JSON.stringify(invoice)));
      setHasUnsavedChanges(false);
      toast.success(`Invoice saved as ${type}`);
      if (type === 'final') {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(`Failed to save invoice: ${error.message}`);
    }
  };

  // Handle version selection
  const handleVersionSelect = (version) => {
    if (hasUnsavedChanges) {
      setSelectedVersion(version);
      setShowWarningDialog(true);
    } else {
      restoreVersion(version);
    }
  };

  // Restore version
  const restoreVersion = (version) => {
    setInvoice(version.data);
    setLastSavedState(version.data);
    setHasUnsavedChanges(false);
    toast.success('Version restored successfully');
  };

  // Handle warning dialog actions
  const handleWarningDialogConfirm = () => {
    restoreVersion(selectedVersion);
    setShowWarningDialog(false);
    setSelectedVersion(null);
  };

  const handleWarningDialogSaveAndGo = async () => {
    try {
      await handleSave('final');
      restoreVersion(selectedVersion);
      setShowWarningDialog(false);
      setSelectedVersion(null);
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  const handleFieldChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInvoice(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoice(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === parseInt(contractId));
    if (contract) {
      const seller = companies.find(c => c.id === contract.seller_id);
      const buyer = companies.find(c => c.id === contract.buyer_id);
      
      if (seller && buyer) {
        setInvoice(prev => ({
          ...prev,
          seller: {
            company: seller.name,
            address: seller.address,
            director: seller.director,
            email: seller.email
          },
          buyer: {
            company: buyer.name,
            address: buyer.address,
            contactPerson: buyer.director,
            email: buyer.email
          }
        }));
      }
    }
  };

  const handleCompanyChange = (type, companyId) => {
    const company = companies.find(c => c.id === parseInt(companyId));
    if (company) {
      setInvoice(prev => ({
        ...prev,
        [type]: {
          company: company.name,
          address: company.address,
          [type === 'seller' ? 'director' : 'contactPerson']: company.director,
          email: company.email
        }
      }));
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      grossWeight: 0,
      netWeight: 0,
      unitPrice: 0,
      amount: 1,
      total: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoice(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'unitPrice' || field === 'amount') {
            updatedItem.total = updatedItem.unitPrice * updatedItem.amount;
          }
          return updatedItem;
        }
        return item;
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const removeItem = (id) => {
    setInvoice(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const error = companiesError || contractsError;
  const isCreating = createMutation.isLoading;
  const isUpdating = updateMutation.isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        <BaseSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <InvoiceSidebarContent 
            versions={versions}
            currentVersion={lastSavedState}
            onVersionSelect={handleVersionSelect}
            hasUnsavedChanges={hasUnsavedChanges}
            isCollapsed={isSidebarCollapsed}
            onSave={handleSave}
            lastSavedState={lastSavedState}
            invoice={invoice}
          />
        </BaseSidebar>
        
        <div className={`flex-1 transition-all duration-300`}>
          <div className="flex h-full">
            <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300}`}>
              {error ? (
                <div className="text-center">
                  <div className="text-red-600 text-xl mb-4">
                    Failed to load data
                  </div>
                  <p className="text-gray-600 mb-4">{error.message}</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Go Back to Dashboard
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <InvoiceForm
                    invoice={invoice}
                    companies={companies}
                    contracts={contracts}
                    onFieldChange={handleFieldChange}
                    onContractChange={handleContractChange}
                    onCompanyChange={handleCompanyChange}
                    onAddItem={addItem}
                    onUpdateItem={updateItem}
                    onRemoveItem={removeItem}
                    onSave={handleSave}
                    isSaving={isCreating || isUpdating}
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <RightSidebar
              onPreview={() => {/* Handle preview */}}
              onExport={() => setShowGenerateDropdown(!showGenerateDropdown)}
              onSave={handleSave}
              isSaving={isCreating || isUpdating}
              showExportDropdown={showGenerateDropdown}
              onExportDropdownToggle={() => setShowGenerateDropdown(!showGenerateDropdown)}
              showSaveDropdown={showSaveDropdown}
              onSaveDropdownToggle={() => setShowSaveDropdown(!showSaveDropdown)}
              isCollapsed={isRightSidebarCollapsed}
              onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
            />
          </div>
        </div>
      </div>

      <WarningDialog
        isOpen={showWarningDialog}
        onClose={() => {
          setShowWarningDialog(false);
          setSelectedVersion(null);
        }}
        onConfirm={handleWarningDialogConfirm}
        onSaveAndGo={handleWarningDialogSaveAndGo}
        changes={lastSavedState ? getChanges(lastSavedState, invoice) : []}
        title="Unsaved Changes"
        message="You have unsaved changes that will be lost if you restore this version. Would you like to save your changes first?"
      />
    </div>
  );
};

export default InvoiceCreator; 