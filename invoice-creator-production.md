# Invoice Creator - Production Setup

## Project Structure
```
invoice-creator/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── forms/
│   │   │   ├── InvoiceForm.jsx
│   │   │   ├── CompanySelector.jsx
│   │   │   └── ItemsTable.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Dropdown.jsx
│   ├── hooks/
│   │   ├── useDirectus.js
│   │   ├── useInvoice.js
│   │   └── useAuth.js
│   ├── services/
│   │   ├── directus.js
│   │   ├── invoiceService.js
│   │   └── fileService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── InvoiceContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── InvoiceCreator.jsx
│   │   └── Login.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── index.js
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 1. Initial Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Directus backend running

### Installation Commands
```bash
# Create React app
npx create-react-app invoice-creator
cd invoice-creator

# Install dependencies
npm install @directus/sdk react-query lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install axios react-hook-form react-router-dom
npm install @headlessui/react @heroicons/react

# Initialize Tailwind CSS
npx tailwindcss init -p
```

## 2. Environment Configuration

### .env.example
```env
# Directus Configuration
REACT_APP_DIRECTUS_URL=http://localhost:8055
REACT_APP_DIRECTUS_TOKEN=your_static_token_here

# Application Configuration
REACT_APP_API_TIMEOUT=10000
REACT_APP_UPLOAD_MAX_SIZE=10485760
REACT_APP_SUPPORTED_FORMATS=.xlsx,.xls,.csv

# Development
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

### .env.local (create this file)
```env
# Copy from .env.example and fill with your values
REACT_APP_DIRECTUS_URL=http://localhost:8055
REACT_APP_DIRECTUS_TOKEN=your_actual_token
REACT_APP_DEBUG=true
```

## 3. Directus Collections Structure

### Required Collections in Directus:

