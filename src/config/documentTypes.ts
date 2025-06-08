import { File, Receipt, PieChart, Briefcase, Shield, MessageSquare, Award, Mail, LucideIcon } from 'lucide-react';

interface ValidationRules {
  requiredFields: string[];
  formatValidation: {
    [key: string]: {
      requiredSheets?: string[];
      requiredColumns?: {
        [key: string]: string[];
      };
      requiredSections?: string[];
    };
  };
}

interface DocumentRoutes {
  create: string;
  edit: string;
  list: string;
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  detail: string;
  supportedFormats: string[];
  defaultFormat: string;
  validationRules: ValidationRules;
  routes: DocumentRoutes;
}

interface DocumentTypes {
  [key: string]: DocumentType;
}

export const DOCUMENT_TYPES: DocumentTypes = {
  invoice: {
    id: 'invoice',
    name: 'Invoice',
    description: 'Billing documents',
    icon: Receipt,
    color: 'bg-green-500',
    detail: 'Generate invoices, quotes, and billing statements automatically',
    supportedFormats: ['xlsx', 'pdf', 'docx', 'txt'],
    defaultFormat: 'xlsx',
    validationRules: {
      requiredFields: ['invoice_number', 'date', 'seller', 'buyer', 'items'],
      formatValidation: {
        xlsx: {
          requiredSheets: ['Invoice', 'Items'],
          requiredColumns: {
            Invoice: ['Invoice Number', 'Date', 'Seller', 'Buyer'],
            Items: ['Name', 'Quantity', 'Unit Price', 'Total']
          }
        }
      }
    },
    routes: {
      create: '/invoice/create',
      edit: '/invoice/:id/edit',
      list: '/invoices'
    }
  },
  contract: {
    id: 'contract',
    name: 'Contract',
    description: 'Legal agreements',
    icon: File,
    color: 'bg-blue-500',
    detail: 'Create employment contracts, vendor agreements, and legal documents',
    supportedFormats: ['docx', 'pdf', 'txt'],
    defaultFormat: 'docx',
    validationRules: {
      requiredFields: ['contract_number', 'parties', 'effective_date', 'terms'],
      formatValidation: {
        docx: {
          requiredSections: ['Parties', 'Terms', 'Signatures']
        }
      }
    },
    routes: {
      create: '/contract/create',
      edit: '/contract/:id/edit',
      list: '/contracts'
    }
  },
  report: {
    id: 'report',
    name: 'Report',
    description: 'Analytics & insights',
    icon: PieChart,
    color: 'bg-purple-500',
    detail: 'Create detailed reports with charts, tables, and analysis',
    supportedFormats: ['xlsx', 'pdf', 'docx'],
    defaultFormat: 'xlsx',
    validationRules: {
      requiredFields: ['report_title', 'date', 'content', 'charts'],
      formatValidation: {
        xlsx: {
          requiredSheets: ['Summary', 'Data', 'Charts']
        }
      }
    },
    routes: {
      create: '/report/create',
      edit: '/report/:id/edit',
      list: '/reports'
    }
  }
  // Add more document types here as needed
};

export const getDocumentType = (typeId: string): DocumentType | null => {
  return DOCUMENT_TYPES[typeId] || null;
};

export const getDocumentTypeByRoute = (route: string): DocumentType | undefined => {
  return Object.values(DOCUMENT_TYPES).find(type => 
    type.routes.create === route || 
    type.routes.edit === route || 
    type.routes.list === route
  );
};

export const getSupportedFormats = (typeId: string): string[] => {
  const docType = getDocumentType(typeId);
  return docType ? docType.supportedFormats : [];
};

export const getValidationRules = (typeId: string): ValidationRules | null => {
  const docType = getDocumentType(typeId);
  return docType ? docType.validationRules : null;
};

export const getDocumentRoutes = (typeId: string): DocumentRoutes | null => {
  const docType = getDocumentType(typeId);
  return docType ? docType.routes : null;
}; 