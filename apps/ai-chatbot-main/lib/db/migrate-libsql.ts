/**
 * Script de migração avançado para LibSQL
 *
 * Este script executa migrações no banco de dados LibSQL (Turso)
 * Ele pode utilizar diretamente os esquemas Drizzle ou SQL bruto
 *
 * Uso:
 *   pnpm tsx lib/db/migrate-libsql.ts
 */

import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as fs from "fs";
import * as path from "path";
import * as schema from "./schema";

// Carrega variáveis de ambiente do .env.local se existir
dotenv.config({ path: ".env.local" });
dotenv.config(); // Fallback para .env

// Configuração do banco de dados
const dbUrl =
  process.env.LIBSQL_DB_URL || process.env.LIBSQL_URL || "file:./dev.db";
const dbToken =
  process.env.LIBSQL_DB_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
const useDrizzleMigrate = process.env.USE_DRIZZLE_MIGRATE === "1";

// Caminho absoluto para garantir que o arquivo dev.db seja criado no local correto
const absoluteDbPath = dbUrl.startsWith("file:")
  ? path.resolve(process.cwd(), dbUrl.replace("file:", ""))
  : null;

// Exibe informações de configuração
console.log("🔄 Configuração da migração:");
console.log(`   URL do banco de dados: ${dbUrl}`);
if (absoluteDbPath) {
  console.log(`   Caminho absoluto do arquivo: ${absoluteDbPath}`);

  // Verifica se o diretório existe
  const dbDir = path.dirname(absoluteDbPath);
  if (!fs.existsSync(dbDir)) {
    console.log(`   Criando diretório para o banco de dados: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
}
console.log(
  `   Token de autenticação: ${dbToken ? "✓ Configurado" : "✗ Não configurado"}`
);
console.log(
  `   Modo de migração: ${useDrizzleMigrate ? "Drizzle" : "SQL manual"}`
);

async function main() {
  console.log("🚀 Iniciando migração do banco de dados LibSQL...");

  try {
    // Cria o cliente LibSQL
    const client = createClient({
      url: dbUrl,
      authToken: dbToken,
    });

    // Método 1: Usar Drizzle Migrate com arquivos de migração
    if (useDrizzleMigrate) {
      const db = drizzle(client);
      const migrationsFolder = path.resolve(process.cwd(), "drizzle");

      console.log(`   Diretório de migrações: ${migrationsFolder}`);

      if (!fs.existsSync(migrationsFolder)) {
        console.error("❌ Erro: Diretório de migrações não encontrado!");
        console.log(
          "   Execute 'pnpm drizzle-kit generate' para criar os arquivos de migração."
        );
        process.exit(1);
      }

      console.log("🔄 Executando migrações com Drizzle...");
      await migrate(db, { migrationsFolder });
    }
    // Método 2: Executar SQL bruto (fallback)
    else {
      console.log("🔄 Executando migrações manuais via SQL...");

      // Tabela User
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "User" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        );
      `);

      // Tabela Chat
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Chat" (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          visibility TEXT NOT NULL DEFAULT 'private',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          last_context TEXT
        );
      `);

      // Tabela Message
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Message" (
          id TEXT PRIMARY KEY,
          chat_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT NULL,
          FOREIGN KEY (chat_id) REFERENCES Chat(id) ON DELETE CASCADE
        );
      `);

      // Tabela Vote
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Vote" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chat_id TEXT NOT NULL,
          message_id TEXT NOT NULL,
          is_upvoted INTEGER NOT NULL,
          FOREIGN KEY (chat_id) REFERENCES Chat(id) ON DELETE CASCADE,
          FOREIGN KEY (message_id) REFERENCES Message(id) ON DELETE CASCADE
        );
      `);

      // Tabela Document
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Document" (
          id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          kind TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          PRIMARY KEY (id, created_at)
        );
      `);

      // Tabela Stream
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Stream" (
          id TEXT PRIMARY KEY,
          chat_id TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (chat_id) REFERENCES Chat(id) ON DELETE CASCADE
        );
      `);

      // Tabela Suggestion
      await client.execute(`
        CREATE TABLE IF NOT EXISTS "Suggestion" (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          document_id TEXT NOT NULL,
          document_created_at TEXT NOT NULL,
          selection_start INTEGER NOT NULL,
          selection_end INTEGER NOT NULL,
          suggestion TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (document_id, document_created_at) REFERENCES Document(id, created_at) ON DELETE CASCADE
        );
      `);
    }

    console.log("✅ Migrações concluídas com sucesso!");
    console.log(`   Banco de dados: ${dbUrl}`);
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);

    if (error.message && error.message.includes("no such table")) {
      console.log("\n🔍 Erro de tabela não encontrada. Possíveis soluções:");
      console.log(
        "   1. Verifique se o banco de dados foi inicializado corretamente"
      );
      console.log(
        "   2. Certifique-se de que o caminho para o arquivo dev.db está correto"
      );
      console.log(
        "   3. Se estiver usando um banco de dados remoto, verifique as permissões"
      );
    } else if (error.message && error.message.includes("ENOTFOUND")) {
      console.log("\n🔍 Erro de conexão. Possíveis soluções:");
      console.log("   1. Verifique se a URL do banco de dados está correta");
      console.log(
        "   2. Certifique-se de que o banco de dados está acessível a partir da sua rede"
      );
      console.log(
        "   3. Se estiver usando Turso, verifique se o banco de dados foi criado e está ativo"
      );
    }

    process.exit(1);
  } finally {
    client.close();
  }
}

main();
