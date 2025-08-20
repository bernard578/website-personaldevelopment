'use client'

import React, { useEffect, useRef } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

// Infer the correct data type from the RichText component itself.
// This avoids `any` and stays compatible with library updates.
type RichTextData = React.ComponentProps<typeof RichText>['data']

type Props = {
  /** The JSON from a Payload richText field */
  data: RichTextData
  className?: string
}

/** Croatian-friendly slugify for heading IDs */
function slugifyId(input: string): string {
  const map: Record<string, string> = {
    č: 'c', ć: 'c', š: 's', đ: 'd', ž: 'z',
    Č: 'c', Ć: 'c', Š: 's', Đ: 'd', Ž: 'z',
  }

  return input
    .normalize('NFKD')
    .replace(/[čćšđžČĆŠĐŽ]/g, (m) => map[m] ?? m)
    .replace(/[\u0300-\u036f]/g, '') // strip combining marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function RichTextField({
  data,
  className = 'prose max-w-none',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  // After render: add ids to h1..h4 if missing, and ensure <img> tags have alt=""
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const used = new Set<string>()

    // 1) Ensure unique heading IDs
    const headings = el.querySelectorAll('h1, h2, h3, h4')
    headings.forEach((h) => {
      if (!(h instanceof HTMLElement)) return
      if (h.id) {
        used.add(h.id)
        return
      }
      const text = h.textContent?.trim() || ''
      if (!text) return

      const base = slugifyId(text) || 'section'
      let id = base
      let i = 2
      while (used.has(id)) id = `${base}-${i++}`
      h.id = id
      used.add(id)
    })

    // 2) Ensure <img> always has an alt attribute (for a11y)
    const imgs = el.querySelectorAll('img:not([alt])')
    imgs.forEach((img) => {
      img.setAttribute('alt', '')
    })
  }, [data])

  return (
    <div ref={containerRef} className={className}>
      <RichText data={data} />
    </div>
  )
}
