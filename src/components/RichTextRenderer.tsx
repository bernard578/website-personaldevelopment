'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface Props {
  data: SerializedEditorState
}

export default function RichTextRenderer({ data }: Props) {
  return <RichText data={data} />
}
