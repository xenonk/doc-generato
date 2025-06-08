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
import Header from '../components/Header';

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
  const isEditing = Boolean(id);
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
        <DocumentLayout
          title={isEditing ? `Edit Contract ${id}` : 'Create Contract'}
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
          onCollaborationClick={handleCollaboration}
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
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="w-full space-y-6">
              {/* Contract Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">CONTRACT</h1>
                    <p className="text-gray-600">Professional Contract Document</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Number</label>
                    <input
                      type="text"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      name="contractNumber"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={handleChange}
                      name="effectiveDate"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Type and Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                    <select
                      value={formData.contractType}
                      onChange={handleChange}
                      name="contractType"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select Contract Type</option>
                      {contractTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={document?.status || 'draft'}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Parties Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties Information</h3>
                <div className="grid grid-cols-2 gap-8">
                  {/* First Party */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">First Party</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                          value={formData.parties.firstParty.companyId}
                          onChange={handleChange}
                          name="firstParty.companyId"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Representative</label>
                        <input
                          type="text"
                          value={formData.parties.firstParty.representative}
                          onChange={handleChange}
                          name="firstParty.representative"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          value={formData.parties.firstParty.position}
                          onChange={handleChange}
                          name="firstParty.position"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.parties.firstParty.email}
                          onChange={handleChange}
                          name="firstParty.email"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={formData.parties.firstParty.phone}
                          onChange={handleChange}
                          name="firstParty.phone"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second Party */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Second Party</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                          value={formData.parties.secondParty.companyId}
                          onChange={handleChange}
                          name="secondParty.companyId"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Representative</label>
                        <input
                          type="text"
                          value={formData.parties.secondParty.representative}
                          onChange={handleChange}
                          name="secondParty.representative"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          value={formData.parties.secondParty.position}
                          onChange={handleChange}
                          name="secondParty.position"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.parties.secondParty.email}
                          onChange={handleChange}
                          name="secondParty.email"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={formData.parties.secondParty.phone}
                          onChange={handleChange}
                          name="secondParty.phone"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      name="title"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={handleChange}
                        name="effectiveDate"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <input
                        type="date"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        name="expirationDate"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={handleChange}
                        name="value"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={handleChange}
                        name="currency"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select Currency</option>
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                      <select
                        value={formData.paymentTerms}
                        onChange={handleChange}
                        name="paymentTerms"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select Payment Terms</option>
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

              {/* Contract Terms */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Terms</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms and Conditions</label>
                  <textarea
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    name="termsAndConditions"
                    rows={6}
                    placeholder="Enter contract terms and conditions..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                    <textarea
                      value={formData.deliverables}
                      onChange={handleChange}
                      name="deliverables"
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Governing Law</label>
                    <input
                      type="text"
                      value={formData.governingLaw}
                      onChange={handleChange}
                      name="governingLaw"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                    <input
                      type="text"
                      value={formData.jurisdiction}
                      onChange={handleChange}
                      name="jurisdiction"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Termination Clause</label>
                    <textarea
                      value={formData.terminationClause}
                      onChange={handleChange}
                      name="terminationClause"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Terms</label>
                    <textarea
                      value={formData.renewalTerms}
                      onChange={handleChange}
                      name="renewalTerms"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Conditions</label>
                    <textarea
                      value={formData.specialConditions}
                      onChange={handleChange}
                      name="specialConditions"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
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
          </div>
        </DocumentLayout>
      </div>
    </div>
  );
};

export default ContractCreator; 