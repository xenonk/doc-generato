interface Change {
  field: string;
  oldValue: any;
  newValue: any;
}

export const getChanges = (oldObj: any, newObj: any, prefix = ''): Change[] => {
  const changes: Change[] = [];
  
  for (const key in newObj) {
    if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      changes.push(...getChanges(oldObj[key] || {}, newObj[key], `${prefix}${key}.`));
    } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      changes.push({
        field: `${prefix}${key}`,
        oldValue: oldObj[key] || 'empty',
        newValue: newObj[key] || 'empty'
      });
    }
  }
  
  return changes;
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}; 