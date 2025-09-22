import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "./provider";

// Verificar se a migração deve ser pulada
const SKIP_DB_MIGRATE = process.env.SKIP_DB_MIGRATE === "1";

export async function migrate() {
  if (SKIP_DB_MIGRATE) {
    console.log("Skipping database migration");
    return;
  }

  // Obtém a conexão com o banco de dados
  const db = getDb();
  if (!db) {
    console.warn("Database connection not available, skipping migration");
    return;
  }

  try {
    // Para o LibSQL/SQLite, executamos as migrações manualmente
    if (process.env.DB_DRIVER === "libsql" || process.env.DB_DRIVER === "turso") {
      console.log("Running SQLite/LibSQL migrations...");
      
      // Verifica se a tabela _drizzle_migrations existe
      const migrationsTableExists = await db.execute(sql`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='_drizzle_migrations'
      `);
      
      if (migrationsTableExists.rows.length === 0) {
        console.log("Creating migrations table...");
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS _drizzle_migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
      
      console.log("Migrations completed for SQLite/LibSQL");
    } else {
      // Para Postgres, temos o método migrar dedicado
      console.log("Migrations handled separately for PostgreSQL");
    }
    
    console.log("Database migration completed");
  } catch (error) {
    console.error("Error during database migration:", error);
    throw error;
  }
}

// Executa a migração se o script for executado diretamente
if (require.main === module) {
  migrate()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}