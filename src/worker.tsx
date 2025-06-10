import { defineApp, ErrorResponse } from "rwsdk/worker";
import { layout, route, render, prefix } from "rwsdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/home/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { type User, db, setupDb } from "@/db";
import { env } from "cloudflare:workers";
import { realtimeRoute } from "rwsdk/realtime/worker";
export { RealtimeDurableObject } from "rwsdk/realtime/durableObject";
export { SessionDurableObject } from "./session/durableObject";

import { queue } from "./queue";

// auth
import { auth } from "./lib/auth";


export type AppContext = {
  session: Session | null;
  user: User | null;
  authUrl: string;
};

const app = defineApp([
  realtimeRoute(() => env.REALTIME_DURABLE_OBJECT),
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    ctx.authUrl = env.BETTER_AUTH_URL;

    
    setupSessionStore(env);
    
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });


      if (session?.user) {
        ctx.user = {
          ...session.user,
          image: session.user.image ?? null,
          role: session.user.role ?? null,
          banned: session.user.banned ?? null,
          banReason: session.user.banReason ?? null,
          banExpires: session.user.banExpires ?? null,
          twoFactorEnabled: session.user.twoFactorEnabled ?? null
        };
      }  

        // get url of request
        
      
    } catch (error) {
      console.log("error", error);
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  // This is a hack because we are receiveing a "state_not_found" error even when logged in
  route("/api/auth/error", ({ ctx }) => {
    if (ctx.user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
    // Return a default response when user is not authenticated
    return new Response("Authentication error", {
      status: 401,
    });
  }),
  route("/api/auth/*", async ({ request }) => {
    await setupDb(env);
    return auth.handler(request);
  }),
  render(Document, [
    route("/", [Home]),
    route("/protected", [
      ({ ctx }) => {
        if (!ctx.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/user/login" },
          });
        }
      },
      Home,
    ]),
    prefix("/user", userRoutes),
  ]),
]);

export default {
  fetch: app.fetch,
  queue
}