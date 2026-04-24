import {
  GAMES,
  type GameDefinition,
  type GameKey,
} from "./game-catalog";

export interface UserTableSummary {
  gameKey: GameKey;
  gameTitle: string;
  gameHref: string;
  tableId: string;
  tableHref: string;
  status: string;
  statusLabel: string;
  seat: number;
  seatLabel: string;
  maxPlayers: number | null;
  canRejoin: boolean;
  activityAt: string;
  activityLabel: string;
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface SetupPreset {
  id: string;
  gameKey: GameKey;
  name: string;
  settings: JsonValue;
  createdAt: string;
  updatedAt: string;
}

export interface SetupPresetInput {
  gameKey: GameKey;
  name: string;
  settings: JsonValue;
}

export interface AccountDashboardData {
  favoriteGameKeys: GameKey[];
  favoriteGames: GameDefinition[];
  activeTables: UserTableSummary[];
  recentTables: UserTableSummary[];
}

export function sortGamesForUser(
  favoriteGameKeys: readonly GameKey[],
): readonly GameDefinition[] {
  const favoriteSet = new Set(favoriteGameKeys);
  return [...GAMES].sort((left, right) => {
    const leftFavorite = favoriteSet.has(left.id);
    const rightFavorite = favoriteSet.has(right.id);
    if (leftFavorite === rightFavorite) return 0;
    return leftFavorite ? -1 : 1;
  });
}
