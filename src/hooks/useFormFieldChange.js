import { useCallback } from 'react';

/**
 * A generic hook for handling form field changes with support for:
 * 1. Nested field changes using dot notation
 * 2. Entity-based changes (e.g., company, contract)
 * 3. Array field changes
 * 4. Status tracking for all changes
 * 
 * @param {Function} setFormData - State setter function for the form data
 * @param {Object} options - Configuration options
 * @param {Object} options.entities - Map of entity types to their data and mapping functions
 * @param {Function} options.onChange - Callback for tracking changes
 * @returns {Object} Object containing field change handlers
 */
const useFormFieldChange = (setFormData, options = {}) => {
  const { entities = {}, onChange } = options;

  // Handle nested field changes using dot notation
  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = fieldName.split('.');
      let current = newData;

      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // Set the value
      current[keys[keys.length - 1]] = value;
      
      // Notify about the change
      if (onChange) {
        onChange(newData);
      }
      
      return newData;
    });
  }, [setFormData, onChange]);

  // Handle entity-based changes (e.g., company, contract)
  const handleEntityChange = useCallback((entityType, entityId, formData) => {
    const entityConfig = entities[entityType];
    if (!entityConfig) {
      console.warn(`No configuration found for entity type: ${entityType}`);
      return;
    }

    const { data, mapping } = entityConfig;
    const entity = data.find(item => item.id === parseInt(entityId));
    
    if (entity && mapping) {
      setFormData(prev => {
        const newData = {
          ...prev,
          ...mapping(entity, prev)
        };
        
        // Notify about the change
        if (onChange) {
          onChange(newData);
        }
        
        return newData;
      });
    }
  }, [entities, setFormData, onChange]);

  // Handle array field changes
  const handleArrayField = useCallback((fieldName) => {
    return {
      addItem: (item) => {
        setFormData(prev => {
          const newData = {
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), item]
          };
          
          // Notify about the change
          if (onChange) {
            onChange(newData);
          }
          
          return newData;
        });
      },
      updateItem: (index, item) => {
        setFormData(prev => {
          const newData = {
            ...prev,
            [fieldName]: prev[fieldName].map((existingItem, i) => 
              i === index ? item : existingItem
            )
          };
          
          // Notify about the change
          if (onChange) {
            onChange(newData);
          }
          
          return newData;
        });
      },
      removeItem: (index) => {
        setFormData(prev => {
          const newData = {
            ...prev,
            [fieldName]: prev[fieldName].filter((_, i) => i !== index)
          };
          
          // Notify about the change
          if (onChange) {
            onChange(newData);
          }
          
          return newData;
        });
      }
    };
  }, [setFormData, onChange]);

  return {
    handleFieldChange,
    handleEntityChange,
    handleArrayField
  };
};

export default useFormFieldChange; 