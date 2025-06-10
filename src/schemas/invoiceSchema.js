const invoiceSchema = [
  {
    title: 'Invoice Header',
    fields: [
      {
        name: 'number',
        label: 'Invoice Number',
        type: 'input',
        getValue: data => data.number || '',
        inputProps: { type: 'text' }
      },
      {
        name: 'date',
        label: 'Date',
        type: 'input',
        getValue: data => data.date || '',
        inputProps: { type: 'date' }
      }
    ]
  },
  {
    title: 'Contract',
    fields: [
      {
        name: 'contract',
        label: 'Contract',
        type: 'select',
        getValue: data => data.contract || '',
        options: [] // To be filled in InvoiceCreator.jsx
      }
    ]
  },
  {
    title: 'From (Seller)',
    layout: 'grid grid-cols-2 gap-8',
    fields: [
      {
        name: 'seller.company',
        label: 'Company',
        type: 'select',
        getValue: data => data.seller?.company || '',
        options: [] // To be filled in InvoiceCreator.jsx
      },
      {
        name: 'seller.address',
        label: 'Address',
        type: 'textarea',
        getValue: data => data.seller?.address || ''
      },
      {
        name: 'seller.director',
        label: 'Director',
        type: 'input',
        getValue: data => data.seller?.director || '',
        inputProps: { type: 'text' }
      },
      {
        name: 'seller.email',
        label: 'Email',
        type: 'input',
        getValue: data => data.seller?.email || '',
        inputProps: { type: 'email' }
      }
    ]
  },
  {
    title: 'To (Buyer)',
    layout: 'grid grid-cols-2 gap-8',
    fields: [
      {
        name: 'buyer.company',
        label: 'Company',
        type: 'select',
        getValue: data => data.buyer?.company || '',
        options: [] // To be filled in InvoiceCreator.jsx
      },
      {
        name: 'buyer.address',
        label: 'Address',
        type: 'textarea',
        getValue: data => data.buyer?.address || ''
      },
      {
        name: 'buyer.contactPerson',
        label: 'Contact Person',
        type: 'input',
        getValue: data => data.buyer?.contactPerson || '',
        inputProps: { type: 'text' }
      },
      {
        name: 'buyer.email',
        label: 'Email',
        type: 'input',
        getValue: data => data.buyer?.email || '',
        inputProps: { type: 'email' }
      }
    ]
  },
  {
    title: 'Bank Details',
    fields: [
      {
        name: 'bankDetails',
        label: 'Bank Information',
        type: 'textarea',
        getValue: data => data.bankDetails || ''
      }
    ]
  },
  {
    title: 'Invoice Items',
    fields: [
      {
        name: 'items',
        label: 'Invoice Items',
        type: 'custom',
        render: (data, { onAddItem, onUpdateItem, onRemoveItem }) => {
          return (
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
                    {data.items.map((item, idx) => (
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
                          <span className="text-sm text-gray-500">{data.currency}</span>
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
        }
      }
    ]
  },
  {
    title: 'Totals',
    fields: [
      {
        name: 'subtotal',
        label: 'Subtotal',
        type: 'custom',
        render: data => (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="font-medium">${data.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
        )
      },
      {
        name: 'tax',
        label: 'Tax (10%)',
        type: 'custom',
        render: data => (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tax (10%):</span>
            <span className="font-medium">${data.tax?.toFixed(2) || '0.00'}</span>
          </div>
        )
      },
      {
        name: 'total',
        label: 'Total',
        type: 'custom',
        render: data => (
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold">${data.total?.toFixed(2) || '0.00'}</span>
          </div>
        )
      }
    ]
  }
];

export default invoiceSchema; 