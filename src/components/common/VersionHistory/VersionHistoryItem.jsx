import React from 'react';
import { User } from 'lucide-react';
import { formatDateTime } from '../../../utils/dateUtils';

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

export default VersionHistoryItem; 