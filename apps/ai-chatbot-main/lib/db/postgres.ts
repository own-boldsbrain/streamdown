import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getPostgresDb() {
  if (db) return db;
  
  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }
  
  const client = postgres(postgresUrl);
  db = drizzle(client, { schema });
  return db;
}