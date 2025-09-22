import { config } from "dotenv";
import { defineConfig, type Config } from "drizzle-kit";

config({
  path: ".env.local",
});

// Obtém o driver de banco de dados a partir das variáveis de ambiente
const DB_DRIVER = process.env.DB_DRIVER || "postgres";

// Configuração condicional com base no driver
let drizzleConfig: Config;

if (DB_DRIVER === "libsql" || DB_DRIVER === "turso") {
  drizzleConfig = {
    schema: "./lib/db/schema.ts",
    out: "./lib/db/migrations-sqlite",
    dialect: "sqlite",
    dbCredentials: {
      url: process.env.LIBSQL_URL || "file:./data/streamdown.db",
    },
  };
} else {
  // PostgreSQL (padrão)
  drizzleConfig = {
    schema: "./lib/db/schema.ts",
    out: "./lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.POSTGRES_URL || "",
    },
  };
}

export default defineConfig(drizzleConfig);
