// scripts/seedETF.ts
import 'dotenv/config'   // ← load up your .env into process.env

import payload from 'payload'
import payloadConfig from '../payload.config'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'

// Slugify helper w/ Croatian diacritics
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/đ/g, 'd')
    .replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function run() {
  // 1️⃣ Initialize Payload using your config file
  await payload.init({ config: payloadConfig })

  // 2️⃣ Load the Markdown
const md = readFileSync(
    resolve(process.cwd(), 'content', 'posts', 'ETF-article.md'),
    'utf8'
)

  // 3️⃣ Build the Lexical editor config from your Payload schema
  const editorConfig = await editorConfigFactory.default({
    config: payload.config,
  })

  // 4️⃣ Convert Markdown → Lexical editor state
  const typedState = convertMarkdownToLexical({
    markdown: md,
    editorConfig,
  })

  // 5️⃣ Strip methods to a pure object
  const body = JSON.parse(JSON.stringify(typedState))

  // 6️⃣ Extract title & slug
  const title = (md.match(/^#\s*(.+)/)?.[1] ?? 'Untitled').trim()
  const slug = slugify(title)

  // 7️⃣ Create the Post in Payload
  await payload.create({
    collection: 'posts',
    data: {
      title,
      slug,
      category: 'financije', // your select‐value
      body,
    },
  })

  console.log('✅ Seeded:', slug)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
