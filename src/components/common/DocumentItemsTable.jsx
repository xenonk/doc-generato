import React from 'react';

const DocumentItemsTable = ({ items = [], currency = 'USD', onAddItem, onUpdateItem, onRemoveItem }) => (
  <div>
    <button
      onClick={onAddItem}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 mb-4"
    >
      Add Item
    </button>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Gross Weight</th>
            <th>Net Weight</th>
            <th>Unit Price</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => onUpdateItem(item.id, 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.grossWeight}
                  onChange={e => onUpdateItem(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  step="0.1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.netWeight}
                  onChange={e => onUpdateItem(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  step="0.1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={e => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                  step="0.01"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.amount}
                  onChange={e => onUpdateItem(item.id, 'amount', parseInt(e.target.value) || 1)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                  min="1"
                />
              </td>
              <td>
                <span className="text-sm text-gray-500">{currency}</span>
              </td>
              <td>
                <span className="font-medium text-sm">${item.total?.toFixed(2) || '0.00'}</span>
              </td>
              <td>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DocumentItemsTable; 