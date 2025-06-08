import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { VersionHistory } from './VersionHistory';
import { DocumentWorkspace } from './DocumentWorkspace';
import { ChangesModal } from './ChangesModal';
import { getChanges } from '../../utils/documentUtils';

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

interface Party {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

interface InvoiceState {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: string;
  total_amount: number;
  currency: string;
  notes: string;
  seller: Party;
  buyer: Party;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
}

interface Change {
  field: string;
  oldValue: any;
  newValue: any;
}

interface DocumentSidebarProps {
  versions: Version[];
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
  isCollapsed: boolean;
  onSave: () => void;
  onDiscard: () => void;
  hasUnsavedChanges: boolean;
  selectedWorkspaces: Array<{ id: number; name: string; documents: number }>;
  onWorkspaceChange: (workspaces: Array<{ id: number; name: string; documents: number }>) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  versions,
  currentVersion,
  onVersionSelect,
  isCollapsed,
  onSave,
  onDiscard,
  hasUnsavedChanges,
  selectedWorkspaces,
  onWorkspaceChange,
}) => {
  const [changes, setChanges] = useState<Change[]>([]);
  const [showChangesModal, setShowChangesModal] = useState(false);

  const handleSave = () => {
    if (hasUnsavedChanges) {
      setShowChangesModal(true);
    } else {
      onSave();
    }
  };

  const handleSaveConfirm = () => {
    onSave();
    setShowChangesModal(false);
  };

  const handleDiscard = () => {
    onDiscard();
    setShowChangesModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <VersionHistory
          versions={versions}
          currentVersion={currentVersion}
          onVersionSelect={onVersionSelect}
          isCollapsed={isCollapsed}
        />
        <DocumentWorkspace
          selectedWorkspaces={selectedWorkspaces}
          onWorkspaceChange={onWorkspaceChange}
          isCollapsed={isCollapsed}
        />
      </div>

      <ChangesModal
        isOpen={showChangesModal}
        onClose={() => setShowChangesModal(false)}
        onSave={handleSaveConfirm}
        onDiscard={handleDiscard}
        changes={changes}
      />
    </div>
  );
}; 