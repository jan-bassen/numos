import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export function getDBClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  const client = postgres(connectionString, { prepare: false })
  return drizzle(client)
}
