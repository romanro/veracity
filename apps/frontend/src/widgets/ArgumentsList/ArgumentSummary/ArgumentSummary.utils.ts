export function buildArgumentPath(path: string, argumentId: string | number): string {
  if (path.endsWith('/consensus')) {
    return path.replace(/\/consensus$/, `/arguments/${argumentId}`);
  }

  // Ensure there's no trailing slash before appending
  const cleanPath = path.replace(/\/+$/, '');
  return `${cleanPath}/arguments/${argumentId}`;
}
