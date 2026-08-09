import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { credentialsSchema } from "@/lib/validations/auth";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  // Credentials sign-in requires JWT sessions in next-auth v4 — the adapter
  // is kept for future providers (e.g. magic-link email) but isn't used to
  // persist the session for this admin's login.
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Keyed by the submitted email, not IP — there's exactly one valid
        // admin account, so this bounds brute-force attempts against it
        // regardless of how many source IPs an attacker rotates through
        // (unlike IP-based limiting, which isn't trustworthy pre-Phase 12
        // reverse proxy — see lib/net.ts).
        const { allowed } = rateLimit(
          `login:${parsed.data.email}`,
          LOGIN_ATTEMPT_LIMIT,
          LOGIN_WINDOW_MS,
        );
        if (!allowed) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
