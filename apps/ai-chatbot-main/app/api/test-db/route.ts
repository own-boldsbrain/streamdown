import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/provider";

export async function GET(_request: Request) {
  try {
    // Verificar variáveis de ambiente
    const envVars = {
      AUTH_SECRET: process.env.AUTH_SECRET ? "Definido" : "Não definido",
      DB_PROVIDER: process.env.DB_PROVIDER || "postgres (padrão)",
      POSTGRES_URL: process.env.POSTGRES_URL ? "Definido" : "Não definido",
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL
        ? "Definido"
        : "Não definido",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN
        ? "Definido"
        : "Não definido",
      ENABLE_GUEST_USER_FALLBACK: process.env.ENABLE_GUEST_USER_FALLBACK,
      NODE_ENV: process.env.NODE_ENV || "não definido",
    };

    // Tentar conectar ao banco de dados
    let dbStatus = "Não conectado";
    let dbError: string | null = null;

    try {
      const db = await Promise.resolve(getDb());
      if (db) {
        dbStatus = "Conectado com sucesso";
      } else {
        dbStatus =
          "Não foi possível conectar ao banco de dados, mas o fallback está ativado";
      }
    } catch (error) {
      dbStatus = "Erro ao conectar ao banco de dados";
      dbError = String(error);
    }

    return NextResponse.json({
      status: "OK",
      message: "Teste de diagnóstico concluído",
      environment: envVars,
      database: {
        status: dbStatus,
        error: dbError,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "Erro",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
