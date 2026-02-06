import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
// Create the Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Create the Drizzle instance with all schemas for relational queries
export const db = drizzle({client: sql, schema });

export { schema };
export type Database = typeof db;
