import "server-only";
import { ChatSDKError } from "../errors";
import { generateUUID } from "../utils";
import { getLibSqlDb } from "./libsql";
import { getPostgresDb } from "./postgres";
import { getTursoDb } from "./turso";

// Check which database driver we should use
const DB_DRIVER = process.env.DB_DRIVER || "postgres";

// Check if guest user fallback is enabled for DB errors
const ENABLE_GUEST_USER_FALLBACK =
  process.env.ENABLE_GUEST_USER_FALLBACK === "true";

// Check if complete no-DB mode is enabled
const ALLOW_GUEST_NO_DB = process.env.ALLOW_GUEST_NO_DB === "1";

// Get the appropriate database client based on the driver
export function getDb() {
  try {
    // Suporte explícito para fallback total sem DB
    if (ALLOW_GUEST_NO_DB) {
      console.warn("Operating in NO-DB mode with ALLOW_GUEST_NO_DB=1");
      return null;
    }

    if (DB_DRIVER === "libsql") {
      return getLibSqlDb();
    }
    if (DB_DRIVER === "turso") {
      return getTursoDb();
    }
    return getPostgresDb();
  } catch (error) {
    console.error(`Failed to initialize ${DB_DRIVER} database:`, error);
    if (ENABLE_GUEST_USER_FALLBACK || ALLOW_GUEST_NO_DB) {
      console.warn("Using guest fallback mode due to database initialization error");
      return null;
    }
    throw error;
  }
}

// Create a guest user ID for fallback mode when database is unavailable
export function createGuestId() {
  return `guest-${generateUUID()}-${Date.now()}`;
}

// Helper function to handle database errors with optional guest fallback
export function handleDbError(
  error: unknown,
  errorMessage: string,
  fallbackValue: any = null
): never | any {
  if (ENABLE_GUEST_USER_FALLBACK || ALLOW_GUEST_NO_DB) {
    console.warn(`DB Error with fallback enabled: ${errorMessage}`, error);
    return fallbackValue;
  }

  console.error(`DB Error: ${errorMessage}`, error);
  throw new ChatSDKError("bad_request:database", errorMessage);
}
