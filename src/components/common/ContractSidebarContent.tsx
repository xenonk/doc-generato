import React, { useState } from 'react';
import { 
  FileText, Clock, History, CheckCircle2, AlertCircle, XCircle,
  Save, Send, Download, Printer, Share2, MoreVertical,
  User, MessageSquare, Tag, Lock, ChevronLeft, ChevronRight,
  LucideIcon
} from 'lucide-react';

interface ChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  changes: string[];
}

interface Version {
  id: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'expired';
  date: string;
  author: string;
  changes: string;
}

interface Contract {
  createdBy?: string;
  lastModified?: string;
  type?: string;
  access?: string;
  assignedTo?: string;
  commentCount?: number;
  title?: string;
}

interface ContractSidebarContentProps {
  versions?: Version[];
  currentVersion?: Version;
  onVersionSelect?: (version: Version) => void;
  hasUnsavedChanges: boolean;
  isCollapsed: boolean;
  onSave: () => void;
  lastSavedState?: Contract;
  contract?: Contract;
}

const ChangesModal: React.FC<ChangesModalProps> = ({ isOpen, onClose, onSave, changes }) => {
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

const ContractSidebarContent: React.FC<ContractSidebarContentProps> = ({ 
  versions = [], 
  currentVersion,
  onVersionSelect,
  hasUnsavedChanges,
  isCollapsed,
  onSave,
  lastSavedState,
  contract
}) => {
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStatusClick = () => {
    if (hasUnsavedChanges) {
      setShowChangesModal(true);
    }
  };

  const handleSaveChanges = () => {
    onSave();
    setShowChangesModal(false);
  };

  const getChanges = (oldState: Contract | undefined, newState: Contract | undefined): string[] => {
    if (!oldState || !newState) return [];
    
    const changes: string[] = [];
    // Compare basic information
    if (oldState.title !== newState.title) {
      changes.push(`Title changed from "${oldState.title}" to "${newState.title}"`);
    }
    if (oldState.type !== newState.type) {
      changes.push(`Contract type changed from "${oldState.type}" to "${newState.type}"`);
    }
    // Add more comparisons as needed
    return changes;
  };

  const VersionHistoryItem: React.FC<{ version: Version }> = ({ version }) => {
    const statusIcons: Record<Version['status'], { icon: LucideIcon; color: string }> = {
      draft: { icon: FileText, color: 'text-gray-500' },
      review: { icon: Clock, color: 'text-yellow-500' },
      approved: { icon: CheckCircle2, color: 'text-green-500' },
      rejected: { icon: XCircle, color: 'text-red-500' },
      expired: { icon: AlertCircle, color: 'text-orange-500' }
    };

    const StatusIcon = statusIcons[version.status]?.icon || FileText;
    const statusColor = statusIcons[version.status]?.color || 'text-gray-500';

    return (
      <div className="p-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Version {version.version}</span>
          <StatusIcon className={`w-4 h-4 ${statusColor}`} />
        </div>
        <p className="text-xs text-gray-500 mb-1">{version.date}</p>
        <p className="text-xs text-gray-600 mb-1">By {version.author}</p>
        <p className="text-xs text-gray-700">{version.changes}</p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Document Workspace */}
        <div className="p-4 space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Document Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Created by: {contract?.createdBy || 'John Doe'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Last modified: {contract?.lastModified || '2024-03-16 15:45'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <span>Type: {contract?.type || 'Service Agreement'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Access: {contract?.access || 'Private'}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Collaboration</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Assigned to: {contract?.assignedTo || 'Jane Smith'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>Comments: {contract?.commentCount || 3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Version History */}
        {versions.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Version History</h3>
            <div className="space-y-2">
              {versions.map(version => (
                <VersionHistoryItem key={version.id} version={version} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500 relative">
          <div 
            onClick={handleStatusClick}
            className={`cursor-pointer ${hasUnsavedChanges ? 'hover:bg-gray-50 rounded-lg p-1' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleStatusClick();
              }
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
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
          changes={lastSavedState ? getChanges(lastSavedState, contract) : []}
        />
      )}
    </div>
  );
};

export default ContractSidebarContent; 