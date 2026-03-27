export function formatSlug(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function isValidSlugLength(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 50;
}
