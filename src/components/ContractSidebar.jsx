import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, FileText, Clock, 
  History, CheckCircle2, AlertCircle, XCircle,
  Save, Send, Download, Printer, Share2, MoreVertical,
  User, MessageSquare, Tag, Lock
} from 'lucide-react';

const ContractSidebar = ({ isCollapsed, onToggle, contractData, onStatusChange, onAction }) => {
  const [activeTab, setActiveTab] = useState('workspace');
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Mock version history data
  const versionHistory = [
    {
      id: 1,
      version: '1.0',
      date: '2024-03-15 14:30',
      author: 'John Doe',
      changes: 'Initial draft created',
      status: 'draft'
    },
    {
      id: 2,
      version: '1.1',
      date: '2024-03-16 10:15',
      author: 'Jane Smith',
      changes: 'Updated payment terms',
      status: 'review'
    },
    {
      id: 3,
      version: '1.2',
      date: '2024-03-16 15:45',
      author: 'John Doe',
      changes: 'Added special conditions',
      status: 'draft'
    }
  ];

  // Mock status options
  const statusOptions = [
    { id: 'draft', label: 'Draft', icon: FileText, color: 'text-gray-500' },
    { id: 'review', label: 'In Review', icon: Clock, color: 'text-yellow-500' },
    { id: 'approved', label: 'Approved', icon: CheckCircle2, color: 'text-green-500' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
    { id: 'expired', label: 'Expired', icon: AlertCircle, color: 'text-orange-500' }
  ];

  // Mock action options
  const actionOptions = [
    { id: 'save', label: 'Save Draft', icon: Save, onClick: () => onAction('save') },
    { id: 'submit', label: 'Submit for Review', icon: Send, onClick: () => onAction('submit') },
    { id: 'download', label: 'Download PDF', icon: Download, onClick: () => onAction('download') },
    { id: 'print', label: 'Print', icon: Printer, onClick: () => onAction('print') },
    { id: 'share', label: 'Share', icon: Share2, onClick: () => onAction('share') }
  ];

  const TabButton = ({ id, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
        activeTab === id 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {count !== undefined && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
              {count}
            </span>
          )}
        </>
      )}
    </button>
  );

  const VersionHistoryItem = ({ version }) => {
    const StatusIcon = statusOptions.find(s => s.id === version.status)?.icon || FileText;
    const statusColor = statusOptions.find(s => s.id === version.status)?.color || 'text-gray-500';

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

  const StatusOption = ({ status }) => {
    const Icon = status.icon;
    return (
      <button
        onClick={() => {
          onStatusChange(status.id);
          setIsStatusOpen(false);
        }}
        className={`w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 ${
          contractData?.status === status.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
        }`}
      >
        <Icon className={`w-4 h-4 ${status.color}`} />
        {!isCollapsed && <span>{status.label}</span>}
      </button>
    );
  };

  const ActionButton = ({ action }) => {
    const Icon = action.icon;
    return (
      <button
        onClick={action.onClick}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full"
      >
        <Icon className="w-4 h-4" />
        {!isCollapsed && <span>{action.label}</span>}
      </button>
    );
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 min-h-[calc(100vh-50px)] transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="p-4 space-y-6">
          {/* Tabs */}
          <div className="space-y-1">
            <TabButton
              id="workspace"
              icon={FileText}
              label="Document Workspace"
              count={3}
            />
            <TabButton
              id="history"
              icon={History}
              label="Version History"
              count={versionHistory.length}
            />
            <TabButton
              id="status"
              icon={CheckCircle2}
              label="Status"
            />
            <TabButton
              id="actions"
              icon={MoreVertical}
              label="Actions"
            />
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {/* Document Workspace */}
            {activeTab === 'workspace' && !isCollapsed && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Document Info</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Created by: {contractData?.createdBy || 'John Doe'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last modified: {contractData?.lastModified || '2024-03-16 15:45'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>Type: {contractData?.type || 'Service Agreement'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      <span>Access: {contractData?.access || 'Private'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Collaboration</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Assigned to: {contractData?.assignedTo || 'Jane Smith'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comments: {contractData?.commentCount || 3}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Version History */}
            {activeTab === 'history' && !isCollapsed && (
              <div className="space-y-2">
                {versionHistory.map(version => (
                  <VersionHistoryItem key={version.id} version={version} />
                ))}
              </div>
            )}

            {/* Status */}
            {activeTab === 'status' && !isCollapsed && (
              <div className="space-y-1">
                {statusOptions.map(status => (
                  <StatusOption key={status.id} status={status} />
                ))}
              </div>
            )}

            {/* Actions */}
            {activeTab === 'actions' && !isCollapsed && (
              <div className="space-y-1">
                {actionOptions.map(action => (
                  <ActionButton key={action.id} action={action} />
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ContractSidebar; 