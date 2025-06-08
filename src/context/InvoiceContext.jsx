import React, { createContext, useContext, useState } from 'react';

const InvoiceContext = createContext(null);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const createInvoice = (invoiceData) => {
    const newInvoice = {
      id: `INV-${Date.now()}`,
      ...invoiceData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id, updates) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    );
    if (currentInvoice?.id === id) {
      setCurrentInvoice(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
    }
  };

  const value = {
    invoices,
    currentInvoice,
    setCurrentInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}; 