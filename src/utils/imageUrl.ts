/**
 * Resolve image URL for deployment with base path.
 * Converts absolute local paths like /images/... to include Vite base prefix.
 * External URLs (http://, https://) are returned as-is.
 */
export function resolveImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return import.meta.env.BASE_URL + path.slice(1);
  }
  return path;
}
