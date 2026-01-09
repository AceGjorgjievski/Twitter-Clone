export async function urlToFile(url: string): Promise<File> {
  const fullUrl = url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_BACKEND_ROOT_API}${url}`;

  const response = await fetch(fullUrl);
  const blob = await response.blob();

  const filename = fullUrl.split('/').pop() || 'image';
  const mimeType = blob.type || 'image/png';

  return new File([blob], filename, { type: mimeType });
}
