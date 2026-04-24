export const GAMES = [
  {
    id: "skull-king",
    title: "Skull King",
    description: "Real-time trick-taking for 2–8 players",
    href: "https://skull.tabledeck.us",
    live: true,
  },
  {
    id: "kings-cribbage",
    title: "King's Cribbage",
    description: "Classic cribbage, played online with friends",
    href: "https://kingscrib.tabledeck.us",
    live: true,
  },
  {
    id: "battleship",
    title: "Battleship",
    description: "Naval strategy — sink the fleet before they sink yours",
    href: "https://battleship.tabledeck.us",
    live: true,
  },
  {
    id: "game-of-things",
    title: "Game of Things",
    description: "The party game of outrageous answers",
    href: "https://things.tabledeck.us",
    live: true,
  },
  {
    id: "scoreboard",
    title: "Scoreboard",
    description: "Live scores for any game — hearts, golf, anything with rounds",
    href: "https://score.tabledeck.us",
    live: true,
  },
] as const;

export type GameDefinition = (typeof GAMES)[number];
export type GameKey = GameDefinition["id"];

export const GAME_CATALOG = Object.fromEntries(
  GAMES.map((game) => [game.id, game]),
) as Record<GameKey, GameDefinition>;

export function isGameKey(value: string): value is GameKey {
  return value in GAME_CATALOG;
}

export const RECENT_TABLE_SOURCES = [
  {
    gameKey: "skull-king",
    binding: "SKULL_KING_DB",
  },
  {
    gameKey: "kings-cribbage",
    binding: "KINGS_CRIBBAGE_DB",
  },
  {
    gameKey: "battleship",
    binding: "BATTLESHIP_DB",
  },
] as const satisfies ReadonlyArray<{
  gameKey: GameKey;
  binding: keyof Pick<Env, "SKULL_KING_DB" | "KINGS_CRIBBAGE_DB" | "BATTLESHIP_DB">;
}>;
