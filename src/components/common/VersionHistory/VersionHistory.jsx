import React, { useState, useRef, useEffect } from 'react';
import { History } from 'lucide-react';
import VersionHistoryItem from './VersionHistoryItem';

const VersionHistory = ({ versions, currentVersion, onVersionSelect, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Version History</h3>
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

export default VersionHistory; 