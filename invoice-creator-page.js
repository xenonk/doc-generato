// src/pages/InvoiceCreator.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import InvoiceForm from '../components/forms/InvoiceForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInvoice } from '../hooks/useInvoice';
import { companyService, contractService } from '../services/invoiceService';
import { generateInvoiceNumber } from '../utils/helpers';

const InvoiceCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const {
    invoice,
    setInvoice,
    isLoading: invoiceLoading,
    addItem,
    updateItem,
    removeItem,
    saveInvoice,
    isCreating,
    isUpdating,
    error
  } = useInvoice(id);

  // Fetch companies
  const { data: companies = [], isLoading: companiesLoading } = useQuery(
    'companies',
    companyService.getCompanies,
    {
      onError: (error) => {
        toast.error(`Failed to load companies: ${error.message}`);
      }
    }
  );

  // Fetch contracts
  const { data: contracts = [], isLoading: contractsLoading } = useQuery(
    'contracts',
    contractService.getContracts,
    {
      onError: (error) => {
        toast.error(`Failed to load contracts: ${error.message}`);
      }
    }
  );

  // Generate invoice number for new invoices
  useEffect(() => {
    if (!isEditing && !invoice.invoice_number) {
      setInvoice(prev => ({
        ...prev,
        invoice_number: generateInvoiceNumber()
      }));
    }
  }, [isEditing, invoice.invoice_number, setInvoice]);

  // Handle contract change - auto-populate companies
  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setInvoice(prev => ({
        ...prev,
        contract_id: contractId,
        seller_id: contract.seller_id.id,
        buyer_id: contract.buyer_id.id
      }));
    }
  };

  // Handle company change
  const handleCompanyChange = (type, companyId) => {
    setInvoice(prev => ({
      ...prev,
      [type]: companyId
    }));
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      const result = await saveInvoice();
      
      if (result && !isEditing) {
        toast.success('Invoice created successfully!');
        navigate(`/invoice/${result}/edit`);
      } else {
        toast.success('Invoice updated successfully!');
      }
    } catch (error) {
      toast.error(`Failed to save invoice: ${error.message}`);
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    try {
      setInvoice(prev => ({ ...prev, status: 'draft' }));
      await handleSave();
    } catch (error) {
      console.error('Failed to save as draft:', error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Show loading state
  if (invoiceLoading || companiesLoading || contractsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">
                Failed to load invoice
              </div>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={isEditing ? `Edit Invoice ${invoice.invoice_number}` : 'Create Invoice'}
        showSaveButton
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
      
      <div className="flex">
        <Sidebar 
          invoiceId={id}
          onSaveAsDraft={handleSaveAsDraft}
        />
        
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <InvoiceForm
              invoice={invoice}
              companies={companies}
              contracts={contracts}
              onFieldChange={handleFieldChange}
              onContractChange={handleContractChange}
              onCompanyChange={handleCompanyChange}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isLoading={isCreating || isUpdating}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );