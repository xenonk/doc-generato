import directus, { handleDirectusError } from './directus';

interface Company {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Contract {
  id: string;
  name: string;
  company_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  number: string;
  contract_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DocumentBlueprint {
  id: string;
  name: string;
  type: string;
  file_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface RecentDocument {
  id: string;
  name: string;
  type: string;
  last_accessed: string;
}

// Mock data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    type: 'customer',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  // Add more mock companies as needed
];

const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Service Agreement',
    company_id: '1',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  // Add more mock contracts as needed
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-001',
    contract_id: '1',
    amount: 1000.00,
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  // Add more mock invoices as needed
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contract Template',
    type: 'contract',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  // Add more mock documents as needed
];

const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

const documentService = {
  // Document Blueprint Methods
  uploadBlueprint: async (file: File, metadata: Record<string, any>): Promise<DocumentBlueprint> => {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: '1',
          name: file.name,
          type: file.type,
          file_id: 'mock-file-id',
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const uploadedFile = await directus.files.createOne(formData);

      const blueprint = await directus.items('document_blueprints').createOne({
        name: file.name,
        type: file.type,
        file_id: uploadedFile.id,
        metadata,
      });

      return blueprint.data as DocumentBlueprint;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  validateBlueprint: async (blueprintId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        return true;
      }

      const blueprint = await directus.items('document_blueprints').readOne(blueprintId);
      // Add validation logic here
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  getBlueprint: async (blueprintId: string): Promise<DocumentBlueprint> => {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: blueprintId,
          name: 'Mock Blueprint',
          type: 'application/pdf',
          file_id: 'mock-file-id',
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const blueprint = await directus.items('document_blueprints').readOne(blueprintId);
      return blueprint.data as DocumentBlueprint;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  getBlueprintsByType: async (type: string): Promise<DocumentBlueprint[]> => {
    try {
      if (USE_MOCK_DATA) {
        return [
          {
            id: '1',
            name: 'Mock Blueprint',
            type,
            file_id: 'mock-file-id',
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }

      const blueprints = await directus.items('document_blueprints').readByQuery({
        filter: { type },
      });

      return blueprints.data as DocumentBlueprint[];
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  deleteBlueprint: async (blueprintId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        return true;
      }

      const blueprint = await directus.items('document_blueprints').readOne(blueprintId);
      await directus.files.deleteOne(blueprint.data.file_id);
      await directus.items('document_blueprints').deleteOne(blueprintId);
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  updateBlueprintMetadata: async (blueprintId: string, metadata: Record<string, any>): Promise<DocumentBlueprint> => {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: blueprintId,
          name: 'Mock Blueprint',
          type: 'application/pdf',
          file_id: 'mock-file-id',
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const blueprint = await directus.items('document_blueprints').updateOne(blueprintId, { metadata });
      return blueprint.data as DocumentBlueprint;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Recent Documents Methods
  getRecentDocuments: async (): Promise<RecentDocument[]> => {
    try {
      if (USE_MOCK_DATA) {
        return [
          {
            id: '1',
            name: 'Recent Document',
            type: 'contract',
            last_accessed: new Date().toISOString(),
          },
        ];
      }

      const recentDocuments = await directus.items('recent_documents').readByQuery({
        sort: ['-last_accessed'],
        limit: 10,
      });

      return recentDocuments.data as RecentDocument[];
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Company Methods
  getCompanies: async (): Promise<Company[]> => {
    try {
      if (USE_MOCK_DATA) {
        return mockCompanies;
      }

      const companies = await directus.items('companies').readByQuery();
      return companies.data as Company[];
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Contract Methods
  getContracts: async (companyId?: string): Promise<Contract[]> => {
    try {
      if (USE_MOCK_DATA) {
        return mockContracts.filter(contract => !companyId || contract.company_id === companyId);
      }

      const contracts = await directus.items('contracts').readByQuery({
        filter: companyId ? { company_id: companyId } : undefined,
      });

      return contracts.data as Contract[];
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  getContract: async (contractId: string): Promise<Contract> => {
    try {
      if (USE_MOCK_DATA) {
        const contract = mockContracts.find(c => c.id === contractId);
        if (!contract) throw new Error('Contract not found');
        return contract;
      }
      const contract = await directus.items('contracts').readOne(contractId);
      return contract.data as Contract;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Invoice Methods
  getInvoice: async (id: string): Promise<Invoice> => {
    try {
      if (USE_MOCK_DATA) {
        return mockInvoices.find(inv => inv.id === id) || {
          id,
          number: 'INV-001',
          contract_id: '1',
          amount: 1000.00,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const invoice = await directus.items('invoices').readOne(id);
      return invoice.data as Invoice;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    try {
      if (USE_MOCK_DATA) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          number: data.number || 'INV-001',
          contract_id: data.contract_id || '1',
          amount: data.amount || 0,
          status: data.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const invoice = await directus.items('invoices').createOne(data);
      return invoice.data as Invoice;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    try {
      if (USE_MOCK_DATA) {
        return {
          id,
          number: data.number || 'INV-001',
          contract_id: data.contract_id || '1',
          amount: data.amount || 0,
          status: data.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const invoice = await directus.items('invoices').updateOne(id, data);
      return invoice.data as Invoice;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  deleteInvoice: async (id: string): Promise<void> => {
    try {
      if (USE_MOCK_DATA) {
        return;
      }

      await directus.items('invoices').deleteOne(id);
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },
};

export default documentService; 