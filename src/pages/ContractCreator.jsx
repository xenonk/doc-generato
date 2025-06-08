import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { documentService } from '../services/documentService';
import DocumentLayout from '../components/common/DocumentLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FileText, Building2, Calendar, DollarSign, 
  User, Mail, Phone, Globe, FileSignature,
  ChevronLeft, Save, X, AlertCircle
} from 'lucide-react';

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

const ContractCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <DocumentLayout
      title={id ? 'Edit Contract' : 'Create New Contract'}
      documentType="Contract"
      document={document}
      versions={versions}
      currentVersion={currentVersion}
      onVersionSelect={handleVersionSelect}
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      isSaving={isSaving}
      lastSaved={document?.lastSaved}
      onStatusChange={handleStatusChange}
      onPreview={handlePreview}
      onExport={handleExport}
      onBack={() => navigate(-1)}
      collaborators={collaborators}
      workspaces={workspaces}
      selectedWorkspace={selectedWorkspace}
      onWorkspaceSelect={handleWorkspaceSelect}
      onWorkspaceFilter={handleWorkspaceFilter}
      onUnsavedChangesConfirm={handleUnsavedChangesConfirm}
      onUnsavedChangesCancel={handleUnsavedChangesCancel}
    >
      <div className="space-y-6">
        {/* Contract form content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">
                  Contract Number
                </label>
                <input
                  type="text"
                  id="contractNumber"
                  name="contractNumber"
                  value={formData.contractNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="contractType" className="block text-sm font-medium text-gray-700">
                  Contract Type
                </label>
                <select
                  id="contractType"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a type</option>
                  {contractTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dates and Value */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Dates and Value</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                  Effective Date
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
                  Payment Terms
                </label>
                <select
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select payment terms</option>
                  {paymentTerms.map(term => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Parties Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Parties Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Party */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900">First Party</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstParty.companyId" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    id="firstParty.companyId"
                    name="firstParty.companyId"
                    value={formData.parties.firstParty.companyId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select a company</option>
                    {mockCompanies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name} ({company.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="firstParty.representative" className="block text-sm font-medium text-gray-700">
                    Representative
                  </label>
                  <input
                    type="text"
                    id="firstParty.representative"
                    name="firstParty.representative"
                    value={formData.parties.firstParty.representative}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="firstParty.position" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    id="firstParty.position"
                    name="firstParty.position"
                    value={formData.parties.firstParty.position}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="firstParty.email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="firstParty.email"
                    name="firstParty.email"
                    value={formData.parties.firstParty.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="firstParty.phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="firstParty.phone"
                    name="firstParty.phone"
                    value={formData.parties.firstParty.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Second Party */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900">Second Party</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="secondParty.companyId" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    id="secondParty.companyId"
                    name="secondParty.companyId"
                    value={formData.parties.secondParty.companyId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select a company</option>
                    {mockCompanies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name} ({company.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="secondParty.representative" className="block text-sm font-medium text-gray-700">
                    Representative
                  </label>
                  <input
                    type="text"
                    id="secondParty.representative"
                    name="secondParty.representative"
                    value={formData.parties.secondParty.representative}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="secondParty.position" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    id="secondParty.position"
                    name="secondParty.position"
                    value={formData.parties.secondParty.position}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="secondParty.email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="secondParty.email"
                    name="secondParty.email"
                    value={formData.parties.secondParty.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="secondParty.phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="secondParty.phone"
                    name="secondParty.phone"
                    value={formData.parties.secondParty.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">
                Deliverables
              </label>
              <textarea
                id="deliverables"
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700">
                Terms and Conditions
              </label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="governingLaw" className="block text-sm font-medium text-gray-700">
                  Governing Law
                </label>
                <input
                  type="text"
                  id="governingLaw"
                  name="governingLaw"
                  value={formData.governingLaw}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
                  Jurisdiction
                </label>
                <input
                  type="text"
                  id="jurisdiction"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="terminationClause" className="block text-sm font-medium text-gray-700">
                Termination Clause
              </label>
              <textarea
                id="terminationClause"
                name="terminationClause"
                value={formData.terminationClause}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="renewalTerms" className="block text-sm font-medium text-gray-700">
                Renewal Terms
              </label>
              <textarea
                id="renewalTerms"
                name="renewalTerms"
                value={formData.renewalTerms}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="specialConditions" className="block text-sm font-medium text-gray-700">
                Special Conditions
              </label>
              <textarea
                id="specialConditions"
                name="specialConditions"
                value={formData.specialConditions}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Attachments</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
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
        </div>
      </div>
    </DocumentLayout>
  );
};

export default ContractCreator; 