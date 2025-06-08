import { db } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
    admin as adminPlugin,
    openAPI,
    organization,
    twoFactor,
} from "better-auth/plugins";


export let auth: any;

// Create auth instance with proper database connection
export const createAuth = (env: Env) => {
  console.log('creating auth!')
  const prisma = db;
  
  auth = betterAuth({
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    databaseHooks: {
      user: {
        create: {
          before: async (user: any) => {
            console.log('user before', user)
            delete user.role;
            return user;
          },
          after: async (user: any) => {
            return user;
          },
        },
      },
    },
    appName: "FLSS",
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url, token }, request) => {
        console.log(`Verification email for ${user.email}: ${url}`);
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

  return auth;
};
