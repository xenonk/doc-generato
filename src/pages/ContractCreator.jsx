import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { documentService } from '../services/documentService';
import DocumentLayout from '../components/common/DocumentLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FileText, Building2, Calendar, DollarSign, 
  User, Mail, Phone, Globe, FileSignature,
  ChevronLeft, Save, X, AlertCircle,
  Download,
  Printer,
  Share2,
  Upload,
  Trash2,
  Check,
  Clock,
  Users,
  MapPin,
  Tag,
  Percent,
  File,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  FileSpreadsheet,
  FilePdf,
  FileWord,
  FileArchive
} from 'lucide-react';
import Header from '../components/Header';
import BaseSidebar from '../components/common/BaseSidebar';
import DocumentSidebarContent from '../components/common/DocumentSidebarContent';
import DocumentRightSidebar from '../components/common/DocumentRightSidebar';
import DocumentFormWrapper from '../components/common/DocumentFormWrapper';

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'ABC Corporation', type: 'Customer', country: 'USA', city: 'New York' },
  { id: 2, name: 'XYZ Ltd', type: 'Supplier', country: 'UK', city: 'London' },
  { id: 3, name: 'Global Industries', type: 'Partner', country: 'Germany', city: 'Berlin' },
  { id: 4, name: 'Tech Solutions', type: 'Customer', country: 'Canada', city: 'Toronto' },
  { id: 5, name: 'Pacific Trading', type: 'Supplier', country: 'Japan', city: 'Tokyo' }
];

// Mock data for contract types
const contractTypes = [
  { id: 'service', name: 'Service Agreement' },
  { id: 'supply', name: 'Supply Contract' },
  { id: 'nda', name: 'Non-Disclosure Agreement' },
  { id: 'partnership', name: 'Partnership Agreement' },
  { id: 'employment', name: 'Employment Contract' }
];

// Mock data for currencies
const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' }
];

// Mock data for payment terms
const paymentTerms = [
  { id: 'net30', name: 'Net 30' },
  { id: 'net60', name: 'Net 60' },
  { id: 'immediate', name: 'Immediate' },
  { id: 'advance', name: 'Advance Payment' },
  { id: 'milestone', name: 'Milestone-based' }
];

// Default document state
const defaultDocument = {
  contractNumber: '',
  contractDate: new Date().toISOString().split('T')[0],
  contractType: '',
  status: 'draft',
  subject: '',
  description: '',
  effectiveDate: '',
  expirationDate: '',
  value: '',
  currency: '',
  paymentTerms: '',
  termsAndConditions: '',
  deliverables: '',
  governingLaw: '',
  jurisdiction: '',
  terminationClause: '',
  renewalTerms: '',
  specialConditions: '',
  seller: {
    companyName: '',
    representative: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    taxId: ''
  },
  buyer: {
    companyName: '',
    representative: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    taxId: ''
  },
  attachments: [],
  lastSaved: null
};

const ContractCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(defaultDocument);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [versions, setVersions] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [formData, setFormData] = useState({
    contractNumber: '',
    contractType: '',
    title: '',
    description: '',
    effectiveDate: '',
    expirationDate: '',
    value: '',
    currency: 'USD',
    paymentTerms: '',
    parties: {
      firstParty: {
        companyId: '',
        representative: '',
        position: '',
        email: '',
        phone: ''
      },
      secondParty: {
        companyId: '',
        representative: '',
        position: '',
        email: '',
        phone: ''
      }
    },
    deliverables: '',
    termsAndConditions: '',
    governingLaw: '',
    jurisdiction: '',
    terminationClause: '',
    renewalTerms: '',
    specialConditions: '',
    attachments: []
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (id) {
          const data = await documentService.getContract(id);
          setDocument(data);
          setFormData(data);
          // Mock versions data
          const mockVersions = [
            {
              id: 1,
              version: '1.0',
              status: 'draft',
              date: new Date(),
              author: 'John Doe',
              changes: 'Initial version'
            },
            {
              id: 2,
              version: '1.1',
              status: 'review',
              date: new Date(Date.now() - 86400000),
              author: 'Jane Smith',
              changes: 'Updated terms and conditions'
            }
          ];
          setVersions(mockVersions);
          setCurrentVersion(mockVersions[0]);
          // Mock collaborators data
          setCollaborators([
            { id: 1, name: 'John Doe', role: 'Author', avatar: 'JD' },
            { id: 2, name: 'Jane Smith', role: 'Reviewer', avatar: 'JS' }
          ]);
          // Mock workspaces data
          setWorkspaces([
            { id: 1, name: 'Legal Team', type: 'team' },
            { id: 2, name: 'Sales Team', type: 'team' },
            { id: 3, name: 'Personal', type: 'personal' }
          ]);
          setSelectedWorkspace({ id: 1, name: 'Legal Team', type: 'team' });
          setLastSaved(data.lastSaved);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleSave = async (type) => {
    setIsSaving(true);
    try {
      const updatedDocument = {
        ...document,
        ...formData,
        status: type === 'final' ? 'review' : 'draft',
        lastSaved: new Date()
      };
      if (id) {
        await documentService.updateContract(id, updatedDocument);
      } else {
        await documentService.createContract(updatedDocument);
      }
      setDocument(updatedDocument);
      setHasUnsavedChanges(false);
      setLastSaved(updatedDocument.lastSaved);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Implement preview functionality
    console.log('Preview document');
  };

  const handleExport = (type) => {
    // Implement export functionality
    console.log('Export document as', type);
  };

  const handleVersionSelect = (version) => {
    setCurrentVersion(version);
    // In a real app, this would load the document version
    console.log('Select version', version);
  };

  const handleCollaboration = () => {
    // Implement collaboration functionality
    console.log('Open collaboration panel');
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleWorkspaceFilter = (query) => {
    // Implement workspace filtering
    console.log('Filter workspaces by', query);
  };

  const handleUnsavedChangesConfirm = () => {
    handleSave('draft');
  };

  const handleUnsavedChangesCancel = () => {
    navigate(-1);
  };

  const handleStatusChange = (newStatus) => {
    setDocument(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
    setHasUnsavedChanges(true);
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (field, value) => {
    setDocument(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handlePartyChange = (party, field, value) => {
    setDocument(prev => ({
      ...prev,
      [party]: {
        ...prev[party],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-50px)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-50px)]">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">
              Failed to load contract
            </div>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        <BaseSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="bg-white border-r border-gray-200"
        >
          <DocumentSidebarContent 
            document={document}
            versions={versions}
            currentVersion={currentVersion}
            onVersionSelect={handleVersionSelect}
            hasUnsavedChanges={hasUnsavedChanges}
            isCollapsed={isSidebarCollapsed}
            onSave={handleSave}
            lastSavedState={lastSaved}
            documentType="Contract"
            onStatusChange={handleStatusChange}
            onCollaborationClick={handleCollaboration}
            collaborators={collaborators}
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceSelect={handleWorkspaceSelect}
            onWorkspaceFilter={handleWorkspaceFilter}
            onUnsavedChangesConfirm={handleUnsavedChangesConfirm}
            onUnsavedChangesCancel={handleUnsavedChangesCancel}
          />
        </BaseSidebar>
        
        <div className="flex-1 flex">
          <div className="flex-1 p-6 overflow-y-auto">
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
              <DocumentFormWrapper>
                {/* Contract Header */}
                <DocumentFormWrapper.Section title="Contract Header">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Grid cols={2}>
                      <DocumentFormWrapper.Field label="Contract Number">
                        <DocumentFormWrapper.Input
                          type="text"
                          value={document.contractNumber}
                          onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                          placeholder="Enter contract number"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Contract Date">
                        <DocumentFormWrapper.Input
                          type="date"
                          value={document.contractDate}
                          onChange={(e) => handleInputChange('contractDate', e.target.value)}
                        />
                      </DocumentFormWrapper.Field>
                    </DocumentFormWrapper.Grid>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Contract Type and Status */}
                <DocumentFormWrapper.Section title="Contract Type and Status">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Grid cols={2}>
                      <DocumentFormWrapper.Field label="Contract Type">
                        <DocumentFormWrapper.Select
                          value={document.contractType}
                          onChange={(e) => handleInputChange('contractType', e.target.value)}
                          options={[
                            { value: 'sales', label: 'Sales Contract' },
                            { value: 'service', label: 'Service Agreement' },
                            { value: 'employment', label: 'Employment Contract' },
                            { value: 'nda', label: 'Non-Disclosure Agreement' }
                          ]}
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Status">
                        <DocumentFormWrapper.Select
                          value={document.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'review', label: 'In Review' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'expired', label: 'Expired' }
                          ]}
                        />
                      </DocumentFormWrapper.Field>
                    </DocumentFormWrapper.Grid>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Parties Information */}
                <DocumentFormWrapper.Section title="Parties Information">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* First Party */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">First Party</h4>
                      <DocumentFormWrapper.Field label="Company">
                        <DocumentFormWrapper.Select
                          value={document.seller.companyId}
                          onChange={(e) => handlePartyChange('seller', 'companyId', e.target.value)}
                          options={mockCompanies.map(company => ({ value: company.id, label: `${company.name} (${company.type})` }))}
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Representative">
                        <DocumentFormWrapper.Input
                          type="text"
                          value={document.seller.representative}
                          onChange={(e) => handlePartyChange('seller', 'representative', e.target.value)}
                          placeholder="Enter representative name"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Position">
                        <DocumentFormWrapper.Input
                          type="text"
                          value={document.seller.position}
                          onChange={(e) => handlePartyChange('seller', 'position', e.target.value)}
                          placeholder="Enter position"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Email">
                        <DocumentFormWrapper.Input
                          type="email"
                          value={document.seller.email}
                          onChange={(e) => handlePartyChange('seller', 'email', e.target.value)}
                          placeholder="Enter email"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Phone">
                        <DocumentFormWrapper.Input
                          type="tel"
                          value={document.seller.phone}
                          onChange={(e) => handlePartyChange('seller', 'phone', e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </DocumentFormWrapper.Field>
                    </div>

                    {/* Second Party */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Second Party</h4>
                      <DocumentFormWrapper.Field label="Company">
                        <DocumentFormWrapper.Select
                          value={document.buyer.companyId}
                          onChange={(e) => handlePartyChange('buyer', 'companyId', e.target.value)}
                          options={mockCompanies.map(company => ({ value: company.id, label: `${company.name} (${company.type})` }))}
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Representative">
                        <DocumentFormWrapper.Input
                          type="text"
                          value={document.buyer.representative}
                          onChange={(e) => handlePartyChange('buyer', 'representative', e.target.value)}
                          placeholder="Enter representative name"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Position">
                        <DocumentFormWrapper.Input
                          type="text"
                          value={document.buyer.position}
                          onChange={(e) => handlePartyChange('buyer', 'position', e.target.value)}
                          placeholder="Enter position"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Email">
                        <DocumentFormWrapper.Input
                          type="email"
                          value={document.buyer.email}
                          onChange={(e) => handlePartyChange('buyer', 'email', e.target.value)}
                          placeholder="Enter email"
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Phone">
                        <DocumentFormWrapper.Input
                          type="tel"
                          value={document.buyer.phone}
                          onChange={(e) => handlePartyChange('buyer', 'phone', e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </DocumentFormWrapper.Field>
                    </div>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Contract Details */}
                <DocumentFormWrapper.Section title="Contract Details">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Field label="Title">
                      <DocumentFormWrapper.Input
                        type="text"
                        value={document.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter contract title"
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Description">
                      <DocumentFormWrapper.Textarea
                        value={document.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter contract description"
                        rows={4}
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Grid cols={2}>
                      <DocumentFormWrapper.Field label="Effective Date">
                        <DocumentFormWrapper.Input
                          type="date"
                          value={document.effectiveDate}
                          onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Expiration Date">
                        <DocumentFormWrapper.Input
                          type="date"
                          value={document.expirationDate}
                          onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                        />
                      </DocumentFormWrapper.Field>
                    </DocumentFormWrapper.Grid>
                    <DocumentFormWrapper.Grid cols={2}>
                      <DocumentFormWrapper.Field label="Value">
                        <DocumentFormWrapper.Input
                          type="number"
                          value={document.value}
                          onChange={(e) => handleInputChange('value', e.target.value)}
                        />
                      </DocumentFormWrapper.Field>
                      <DocumentFormWrapper.Field label="Currency">
                        <DocumentFormWrapper.Select
                          value={document.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          options={currencies.map(currency => ({ value: currency.code, label: `${currency.code} - ${currency.name}` }))}
                        />
                      </DocumentFormWrapper.Field>
                    </DocumentFormWrapper.Grid>
                    <DocumentFormWrapper.Field label="Payment Terms">
                      <DocumentFormWrapper.Select
                        value={document.paymentTerms}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        options={paymentTerms.map(term => ({ value: term.id, label: term.name }))}
                      />
                    </DocumentFormWrapper.Field>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Contract Terms */}
                <DocumentFormWrapper.Section title="Contract Terms">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Field label="Terms and Conditions">
                      <DocumentFormWrapper.Textarea
                        value={document.termsAndConditions}
                        onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                        placeholder="Enter contract terms and conditions"
                        rows={6}
                      />
                    </DocumentFormWrapper.Field>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Additional Information */}
                <DocumentFormWrapper.Section title="Additional Information">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Field label="Deliverables">
                      <DocumentFormWrapper.Textarea
                        value={document.deliverables}
                        onChange={(e) => handleInputChange('deliverables', e.target.value)}
                        placeholder="Enter contract deliverables"
                        rows={4}
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Governing Law">
                      <DocumentFormWrapper.Input
                        type="text"
                        value={document.governingLaw}
                        onChange={(e) => handleInputChange('governingLaw', e.target.value)}
                        placeholder="Enter governing law"
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Jurisdiction">
                      <DocumentFormWrapper.Input
                        type="text"
                        value={document.jurisdiction}
                        onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                        placeholder="Enter jurisdiction"
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Termination Clause">
                      <DocumentFormWrapper.Textarea
                        value={document.terminationClause}
                        onChange={(e) => handleInputChange('terminationClause', e.target.value)}
                        placeholder="Enter termination clause"
                        rows={2}
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Renewal Terms">
                      <DocumentFormWrapper.Textarea
                        value={document.renewalTerms}
                        onChange={(e) => handleInputChange('renewalTerms', e.target.value)}
                        placeholder="Enter renewal terms"
                        rows={2}
                      />
                    </DocumentFormWrapper.Field>
                    <DocumentFormWrapper.Field label="Special Conditions">
                      <DocumentFormWrapper.Textarea
                        value={document.specialConditions}
                        onChange={(e) => handleInputChange('specialConditions', e.target.value)}
                        placeholder="Enter special conditions"
                        rows={2}
                      />
                    </DocumentFormWrapper.Field>
                  </div>
                </DocumentFormWrapper.Section>

                {/* Attachments */}
                <DocumentFormWrapper.Section title="Attachments">
                  <div className="space-y-4">
                    <DocumentFormWrapper.Field label="Upload Files">
                      <DocumentFormWrapper.Input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e)}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </DocumentFormWrapper.Field>
                    {formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DocumentFormWrapper.Section>
              </DocumentFormWrapper>
            )}
          </div>

          {/* Right Sidebar */}
          <DocumentRightSidebar
            onPreview={handlePreview}
            onExport={handleExport}
            onSave={handleSave}
            isSaving={isSaving}
            showExportDropdown={showExportDropdown}
            onExportDropdownToggle={() => setShowExportDropdown(!showExportDropdown)}
            showSaveDropdown={showSaveDropdown}
            onSaveDropdownToggle={() => setShowSaveDropdown(!showSaveDropdown)}
            isCollapsed={isRightSidebarCollapsed}
            onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
            status={document?.status || 'draft'}
            lastSaved={lastSaved}
            documentType="Contract"
          />
        </div>
      </div>
    </div>
  );
};

export default ContractCreator; 