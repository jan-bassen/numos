export const elementTypes = {
  action: {
    key: 'action',
    title: 'Action',
    plural: 'Actions',
    slug: 'actions',
    titles: {
      singular_capitalized: 'Action',
      plural_capitalized: 'Actions',
      singular_lowercase: 'action',
      plural_lowercase: 'actions',
    },
  },
  attribute: {
    key: 'attribute',
    title: 'Attribute',
    plural: 'Attributes',
    slug: 'attributes',
    titles: {
      singular_capitalized: 'Attribute',
      plural_capitalized: 'Attributes',
      singular_lowercase: 'attribute',
      plural_lowercase: 'attributes',
    },
  },
  layer: {
    key: 'layer',
    title: 'Layer',
    plural: 'Layers',
    slug: 'image',
    titles: {
      singular_capitalized: 'Layer',
      plural_capitalized: 'Layers',
      singular_lowercase: 'layer',
      plural_lowercase: 'layers',
    },
  },
}

export type ElementType = keyof typeof elementTypes