#### `companies`
```json
{
  "id": "uuid",
  "name": "string",
  "address": "text",
  "director": "string",
  "email": "string",
  "phone": "string",
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### `contracts`
```json
{
  "id": "uuid",
  "name": "string",
  "seller_id": "uuid (relates to companies)",
  "buyer_id": "uuid (relates to companies)",
  "status": "string",
  "start_date": "date",
  "end_date": "date",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### `invoices`
```json
{
  "id": "uuid",
  "invoice_number": "string",
  "date": "date",
  "seller_id": "uuid (relates to companies)",
  "buyer_id": "uuid (relates to companies)",
  "contract_id": "uuid (relates to contracts)",
  "bank_details": "string",
  "currency": "string",
  "subtotal": "decimal",
  "tax_rate": "decimal",
  "tax_amount": "decimal",
  "total": "decimal",
  "status": "string",
  "workspace_id": "uuid (relates to workspaces)",
  "created_by": "uuid (relates to directus_users)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### `invoice_items`
```json
{
  "id": "uuid",
  "invoice_id": "uuid (relates to invoices)",
  "name": "string",
  "description": "text",
  "gross_weight": "decimal",
  "net_weight": "decimal",
  "unit_price": "decimal",
  "quantity": "integer",
  "total": "decimal",
  "sort": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### `workspaces`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "text",
  "owner_id": "uuid (relates to directus_users)",
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### `document_versions`
```json
{
  "id": "uuid",
  "invoice_id": "uuid (relates to invoices)",
  "version_number": "integer",
  "data": "json",
  "is_current": "boolean",
  "created_by": "uuid (relates to directus_users)",
  "created_at": "datetime"
}
```

## 4. Core Service Files

### src/services/directus.js
```javascript
import { Directus } from '@directus/sdk';

const directus = new Directus(process.env.REACT_APP_DIRECTUS_URL, {
  auth: {
    staticToken: process.env.REACT_APP_DIRECTUS_TOKEN,
  },
});

export default directus;

// Helper functions
export const handleDirectusError = (error) => {
  console.error('Directus Error:', error);
  if (error.response?.data?.errors) {
    return error.response.data.errors[0].message;
  }
  return error.message || 'An error occurred';
};

export const createDirectusFilter = (filters) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = { _eq: value };
    }
    return acc;
  }, {});
};
```

### src/services/invoiceService.js
```javascript
import directus, { handleDirectusError } from './directus';

export const invoiceService = {
  // Get all invoices with related data
  async getInvoices(filters = {}) {
    try {
      const response = await directus.items('invoices').readByQuery({
        filter: filters,
        fields: [
          '*',
          'seller_id.name',
          'seller_id.address',
          'buyer_id.name',
          'buyer_id.address',
          'contract_id.name',
          'workspace_id.name',
          'invoice_items.*'
        ],
        sort: ['-created_at']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get single invoice
  async getInvoice(id) {
    try {
      const response = await directus.items('invoices').readOne(id, {
        fields: [
          '*',
          'seller_id.*',
          'buyer_id.*',
          'contract_id.*',
          'workspace_id.*',
          'invoice_items.*'
        ]
      });
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Create invoice
  async createInvoice(invoiceData) {
    try {
      const response = await directus.items('invoices').createOne(invoiceData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update invoice
  async updateInvoice(id, updates) {
    try {
      const response = await directus.items('invoices').updateOne(id, updates);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Create invoice items
  async createInvoiceItems(items) {
    try {
      const response = await directus.items('invoice_items').createMany(items);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update invoice items
  async updateInvoiceItems(invoiceId, items) {
    try {
      // Delete existing items
      await directus.items('invoice_items').deleteMany({
        filter: { invoice_id: { _eq: invoiceId } }
      });
      
      // Create new items
      const itemsWithInvoiceId = items.map(item => ({
        ...item,
        invoice_id: invoiceId
      }));
      
      return await this.createInvoiceItems(itemsWithInvoiceId);
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Create version
  async createVersion(invoiceId, versionData) {
    try {
      const response = await directus.items('document_versions').createOne({
        invoice_id: invoiceId,
        ...versionData
      });
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
};

// Company service
export const companyService = {
  async getCompanies() {
    try {
      const response = await directus.items('companies').readByQuery({
        filter: { status: { _eq: 'active' } },
        sort: ['name']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  async getCompany(id) {
    try {
      const response = await directus.items('companies').readOne(id);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
};

// Contract service
export const contractService = {
  async getContracts() {
    try {
      const response = await directus.items('contracts').readByQuery({
        fields: ['*', 'seller_id.*', 'buyer_id.*'],
        filter: { status: { _eq: 'active' } },
        sort: ['name']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
};

// Workspace service
export const workspaceService = {
  async getWorkspaces() {
    try {
      const response = await directus.items('workspaces').readByQuery({
        filter: { status: { _eq: 'active' } },
        sort: ['name']
      });
      return response.data;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
};
```

## 5. Custom Hooks

### src/hooks/useInvoice.js
```javascript
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { invoiceService } from '../services/invoiceService';

export const useInvoice = (invoiceId = null) => {
  const queryClient = useQueryClient();
  
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    seller_id: '',
    buyer_id: '',
    contract_id: '',
    bank_details: '',
    currency: 'USD',
    subtotal: 0,
    tax_rate: 0.1,
    tax_amount: 0,
    total: 0,
    status: 'draft',
    workspace_id: '',
    items: []
  });

  // Fetch invoice if ID provided
  const { data: invoiceData, isLoading } = useQuery(
    ['invoice', invoiceId],
    () => invoiceService.getInvoice(invoiceId),
    {
      enabled: !!invoiceId,
      onSuccess: (data) => {
        setInvoice(data);
      }
    }
  );

  // Create invoice mutation
  const createInvoiceMutation = useMutation(
    (data) => invoiceService.createInvoice(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices']);
      }
    }
  );

  // Update invoice mutation
  const updateInvoiceMutation = useMutation(
    ({ id, data }) => invoiceService.updateInvoice(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoice', invoiceId]);
        queryClient.invalidateQueries(['invoices']);
      }
    }
  );

  // Calculate totals
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax_amount = subtotal * (invoice.tax_rate || 0.1);
    const total = subtotal + tax_amount;
    
    return { subtotal, tax_amount, total };
  };

  // Update invoice items
  const updateItems = (newItems) => {
    const totals = calculateTotals(newItems);
    setInvoice(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  // Add item
  const addItem = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      name: '',
      description: '',
      gross_weight: 0,
      net_weight: 0,
      unit_price: 0,
      quantity: 1,
      total: 0
    };
    
    updateItems([...invoice.items, newItem]);
  };

  // Update item
  const updateItem = (id, field, value) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if price or quantity changed
        if (field === 'unit_price' || field === 'quantity') {
          updatedItem.total = updatedItem.unit_price * updatedItem.quantity;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    updateItems(updatedItems);
  };

  // Remove item
  const removeItem = (id) => {
    const updatedItems = invoice.items.filter(item => item.id !== id);
    updateItems(updatedItems);
  };

  // Save invoice
  const saveInvoice = async () => {
    try {
      if (invoiceId) {
        await updateInvoiceMutation.mutateAsync({ 
          id: invoiceId, 
          data: invoice 
        });
      } else {
        const result = await createInvoiceMutation.mutateAsync(invoice);
        return result.id;
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    invoice,
    setInvoice,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    saveInvoice,
    isCreating: createInvoiceMutation.isLoading,
    isUpdating: updateInvoiceMutation.isLoading,
    error: createInvoiceMutation.error || updateInvoiceMutation.error
  };
};
```

## 6. Package.json Scripts

### package.json
```json
{
  "name": "invoice-creator",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@directus/sdk": "^10.3.5",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-query": "^3.39.3",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "REACT_APP_DEBUG=true react-scripts start",
    "build:prod": "REACT_APP_DEBUG=false npm run build",
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## 7. Tailwind Configuration

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## 8. Development Commands

### Start Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with debug mode
npm run dev
```

### Build for Production
```bash
# Build optimized production bundle
npm run build:prod

# Serve built files locally (install serve first)
npm install -g serve
serve -s build -l 3000
```

## 9. Deployment Options

### Option 1: Netlify
```bash
# Build command: npm run build:prod
# Publish directory: build
# Environment variables: Set in Netlify dashboard
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Apache/Nginx
```bash
# Build the app
npm run build:prod

# Copy build folder to web server
# Configure web server for SPA routing
```

## 10. Integration Testing

### Test Directus Connection
```javascript
// src/utils/testConnection.js
import directus from '../services/directus';

export const testDirectusConnection = async () => {
  try {
    const response = await directus.server.ping();
    console.log('✅ Directus connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ Directus connection failed:', error);
    return false;
  }
};
```

## 11. Environment Setup Checklist

### ✅ Before Starting Development:

1. **Directus Setup**
   - [ ] Directus instance running on localhost:8055
   - [ ] Collections created (companies, contracts, invoices, etc.)
   - [ ] Static token generated
   - [ ] CORS configured for localhost:3000

2. **Project Setup**
   - [ ] Node.js 18+ installed
   - [ ] Dependencies installed (`npm install`)
   - [ ] Environment variables configured (`.env.local`)
   - [ ] Tailwind CSS configured

3. **Testing**
   - [ ] Directus connection test passes
   - [ ] Can fetch companies/contracts from API
   - [ ] File upload works (if implemented)

### Next Steps:
1. Set up your Directus collections using the schemas above
2. Configure your environment variables
3. Run the test connection utility
4. Start development with `npm start`

Would you like me to create the complete component files (Header, Sidebar, forms, etc.) or focus on a specific part of the integration?