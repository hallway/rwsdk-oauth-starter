import { defineApp, ErrorResponse } from "rwsdk/worker";
import { layout, route, render, prefix } from "rwsdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { type User, db, setupDb } from "@/db";
import { env } from "cloudflare:workers";
import { realtimeRoute } from "rwsdk/realtime/worker";
export { RealtimeDurableObject } from "rwsdk/realtime/durableObject";
export { SessionDurableObject } from "./session/durableObject";

// auth
import { auth, createAuth } from "./lib/auth";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  realtimeRoute(() => env.REALTIME_DURABLE_OBJECT),
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);
    createAuth(env);
    

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (session?.user) {
        ctx.user = {
          ...session.user,
          image: session.user.image ?? null,
        };
      }
    } catch (error) {
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
  route("/api/auth/*", ({ request }) => {
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
