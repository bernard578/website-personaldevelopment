import type { Field, CollectionSlug } from 'payload'

export const seoMinimal = (relTo: CollectionSlug): Field => ({
  type: 'group',
  name: 'seo',
  label: 'SEO',
  admin: { description: 'Basic SEO' }, // v3-safe (no initCollapsed)
  fields: [
    { name: 'metaTitle', type: 'text', label: 'Meta Title', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description', maxLength: 160 },
  ],
})
