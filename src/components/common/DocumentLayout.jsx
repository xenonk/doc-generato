import React, { useState } from 'react';
import DocumentSidebarContent from './DocumentSidebarContent';
import DocumentRightSidebar from './DocumentRightSidebar';
import Sidebar from './Sidebar';

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
  onUnsavedChangesCancel
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const handleExport = (type) => {
    onExport(type);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          width={sidebarWidth}
        >
          <DocumentSidebarContent
            document={document}
            versions={versions}
            currentVersion={currentVersion}
            onVersionSelect={onVersionSelect}
            hasUnsavedChanges={hasUnsavedChanges}
            isCollapsed={isSidebarCollapsed}
            onSave={onSave}
            lastSavedState={lastSaved}
            documentType={documentType}
            onStatusChange={onStatusChange}
            onCollaborationClick={onCollaborationClick}
            onCollaboration={onCollaboration}
            collaborators={collaborators}
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceSelect={onWorkspaceSelect}
            onWorkspaceFilter={onWorkspaceFilter}
            onUnsavedChangesConfirm={onUnsavedChangesConfirm}
            onUnsavedChangesCancel={onUnsavedChangesCancel}
          />
        </Sidebar>

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            marginLeft: isSidebarCollapsed ? '64px' : `${sidebarWidth}px`,
            marginRight: isRightSidebarCollapsed ? '64px' : `${rightSidebarWidth}px`,
            transition: 'margin 300ms ease-in-out'
          }}
        >
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
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
          onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          status={document?.status || 'draft'}
          lastSaved={lastSaved}
          documentType={documentType}
        />
      </div>
    </div>
  );
};

export default DocumentLayout; 