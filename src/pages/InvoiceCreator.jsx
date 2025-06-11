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
import GlobalModal from '../components/common/modals/GlobalModal';
import Page from '../components/common/Page';
import DocumentForm from '../components/common/DocumentForm';
import invoiceSchema from '../schemas/invoiceSchema';
import useFormFieldChange from '../hooks/useFormFieldChange';

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
    currency: 'USD'
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
  const createMutation = useMutation((data) => documentService.createDocument('invoice', data), {
    onSuccess: () => {
      toast.success('Invoice created successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    }
  });

  const updateMutation = useMutation((data) => documentService.updateDocument('invoice', id, data), {
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

  // Configure form field change handlers
  const { handleFieldChange, handleEntityChange, handleArrayField } = useFormFieldChange(setInvoice, {
    entities: {
      company: {
        data: companies,
        mapping: (company, prevData) => {
          // Determine if this is a seller or buyer company based on the field being changed
          const isSeller = prevData.seller?.company === company.name;
          const isBuyer = prevData.buyer?.company === company.name;
          const type = isSeller ? 'seller' : isBuyer ? 'buyer' : company.type;

          return {
            [type]: {
              company: company.name,
              address: company.address,
              [type === 'seller' ? 'director' : 'contactPerson']: company.director,
              email: company.email
            }
          };
        }
      },
      contract: {
        data: contracts,
        mapping: (contract) => {
          const seller = companies.find(c => c.id === contract.seller_id);
          const buyer = companies.find(c => c.id === contract.buyer_id);
          
          return {
            seller: seller ? {
              company: seller.name,
              address: seller.address,
              director: seller.director,
              email: seller.email
            } : {},
            buyer: buyer ? {
              company: buyer.name,
              address: buyer.address,
              contactPerson: buyer.director,
              email: buyer.email
            } : {}
          };
        }
      }
    },
    onChange: (newData) => {
      // Update last saved state to track changes
      setLastSavedState(prev => {
        if (!prev) return newData;
        const changes = getChanges(prev, newData);
        if (changes.length > 0) {
          setHasUnsavedChanges(true);
        }
        return prev;
      });
    }
  });

  // Get array field handlers for items
  const { addItem, updateItem, removeItem } = handleArrayField('items');

  // Prepare schema with dynamic options and handlers
  const preparedSchema = invoiceSchema.map(section => {
    if (section.title === 'Contract') {
      return {
        ...section,
        fields: section.fields.map(field =>
          field.name === 'contract'
            ? { 
                ...field, 
                options: contracts.map(c => ({ value: c.id, label: c.name })),
                onChange: (value) => handleEntityChange('contract', value)
              }
            : field
        )
      };
    }
    if (section.title === 'From (Seller)') {
      return {
        ...section,
        fields: section.fields.map(field => {
          if (field.name === 'seller.company') {
            return {
              ...field,
              options: companies.map(c => ({ value: c.id, label: c.name })),
              getValue: (data) => {
                const company = companies.find(c => c.name === data.seller?.company);
                return company ? company.id : '';
              },
              onChange: (value) => {
                const selectedCompany = companies.find(c => c.id === parseInt(value));
                if (selectedCompany) {
                  const updatedInvoice = {
                    ...invoice,
                    seller: {
                      ...invoice.seller,
                      company: selectedCompany.name,
                      address: selectedCompany.address || invoice.seller?.address || '',
                      director: selectedCompany.director || invoice.seller?.director || '',
                      email: selectedCompany.email || invoice.seller?.email || ''
                    }
                  };
                  setInvoice(updatedInvoice);
                  // Track changes for status
                  setLastSavedState(prev => {
                    if (!prev) return updatedInvoice;
                    const changes = getChanges(prev, updatedInvoice);
                    if (changes.length > 0) {
                      setHasUnsavedChanges(true);
                    }
                    return prev;
                  });
                }
              }
            };
          }
          return {
            ...field,
            onChange: (value) => {
              handleFieldChange(field.name, value);
              // Track changes for status
              setLastSavedState(prev => {
                if (!prev) return invoice;
                const changes = getChanges(prev, { ...invoice, [field.name]: value });
                if (changes.length > 0) {
                  setHasUnsavedChanges(true);
                }
                return prev;
              });
            }
          };
        })
      };
    }
    if (section.title === 'To (Buyer)') {
      return {
        ...section,
        fields: section.fields.map(field => {
          if (field.name === 'buyer.company') {
            return {
              ...field,
              options: companies.map(c => ({ value: c.id, label: c.name })),
              getValue: (data) => {
                const company = companies.find(c => c.name === data.buyer?.company);
                return company ? company.id : '';
              },
              onChange: (value) => {
                const selectedCompany = companies.find(c => c.id === parseInt(value));
                if (selectedCompany) {
                  const updatedInvoice = {
                    ...invoice,
                    buyer: {
                      ...invoice.buyer,
                      company: selectedCompany.name,
                      address: selectedCompany.address || invoice.buyer?.address || '',
                      contactPerson: selectedCompany.director || invoice.buyer?.contactPerson || '',
                      email: selectedCompany.email || invoice.buyer?.email || ''
                    }
                  };
                  setInvoice(updatedInvoice);
                  // Track changes for status
                  setLastSavedState(prev => {
                    if (!prev) return updatedInvoice;
                    const changes = getChanges(prev, updatedInvoice);
                    if (changes.length > 0) {
                      setHasUnsavedChanges(true);
                    }
                    return prev;
                  });
                }
              }
            };
          }
          return {
            ...field,
            onChange: (value) => {
              handleFieldChange(field.name, value);
              // Track changes for status
              setLastSavedState(prev => {
                if (!prev) return invoice;
                const changes = getChanges(prev, { ...invoice, [field.name]: value });
                if (changes.length > 0) {
                  setHasUnsavedChanges(true);
                }
                return prev;
              });
            }
          };
        })
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
      <GlobalModal
        isOpen={isWarningDialogOpen}
        title="Unsaved Changes"
        message="You have unsaved changes. Would you like to save them before switching versions?"
        actions={[
          {
            label: 'Cancel',
            onClick: () => setWarningDialogOpen(false),
            className: 'px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'
          },
          {
            label: 'Discard Changes',
            onClick: handleWarningDialogConfirm,
            className: 'px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md'
          },
          {
            label: 'Save & Switch',
            onClick: handleWarningDialogSaveAndGo,
            className: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md'
          }
        ]}
      />
    </Page>
  );
};

export default Invoice; 