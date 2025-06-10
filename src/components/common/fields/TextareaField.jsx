import React from 'react';

const TextareaField = ({ label, value, onChange, name, className = '', ...rest }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 h-20 ${className}`}
      {...rest}
    />
  </div>
);

export default TextareaField; 