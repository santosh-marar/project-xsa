import { PrismaAdapter } from "@auth/prisma-adapter";
import { User, type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";
import { USER_ROLE } from "@/constants";



/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      // id: string;
      // ...other properties
      role: USER_ROLE[];
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  adapter: PrismaAdapter(db),
  // secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [GoogleProvider],

  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Fetch and store only role names in the token
        const userWithRoles = await db.user.findUnique({
          where: { id: user.id },
          include: { roles: true },
        });

        token.roles = userWithRoles?.roles.map((role) => role.name) || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.roles as USER_ROLE[];
      }
      return session;
    },
  },
  events: {
    async createUser(message: { user: User }) {
      try {
        // Get or create the default user role
        let userRole = await db.role.findUnique({
          where: { name: "user" },
        });

        if (!userRole) {
          userRole = await db.role.create({
            data: {
              name: "user",
              description: "Default role for new users",
            },
          });
        }

        // Assign the role to the new user
        await db.user.update({
          where: { id: message.user.id },
          data: {
            roles: {
              connect: { id: userRole.id },
            },
          },
        });
      } catch (error) {
        console.error("Error assigning role to new user:", error);
      }
    },
  },
} satisfies NextAuthConfig;
