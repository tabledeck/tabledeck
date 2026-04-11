import { createRequestHandler, RouterContextProvider } from "react-router";

// @ts-expect-error - build output has no type declarations
const buildImport = () => import("../build/server/index.js");

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Bridge Cloudflare env bindings into process.env
    Object.assign(process.env, env);

    const context = new RouterContextProvider();
    (context as any).cloudflare = { env, ctx };

    return createRequestHandler(buildImport, "production")(request, context);
  },
} satisfies ExportedHandler<Env>;
