import { useCallback } from 'react';

/**
 * useNestedFieldChange
 * Returns a handler for updating nested fields in an object using dot notation (e.g., 'seller.company')
 * @param {Function} setState - The state setter function (e.g., setInvoice)
 */
export default function useNestedFieldChange(setState) {
  return useCallback((field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setState(prev => {
        let updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setState(prev => ({ ...prev, [field]: value }));
    }
  }, [setState]);
} 