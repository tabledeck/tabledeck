import { useFetcher } from "react-router";
import type { GameKey } from "~/domain/game-catalog";

interface FavoriteGameButtonProps {
  gameKey: GameKey;
  isFavorite: boolean;
}

interface FavoriteResponse {
  ok: boolean;
  isFavorite: boolean;
}

export function FavoriteGameButton({
  gameKey,
  isFavorite,
}: FavoriteGameButtonProps) {
  const fetcher = useFetcher<FavoriteResponse>();
  const pendingFavorite =
    fetcher.formData?.get("favorite") === "true"
      ? true
      : fetcher.formData?.get("favorite") === "false"
        ? false
        : null;
  const resolvedFavorite =
    pendingFavorite ?? fetcher.data?.isFavorite ?? isFavorite;

  return (
    <fetcher.Form method="post" action="/api/account/favorites">
      <input type="hidden" name="gameKey" value={gameKey} />
      <input
        type="hidden"
        name="favorite"
        value={String(!resolvedFavorite)}
      />
      <button
        type="submit"
        className="td-btn-secondary"
        disabled={fetcher.state !== "idle"}
        style={{
          fontSize: "10.5px",
          padding: "6px 12px",
          opacity: fetcher.state === "idle" ? 1 : 0.75,
        }}
      >
        {resolvedFavorite ? "Favorited" : "Favorite"}
      </button>
    </fetcher.Form>
  );
}
