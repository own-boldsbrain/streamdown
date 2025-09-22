import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/provider";

export const dynamic = "force-dynamic"; // garantir execução a cada chamada em dev

type HealthPayload = {
  driver: string;
  allowGuestNoDb: boolean;
  enableGuestFallback: boolean;
  mode: "no-db" | "connected" | "error";
  tables?: string[];
  error?: string;
  timestamp: string;
};

async function inspectTables(db: any): Promise<string[]> {
  try {
    if (!db) {
      return [];
    }
    // LibSQL / Turso (libsql client): tentar enumerar via sqlite_master
    if (typeof db.execute === "function") {
      try {
        const res: any = await db.execute(
          "SELECT name FROM sqlite_master WHERE type='table'"
        );
        if (res && Array.isArray(res.rows)) {
          return res.rows.map((r: any) => r.name).filter(Boolean);
        }
      } catch {
        // silencioso
      }
    }
    // Fallback: testar existência de tabelas conhecidas
    const candidates = [
      "User",
      "Chat",
      "Message",
      "Document",
      "Suggestion",
      "Stream",
      "Vote",
    ];
    const existing: string[] = [];
    for (const tbl of candidates) {
      try {
        const probe = `SELECT 1 FROM ${tbl} LIMIT 1`;
        if (typeof db.execute === "function") {
          await db.execute(probe);
          existing.push(tbl);
        } else if (typeof db.query === "function") {
          await db.query(probe);
          existing.push(tbl);
        }
      } catch {
        // tabela não existe
      }
    }
    return existing;
  } catch {
    return [];
  }
}

export async function GET() {
  const driver = process.env.DB_DRIVER || "postgres";
  const allowGuestNoDb = process.env.ALLOW_GUEST_NO_DB === "1";
  const enableGuestFallback = process.env.ENABLE_GUEST_USER_FALLBACK === "true";
  const base: HealthPayload = {
    driver,
    allowGuestNoDb,
    enableGuestFallback,
    mode: allowGuestNoDb ? "no-db" : "connected",
    timestamp: new Date().toISOString(),
  };
  if (allowGuestNoDb) {
    return NextResponse.json(base, { status: 200 });
  }
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { ...base, mode: "error", error: "DB unavailable (null client)" },
        { status: 503 }
      );
    }
    const tables = await inspectTables(db);
    return NextResponse.json(
      { ...base, tables, mode: "connected" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ...base, mode: "error", error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
