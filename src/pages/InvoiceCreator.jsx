import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  ChevronDown, Upload, Plus, Trash2, FileText, 
  Download, FileJson, FileSpreadsheet, Settings, Moon, LogOut, User, Building2, Mail, History,
  Search, X, CheckCircle2, AlertCircle, Save, XCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import { documentService } from '../services/documentService';
import Header from '../components/Header';
import BaseSidebar from '../components/common/sidebars/BaseSidebar';
import WarningDialog from '../components/WarningDialog';
import { getChanges } from '../utils/objectUtils';
import DocumentLeftSidebar from '../components/common/sidebars/DocumentLeftSidebar';
import DocumentRightSidebar from '../components/common/sidebars/DocumentRightSidebar';
import { generateDocumentVersions } from '../mocks/documentVersions';
import { mockWorkspaces } from '../mocks/workspaces';
import useVersionHistory from '../hooks/useVersionHistory';
import VersionWarningDialog from '../components/common/modals/VersionWarningDialog';
import Page from '../components/common/Page';

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
  onSave,
  isSaving
}) => {
  const [selectedContract, setSelectedContract] = useState('');
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  const handleContractSelect = (contractId) => {
    setSelectedContract(contractId);
    onContractChange(contractId);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Invoice Header Block */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Professional Invoice Document</p>
          </div>
        </div>

        {/* Invoice Number and Date */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoice.number}
              onChange={(e) => onFieldChange('number', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => onFieldChange('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Contract Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
      </div>

      {/* From/To Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-8">
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
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Information</label>
          <textarea
            value={invoice.bankDetails}
            onChange={(e) => onFieldChange('bankDetails', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
            placeholder="Enter bank account details..."
          />
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

// Move mock data generation outside component
const mockVersions = generateDocumentVersions('Invoice', 'INV-2024-001');

const defaultSelectedWorkspace = [mockWorkspaces[0]];

const InvoiceCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

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
  const { data: companies = [], error: companiesError } = useQuery('companies', () => documentService.getCompanies());
  const { data: contracts = [], error: contractsError } = useQuery('contracts', () => documentService.getContracts());

  // Use mock versions data
  const { data: versions = mockVersions, isLoading: isLoadingVersions } = useQuery(
    ['versions', id],
    () => Promise.resolve(mockVersions), // Simulate API call
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(`Failed to load versions: ${error.message}`);
      }
    }
  );

  // Set initial state only once when component mounts
  useEffect(() => {
    if (versions.length > 0 && !lastSavedState) {
      const currentVersion = versions[0]; // First version is always current
      setInvoice(currentVersion.data);
      setLastSavedState(currentVersion.data);
    }
  }, [versions, lastSavedState]);

  // Track changes
  useEffect(() => {
    if (lastSavedState) {
      const changes = getChanges(lastSavedState, invoice);
      setHasUnsavedChanges(changes.length > 0);
    }
  }, [invoice, lastSavedState]);

  // Save mutations
  const createMutation = useMutation((data) => documentService.createInvoice(data), {
    onSuccess: () => {
      toast.success('Invoice created successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    }
  });

  const updateMutation = useMutation((data) => documentService.updateInvoice(id, data), {
    onSuccess: () => {
      toast.success('Invoice updated successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Failed to update invoice: ${error.message}`);
    }
  });

  // Update save handler to update lastSaved time
  const handleSave = async (type) => {
    try {
      const mutation = isEditing ? updateMutation : createMutation;
      await mutation.mutateAsync({ ...invoice, status: type });
      setLastSavedState(JSON.parse(JSON.stringify(invoice)));
      setHasUnsavedChanges(false);
      setLastSaved(new Date()); // Update last saved time
      toast.success(`Invoice saved as ${type}`);
      if (type === 'final') {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(`Failed to save invoice: ${error.message}`);
    }
  };

  const {
    selectedVersion: versionToRestore,
    showWarningDialog: isWarningDialogOpen,
    handleVersionSelect,
    handleWarningDialogConfirm,
    handleWarningDialogSaveAndGo,
    setShowWarningDialog: setWarningDialogOpen
  } = useVersionHistory({
    currentDocument: invoice,
    onDocumentChange: setInvoice,
    onSave: handleSave,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setLastSavedState
  });

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
    <Page
      leftSidebar={
          <DocumentLeftSidebar
            isCollapsed={isSidebarCollapsed}
            documentType="Invoice"
            versions={versions}
            currentVersion={lastSavedState}
            onVersionSelect={handleVersionSelect}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSave}
            lastSavedState={lastSavedState}
            document={invoice}
            onCollaborationClick={() => {/* Handle collaboration click */}}
            onPreview={() => {/* Handle preview */}}
            onExport={(type) => {
              console.log(`Exporting as ${type}`);
              setShowGenerateDropdown(false);
            }}
            isSaving={isCreating || isUpdating}
            lastSaved={lastSaved}
            onLeftSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            workspaces={mockWorkspaces}
            selectedWorkspace={defaultSelectedWorkspace}
          />
      }
      isLeftSidebarCollapsed={isSidebarCollapsed}
      onLeftSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      showBreadcrumbs={true}
      breadcrumbs={[
        { label: defaultSelectedWorkspace[0].name, href: `/workspaces/${defaultSelectedWorkspace[0].id}` },
        { label: 'Invoices', href: '/documents/invoices' },
        { label: isEditing ? `Edit Invoice ${invoice.number}` : 'New Invoice' }
      ]}
    >
      <div className="p-6">
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
                <div className="w-full">
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
                    onSave={handleSave}
                    isSaving={isCreating || isUpdating}
                  />
                </div>
              )}
            </div>

      <VersionWarningDialog
        isOpen={isWarningDialogOpen}
        onClose={() => setWarningDialogOpen(false)}
        onConfirm={handleWarningDialogConfirm}
        onSaveAndGo={handleWarningDialogSaveAndGo}
      />
    </Page>
  );
};

export default InvoiceCreator; 