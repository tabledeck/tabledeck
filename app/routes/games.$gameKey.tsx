import type { Route } from "./+types/games.$gameKey";
import { isGameKey } from "~/domain/game-catalog";
import { gameLandingSeo, pageMeta } from "~/domain/seo";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { GamePageView } from "~/components/seo/GamePageView";

export function meta({ params }: Route.MetaArgs) {
  if (!params.gameKey || !isGameKey(params.gameKey)) {
    return [{ title: "Game not found — Tabledeck" }, { name: "robots", content: "noindex" }];
  }
  return pageMeta(gameLandingSeo(params.gameKey));
}

export async function loader({ params, context }: Route.LoaderArgs) {
  if (!params.gameKey || !isGameKey(params.gameKey)) {
    throw new Response("Not found", { status: 404 });
  }
  const user = getOptionalUserFromContext(context);
  return {
    gameKey: params.gameKey,
    user: user ? { name: user.name, email: user.email } : null,
  };
}

export default function GameLanding({ loaderData }: Route.ComponentProps) {
  return (
    <GamePageView mode="landing" gameKey={loaderData.gameKey} user={loaderData.user} />
  );
}
