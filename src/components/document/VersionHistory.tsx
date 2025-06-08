import React, { useState, useRef, useEffect } from 'react';
import { History, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../../utils/documentUtils';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Version {
  id: string;
  name: string;
  created_at: string;
  user: User;
}

interface VersionHistoryItemProps {
  version: Version;
  isCurrent: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const VersionHistoryItem: React.FC<VersionHistoryItemProps> = ({ version, isCurrent, onClick, isCollapsed }) => {
  const getStatusColor = (isCurrent: boolean) => isCurrent ? 'bg-green-500' : 'bg-gray-300';
  
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

interface VersionHistoryProps {
  versions: Version[];
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
  isCollapsed: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, currentVersion, onVersionSelect, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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