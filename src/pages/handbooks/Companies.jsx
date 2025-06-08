import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Globe, Phone, Mail, MapPin } from 'lucide-react';
import Header from '../../components/Header';
import HandbookTable from '../../components/HandbookTable';

// Mock data for demonstration
const mockCompanies = [
  {
    id: 1,
    name: 'Acme Corporation',
    type: 'Customer',
    country: 'United States',
    city: 'New York',
    contact: 'John Doe',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    status: 'Active'
  },
  {
    id: 2,
    name: 'TechGlobal Ltd',
    type: 'Supplier',
    country: 'United Kingdom',
    city: 'London',
    contact: 'Jane Smith',
    email: 'jane@techglobal.com',
    phone: '+44 20 7123 4567',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Global Imports Inc',
    type: 'Partner',
    country: 'Germany',
    city: 'Berlin',
    contact: 'Hans Mueller',
    email: 'hans@globalimports.de',
    phone: '+49 30 12345678',
    status: 'Inactive'
  },
  // Add more mock data as needed
];

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState(mockCompanies);

  const columns = [
    {
      key: 'name',
      label: 'Company Name',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <Building2 className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Customer' ? 'bg-blue-100 text-blue-800' :
          value === 'Supplier' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <Globe className="w-4 h-4 text-gray-400 mr-1" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact Person',
      sortable: true,
      filterable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center">
          <Mail className="w-4 h-4 text-gray-400 mr-1" />
          <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800">
            {value}
          </a>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-gray-400 mr-1" />
          <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800">
            {value}
          </a>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    // Navigate to add company form
    navigate('/handbooks/companies/new');
  };

  const handleEdit = (company) => {
    // Navigate to edit company form
    navigate(`/handbooks/companies/${company.id}/edit`);
  };

  const handleDelete = (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      // In a real application, this would be an API call
      setCompanies(companies.filter(c => c.id !== company.id));
    }
  };

  const handleSearch = (query) => {
    // In a real application, this would be an API call
    const filtered = mockCompanies.filter(company =>
      Object.values(company).some(value =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setCompanies(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your company information, contacts, and details
          </p>
        </div>

        <HandbookTable
          title="Companies"
          columns={columns}
          data={companies}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={handleSearch}
          pageSize={10}
          totalItems={companies.length}
        />
      </div>
    </div>
  );
};

export default Companies; 