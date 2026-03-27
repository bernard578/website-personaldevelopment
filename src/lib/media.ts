export type MediaRef =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined;

function toRelative(u?: string | null): string | undefined {
  if (!u) return undefined
  try {
    return u.startsWith('http') ? new URL(u).pathname : u
  } catch {
    return u ?? undefined
  }
}

export function mediaUrl(m: MediaRef): string | undefined {
  if (!m || typeof m === 'string') return undefined
  const fromUrl = toRelative(m.url ?? undefined)
  if (fromUrl) return fromUrl
  return m.filename ? `/media/${m.filename}` : undefined
}
