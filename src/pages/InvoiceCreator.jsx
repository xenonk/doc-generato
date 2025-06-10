import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { documentService } from '../services/documentService';
import { getChanges } from '../utils/objectUtils';
import DocumentLeftSidebar from '../components/common/sidebars/DocumentLeftSidebar';
import { generateDocumentVersions } from '../mocks/documentVersions';
import { mockWorkspaces } from '../mocks/workspaces';
import useVersionHistory from '../hooks/useVersionHistory';
import VersionWarningDialog from '../components/common/modals/VersionWarningDialog';
import Page from '../components/common/Page';
import DocumentForm from '../components/common/DocumentForm';
import invoiceSchema from '../schemas/invoiceSchema';

const mockVersions = generateDocumentVersions('Invoice', 'INV-2024-001');
const defaultSelectedWorkspace = [mockWorkspaces[0]];

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [lastSaved, setLastSaved] = useState(new Date());

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

  // Prepare schema with dynamic options
  const preparedSchema = invoiceSchema.map(section => {
    if (section.title === 'Contract') {
      return {
        ...section,
        fields: section.fields.map(field =>
          field.name === 'contract'
            ? { ...field, options: contracts.map(c => ({ value: c.id, label: c.name })) }
            : field
        )
      };
    }
    if (section.title === 'From (Seller)') {
      return {
        ...section,
        fields: section.fields.map(field =>
          field.name === 'seller.company'
            ? { ...field, options: companies.map(c => ({ value: c.id, label: c.name })) }
            : field
        )
      };
    }
    if (section.title === 'To (Buyer)') {
      return {
        ...section,
        fields: section.fields.map(field =>
          field.name === 'buyer.company'
            ? { ...field, options: companies.map(c => ({ value: c.id, label: c.name })) }
            : field
        )
      };
    }
    return section;
  });

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
            <DocumentForm
              schema={preparedSchema}
              documentData={invoice}
              onFieldChange={handleFieldChange}
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

export default Invoice; 