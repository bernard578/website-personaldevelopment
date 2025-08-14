// src/lib/richtext/AutoHeadingIdPlugin.tsx
'use client'                 // ← add this as the very first line

import { $isHeadingNode }            from '@lexical/rich-text'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect }                 from 'react'
import { slugify }                   from '@/lib/utils/slugify'
import { $getRoot }                  from 'lexical'

export default function AutoHeadingIdPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $getRoot()
          .getChildren()
          .forEach(node => {
            if ($isHeadingNode(node)) {
              const dom = editor.getElementByKey(node.getKey()) as HTMLElement|null
              if (!dom || dom.id) return

              const txt = node.getTextContent().trim()
              if (txt) dom.id = slugify(txt)
            }
          })
      })
    })
  }, [editor])

  return null
}
