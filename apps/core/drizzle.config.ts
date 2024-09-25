import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  out: './src/db/migrations',
  migrations: {
    prefix: 'supabase',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
