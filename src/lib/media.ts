export type MediaRef =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined;

export function mediaUrl(m: MediaRef) {
  if (!m || typeof m === 'string') return undefined;
  return m.url ?? (m.filename ? `/media/${m.filename}` : undefined);
}
