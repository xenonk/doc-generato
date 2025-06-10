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
    if (Array.isArray(newObj[key])) {
      const oldArr = oldObj[key] || [];
      const newArr = newObj[key] || [];
      if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
        // Try to show a summary for items array
        if (key === 'items') {
          changes.push(
            `${prefix}items changed from ${oldArr.length} item${oldArr.length !== 1 ? 's' : ''} to ${newArr.length} item${newArr.length !== 1 ? 's' : ''}`
          );
        } else {
          changes.push(
            `${prefix}${key} changed from ${oldArr.length} to ${newArr.length}`
          );
        }
      }
    } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      // For objects, just say 'changed' if different
      if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
        changes.push(`${prefix}${key} changed`);
      }
    } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      changes.push(`${prefix}${fieldName} changed from "${oldObj[key] || 'empty'}" to "${newObj[key] || 'empty'}"`);
    }
  }
  
  return changes;
}; 