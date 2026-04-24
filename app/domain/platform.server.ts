import {
  GAME_CATALOG,
  RECENT_TABLE_SOURCES,
  isGameKey,
  type GameKey,
} from "./game-catalog";
import type {
  AccountDashboardData,
  JsonValue,
  SetupPreset,
  SetupPresetInput,
  UserTableSummary,
} from "./platform-shared";

interface FavoriteGameRow {
  gameKey: string;
}

interface SetupPresetRow {
  id: string;
  gameKey: string;
  name: string;
  settings: string;
  createdAt: string;
  updatedAt: string;
}

interface RecentTableRow {
  gameId: string;
  status: string;
  createdAt: string;
  finishedAt: string | null;
  seat: number;
  maxPlayers: number | null;
}

const USER_TABLE_QUERY = `
  SELECT
    g.id AS gameId,
    g.status AS status,
    g.createdAt AS createdAt,
    g.finishedAt AS finishedAt,
    g.maxPlayers AS maxPlayers,
    gp.seat AS seat
  FROM "GamePlayer" gp
  INNER JOIN "Game" g ON g.id = gp.gameId
  WHERE gp.userId = ?
  ORDER BY COALESCE(g.finishedAt, g.createdAt) DESC
  LIMIT ?
`;

const SETUP_PRESET_COLUMNS = `
  id,
  gameKey,
  name,
  settings,
  createdAt,
  updatedAt
`;

function formatStatusLabel(status: string): string {
  if (status === "waiting") return "Gathering players";
  if (status === "active") return "In progress";
  if (status === "finished") return "Finished";
  return status;
}

