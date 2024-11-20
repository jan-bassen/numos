import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
  upload: {
    staticDir: 'avatars',
    bulkUpload: false,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 100,
        height: 100,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
