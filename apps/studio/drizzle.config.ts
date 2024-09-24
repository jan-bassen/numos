import "dotenv/config";
import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./backend/schema.ts",
  out: "./lib/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_CONNECTION_STRING!,
  },
} satisfies Config;
