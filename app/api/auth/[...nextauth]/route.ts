import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // TEMP: prints the real cause behind OAuthSignin/OAuthCallback errors to
  // your terminal (the URL only ever shows a generic error code). Turn
  // this back off (delete the line) once Google login is working.
  debug: true,
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await (prisma as any).user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No account found for this email. Please sign up first.");
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          throw new Error("Incorrect password.");
        }

        if (!user.emailVerified || user.pendingActivation) {
          throw new Error("Please finish verifying your email and phone before logging in.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // Owner sign-in via Google/Facebook: an OAuth login has no OTP step,
    // so treat it as verified automatically (they own that inbox already).
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await (prisma as any).user.update({
          where: { id: user.id },
          data: { emailVerified: new Date(), pendingActivation: false },
        }).catch(() => {});
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.phone = (user as any).phone || null;
        token.emailVerified = !!(user as any).emailVerified;
      }
      if (trigger === "update" && session) {
        if (session.phone) token.phone = session.phone;
        if (session.role) token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phone = token.phone as string | null;
        (session.user as any).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };