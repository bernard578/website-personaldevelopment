import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slugify } from '@/lib/utils/slugify'
import {
  lexicalEditor,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig, CollectionSlug } from 'payload'
import { seoMinimal } from '@/lib/seo/seoFields'   // 👈 import the util

/* ------------------------------------------------------------------ */
/*  Helper — crash early if an env-var is missing                      */
/* ------------------------------------------------------------------ */
const mustGetEnv = (key: string): string => {
  const val = process.env[key]
  if (!val) throw new Error(`Environment variable ${key} is not set`)
  return val
}

/* ------------------------------------------------------------------ */
/*  Slugs typed for TS                                                 */
/* ------------------------------------------------------------------ */
const MEDIA_SLUG: CollectionSlug = 'media'

/* ------------------------------------------------------------------ */
/*  Media collection — every file / image ends up here                 */
/* ------------------------------------------------------------------ */
const Media: CollectionConfig = {
  slug: MEDIA_SLUG,
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  admin: { useAsTitle: 'filename' },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt text' },
  ],
}

/* ------------------------------------------------------------------ */
/*  Posts collection — blog articles                                  */
/* ------------------------------------------------------------------ */
const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Financije',            value: 'financije' },
        { label: 'Upravljanje vremenom', value: 'upravljanje-vremenom' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: MEDIA_SLUG,      // ← typed slug
      required: false,
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          EXPERIMENTAL_TableFeature(),
        ],
      }),
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true, position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data || typeof data.title !== 'string') return
            data.slug = slugify(data.title)
          },
        ],
      },
    },

    {
      name: 'date',
      type: 'date',
      admin: { position: 'sidebar' },
      defaultValue: () => new Date(),
    },

    // ✅ Minimal SEO group appended (two fields: metaTitle + metaDescription)
    seoMinimal(MEDIA_SLUG),
  ],
}

/* ------------------------------------------------------------------ */
/*  Final Payload configuration                                       */
/* ------------------------------------------------------------------ */
export default buildConfig({
  serverURL: process.env.SERVER_URL ?? 'http://localhost:3000',
  secret: mustGetEnv('PAYLOAD_SECRET'),
  db: mongooseAdapter({ url: mustGetEnv('DATABASE_URI') }),
  editor: lexicalEditor({}),
  collections: [Media, Posts],
})
