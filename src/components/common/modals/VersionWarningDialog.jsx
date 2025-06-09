import React from 'react';
import { AlertTriangle } from 'lucide-react';

const VersionWarningDialog = ({
  isOpen,
  onClose,
  onConfirm,
  onSaveAndGo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Unsaved Changes</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          You have unsaved changes. Would you like to save them before switching versions?
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Discard Changes
          </button>
          <button
            onClick={onSaveAndGo}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save & Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionWarningDialog; 