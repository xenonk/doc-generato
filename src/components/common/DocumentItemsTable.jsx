import React from 'react';

const DocumentItemsTable = ({ items = [], currency = 'USD', onAddItem, onUpdateItem, onRemoveItem, tableTitle = 'Items' }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{tableTitle}</h3>
      <button
        onClick={onAddItem}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Item</span>
      </button>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Weight</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="text"
                  value={item.name}
                  onChange={e => onUpdateItem(item.id, 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter item name"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="number"
                  value={item.grossWeight}
                  onChange={e => onUpdateItem(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="number"
                  value={item.netWeight}
                  onChange={e => onUpdateItem(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={e => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <input
                  type="number"
                  value={item.amount}
                  onChange={e => onUpdateItem(item.id, 'amount', parseInt(e.target.value) || 1)}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{currency}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                ${item.total?.toFixed(2) || '0.00'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-500">
                No items added yet. Click "Add Item" to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DocumentItemsTable; 