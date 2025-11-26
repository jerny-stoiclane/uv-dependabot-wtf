export const extractFilename = (presigned_url: string) => {
  if (!presigned_url) return null;
  const url = new URL(presigned_url);
  const filename = decodeURIComponent(url.pathname.split('/').pop() || '');
  return filename;
};
