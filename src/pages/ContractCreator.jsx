import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, Building2, Calendar, DollarSign, 
  User, Mail, Phone, Globe, FileSignature,
  ChevronLeft, Save, X, AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (id) {
      // In a real app, this would fetch the contract data
      // For now, we'll use mock data
      const mockContract = {
        contractNumber: 'CNT-2024-001',
        contractType: 'service',
        title: 'Software Development Agreement',
        description: 'Agreement for the development of custom software solutions',
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
        value: '50000',
        currency: 'USD',
        paymentTerms: 'net30',
        parties: {
          firstParty: {
            companyId: '1',
            representative: 'John Smith',
            position: 'CEO',
            email: 'john@abccorp.com',
            phone: '+1-555-0123'
          },
          secondParty: {
            companyId: '2',
            representative: 'Jane Doe',
            position: 'CTO',
            email: 'jane@xyz.com',
            phone: '+44-555-0123'
          }
        },
        deliverables: 'Custom software development, documentation, and support',
        termsAndConditions: 'Standard terms and conditions apply',
        governingLaw: 'New York State Law',
        jurisdiction: 'New York County',
        terminationClause: 'Either party may terminate with 30 days notice',
        renewalTerms: 'Automatic renewal for 1 year unless terminated',
        specialConditions: 'None',
        attachments: []
      };
      setFormData(mockContract);
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.contractNumber) newErrors.contractNumber = 'Contract number is required';
    if (!formData.contractType) newErrors.contractType = 'Contract type is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';
    if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';
    if (!formData.value) newErrors.value = 'Value is required';
    if (!formData.parties.firstParty.companyId) newErrors['parties.firstParty.companyId'] = 'First party company is required';
    if (!formData.parties.secondParty.companyId) newErrors['parties.secondParty.companyId'] = 'Second party company is required';
    
    // Date validation
    if (formData.effectiveDate && formData.expirationDate) {
      if (new Date(formData.effectiveDate) >= new Date(formData.expirationDate)) {
        newErrors.expirationDate = 'Expiration date must be after effective date';
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.parties.firstParty.email && !emailRegex.test(formData.parties.firstParty.email)) {
      newErrors['parties.firstParty.email'] = 'Invalid email format';
    }
    if (formData.parties.secondParty.email && !emailRegex.test(formData.parties.secondParty.email)) {
      newErrors['parties.secondParty.email'] = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call
      console.log('Submitting contract:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigate('/documents');
    } catch (error) {
      console.error('Error creating contract:', error);
      setErrors({ submit: 'Failed to create contract. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {id ? 'Edit Contract' : 'Create New Contract'}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Contract</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Number
                    </label>
                    <input
                      type="text"
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      className={`w-full ${errors.contractNumber ? 'border-red-500' : ''}`}
                      placeholder="CNT-2024-001"
                    />
                    {errors.contractNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.contractNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Type
                    </label>
                    <select
                      name="contractType"
                      value={formData.contractType}
                      onChange={handleChange}
                      className={`w-full ${errors.contractType ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Type</option>
                      {contractTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.contractType && (
                      <p className="mt-1 text-sm text-red-600">{errors.contractType}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Contract Title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full"
                      placeholder="Brief description of the contract"
                    />
                  </div>
                </div>
              </div>

              {/* Dates and Value */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Dates and Value</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      name="effectiveDate"
                      value={formData.effectiveDate}
                      onChange={handleChange}
                      className={`w-full ${errors.effectiveDate ? 'border-red-500' : ''}`}
                    />
                    {errors.effectiveDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.effectiveDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleChange}
                      className={`w-full ${errors.expirationDate ? 'border-red-500' : ''}`}
                    />
                    {errors.expirationDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <div className="flex space-x-2">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-24"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        className={`flex-1 ${errors.value ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.value && (
                      <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <select
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleChange}
                      className="w-full"
                    >
                      <option value="">Select Terms</option>
                      {paymentTerms.map(term => (
                        <option key={term.id} value={term.id}>
                          {term.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contracting Parties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Party */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">First Party</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <select
                        name="parties.firstParty.companyId"
                        value={formData.parties.firstParty.companyId}
                        onChange={handleChange}
                        className={`w-full ${errors['parties.firstParty.companyId'] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Company</option>
                        {mockCompanies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name} ({company.type})
                          </option>
                        ))}
                      </select>
                      {errors['parties.firstParty.companyId'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['parties.firstParty.companyId']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Representative
                      </label>
                      <input
                        type="text"
                        name="parties.firstParty.representative"
                        value={formData.parties.firstParty.representative}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="Full Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        name="parties.firstParty.position"
                        value={formData.parties.firstParty.position}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="Job Title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="parties.firstParty.email"
                        value={formData.parties.firstParty.email}
                        onChange={handleChange}
                        className={`w-full ${errors['parties.firstParty.email'] ? 'border-red-500' : ''}`}
                        placeholder="email@company.com"
                      />
                      {errors['parties.firstParty.email'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['parties.firstParty.email']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="parties.firstParty.phone"
                        value={formData.parties.firstParty.phone}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="+1-555-0123"
                      />
                    </div>
                  </div>

                  {/* Second Party */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Second Party</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <select
                        name="parties.secondParty.companyId"
                        value={formData.parties.secondParty.companyId}
                        onChange={handleChange}
                        className={`w-full ${errors['parties.secondParty.companyId'] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Company</option>
                        {mockCompanies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name} ({company.type})
                          </option>
                        ))}
                      </select>
                      {errors['parties.secondParty.companyId'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['parties.secondParty.companyId']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Representative
                      </label>
                      <input
                        type="text"
                        name="parties.secondParty.representative"
                        value={formData.parties.secondParty.representative}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="Full Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        name="parties.secondParty.position"
                        value={formData.parties.secondParty.position}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="Job Title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="parties.secondParty.email"
                        value={formData.parties.secondParty.email}
                        onChange={handleChange}
                        className={`w-full ${errors['parties.secondParty.email'] ? 'border-red-500' : ''}`}
                        placeholder="email@company.com"
                      />
                      {errors['parties.secondParty.email'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['parties.secondParty.email']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="parties.secondParty.phone"
                        value={formData.parties.secondParty.phone}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="+1-555-0123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deliverables
                    </label>
                    <textarea
                      name="deliverables"
                      value={formData.deliverables}
                      onChange={handleChange}
                      rows="3"
                      className="w-full"
                      placeholder="List of deliverables and milestones"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms and Conditions
                    </label>
                    <textarea
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleChange}
                      rows="3"
                      className="w-full"
                      placeholder="Standard terms and conditions"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Governing Law
                      </label>
                      <input
                        type="text"
                        name="governingLaw"
                        value={formData.governingLaw}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., New York State Law"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jurisdiction
                      </label>
                      <input
                        type="text"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g., New York County"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Termination Clause
                    </label>
                    <textarea
                      name="terminationClause"
                      value={formData.terminationClause}
                      onChange={handleChange}
                      rows="2"
                      className="w-full"
                      placeholder="Terms for contract termination"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Terms
                    </label>
                    <textarea
                      name="renewalTerms"
                      value={formData.renewalTerms}
                      onChange={handleChange}
                      rows="2"
                      className="w-full"
                      placeholder="Terms for contract renewal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Conditions
                    </label>
                    <textarea
                      name="specialConditions"
                      value={formData.specialConditions}
                      onChange={handleChange}
                      rows="2"
                      className="w-full"
                      placeholder="Any special conditions or requirements"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContractCreator; 