import dotenv from 'dotenv'
dotenv.config()

import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import {
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Docs } from './collections/Docs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const payloadSecret = process.env.PAYLOAD_SECRET
const databaseUri = process.env.DATABASE_URI
const smtpHost = process.env.SMTP_HOST
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS

if (!databaseUri) {
  throw new Error('DATABASE_URI is not set')
}

if (!smtpHost || !smtpUser || !smtpPass) {
  throw new Error('Missing email environment variables')
}

if (!blobToken) {
  throw new Error('BLOB_READ_WRITE_TOKEN is not set')
}

if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET is not set')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: '@' /* path.resolve(dirname) */,
    },
    avatar: {
      Component: '/components/admin/avatar',
    },
    components: {},
  },
  collections: [Users, Media, Docs],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
    ],
  }),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
    },
    push: false,
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@auth.numos.xyz',
    defaultFromName: 'Numos Auth',
    // Nodemailer transportOptions
    transportOptions: {
      host: smtpHost,
      port: 587,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      collections: {
        media: true,
        users: true,
      },
      token: blobToken,
    }),
  ],
})
