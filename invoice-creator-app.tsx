import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, Plus, Trash2, Copy, Share, Save, FileText, Settings, Moon, LogOut, User, Calendar, Building2, Mail, DollarSign } from 'lucide-react';

const InvoiceCreator = () => {
  const [invoice, setInvoice] = useState({
    number: 'INV-2024-001',
    date: '01/15/2024',
    seller: {
      company: 'TechCorp Solutions Ltd.',
      address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
      director: 'John Smith',
      email: 'john@techcorp.com'
    },
    buyer: {
      company: 'Acme Corporation',
      address: '456 Corporate Blvd\nFloor 25\nLos Angeles, CA 90210',
      contactPerson: 'Jane Doe',
      email: 'jane@acme.com'
    },
    bankDetails: 'Chase Bank - Account: ****1234',
    items: [
      { id: 1, name: 'Software License', grossWeight: 0.5, netWeight: 0.5, unitPrice: 1200.00, amount: 1, total: 1200.00 },
      { id: 2, name: 'Consulting Services', grossWeight: 0, netWeight: 0, unitPrice: 150.00, amount: 8, total: 1200.00 }
    ],
    currency: 'USD',
    subtotal: 2400.00,
    tax: 240.00,
    total: 2640.00
  });

  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Current Invoice', active: true },
    { id: 2, name: 'Q1 2024 Invoices', active: false },
    { id: 3, name: 'Client Templates', active: false }
  ]);

  const [recentDocuments, setRecentDocuments] = useState([
    { id: 1, name: 'Invoice #INV-2024-001', status: 'draft', lastModified: '2 minutes ago' },
    { id: 2, name: 'Invoice #INV-2024-002', status: 'ready', lastModified: '1 hour ago' },
    { id: 3, name: 'Contract Template', status: 'approval_awaiting', lastModified: '3 hours ago' }
  ]);

  const [companies] = useState([
    { id: 1, name: 'TechCorp Solutions Ltd.', address: '123 Business Ave\nSuite 100\nNew York, NY 10001', director: 'John Smith', email: 'john@techcorp.com' },
    { id: 2, name: 'Innovation Labs Inc.', address: '789 Tech Street\nBuilding A\nSan Francisco, CA 94102', director: 'Alice Johnson', email: 'alice@innovationlabs.com' },
    { id: 3, name: 'Global Services Corp.', address: '321 Enterprise Way\nSuite 500\nChicago, IL 60601', director: 'Bob Wilson', email: 'bob@globalservices.com' }
  ]);

  const [contracts] = useState([
    { id: 1, name: 'Software Development Contract', sellerId: 1, buyerId: 2 },
    { id: 2, name: 'Consulting Agreement', sellerId: 1, buyerId: 3 },
    { id: 3, name: 'Maintenance Contract', sellerId: 2, buyerId: 3 }
  ]);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [selectedContract, setSelectedContract] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

  const handleCompanyChange = (type, companyId) => {
    const company = companies.find(c => c.id === parseInt(companyId));
    if (company) {
      setInvoice(prev => ({
        ...prev,
        [type]: {
          company: company.name,
          address: company.address,
          [type === 'seller' ? 'director' : 'contactPerson']: company.director,
          email: company.email
        }
      }));
    }
  };

  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === parseInt(contractId));
    if (contract) {
      setSelectedContract(contractId);
      const seller = companies.find(c => c.id === contract.sellerId);
      const buyer = companies.find(c => c.id === contract.buyerId);
      
      if (seller && buyer) {
        setInvoice(prev => ({
          ...prev,
          seller: {
            company: seller.name,
            address: seller.address,
            director: seller.director,
            email: seller.email
          },
          buyer: {
            company: buyer.name,
            address: buyer.address,
            contactPerson: buyer.director,
            email: buyer.email
          }
        }));
      }
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      grossWeight: 0,
      netWeight: 0,
      unitPrice: 0,
      amount: 1,
      total: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoice(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'unitPrice' || field === 'amount') {
            updatedItem.total = updatedItem.unitPrice * updatedItem.amount;
          }
          return updatedItem;
        }
        return item;
      });
      
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const removeItem = (id) => {
    setInvoice(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      ready: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ready' },
      approval_awaiting: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Awaiting Approval' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Invoice Creator</span>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-blue-600 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Create Invoice</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Templates</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowGenerateDropdown(!showGenerateDropdown)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <span>Generate PDF</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showGenerateDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Generate PDF</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Generate DOCX</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Export JSON</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Export XLSX</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <User className="w-5 h-5" />
                <span>Sarah Johnson</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen">
          <div className="p-6">
            {/* Import Data */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Import Data</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Drop XLSX file here or</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Browse Files</button>
                <p className="text-xs text-gray-500 mt-1">Supported: .xlsx, .xls</p>
              </div>
            </div>

            {/* Document Workspace */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Document Workspace</h3>
              <div className="space-y-2">
                {workspaces.map(workspace => (
                  <div key={workspace.id} className={`p-3 rounded-lg cursor-pointer ${workspace.active ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{workspace.name}</span>
                      {workspace.active && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                ))}
                <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add to Workspace
                </button>
              </div>
            </div>

            {/* Version History */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Version History</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Version</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-600">Auto-save</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Documents</h3>
              <div className="space-y-3">
                {recentDocuments.map(doc => (
                  <div key={doc.id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      {getStatusBadge(doc.status)}
                    </div>
                    <p className="text-xs text-gray-500">{doc.lastModified}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-gray-600">Professional Invoice Document</p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoice.number}
                      onChange={(e) => setInvoice(prev => ({ ...prev, number: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-right font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={invoice.date.split('/').reverse().join('-')}
                      onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value.split('-').reverse().join('/') }))}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract</label>
                <div className="relative">
                  <select
                    value={selectedContract}
                    onChange={(e) => handleContractChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 appearance-none bg-white"
                  >
                    <option value="">Select Contract</option>
                    {contracts.map(contract => (
                      <option key={contract.id} value={contract.id}>
                        {contract.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* From/To Section */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">From (Seller)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <select
                        value={companies.find(c => c.name === invoice.seller.company)?.id || ''}
                        onChange={(e) => handleCompanyChange('seller', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={invoice.seller.address}
                        onChange={(e) => setInvoice(prev => ({ ...prev, seller: { ...prev.seller, address: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                        <input
                          type="text"
                          value={invoice.seller.director}
                          onChange={(e) => setInvoice(prev => ({ ...prev, seller: { ...prev.seller, director: e.target.value } }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={invoice.seller.email}
                          onChange={(e) => setInvoice(prev => ({ ...prev, seller: { ...prev.seller, email: e.target.value } }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">To (Buyer)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <select
                        value={companies.find(c => c.name === invoice.buyer.company)?.id || ''}
                        onChange={(e) => handleCompanyChange('buyer', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={invoice.buyer.address}
                        onChange={(e) => setInvoice(prev => ({ ...prev, buyer: { ...prev.buyer, address: e.target.value } }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input
                          type="text"
                          value={invoice.buyer.contactPerson}
                          onChange={(e) => setInvoice(prev => ({ ...prev, buyer: { ...prev.buyer, contactPerson: e.target.value } }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={invoice.buyer.email}
                          onChange={(e) => setInvoice(prev => ({ ...prev, buyer: { ...prev.buyer, email: e.target.value } }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details</label>
                <select
                  value={invoice.bankDetails}
                  onChange={(e) => setInvoice(prev => ({ ...prev, bankDetails: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Chase Bank - Account: ****1234">Chase Bank - Account: ****1234</option>
                  <option value="Bank of America - Account: ****5678">Bank of America - Account: ****5678</option>
                  <option value="Wells Fargo - Account: ****9012">Wells Fargo - Account: ****9012</option>
                </select>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <button
                  onClick={addItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="overflow-x-auto">
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
                    {invoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Item name"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={item.grossWeight}
                            onChange={(e) => updateItem(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={item.netWeight}
                            onChange={(e) => updateItem(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateItem(item.id, 'amount', parseInt(e.target.value) || 1)}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-500">{invoice.currency}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-medium text-sm">${item.total.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax (10%):</span>
                      <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold">${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreator;