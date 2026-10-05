// Joins a path with Astro's base (e.g. "/academy") so images and links work
// under the Webflow Cloud mount path. Absolute URLs (https://…) pass through.
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
