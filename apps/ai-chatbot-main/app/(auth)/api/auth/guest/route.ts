import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirectUrl") || "/";

    // Verificar se AUTH_SECRET está definido
    if (!process.env.AUTH_SECRET) {
      console.error("AUTH_SECRET não está definido no ambiente");
      return new NextResponse(
        JSON.stringify({
          error: "Erro de configuração: AUTH_SECRET não está definido",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });

    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return signIn("guest", { redirect: true, redirectTo: redirectUrl });
  } catch (error) {
    console.error("Erro na rota de autenticação de convidado:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Erro ao processar a autenticação de convidado",
        details: isDevelopmentEnvironment ? String(error) : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
