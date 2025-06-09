import React, { useState } from 'react';
import DocumentLeftSidebar from './sidebars/DocumentLeftSidebar';
import DocumentRightSidebar from './sidebars/DocumentRightSidebar';
import BaseSidebar from './sidebars/BaseSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentLayout = ({
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

  const handleExport = (type) => {
    onExport(type);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <BaseSidebar
        isCollapsed={isLeftSidebarCollapsed}
        onToggle={onLeftSidebarToggle}
        position="left"
        width={{
          expanded: 'w-80',
          collapsed: 'w-16'
        }}
        toggleButtonPosition="top-4"
        toggleButtonOffset="-right-3"
        toggleButtonIcon={{
          expanded: ChevronLeft,
          collapsed: ChevronRight
        }}
      >
        {leftSidebar || (
          <DocumentLeftSidebar
            isCollapsed={isLeftSidebarCollapsed}
            documentType={documentType}
            versions={versions}
            currentVersion={currentVersion}
            onVersionSelect={onVersionSelect}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={onSave}
            lastSavedState={lastSaved}
            document={document}
            onCollaborationClick={onCollaborationClick}
          />
        )}
      </BaseSidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        <div className="flex-1">
          {children}
        </div>

        {/* Right Sidebar */}
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
          status={document?.status || 'draft'}
          lastSaved={lastSaved}
          documentType={documentType}
        />
      </div>
    </div>
  );
};

export default DocumentLayout; 