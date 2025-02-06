import type { CollectionConfig } from 'payload'

export const Docs: CollectionConfig = {
  slug: 'docs',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: ['home', 'studio'],
    },
    {
      name: 'content',
      type: 'richText',
      required: false,
    },
  ],
}
