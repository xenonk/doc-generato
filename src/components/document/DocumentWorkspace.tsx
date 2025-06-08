import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, X } from 'lucide-react';

interface Workspace {
  id: number;
  name: string;
  documents: number;
}

interface DocumentWorkspaceProps {
  selectedWorkspaces: Workspace[];
  onWorkspaceChange: (workspaces: Workspace[]) => void;
  isCollapsed: boolean;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ selectedWorkspaces, onWorkspaceChange, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock workspaces data - in real app this would come from an API
  const allWorkspaces: Workspace[] = [
    { id: 1, name: 'Current Document', documents: 1 },
    { id: 2, name: 'Q1 2024 Documents', documents: 5 },
    { id: 3, name: 'Client Templates', documents: 3 },
    { id: 4, name: 'Pending Reviews', documents: 2 },
    { id: 5, name: 'Archived Documents', documents: 12 },
    { id: 6, name: 'Draft Documents', documents: 4 },
    { id: 7, name: 'Approved Documents', documents: 8 },
    { id: 8, name: 'Client A Projects', documents: 3 },
    { id: 9, name: 'Client B Projects', documents: 6 },
    { id: 10, name: 'Urgent Documents', documents: 2 }
  ];

  const filteredWorkspaces = allWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspaceToggle = (workspace: Workspace) => {
    const isSelected = selectedWorkspaces.some(w => w.id === workspace.id);
    if (isSelected) {
      onWorkspaceChange(selectedWorkspaces.filter(w => w.id !== workspace.id));
    } else {
      onWorkspaceChange([...selectedWorkspaces, workspace]);
    }
  };

  const handleRemoveWorkspace = (workspaceId: number) => {
    onWorkspaceChange(selectedWorkspaces.filter(w => w.id !== workspaceId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceToggle(workspace)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-50 ${
                      selectedWorkspaces.some(w => w.id === workspace.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{workspace.name}</span>
                      <span className="text-xs text-gray-500">{workspace.documents} docs</span>
                    </div>
                  </button>
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Workspaces</h3>
        <Building2 className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedWorkspaces.map(workspace => (
            <div
              key={workspace.id}
              className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
            >
              <span>{workspace.name}</span>
              <button
                onClick={() => handleRemoveWorkspace(workspace.id)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filteredWorkspaces.map(workspace => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceToggle(workspace)}
              className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-50 ${
                selectedWorkspaces.some(w => w.id === workspace.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{workspace.name}</span>
                <span className="text-xs text-gray-500">{workspace.documents} docs</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 