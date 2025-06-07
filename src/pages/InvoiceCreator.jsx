import DocumentBlueprintUpload from '../components/document/DocumentBlueprintUpload';
import { documentService } from '../services/documentService';

const InvoiceCreator = () => {
  // ... existing state ...
  const [blueprint, setBlueprint] = useState(null);
  const [isUploadingBlueprint, setIsUploadingBlueprint] = useState(false);

  // Handle blueprint upload
  const handleBlueprintUpload = async (file) => {
    setIsUploadingBlueprint(true);
    try {
      const response = await documentService.uploadBlueprint(file, 'invoice');
      setBlueprint(response);
      
      // If the blueprint is an XLSX file, we can try to extract data
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // TODO: Implement data extraction from XLSX
        // This would be handled by your backend API
        toast.success('Document blueprint uploaded. Data extraction will be processed in the background.');
      } else {
        toast.success('Document blueprint uploaded successfully');
      }
    } catch (error) {
      toast.error(`Failed to upload blueprint: ${error.message}`);
    } finally {
      setIsUploadingBlueprint(false);
    }
  };

  // ... existing code ...

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
            {/* Document Blueprint Upload Section */}
            {!isEditing && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Blueprint</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a document blueprint to use as a template for this invoice.
                  Supported formats: XLSX, PDF, DOCX, TXT
                </p>
                <DocumentBlueprintUpload
                  onUpload={handleBlueprintUpload}
                  documentType="invoice"
                  maxSize={10 * 1024 * 1024} // 10MB
                  className="mb-4"
                />
                {blueprint && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Blueprint uploaded successfully
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {blueprint.filename} ({Math.round(blueprint.filesize / 1024)}KB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

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
              isLoading={isCreating || isUpdating || isUploadingBlueprint}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 