import React from 'react';

const SelectField = ({ label, value, onChange, name, options = [], className = '', ...rest }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${className}`}
      {...rest}
    >
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default SelectField; 