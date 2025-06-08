import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SUPPORTED_FORMATS = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
} as const;

type SupportedFormat = keyof typeof SUPPORTED_FORMATS;
type DocumentType = 'invoice' | 'contract' | string;

interface DocumentBlueprintUploadProps {
  onUpload: (file: File) => void;
  documentType: DocumentType;
  maxSize?: number;
  className?: string;
}

const DocumentBlueprintUpload: React.FC<DocumentBlueprintUploadProps> = ({ 
  onUpload, 
  documentType, 
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateDocument = async (file: File): Promise<boolean> => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Basic format validation
      if (!SUPPORTED_FORMATS[file.type as SupportedFormat]) {
        throw new Error(`Unsupported file format. Please upload a ${Object.values(SUPPORTED_FORMATS).join(', ')} file.`);
      }

      // Document type validation based on content
      // This is a placeholder for actual validation logic
      // In production, this would call your backend API
      const isValid = await validateDocumentType(file, documentType);
      
      if (!isValid) {
        throw new Error(`Invalid document type. This file does not appear to be a valid ${documentType}.`);
      }

      return true;
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'An error occurred during validation');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Size validation
    if (file.size > maxSize) {
      toast.error(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const isValid = await validateDocument(file);
    if (isValid) {
      onUpload(file);
      toast.success('Document blueprint uploaded successfully');
    } else {
      toast.error(validationError || 'Validation failed');
    }
  }, [onUpload, maxSize, documentType, validationError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: Object.keys(SUPPORTED_FORMATS).reduce((acc, key) => ({
      ...acc,
      [key]: []
    }), {}),
    maxSize,
    multiple: false
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${isValidating ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isValidating} />
        
        <div className="flex flex-col items-center space-y-3">
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Validating document...</p>
            </>
          ) : (
            <>
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="text-sm">
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drop your document blueprint here or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: {Object.values(SUPPORTED_FORMATS).join(', ')}
                </p>
                <p className="text-xs text-gray-500">
                  Max size: {maxSize / 1024 / 1024}MB
                </p>
              </div>
            </>
          )}
        </div>

        {validationError && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{validationError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder function for document type validation
// This would be replaced with actual validation logic
const validateDocumentType = async (file: File, documentType: DocumentType): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, just check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (documentType) {
    case 'invoice':
      return extension === 'xlsx' || extension === 'pdf';
    case 'contract':
      return extension === 'docx' || extension === 'pdf';
    default:
      return true;
  }
};

export default DocumentBlueprintUpload; 