import React from 'react';
import TextField from './fields/TextField';
import SelectField from './fields/SelectField';
import TextareaField from './fields/TextareaField';

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
      {schema.map((section, idx) => {
        // Check if this section is a custom field (like DocumentItemsTable)
        const isCustomOnly = section.fields.length === 1 && section.fields[0].type === 'custom';
        if (isCustomOnly) {
          return (
            <div key={idx} className="mt-2">
              {section.title && <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">{section.title}</h3>}
              {section.fields[0].render(documentData, { onFieldChange, onAddItem, onUpdateItem, onRemoveItem })}
            </div>
          );
        }
        // Standard section with card
        return (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {section.title && <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">{section.title}</h3>}
            <div className={section.layout || ''}>
              {section.fields.map((field) => {
                if (field.type === 'input' || field.type === 'date' || field.type === 'email' || field.type === 'number') {
                  return (
                    <TextField
                      key={field.name}
                      label={field.label}
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      type={field.inputProps?.type || field.type}
                      name={field.name}
                      {...field.inputProps}
                    />
                  );
                }
                if (field.type === 'select') {
                  return (
                    <SelectField
                      key={field.name}
                      label={field.label}
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      name={field.name}
                      options={field.options || []}
                    />
                  );
                }
                if (field.type === 'textarea') {
                  return (
                    <TextareaField
                      key={field.name}
                      label={field.label}
                      value={field.getValue(documentData)}
                      onChange={e => onFieldChange(field.name, e.target.value)}
                      name={field.name}
                    />
                  );
                }
                if (field.type === 'custom' && field.render) {
                  // This case is handled above for custom-only sections
                  return null;
                }
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentForm; 