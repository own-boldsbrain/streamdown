import "server-only";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getLibSqlDb() {
  if (db) return db;
  
  const libsqlUrl = process.env.LIBSQL_URL;
  const libsqlToken = process.env.LIBSQL_AUTH_TOKEN;
  
  if (!libsqlUrl) {
    throw new Error("LIBSQL_URL environment variable is not set");
  }
  
  const client = createClient({
    url: libsqlUrl,
    // Token opcional, necessário apenas para instâncias remotas
    ...(libsqlToken ? { authToken: libsqlToken } : {})
  });
  
  db = drizzle(client, { schema });
  return db;
}