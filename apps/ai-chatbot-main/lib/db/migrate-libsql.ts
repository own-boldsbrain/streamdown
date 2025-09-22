import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.LIBSQL_URL || "file:./dev.db";
  const authToken = process.env.LIBSQL_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken,
  });

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "User" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    console.log(`LibSQL migration applied on ${url}`);
  } catch (error) {
    console.error("LibSQL migration failed:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
