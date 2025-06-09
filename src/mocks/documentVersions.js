// Helper function to create a version
const createVersion = (id, name, createdAt, user, data) => ({
  id,
  name,
  created_at: createdAt,
  user,
  data
});

// Helper function to create a user
const createUser = (id, name, role, avatar = null) => ({
  id,
  name,
  avatar,
  role
});

// Mock users
const mockUsers = {
  admin: createUser(1, 'John Smith', 'Admin'),
  editor: createUser(2, 'Sarah Johnson', 'Editor'),
  viewer: createUser(3, 'Michael Brown', 'Viewer')
};

// Mock company data
const mockCompanies = {
  seller: {
    company: 'TechCorp Solutions Ltd.',
    address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
    director: 'John Smith',
    email: 'john@techcorp.com'
  },
  buyer: {
    company: 'Acme Corporation',
    address: '456 Corporate Blvd\nFloor 25\nLos Angeles, CA 90210',
    contactPerson: 'Jane Doe',
    email: 'jane@acme.com'
  }
};

// Mock items
const mockItems = {
  empty: [],
  single: [
    { 
      id: 1, 
      name: 'Software License', 
      grossWeight: 0.5, 
      netWeight: 0.5, 
      unitPrice: 1000.00, 
      amount: 1, 
      total: 1000.00 
    }
  ],
  multiple: [
    { 
      id: 1, 
      name: 'Software License', 
      grossWeight: 0.5, 
      netWeight: 0.5, 
      unitPrice: 1200.00, 
      amount: 1, 
      total: 1200.00 
    },
    { 
      id: 2, 
      name: 'Consulting Services', 
      grossWeight: 0, 
      netWeight: 0, 
      unitPrice: 150.00, 
      amount: 8, 
      total: 1200.00 
    }
  ]
};

// Generate mock versions for a document
export const generateDocumentVersions = (documentType = 'Document', documentNumber = 'DOC-2024-001') => {
  const now = new Date();
  
  return [
    // Current version
    createVersion(
      'current',
      'Current Version',
      now.toISOString(),
      mockUsers.admin,
      {
        number: documentNumber,
        date: now.toISOString().split('T')[0],
        seller: { ...mockCompanies.seller },
        buyer: { ...mockCompanies.buyer },
        bankDetails: '',
        items: [...mockItems.empty],
        currency: 'USD',
        subtotal: 0,
        tax: 0,
        total: 0
      }
    ),
    // Auto-save version
    createVersion(
      'v3',
      'Auto-save',
      new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      mockUsers.admin,
      {
        number: documentNumber,
        date: now.toISOString().split('T')[0],
        seller: { ...mockCompanies.seller },
        buyer: { ...mockCompanies.buyer },
        bankDetails: 'Chase Bank - Account: ****1234',
        items: [...mockItems.multiple],
        currency: 'USD',
        subtotal: 2400.00,
        tax: 240.00,
        total: 2640.00
      }
    ),
    // Version 2
    createVersion(
      'v2',
      'Version 2',
      new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      mockUsers.editor,
      {
        number: documentNumber,
        date: now.toISOString().split('T')[0],
        seller: { ...mockCompanies.seller },
        buyer: { ...mockCompanies.buyer },
        bankDetails: 'Chase Bank - Account: ****1234',
        items: [...mockItems.single],
        currency: 'USD',
        subtotal: 1000.00,
        tax: 100.00,
        total: 1100.00
      }
    ),
    // Initial version
    createVersion(
      'v1',
      'Initial Version',
      new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      mockUsers.viewer,
      {
        number: documentNumber,
        date: now.toISOString().split('T')[0],
        seller: { ...mockCompanies.seller },
        buyer: { ...mockCompanies.buyer },
        bankDetails: '',
        items: [...mockItems.empty],
        currency: 'USD',
        subtotal: 0,
        tax: 0,
        total: 0
      }
    )
  ];
};

// Export mock data for direct use
export const mockData = {
  users: mockUsers,
  companies: mockCompanies,
  items: mockItems
}; 