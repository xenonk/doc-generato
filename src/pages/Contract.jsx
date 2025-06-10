import { mockCompanies, contractTypes, currencies, paymentTerms } from '../mocks/contracts';

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