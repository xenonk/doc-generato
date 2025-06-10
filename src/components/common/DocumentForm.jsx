import React from 'react';

const DocumentForm = ({
  schema = [],
  documentData = {},
  onFieldChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onSave,
  isSaving
}) => {
  return (
    <div className="space-y-6 w-full">
      {schema.map((section, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {section.title && <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">{section.title}</h3>}
          <div className={section.layout || ''}>
            {section.fields.map((field) => {
              if (field.type === 'input' || field.type === 'date' || field.type === 'email' || field.type === 'number') {
                return (
                  <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      {...field.inputProps}
                    />
                  </div>
                );
              }
              if (field.type === 'select') {
                return (
                  <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <select
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">{field.placeholder || 'Select'}</option>
                      {field.options && field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === 'textarea') {
                return (
                  <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <textarea
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                    />
                  </div>
                );
              }
              if (field.type === 'custom' && field.render) {
                return field.render(documentData, { onFieldChange, onAddItem, onUpdateItem, onRemoveItem });
              }
              return null;
            })}
          </div>
        </div>
      ))}
      {/* Save button example */}
      {onSave && (
        <div className="flex justify-end">
          <button
            onClick={() => onSave('draft')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentForm; 