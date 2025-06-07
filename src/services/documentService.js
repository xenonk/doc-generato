import directus, { handleDirectusError } from './directus';

// Document blueprint service
export const documentService = {
  // Upload a document blueprint
  async uploadBlueprint(file, documentType) {
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
    try {
      // This is a placeholder for actual validation logic
      // In production, this would call your backend API
      const response = await directus.items('document_blueprints').readOne(fileId);
      
      // Add validation logic here
      // For now, we'll just return true
      return {
        isValid: true,
        validationDetails: {
          documentType: documentType,
          format: response.type,
          size: response.filesize,
          // Add more validation details as needed
        }
      };
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get document blueprint
  async getBlueprint(fileId) {
    try {
      const response = await directus.files.readOne(fileId);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Get document blueprints by type
  async getBlueprintsByType(documentType) {
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
    try {
      await directus.files.deleteOne(fileId);
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update document blueprint metadata
  async updateBlueprintMetadata(fileId, metadata) {
    try {
      const response = await directus.items('document_blueprints').updateOne(fileId, metadata);
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
    try {
      const response = await directus.items('document_templates').readOne(templateId);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Create a new template
  async createTemplate(templateData) {
    try {
      const response = await directus.items('document_templates').createOne(templateData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Update template
  async updateTemplate(templateId, templateData) {
    try {
      const response = await directus.items('document_templates').updateOne(templateId, templateData);
      return response;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  },

  // Delete template
  async deleteTemplate(templateId) {
    try {
      await directus.items('document_templates').deleteOne(templateId);
      return true;
    } catch (error) {
      throw new Error(handleDirectusError(error));
    }
  }
}; 