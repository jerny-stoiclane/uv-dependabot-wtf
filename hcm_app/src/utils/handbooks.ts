export const isValidPDF = (filename) => {
  const fileExtension = filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
  return ['.pdf'].includes('.' + fileExtension);
};

export const formatKeyToHandbookTitle = (keyName: string) => {
  return keyName.substring(keyName.lastIndexOf('/') + 1);
};
