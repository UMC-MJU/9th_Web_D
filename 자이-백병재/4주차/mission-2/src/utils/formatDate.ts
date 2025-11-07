function formatDate(date: Date) { 
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
}

export default formatDate;