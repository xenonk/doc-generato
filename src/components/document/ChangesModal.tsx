import React from 'react';
import { X } from 'lucide-react';

interface Change {
  field: string;
  oldValue: any;
  newValue: any;
}

interface ChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
  changes: Change[];
}

export const ChangesModal: React.FC<ChangesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  changes
}) => {
  if (!isOpen) return null;

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'empty';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Review Changes</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <ul className="space-y-4">
            {changes.map((change, index) => (
              <li key={index} className="text-sm">
                <div className="font-medium text-gray-900">{change.field}</div>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Old Value</div>
                    <div className="mt-1 text-gray-600">{formatValue(change.oldValue)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">New Value</div>
                    <div className="mt-1 text-gray-600">{formatValue(change.newValue)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            Discard Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 