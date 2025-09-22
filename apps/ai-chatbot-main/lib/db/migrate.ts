import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Load env from .env.local (dev) and fallback to .env
const tried: string[] = [];
for (const file of [".env.local", ".env"]) {
  const result = config({ path: file });
  if ("error" in result) {
    tried.push(`${file} (missing)`);
    continue;
  }
  tried.push(`${file} (ok)`);
  break; // stop at first successful load
}

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error(
      `POSTGRES_URL is not defined. Checked load order: ${tried.join(", ")}. Set POSTGRES_URL in .env or provide it in the environment before running the build.`
    );
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
