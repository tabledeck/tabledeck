import { data } from "react-router";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { isGameKey } from "~/domain/game-catalog";
import { setFavoriteGame } from "~/domain/platform.server";

export async function action({
  request,
  context,
}: {
  request: Request;
  context: any;
}) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const user = getOptionalUserFromContext(context);
  if (!user) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const gameKey = formData.get("gameKey");
  const favorite = formData.get("favorite");

  if (typeof gameKey !== "string" || !isGameKey(gameKey)) {
    return data({ error: "Invalid game" }, { status: 400 });
  }

  if (favorite !== "true" && favorite !== "false") {
    return data({ error: "Invalid favorite value" }, { status: 400 });
  }

  const isFavorite = await setFavoriteGame(
    context,
    user.id,
    gameKey,
    favorite === "true",
  );

  return data({ ok: true, isFavorite });
}
