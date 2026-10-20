import type { Route } from "./+types/games.$gameKey.how-to-play";
import { isGameKey } from "~/domain/game-catalog";
import { gameHowToSeo, pageMeta } from "~/domain/seo";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { GamePageView } from "~/components/seo/GamePageView";

export function meta({ params }: Route.MetaArgs) {
  if (!params.gameKey || !isGameKey(params.gameKey)) {
    return [{ title: "Game not found — Tabledeck" }, { name: "robots", content: "noindex" }];
  }
  return pageMeta(gameHowToSeo(params.gameKey));
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

export default function GameHowTo({ loaderData }: Route.ComponentProps) {
  return (
    <GamePageView mode="howto" gameKey={loaderData.gameKey} user={loaderData.user} />
  );
}
