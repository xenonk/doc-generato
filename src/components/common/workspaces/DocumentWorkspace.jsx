import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, Search, X, ChevronDown
} from 'lucide-react';

const DocumentWorkspace = ({ 
  selectedWorkspaces, 
  onWorkspaceChange, 
  isCollapsed, 
  documentType,
  workspaces = [] // Allow passing workspaces from parent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Use provided workspaces or fallback to mock data
  const allWorkspaces = workspaces.length > 0 ? workspaces : [
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

export default DocumentWorkspace; 