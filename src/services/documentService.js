import directus, { handleDirectusError } from './directus';
import { formatDistanceToNow } from 'date-fns';
import { getCurrentUserId } from '../utils/auth';
import { FileText } from 'lucide-react';
import { DOCUMENT_TYPES } from '../config/documentTypes';

const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || false;

// --- MOCK DATA ---
const mockCompanies = [
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
const mockContracts = [
  { id: 1, buyer: 'Acme Corp', items: [{ id: 1, name: 'Service A', quantity: 2, price: 100 }] },
  { id: 2, buyer: 'Globex Inc', items: [{ id: 2, name: 'Service B', quantity: 1, price: 200 }] }
];
const mockInvoices = [
  { id: 1, number: 'INV-001', date: '2024-06-10', seller: 1, buyer: 2, items: [{ id: 1, name: 'Service A', quantity: 2, price: 100 }], status: 'draft' }
];
const mockDocuments = [
  {
    id: 1,
    name: 'Invoice INV-001',
    type: 'invoice',
    status: 'draft',
    modified_at: new Date().toISOString(),
    owner: { id: 1, name: 'John Doe' },
    icon: FileText,
    isMyDocument: true,
    modifiedTime: 'a few seconds ago',
  }
];
const mockBlueprint = { filename: 'template.xlsx', filesize: 10240 };

// --- END MOCK DATA ---

// Document blueprint service
export const documentService = {
  // Upload a document blueprint
  async uploadBlueprint(file, documentType) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockBlueprint);
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);

      const response = await directus.files.createOne(formData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Validate document blueprint
  async validateBlueprint(fileId, documentType) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        isValid: true,
        validationDetails: {
          documentType,
          format: 'xlsx',
          size: 10240,
        }
      });
    }
    try {
      const response = await directus.items('document_blueprints').readOne(fileId);
      
      return {
        isValid: true,
        validationDetails: {
          documentType: documentType,
          format: response.type,
          size: response.filesize,
        }
      };
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get document blueprint
  async getBlueprint(fileId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockBlueprint);
    }
    try {
      const response = await directus.files.readOne(fileId);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get document blueprints by type
  async getBlueprintsByType(documentType) {
    if (USE_MOCK_DATA) {
      return Promise.resolve([mockBlueprint]);
    }
    try {
      const response = await directus.items('document_blueprints').readByQuery({
        filter: {
          document_type: { _eq: documentType },
          status: { _eq: 'active' }
        },
        sort: ['-uploaded_on']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Delete document blueprint
  async deleteBlueprint(fileId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(true);
    }
    try {
      await directus.files.deleteOne(fileId);
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update document blueprint metadata
  async updateBlueprintMetadata(fileId, metadata) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockBlueprint, ...metadata });
    }
    try {
      const response = await directus.items('document_blueprints').updateOne(fileId, metadata);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get recent documents
  async getRecentDocuments() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockDocuments);
    }
    try {
      const response = await directus.items('documents').readByQuery({
        sort: ['-modified_at'],
        limit: 10,
        fields: ['*', 'owner.*']
      });
      
      return response.data.map(doc => ({
        ...doc,
        icon: DOCUMENT_TYPES[doc.type.toLowerCase()]?.icon || FileText,
        modifiedTime: formatDistanceToNow(new Date(doc.modified_at), { addSuffix: true }),
        isMyDocument: doc.owner.id === getCurrentUserId(),
      }));
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get companies
  async getCompanies() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockCompanies);
    }
    try {
      const response = await directus.items('companies').readByQuery({
        sort: ['name'],
        fields: ['*']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get contracts
  async getContracts() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockContracts);
    }
    try {
      const response = await directus.items('contracts').readByQuery({
        sort: ['-created_at'],
        fields: ['*', 'buyer.*', 'items.*']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Generic CRUD for any document type
  async getDocument(documentType, id) {
    if (USE_MOCK_DATA) {
      const mockMap = {
        invoice: mockInvoices,
        contract: mockContracts,
        // add more as needed
      };
      return Promise.resolve(mockMap[documentType]?.find(doc => doc.id === Number(id)));
    }
    try {
      const response = await directus.items(documentType + 's').readOne(id, { fields: ['*', '*.*'] });
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  async createDocument(documentType, data) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...data, id: Date.now() });
    }
    try {
      const response = await directus.items(documentType + 's').createOne(data);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  async updateDocument(documentType, id, data) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...data, id });
    }
    try {
      const response = await directus.items(documentType + 's').updateOne(id, data);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
};

// Document template service
export const templateService = {
  // Get available templates for a document type
  async getTemplates(documentType) {
    if (USE_MOCK_DATA) {
      return Promise.resolve([
        { id: 1, name: 'Default Template', documentType, status: 'active' }
      ]);
    }
    try {
      const response = await directus.items('document_templates').readByQuery({
        filter: {
          document_type: { _eq: documentType },
          status: { _eq: 'active' }
        },
        sort: ['name']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get template by ID
  async getTemplate(templateId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ id: templateId, name: 'Default Template', status: 'active' });
    }
    try {
      const response = await directus.items('document_templates').readOne(templateId);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Create a new template
  async createTemplate(templateData) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...templateData, id: Date.now() });
    }
    try {
      const response = await directus.items('document_templates').createOne(templateData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update template
  async updateTemplate(templateId, templateData) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...templateData, id: templateId });
    }
    try {
      const response = await directus.items('document_templates').updateOne(templateId, templateData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Delete template
  async deleteTemplate(templateId) {
    if (USE_MOCK_DATA) {
      return Promise.resolve(true);
    }
    try {
      await directus.items('document_templates').deleteOne(templateId);
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
}; 