function formatActivityAt(rawValue: string | null): string {
  if (!rawValue) return "Recently";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getHubDb(context: any): D1Database | undefined {
  return context?.cloudflare?.env?.D1_DATABASE as D1Database | undefined;
}

function parsePresetSettings(rawValue: string): JsonValue {
  try {
    return JSON.parse(rawValue) as JsonValue;
  } catch {
    return {};
  }
}

function mapSetupPresetRow(row: SetupPresetRow): SetupPreset | null {
  if (!isGameKey(row.gameKey)) return null;

  return {
    id: row.id,
    gameKey: row.gameKey,
    name: row.name,
    settings: parsePresetSettings(row.settings),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function listFavoriteGameKeys(context: any, userId: string): Promise<GameKey[]> {
  const db = getHubDb(context);
  if (!db) return [];

  try {
    const result = await db
      .prepare(
        `
          SELECT gameKey
          FROM "FavoriteGame"
          WHERE userId = ?
          ORDER BY createdAt DESC
        `,
      )
      .bind(userId)
      .all<FavoriteGameRow>();

    const rows = (result.results ?? []) as FavoriteGameRow[];
    return rows
      .map((row: FavoriteGameRow) => row.gameKey)
      .filter(isGameKey);
  } catch {
    return [];
  }
}

async function listRecentTablesForGame(
  context: any,
  userId: string,
  source: (typeof RECENT_TABLE_SOURCES)[number],
  limitPerGame: number,
): Promise<UserTableSummary[]> {
  const db = context?.cloudflare?.env?.[source.binding] as D1Database | undefined;
  if (!db) return [];

  const queryResult = await db.prepare(USER_TABLE_QUERY).bind(userId, limitPerGame).all<RecentTableRow>();
  const game = GAME_CATALOG[source.gameKey];

  return (queryResult.results ?? []).map((row) => {
    const activityAt = row.finishedAt ?? row.createdAt;
    return {
      gameKey: source.gameKey,
      gameTitle: game.title,
      gameHref: game.href,
      tableId: row.gameId,
      tableHref: `${game.href}/game/${row.gameId}`,
      status: row.status,
      statusLabel: formatStatusLabel(row.status),
      seat: row.seat,
      seatLabel: `Seat ${row.seat + 1}`,
      maxPlayers: row.maxPlayers,
      canRejoin: row.status !== "finished",
      activityAt,
      activityLabel: formatActivityAt(activityAt),
    };
  });
}

export async function getAccountDashboardData(
  context: any,
  userId: string,
): Promise<AccountDashboardData> {
  const favoriteGameKeys = await listFavoriteGameKeys(context, userId);
  const favoriteGames = favoriteGameKeys.map((gameKey) => GAME_CATALOG[gameKey]);

  const recentTables = (
    await Promise.all(
      RECENT_TABLE_SOURCES.map(async (source) => {
        try {
          return await listRecentTablesForGame(context, userId, source, 6);
        } catch {
          return [];
        }
      }),
    )
  )
    .flat()
    .sort((left, right) => right.activityAt.localeCompare(left.activityAt))
    .slice(0, 8);

  return {
    favoriteGameKeys,
    favoriteGames,
    activeTables: recentTables.filter((table) => table.canRejoin).slice(0, 4),
    recentTables,
  };
}

export async function setFavoriteGame(
  context: any,
  userId: string,
  gameKey: GameKey,
  favorite: boolean,
): Promise<boolean> {
  const db = context?.cloudflare?.env?.D1_DATABASE;
  if (!db) return false;

  if (favorite) {
    await db
      .prepare(
        `
          INSERT OR IGNORE INTO "FavoriteGame" ("id", "userId", "gameKey")
          VALUES (?, ?, ?)
        `,
      )
      .bind(crypto.randomUUID(), userId, gameKey)
      .run();
    return true;
  }

  await db
    .prepare(
      `
        DELETE FROM "FavoriteGame"
        WHERE userId = ? AND gameKey = ?
      `,
    )
    .bind(userId, gameKey)
    .run();
  return false;
}

export async function listSetupPresets(
  context: any,
  userId: string,
  gameKey?: GameKey,
): Promise<SetupPreset[]> {
  const db = getHubDb(context);
  if (!db) return [];

  const result = gameKey
    ? await db
        .prepare(
          `
            SELECT ${SETUP_PRESET_COLUMNS}
            FROM "SetupPreset"
            WHERE userId = ? AND gameKey = ?
            ORDER BY updatedAt DESC, createdAt DESC
          `,
        )
        .bind(userId, gameKey)
        .all<SetupPresetRow>()
    : await db
        .prepare(
          `
            SELECT ${SETUP_PRESET_COLUMNS}
            FROM "SetupPreset"
            WHERE userId = ?
            ORDER BY updatedAt DESC, createdAt DESC
          `,
        )
        .bind(userId)
        .all<SetupPresetRow>();

  return (result.results ?? [])
    .map((row) => mapSetupPresetRow(row))
    .filter((preset): preset is SetupPreset => preset !== null);
}

export async function createSetupPreset(
  context: any,
  userId: string,
  input: SetupPresetInput,
): Promise<SetupPreset | null> {
  const db = getHubDb(context);
  if (!db) return null;

  const id = crypto.randomUUID();
  await db
    .prepare(
      `
        INSERT INTO "SetupPreset" ("id", "userId", "gameKey", "name", "settings")
        VALUES (?, ?, ?, ?, ?)
      `,
    )
    .bind(id, userId, input.gameKey, input.name, JSON.stringify(input.settings))
    .run();

  return getSetupPreset(context, userId, id);
}

export async function updateSetupPreset(
  context: any,
  userId: string,
  presetId: string,
  input: SetupPresetInput,
): Promise<SetupPreset | null> {
  const db = getHubDb(context);
  if (!db) return null;

  await db
    .prepare(
      `
        UPDATE "SetupPreset"
        SET gameKey = ?, name = ?, settings = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND userId = ?
      `,
    )
    .bind(input.gameKey, input.name, JSON.stringify(input.settings), presetId, userId)
    .run();

  return getSetupPreset(context, userId, presetId);
}

export async function deleteSetupPreset(
  context: any,
  userId: string,
  presetId: string,
): Promise<boolean> {
  const db = getHubDb(context);
  if (!db) return false;

  const result = await db
    .prepare(
      `
        DELETE FROM "SetupPreset"
        WHERE id = ? AND userId = ?
      `,
    )
    .bind(presetId, userId)
    .run();

  return (result.meta.changes ?? 0) > 0;
}

async function getSetupPreset(
  context: any,
  userId: string,
  presetId: string,
): Promise<SetupPreset | null> {
  const db = getHubDb(context);
  if (!db) return null;

  const row = await db
    .prepare(
      `
        SELECT ${SETUP_PRESET_COLUMNS}
        FROM "SetupPreset"
        WHERE id = ? AND userId = ?
      `,
    )
    .bind(presetId, userId)
    .first<SetupPresetRow>();

  return row ? mapSetupPresetRow(row) : null;
}
