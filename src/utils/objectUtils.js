/**
 * Compares two objects and returns an array of changes
 * @param {Object} oldObj - The original object
 * @param {Object} newObj - The new object to compare against
 * @param {string} prefix - Optional prefix for nested properties
 * @returns {string[]} Array of change descriptions
 */

export const getChanges = (oldObj, newObj, prefix = '') => {
  const changes = [];
  
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      changes.push(...getChanges(oldObj[key] || {}, newObj[key], `${prefix}${key}.`));
    } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      changes.push(`${prefix}${fieldName} changed from "${oldObj[key] || 'empty'}" to "${newObj[key] || 'empty'}"`);
    }
  }
  
  return changes;
}; 