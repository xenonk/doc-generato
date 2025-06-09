import { useState } from 'react';
import { toast } from 'react-hot-toast';

const useVersionHistory = ({
  currentDocument,
  onDocumentChange,
  onSave,
  hasUnsavedChanges,
  setHasUnsavedChanges,
  setLastSavedState
}) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  // Handle version selection
  const handleVersionSelect = (version) => {
    if (hasUnsavedChanges) {
      setSelectedVersion(version);
      setShowWarningDialog(true);
    } else {
      restoreVersion(version);
    }
  };

  // Restore version
  const restoreVersion = (version) => {
    onDocumentChange(version.data);
    setLastSavedState(version.data);
    setHasUnsavedChanges(false);
    toast.success('Version restored successfully');
  };

  // Handle warning dialog actions
  const handleWarningDialogConfirm = () => {
    restoreVersion(selectedVersion);
    setShowWarningDialog(false);
    setSelectedVersion(null);
  };

  const handleWarningDialogSaveAndGo = async () => {
    try {
      await onSave('final');
      restoreVersion(selectedVersion);
      setShowWarningDialog(false);
      setSelectedVersion(null);
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  return {
    selectedVersion,
    showWarningDialog,
    handleVersionSelect,
    handleWarningDialogConfirm,
    handleWarningDialogSaveAndGo,
    setShowWarningDialog
  };
};

export default useVersionHistory; 