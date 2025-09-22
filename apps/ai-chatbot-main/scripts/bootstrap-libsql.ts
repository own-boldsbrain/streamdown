import 'dotenv/config';
import { createClient } from '@libsql/client';

async function ensureTables() {
  const url = process.env.LIBSQL_URL;
  if (!url) {
    throw new Error('LIBSQL_URL is required');
  }

  const client = createClient({
    url,
    ...(process.env.LIBSQL_AUTH_TOKEN ? { authToken: process.env.LIBSQL_AUTH_TOKEN } : {}),
  });

  const stmts = [
    // Migrations meta (compatible with drizzle sqlite async dialect)
    `CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,

    // User
    `CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      password TEXT
    );`,

    // Chat
    `CREATE TABLE IF NOT EXISTS "Chat" (
      id TEXT PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      title TEXT NOT NULL,
      userId TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'private',
      lastContext TEXT,
      FOREIGN KEY (userId) REFERENCES "User"(id)
    );`,

    // Message_v2
    `CREATE TABLE IF NOT EXISTS "Message_v2" (
      id TEXT PRIMARY KEY NOT NULL,
      chatId TEXT NOT NULL,
      role TEXT NOT NULL,
      parts TEXT NOT NULL,
      attachments TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (chatId) REFERENCES "Chat"(id)
    );`,

    // Vote_v2 (composite pk)
    `CREATE TABLE IF NOT EXISTS "Vote_v2" (
      chatId TEXT NOT NULL,
      messageId TEXT NOT NULL,
      isUpvoted INTEGER NOT NULL,
      PRIMARY KEY (chatId, messageId),
      FOREIGN KEY (chatId) REFERENCES "Chat"(id),
      FOREIGN KEY (messageId) REFERENCES "Message_v2"(id)
    );`,

    // Document (composite pk)
    `CREATE TABLE IF NOT EXISTS "Document" (
      id TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      text TEXT NOT NULL DEFAULT 'text',
      userId TEXT NOT NULL,
      PRIMARY KEY (id, createdAt),
      FOREIGN KEY (userId) REFERENCES "User"(id)
    );`,

    // Suggestion
    `CREATE TABLE IF NOT EXISTS "Suggestion" (
      id TEXT PRIMARY KEY NOT NULL,
      documentId TEXT NOT NULL,
      documentCreatedAt TEXT NOT NULL,
      originalText TEXT NOT NULL,
      suggestedText TEXT NOT NULL,
      description TEXT,
      isResolved INTEGER NOT NULL DEFAULT 0,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES "User"(id),
      FOREIGN KEY (documentId, documentCreatedAt) REFERENCES "Document"(id, createdAt)
    );`,

    // Stream
    `CREATE TABLE IF NOT EXISTS "Stream" (
      id TEXT PRIMARY KEY NOT NULL,
      chatId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (chatId) REFERENCES "Chat"(id)
    );`,
  ];

  for (const sql of stmts) {
    await client.execute(sql);
  }

  // insert a migration row if empty to keep drizzle happy
  const res = await client.execute('SELECT COUNT(*) as cnt FROM __drizzle_migrations;');
  const cnt = Number((res.rows?.[0] as any)?.cnt ?? 0);
  if (cnt === 0) {
    await client.execute("INSERT INTO __drizzle_migrations (hash) VALUES ('bootstrap-libsql');");
  }

  console.log('✅ LibSQL bootstrap completed');
}

ensureTables().catch((e) => {
  console.error('❌ LibSQL bootstrap failed', e);
  process.exit(1);
});
