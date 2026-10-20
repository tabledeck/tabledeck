import type { Route } from "./+types/stats.weekly";
import { bearerAuthorized, buildWeeklyUsageReport } from "~/domain/usage-stats";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = (context as { cloudflare?: { env?: Env } }).cloudflare?.env;
  const token = env?.STATS_API_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({
        error: "STATS_API_TOKEN is not configured on the tabledeck worker.",
      }),
      { status: 503, headers: JSON_HEADERS },
    );
  }

  if (!bearerAuthorized(request.headers.get("Authorization"), token)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const report = await buildWeeklyUsageReport(env, new Date());
  return new Response(JSON.stringify(report), { status: 200, headers: JSON_HEADERS });
}
