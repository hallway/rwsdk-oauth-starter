import { db } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
    admin as adminPlugin,
    openAPI,
    organization,
    twoFactor,
} from "better-auth/plugins";
import { env } from "cloudflare:workers";
import { setupDb } from "@/db";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite"
  }),
  hooks: {
    before: async (ctx) => {
      await setupDb(env)
    },
  },
  databaseHooks: {
    before: async () => {
      await setupDb(env) // might be redundant 
    },
    verification: {
      create: {
        before: async (verification: any) => {
          console.log('verification before', verification)
          await setupDb(env);
          return verification;
        },
        after: async (verification: any) => {
          return verification;
        },
      },
    },
    user: {
      create: {
        before: async (user: any) => {
          console.log('user before', user)
          await setupDb(env) // might be redundant 
          delete user.role;
          return user;
        },
        after: async (user: any) => {
          return user;
        },
      },
    }
  },
  appName: "My app",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  socialProviders: {
    google: { 
      clientId: env.GOOGLE_CLIENT_ID as string, 
      clientSecret: env.GOOGLE_CLIENT_SECRET as string, 
    }, 
    github: { 
      clientId: env.GITHUB_CLIENT_ID as string, 
      clientSecret: env.GITHUB_CLIENT_SECRET as string, 
    },
  },
  plugins: [
    adminPlugin(),
    twoFactor(),
    organization(),
    openAPI(),
  ],
});
