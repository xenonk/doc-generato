import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  ChevronDown, Upload, Plus, Trash2, FileText, 
  Settings, Moon, LogOut, User, Building2, Mail 
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { getUserProfile } from '../utils/auth';

// Header Component
const Header = ({ onSave, isSaving }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const user = getUserProfile();

  return (
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
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/invoice/create" className="text-blue-600 font-medium">Create Invoice</a>
            <a href="/templates" className="text-gray-600 hover:text-gray-900">Templates</a>
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
              <span>{user.name}</span>
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
  );
};

// Sidebar Component
const Sidebar = ({ onSaveAsDraft }) => {
  const [workspaces] = useState([
    { id: 1, name: 'Current Invoice', active: true },
    { id: 2, name: 'Q1 2024 Invoices', active: false },
    { id: 3, name: 'Client Templates', active: false }
  ]);

  return (
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

        {/* Save as Draft */}
        <button
          onClick={onSaveAsDraft}
          className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
};

// Invoice Form Component
const InvoiceForm = ({ 
  invoice, 
  companies, 
  contracts, 
  onFieldChange, 
  onContractChange, 
  onCompanyChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  isSaving
}) => {
  const [selectedContract, setSelectedContract] = useState('');

  const handleContractSelect = (contractId) => {
    setSelectedContract(contractId);
    onContractChange(contractId);
  };

  return (
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
                onChange={(e) => onFieldChange('number', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-right font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={invoice.date}
                onChange={(e) => onFieldChange('date', e.target.value)}
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
              onChange={(e) => handleContractSelect(e.target.value)}
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
                  value={invoice.seller?.company || ''}
                  onChange={(e) => onCompanyChange('seller', e.target.value)}
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
                  value={invoice.seller?.address || ''}
                  onChange={(e) => onFieldChange('seller.address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                  <input
                    type="text"
                    value={invoice.seller?.director || ''}
                    onChange={(e) => onFieldChange('seller.director', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoice.seller?.email || ''}
                    onChange={(e) => onFieldChange('seller.email', e.target.value)}
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
                  value={invoice.buyer?.company || ''}
                  onChange={(e) => onCompanyChange('buyer', e.target.value)}
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
                  value={invoice.buyer?.address || ''}
                  onChange={(e) => onFieldChange('buyer.address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={invoice.buyer?.contactPerson || ''}
                    onChange={(e) => onFieldChange('buyer.contactPerson', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invoice.buyer?.email || ''}
                    onChange={(e) => onFieldChange('buyer.email', e.target.value)}
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
            value={invoice.bankDetails || ''}
            onChange={(e) => onFieldChange('bankDetails', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Bank Account</option>
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
            onClick={onAddItem}
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
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Item name"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.grossWeight}
                      onChange={(e) => onUpdateItem(item.id, 'grossWeight', parseFloat(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.netWeight}
                      onChange={(e) => onUpdateItem(item.id, 'netWeight', parseFloat(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => onUpdateItem(item.id, 'amount', parseInt(e.target.value) || 1)}
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
                      onClick={() => onRemoveItem(item.id)}
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
  );
};

export default function InvoiceCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [invoice, setInvoice] = useState({
    number: 'INV-2024-001',
    date: new Date().toISOString().split('T')[0],
    seller: {
      company: '',
      address: '',
      director: '',
      email: ''
    },
    buyer: {
      company: '',
      address: '',
      contactPerson: '',
      email: ''
    },
    bankDetails: '',
    items: [],
    currency: 'USD',
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Fetch companies and contracts
  const { data: companies = [], error: companiesError } = useQuery(
    'companies',
    () => documentService.getCompanies(),
    {
      onError: (error) => {
        toast.error(`Failed to load companies: ${error.message}`);
      }
    }
  );

  const { data: contracts = [], error: contractsError } = useQuery(
    'contracts',
    () => documentService.getContracts(),
    {
      onError: (error) => {
        toast.error(`Failed to load contracts: ${error.message}`);
      }
    }
  );

  // Fetch invoice if editing
  useEffect(() => {
    if (isEditing) {
      documentService.getInvoice(id)
        .then(data => setInvoice(data))
        .catch(error => {
          toast.error(`Failed to load invoice: ${error.message}`);
          navigate('/');
        });
    }
  }, [id, isEditing, navigate]);

  // Save mutations
  const createMutation = useMutation(
    (data) => documentService.createInvoice(data),
    {
      onSuccess: () => {
        toast.success('Invoice created successfully');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(`Failed to create invoice: ${error.message}`);
      }
    }
  );

  const updateMutation = useMutation(
    (data) => documentService.updateInvoice(id, data),
    {
      onSuccess: () => {
        toast.success('Invoice updated successfully');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(`Failed to update invoice: ${error.message}`);
      }
    }
  );

  const handleSave = () => {
    const mutation = isEditing ? updateMutation : createMutation;
    mutation.mutate(invoice);
  };

  const handleSaveAsDraft = () => {
    const mutation = isEditing ? updateMutation : createMutation;
    mutation.mutate({ ...invoice, status: 'draft' });
  };

  const handleFieldChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInvoice(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoice(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === parseInt(contractId));
    if (contract) {
      const seller = companies.find(c => c.id === contract.seller_id);
      const buyer = companies.find(c => c.id === contract.buyer_id);
      
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

  const error = companiesError || contractsError;
  const isCreating = createMutation.isLoading;
  const isUpdating = updateMutation.isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSave={handleSave} isSaving={isCreating || isUpdating} />
      
      <div className="flex">
        <Sidebar onSaveAsDraft={handleSaveAsDraft} />
        
        <div className="flex-1 p-8">
          {error ? (
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">
                Failed to load data
              </div>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Go Back to Dashboard
              </button>
            </div>
          ) : (
            <InvoiceForm
              invoice={invoice}
              companies={companies}
              contracts={contracts}
              onFieldChange={handleFieldChange}
              onContractChange={handleContractChange}
              onCompanyChange={handleCompanyChange}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isSaving={isCreating || isUpdating}
            />
          )}
        </div>
      </div>
    </div>
  );
} 