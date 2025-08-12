'use client'

import * as React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  createCommand,
  $insertNodes,
  COMMAND_PRIORITY_LOW,
} from 'lexical'
import { AnchorLinkNode } from './AnchorLinkNode'

/** custom command so toolbar / slash-menu can dispatch it */
export const INSERT_ANCHOR_LINK_COMMAND = createCommand<void>()

export default function AnchorLinkPlugin() {
  const [editor] = useLexicalComposerContext()

  /** prompt user and insert node */
  const insert = () => {
    const id   = prompt('Anchor ID (no #)')?.trim()
    const text = prompt('Link text')?.trim()
    if (!id || !text) return

    editor.update(() => {
      $insertNodes([new AnchorLinkNode(id, text)])
    })
  }

  /** register the command once */
  React.useEffect(() => {
    return editor.registerCommand(
      INSERT_ANCHOR_LINK_COMMAND,
      () => {
        insert()
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
