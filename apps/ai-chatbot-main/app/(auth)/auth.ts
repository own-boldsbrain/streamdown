import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { DUMMY_PASSWORD } from "@/lib/constants";
// Import dinâmico de createGuestUser será feito dentro do authorize do provider guest.
import { getUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }

  // biome-ignore lint/nursery/useConsistentTypeDefinitions: "Required"
  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return { ...user, type: "regular" };
      },
    }),
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        // NO-DB early return: não carrega nem executa código que acessa DB
        if (process.env.ALLOW_GUEST_NO_DB === "1") {
          console.info("Operating in NO-DB mode with ALLOW_GUEST_NO_DB=1");
          const ts = Date.now();
          return { id: `guest-${ts}`, email: `guest.${ts}@local`, type: "guest", ephemeral: true };
        }

        // Caminho com DB: import dinâmico para evitar carga em NO-DB
        try {
          const { createGuestUser } = await import("@/lib/db/queries");
          const guestUser = await createGuestUser();
          return { ...guestUser, type: "guest" };
        } catch (e) {
          if (process.env.ENABLE_GUEST_USER_FALLBACK === "true") {
            console.error("DB Error with fallback enabled:", e);
            const ts = Date.now();
            return { id: `guest-${ts}`, email: `guest.${ts}@local`, type: "guest", ephemeral: true };
          }
            throw e;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
