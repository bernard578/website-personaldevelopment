'use client'

import React, { useEffect, useRef } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  /** The JSON you get from a Payload richText field */
  data: any
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
    .replace(/[\u0300-\u036f]/g, '')   // strip other combining marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function RichTextField({
  data,
  className = 'prose max-w-none',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  // After render, add ids to h1..h4 if they don't have one
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const used = new Set<string>()
    const headings = el.querySelectorAll('h1, h2, h3, h4')

    headings.forEach((h) => {
      if (!(h instanceof HTMLElement)) return

      // If already has an id, keep it (lets you link by a custom id if you ever add one)
      if (h.id) {
        used.add(h.id)
        return
      }

      const text = h.textContent?.trim() || ''
      if (!text) return

      let base = slugifyId(text)
      if (!base) base = 'section'

      // ensure uniqueness on the page
      let id = base
      let i = 2
      while (used.has(id)) {
        id = `${base}-${i++}`
      }
      h.id = id
      used.add(id)
    })
  }, [data])

  return (
    <div ref={containerRef} className={className}>
      {/* We don't *need* any custom converters for anchors; the IDs above do the job.
         Payload’s link tool can point to "#my-id" and it’ll work. */}
      <RichText data={data} />
    </div>
  )
}
