import { isbot } from "isbot";
import { createRequestHandler, RouterContextProvider } from "react-router";
import { recordPageView, shouldRecordPageView } from "../app/domain/usage-stats";

// @ts-expect-error - build output has no type declarations
const buildImport = () => import("../build/server/index.js");

function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== "www.tabledeck.us") return null;
  url.hostname = "tabledeck.us";
  return Response.redirect(url.toString(), 301);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    // Bridge Cloudflare env bindings into process.env
    Object.assign(process.env, env);

    const context = new RouterContextProvider();
    (context as any).cloudflare = { env, ctx };

    const response = await createRequestHandler(buildImport, "production")(request, context);
    const userAgent = request.headers.get("user-agent");
    if (
      env.D1_DATABASE &&
      shouldRecordPageView(request, response) &&
      !(userAgent && isbot(userAgent))
    ) {
      ctx.waitUntil(
        recordPageView(env.D1_DATABASE, request).catch(() => {
          // Missing UsageHourly (migration not applied yet) must not fail the page.
        }),
      );
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
