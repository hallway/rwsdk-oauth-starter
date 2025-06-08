import { createAuthClient } from "better-auth/react";

export const setupAuthClient = (baseUrl: string) =>
  createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: baseUrl,
    basePath: "/api/auth",
  });
