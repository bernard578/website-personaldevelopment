// src/lib/richtext/AnchorLinkNode.tsx
import * as React from 'react'
import {
  DecoratorNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical'

/* ---------- serialization type ---------- */
export type SerializedAnchorLink = Spread<
  {
    id: string
    text: string
    type: 'anchor-link'
    version: 1
  },
  SerializedLexicalNode
>

/* ---------- the node ---------- */
export class AnchorLinkNode extends DecoratorNode<React.ReactElement> {
  __id: string
  __text: string

  static getType() {
    return 'anchor-link'
  }

  static clone(node: AnchorLinkNode) {
    return new AnchorLinkNode(node.__id, node.__text, node.__key)
  }

  constructor(id: string, text: string, key?: string) {
    super(key)
    this.__id = id
    this.__text = text
  }

  /* ----- serialization ----- */
  exportJSON(): SerializedAnchorLink {
    return {
      id: this.__id,
      text: this.__text,
      type: 'anchor-link',
      version: 1,
    }
  }

  /* ----- render inside editor / front-end ----- */
  decorate() {
    return (
      <a href={`#${this.__id}`} className="text-indigo-600 underline">
        {this.__text}
      </a>
    )
  }
}