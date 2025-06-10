import DocumentItemsTable from '../components/common/DocumentItemsTable';

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
    fields: [
      {
        name: 'items',
        label: 'Invoice Items',
        type: 'custom',
        render: (data, { onAddItem, onUpdateItem, onRemoveItem }) => (
          <DocumentItemsTable
            items={data.items}
            currency={data.currency}
            onAddItem={onAddItem}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
            tableTitle="Invoice Items"
          />
        )
      }
    ]
  }
];

export default invoiceSchema; 