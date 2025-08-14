// "upravljanje-vremenom" -> "Upravljanje Vremenom" (ili samo "upravljanje vremenom")
export function humanizeCategory(
  slug: string,
  opts: { titleCase?: boolean } = { titleCase: true }
) {
  const s = (slug ?? '').replace(/-/g, ' ').trim()
  if (!opts.titleCase) return s

  // Unicode-friendly kapitalizacija svake riječi (radi i s čćšđž)
  return s
    .split(/\s+/)
    .map(w => (w ? w[0].toLocaleUpperCase('hr-HR') + w.slice(1) : w))
    .join(' ')
}
