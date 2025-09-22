import "server-only";
import { ChatSDKError } from "../errors";
import { generateUUID } from "../utils";
import { getPostgresDb } from "./postgres";
import { getTursoDb } from "./turso";

// Check which database provider we should use
const DB_PROVIDER = process.env.DB_PROVIDER || "postgres";

// Check if guest user fallback is enabled
const ENABLE_GUEST_USER_FALLBACK =
  process.env.ENABLE_GUEST_USER_FALLBACK === "true";

// Get the appropriate database client based on the provider
export function getDb() {
  try {
    if (DB_PROVIDER === "turso") {
      return getTursoDb();
    }
    return getPostgresDb();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    if (!ENABLE_GUEST_USER_FALLBACK) {
      throw error;
    }
    return null;
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
  if (ENABLE_GUEST_USER_FALLBACK) {
    console.warn(`DB Error with fallback enabled: ${errorMessage}`, error);
    return fallbackValue;
  }

  console.error(`DB Error: ${errorMessage}`, error);
  throw new ChatSDKError("bad_request:database", errorMessage);
}
