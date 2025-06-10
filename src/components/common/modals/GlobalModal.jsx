import React from 'react';

const GlobalModal = ({
  isOpen,
  title,
  message,
  children,
  actions = [],
  onClose
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        {children}
        <div className="flex justify-end space-x-3 mt-6">
          {actions.map(({ label, onClick, className = '' }, idx) => (
            <button
              key={idx}
              onClick={onClick}
              className={`px-4 py-2 rounded-md ${className}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalModal; 