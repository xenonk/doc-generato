import React from 'react';

interface DocumentFormWrapperProps {
  children: React.ReactNode;
  className?: string;
}

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface FormGridProps {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
  className?: string;
}

interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

interface DocumentFormWrapperComponent extends React.FC<DocumentFormWrapperProps> {
  Section: React.FC<FormSectionProps>;
  Grid: React.FC<FormGridProps>;
  Field: React.FC<FormFieldProps>;
  Input: React.FC<FormInputProps>;
  Select: React.FC<FormSelectProps>;
  Textarea: React.FC<FormTextareaProps>;
}

const DocumentFormWrapper: DocumentFormWrapperComponent = ({ children, className = '' }) => {
  return (
    <div className="space-y-6 w-full">
      {React.Children.map(children, (child) => {
        // If the child is a form section (has a specific className), wrap it in the standard styling
        if (React.isValidElement(child) && typeof child.props === 'object' && child.props !== null && 'className' in child.props && typeof child.props.className === 'string' && child.props.className.includes('form-section')) {
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {child}
            </div>
          );
        }
        // Otherwise, render the child as is
        return child;
      })}
    </div>
  );
};

// Form Section Component
const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`form-section ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

// Form Grid Component
const FormGrid: React.FC<FormGridProps> = ({ children, cols = 2, gap = 8, className = '' }) => {
  return (
    <div className={`grid grid-cols-${cols} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

// Form Field Component
const FormField: React.FC<FormFieldProps> = ({ label, children, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
    </div>
  );
};

// Form Input Component
const FormInput: React.FC<FormInputProps> = ({ type = 'text', value, onChange, className = '', ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
      {...props}
    />
  );
};

// Form Select Component
const FormSelect: React.FC<FormSelectProps> = ({ value, onChange, options, className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Form Textarea Component
const FormTextarea: React.FC<FormTextareaProps> = ({ value, onChange, rows = 4, className = '', ...props }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
      {...props}
    />
  );
};

DocumentFormWrapper.Section = FormSection;
DocumentFormWrapper.Grid = FormGrid;
DocumentFormWrapper.Field = FormField;
DocumentFormWrapper.Input = FormInput;
DocumentFormWrapper.Select = FormSelect;
DocumentFormWrapper.Textarea = FormTextarea;

export default DocumentFormWrapper; 