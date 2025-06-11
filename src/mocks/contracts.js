// src/mocks/contracts.js

export const mockCompanies = [
  { 
    id: 1, 
    name: 'ABC Corporation', 
    type: 'Customer', 
    country: 'USA', 
    city: 'New York',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    director: 'Michael Johnson',
    email: 'michael@abccorp.com'
  },
  { 
    id: 2, 
    name: 'XYZ Ltd', 
    type: 'Supplier', 
    country: 'UK', 
    city: 'London',
    address: '45 Oxford Street, London, UK EC1A 1BB',
    director: 'Sarah Williams',
    email: 'sarah@xyzltd.com'
  },
  { 
    id: 3, 
    name: 'Global Industries', 
    type: 'Partner', 
    country: 'Germany', 
    city: 'Berlin',
    address: 'Kurfürstendamm 123, 10719 Berlin, Germany',
    director: 'Hans Schmidt',
    email: 'hans@globalind.com'
  },
  { 
    id: 4, 
    name: 'Tech Solutions', 
    type: 'Customer', 
    country: 'Canada', 
    city: 'Toronto',
    address: '100 Yonge Street, Toronto, ON M5C 2W1',
    director: 'Emily Chen',
    email: 'emily@techsolutions.ca'
  },
  { 
    id: 5, 
    name: 'Pacific Trading', 
    type: 'Supplier', 
    country: 'Japan', 
    city: 'Tokyo',
    address: '1-1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005',
    director: 'Yuki Tanaka',
    email: 'yuki@pacifictrading.jp'
  }
];

export const contractTypes = [
  { id: 'service', name: 'Service Agreement' },
  { id: 'supply', name: 'Supply Contract' },
  { id: 'nda', name: 'Non-Disclosure Agreement' },
  { id: 'partnership', name: 'Partnership Agreement' },
  { id: 'employment', name: 'Employment Contract' }
];

export const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' }
];

export const paymentTerms = [
  { id: 'net30', name: 'Net 30' },
  { id: 'net60', name: 'Net 60' },
  { id: 'immediate', name: 'Immediate' },
  { id: 'advance', name: 'Advance Payment' },
  { id: 'milestone', name: 'Milestone-based' }
]; 