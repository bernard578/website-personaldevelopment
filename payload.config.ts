import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slugify } from '@/utils/slugify'

import {
  lexicalEditor,
  EXPERIMENTAL_TableFeature,      // <— table support lives behind this flag
} from '@payloadcms/richtext-lexical'

import type { CollectionConfig } from 'payload'

/* ------------------------------------------------------------------ */
/*  Helper — crash early if an env-var is missing                      */
/* ------------------------------------------------------------------ */
const mustGetEnv = (key: string): string => {
  const val = process.env[key]
  if (!val) throw new Error(`Environment variable ${key} is not set`)
  return val
}

/* ------------------------------------------------------------------ */
/*  Media collection — every file / image ends up here                 */
/* ------------------------------------------------------------------ */
const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',           // stored in <projectRoot>/media
    mimeTypes: ['image/*'],       // restrict picker to images only
  },
  admin: { useAsTitle: 'filename' },
  fields: [
    // add alt-text or focal-point fields here if you need them
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
    read: ({ req }) => {
      // If the request is authenticated (admin/editor), allow all
      if (req.user) return true
      // Public (unauthenticated) requests only get published posts
      return {
        _status: { equals: 'published' },
      }
    },
  },
  fields: [
    { name: 'title',
      type: 'text',
      required: true
    },

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
      relationTo: 'media' as const,
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
  ],
}  
/* ------------------------------------------------------------------ */
/*  Final Payload configuration                                       */
/* ------------------------------------------------------------------ */
export default buildConfig({
  serverURL: process.env.SERVER_URL ?? 'http://localhost:3000',

  secret: mustGetEnv('PAYLOAD_SECRET'),

  db: mongooseAdapter({
    url: mustGetEnv('DATABASE_URI'),    // e.g. mongodb://127.0.0.1:27017/blog
  }),

  /* global editor defaults (optional) ----------------------------- */
  editor: lexicalEditor({}),            // applies to any richText field
                                        // that doesn’t override its features

  collections: [Media, Posts],
})