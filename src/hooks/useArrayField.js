import { useCallback } from 'react';

/**
 * useArrayField
 * Generic hook for managing array fields in an object state (e.g., items, attachments)
 * @param {Function} setState - The state setter function (e.g., setInvoice)
 * @param {string} field - The name of the array field (e.g., 'items')
 */
export default function useArrayField(setState, field) {
  const addItem = useCallback((newItem) => {
    setState(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  }, [setState, field]);

  const updateItem = useCallback((id, key, value) => {
    setState(prev => ({
      ...prev,
      [field]: (prev[field] || []).map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    }));
  }, [setState, field]);

  const removeItem = useCallback((id) => {
    setState(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter(item => item.id !== id)
    }));
  }, [setState, field]);

  return { addItem, updateItem, removeItem };
} 