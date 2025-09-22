import "server-only";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getTursoDb() {
  if (db) return db;
  
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!tursoUrl) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }
  
  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });
  
  db = drizzle(client, { schema });
  return db;
}