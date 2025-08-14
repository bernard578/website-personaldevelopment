// src/utils/slugify.ts

export function slugify(str: string): string {
  if (!str) return ''

  const map: Record<string, string> = {
    č: 'c',
    ć: 'c',
    š: 's',
    đ: 'd',
    ž: 'z',
  }

  return str
    .toLowerCase()
    .replace(/[čćšđž]/g, m => map[m] || m)
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // collapse to “-”
    .replace(/(^-|-$)+/g, '')    // trim leading / trailing “-”
}
