import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv'
import schema from '@/db/schema'

dotenv.config()
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const client = postgres(process.env.DATABASE_URL!, { prepare: false })

export const db = drizzle({ client, schema })
