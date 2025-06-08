import React, { useState } from 'react';
import DocumentSidebarContent from './DocumentSidebarContent';
import DocumentRightSidebar from './DocumentRightSidebar';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DocumentStatus } from './DocumentRightSidebar';

interface Document {
  status: DocumentStatus;
  [key: string]: any;
}

interface Version {
  id: string;
  [key: string]: any;
}

interface Workspace {
  id: string;
  [key: string]: any;
}

interface Collaborator {
  id: string;
  [key: string]: any;
}

interface DocumentLayoutProps {
  title: string;
  documentType?: string;
  document?: Document;
  versions?: Version[];
  currentVersion?: Version;
  onVersionSelect?: (version: Version) => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: string;
  onStatusChange?: (status: string) => void;
  onCollaborationClick?: () => void;
  onPreview?: () => void;
  onExport?: (type: string) => void;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  additionalHeaderActions?: React.ReactNode;
  sidebarWidth?: number;
  rightSidebarWidth?: number;
  onCollaboration?: () => void;
  collaborators?: Collaborator[];
  workspaces?: Workspace[];
  selectedWorkspace?: Workspace;
  onWorkspaceSelect?: (workspace: Workspace) => void;
  onWorkspaceFilter?: (query: string) => void;
  onUnsavedChangesConfirm?: () => void;
  onUnsavedChangesCancel?: () => void;
  leftSidebar?: React.ReactNode;
  isLeftSidebarCollapsed?: boolean;
  onLeftSidebarToggle?: () => void;
  isRightSidebarCollapsed?: boolean;
  onRightSidebarToggle?: () => void;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({
  title,
  documentType = 'Document',
  document = { status: 'draft' },
  versions = [],
  currentVersion,
  onVersionSelect,
  hasUnsavedChanges,
  onSave,
  isSaving,
  lastSaved,
  onStatusChange,
  onCollaborationClick,
  onPreview,
  onExport,
  children,
  showBackButton = true,
  onBack,
  additionalHeaderActions,
  sidebarWidth = 320,
  rightSidebarWidth = 256,
  onCollaboration,
  collaborators = [],
  workspaces = [],
  selectedWorkspace,
  onWorkspaceSelect,
  onWorkspaceFilter,
  onUnsavedChangesConfirm,
  onUnsavedChangesCancel,
  leftSidebar,
  isLeftSidebarCollapsed,
  onLeftSidebarToggle,
  isRightSidebarCollapsed,
  onRightSidebarToggle
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const handleExport = (type: string) => {
    onExport?.(type);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className={`relative ${isLeftSidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ease-in-out`}>
        {leftSidebar}
        <button
          onClick={onLeftSidebarToggle}
          className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
        >
          {isLeftSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        <div className="flex-1">
          {children}
        </div>

        {/* Right Sidebar */}
        <div className={`relative ${isRightSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
          <DocumentRightSidebar
            onPreview={onPreview}
            onExport={handleExport}
            onSave={onSave}
            isSaving={isSaving}
            showExportDropdown={showExportDropdown}
            onExportDropdownToggle={() => setShowExportDropdown(!showExportDropdown)}
            showSaveDropdown={showSaveDropdown}
            onSaveDropdownToggle={() => setShowSaveDropdown(!showSaveDropdown)}
            isCollapsed={isRightSidebarCollapsed}
            onToggle={onRightSidebarToggle}
            status={document?.status as DocumentStatus || 'draft'}
            lastSaved={lastSaved}
            documentType={documentType}
          />
          <button
            onClick={onRightSidebarToggle}
            className="absolute -left-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
          >
            {isRightSidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout; 