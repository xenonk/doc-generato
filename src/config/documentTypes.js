import { File, Receipt, PieChart, Briefcase, Shield, MessageSquare, Award, Mail, FileText, FilePlus, FileCheck, FileInput } from 'lucide-react';

export const DOCUMENT_TYPES = {
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
  },
  request: {
    id: 'request',
    name: 'Request',
    description: 'Formal request documents',
    icon: FilePlus,
    color: 'bg-yellow-500',
    detail: 'Create and send formal requests for information or action',
    supportedFormats: ['pdf', 'docx'],
    defaultFormat: 'docx',
    validationRules: {
      requiredFields: ['request_title', 'date', 'recipient', 'content'],
    },
    routes: {
      create: '/request/create',
      edit: '/request/:id/edit',
      list: '/requests'
    }
  },
  letter: {
    id: 'letter',
    name: 'Letter',
    description: 'Business and personal letters',
    icon: Mail,
    color: 'bg-pink-500',
    detail: 'Write and send business or personal letters',
    supportedFormats: ['pdf', 'docx'],
    defaultFormat: 'docx',
    validationRules: {
      requiredFields: ['letter_title', 'date', 'recipient', 'body'],
    },
    routes: {
      create: '/letter/create',
      edit: '/letter/:id/edit',
      list: '/letters'
    }
  },
  price_list: {
    id: 'price_list',
    name: 'Price List',
    description: 'Product and service price lists',
    icon: FileText,
    color: 'bg-orange-500',
    detail: 'Generate and share price lists for products or services',
    supportedFormats: ['xlsx', 'pdf'],
    defaultFormat: 'xlsx',
    validationRules: {
      requiredFields: ['title', 'date', 'items'],
    },
    routes: {
      create: '/price-list/create',
      edit: '/price-list/:id/edit',
      list: '/price-lists'
    }
  },
  export_declaration: {
    id: 'export_declaration',
    name: 'Export Declaration',
    description: 'Export customs declaration documents',
    icon: FileCheck,
    color: 'bg-teal-500',
    detail: 'Prepare export declaration forms for customs',
    supportedFormats: ['pdf', 'docx'],
    defaultFormat: 'pdf',
    validationRules: {
      requiredFields: ['declaration_number', 'date', 'exporter', 'items'],
    },
    routes: {
      create: '/export-declaration/create',
      edit: '/export-declaration/:id/edit',
      list: '/export-declarations'
    }
  }
  // Add more document types here as needed
};

export const getDocumentType = (typeId) => {
  return DOCUMENT_TYPES[typeId] || null;
};

export const getDocumentTypeByRoute = (route) => {
  return Object.values(DOCUMENT_TYPES).find(type => 
    type.routes.create === route || 
    type.routes.edit === route || 
    type.routes.list === route
  );
};

export const getSupportedFormats = (typeId) => {
  const docType = getDocumentType(typeId);
  return docType ? docType.supportedFormats : [];
};

export const getValidationRules = (typeId) => {
  const docType = getDocumentType(typeId);
  return docType ? docType.validationRules : null;
};

export const getDocumentRoutes = (typeId) => {
  const docType = getDocumentType(typeId);
  return docType ? docType.routes : null;
}; 