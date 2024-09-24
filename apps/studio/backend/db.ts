import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { collections } from "./schema";
const connectionString = process.env.SUPABASE_CONNECTION_STRING!;

const client = postgres(connectionString);
const db = drizzle(client);

const allCollections = await db.select().from(collections);
