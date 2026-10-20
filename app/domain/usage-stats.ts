import { GAME_CATALOG, type GameKey } from "./game-catalog";

/** Compare timestamps stored as either "YYYY-MM-DD HH:MM:SS" or ISO-8601. */
export function stampExpr(column: string): string {
  return `replace(substr(${column}, 1, 19), 'T', ' ')`;
}

export function sqlStamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

/** UTC hour bucket key, "YYYY-MM-DDTHH", which sorts lexicographically. */
export function hourKey(date: Date): string {
  return date.toISOString().slice(0, 13);
}

export interface PeriodCount {
  last7Days: number | null;
  prior7Days: number | null;
}

export interface RollingWindows {
  generatedAt: string;
  last7Days: { start: string; end: string };
  prior7Days: { start: string; end: string };
  lastStart: Date;
  lastEnd: Date;
  priorStart: Date;
  priorEnd: Date;
}

export function rollingWindows(now = new Date()): RollingWindows {
  const lastEnd = now;
  const lastStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const priorStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  return {
    generatedAt: now.toISOString(),
    last7Days: { start: lastStart.toISOString(), end: lastEnd.toISOString() },
    prior7Days: { start: priorStart.toISOString(), end: lastStart.toISOString() },
    lastStart,
    lastEnd,
    priorStart,
    priorEnd: lastStart,
  };
}

const between = (column: string) =>
  `${stampExpr(column)} >= ? AND ${stampExpr(column)} < ?`;

export const USAGE_SQL = {
  roomsOpened: `SELECT COUNT(*) AS n FROM "Game" WHERE ${between("createdAt")}`,
  gamesStarted: `SELECT COUNT(*) AS n FROM "Game" WHERE status IN ('active', 'finished') AND ${between("createdAt")}`,
  gamesCompleted: `SELECT COUNT(*) AS n FROM "Game" WHERE finishedAt IS NOT NULL AND ${between("finishedAt")}`,
  uniquePlayersAccount: `SELECT COUNT(DISTINCT CASE WHEN gp.userId IS NOT NULL AND trim(gp.userId) != '' THEN 'u:' || gp.userId WHEN gp.guestName IS NOT NULL AND trim(gp.guestName) != '' THEN 'g:' || gp.guestName ELSE 'p:' || gp.id END) AS n FROM "GamePlayer" gp INNER JOIN "Game" g ON g.id = gp.gameId WHERE ${between("g.createdAt")}`,
  uniquePlayersName: `SELECT COUNT(DISTINCT gp.name) AS n FROM "GamePlayer" gp INNER JOIN "Game" g ON g.id = gp.gameId WHERE ${between("g.createdAt")}`,
  pageViewsInclusive: `SELECT COALESCE(SUM(views), 0) AS n FROM "UsageHourly" WHERE hour >= ? AND hour <= ?`,
  pageViewsEndExclusive: `SELECT COALESCE(SUM(views), 0) AS n FROM "UsageHourly" WHERE hour >= ? AND hour < ?`,
  signups: `SELECT COUNT(*) AS n FROM "User" WHERE ${between("createdAt")}`,
  sessionsStarted: `SELECT COUNT(*) AS n FROM "Session" WHERE ${between("createdAt")}`,
  uniqueSignedInUsers: `SELECT COUNT(DISTINCT userId) AS n FROM "Session" WHERE ${between("createdAt")}`,
  recordPageView: `INSERT INTO "UsageHourly" ("hour", "host", "path", "views") VALUES (?, ?, ?, 1) ON CONFLICT("hour", "host", "path") DO UPDATE SET "views" = "views" + 1`,
} as const;

export type PlayerIdentity = "account" | "name" | "none";

export interface GameStatSource {
  gameKey: GameKey;
  binding: "SKULL_KING_DB" | "KINGS_CRIBBAGE_DB" | "BATTLESHIP_DB" | "SCOREBOARD_DB" | "GAME_OF_THINGS_DB";
  databaseName: string;
  players: PlayerIdentity;
  /** status column distinguishes a lobby from a game that left it. */
  hasStatus: boolean;
  hasFinishedAt: boolean;
}

export const GAME_STAT_SOURCES: readonly GameStatSource[] = [
  {
    gameKey: "skull-king",
    binding: "SKULL_KING_DB",
    databaseName: "skull-king",
    players: "account",
    hasStatus: true,
    hasFinishedAt: true,
  },
  {
    gameKey: "kings-cribbage",
    binding: "KINGS_CRIBBAGE_DB",
    databaseName: "kings-cribbage",
    players: "account",
    hasStatus: true,
    hasFinishedAt: true,
  },
  {
    gameKey: "battleship",
    binding: "BATTLESHIP_DB",
    databaseName: "battleship",
    players: "account",
    hasStatus: true,
    hasFinishedAt: true,
  },
  {
    gameKey: "scoreboard",
    binding: "SCOREBOARD_DB",
    databaseName: "scoreboard",
    players: "name",
    hasStatus: true,
    hasFinishedAt: true,
  },
  {
    gameKey: "game-of-things",
    binding: "GAME_OF_THINGS_DB",
    databaseName: "game-of-things",
    players: "none",
    hasStatus: false,
    hasFinishedAt: false,
  },
];

export interface Queryable {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

async function scalar(db: Queryable, sql: string, binds: unknown[]): Promise<number> {
  const row = await db.prepare(sql).bind(...binds).first<{ n: number | string | null }>();
  if (row?.n == null) return 0;
  const value = Number(row.n);
  return Number.isFinite(value) ? value : 0;
}

function period(last: number | null, prior: number | null): PeriodCount {
  return { last7Days: last, prior7Days: prior };
}

function stamps(window: { start: Date; end: Date }): [string, string] {
  return [sqlStamp(window.start), sqlStamp(window.end)];
}

export interface GameUsage {
  gameKey: GameKey;
  title: string;
  playUrl: string;
  databaseName: string;
  binding: string;
  available: boolean;
  error: string | null;
  roomsOpened: PeriodCount;
  gamesStarted: PeriodCount;
  gamesCompleted: PeriodCount;
  uniqueRooms: PeriodCount;
  uniquePlayers: PeriodCount;
  definitions: Record<string, string>;
  queries: Record<string, string | null>;
}

const DEFINITIONS = {
  roomsOpened:
    "Game rows whose createdAt falls in the window. Each row is one room.",
  gamesStarted:
    "Rooms opened in the window whose status is active or finished. Game of Things has no status column, so gamesStarted equals roomsOpened.",
  gamesCompleted:
    "Game rows whose finishedAt falls in the window. Null when that game does not store a finish time.",
  uniqueRooms:
    "Distinct rooms opened in the window. Equal to roomsOpened because each Game.id is one room.",
  uniquePlayers:
    "Distinct players on rooms opened in the window. Skull King, King's Cribbage, and Battleship count a signed-in user id, otherwise the guest name. Scoreboard counts distinct display names and can collide across different people who share a name. Game of Things does not store a player table.",
};

async function countWindow(
  db: Queryable,
  sql: string,
  windows: RollingWindows,
): Promise<PeriodCount> {
  const [last, prior] = await Promise.all([
    scalar(db, sql, stamps({ start: windows.lastStart, end: windows.lastEnd })),
    scalar(db, sql, stamps({ start: windows.priorStart, end: windows.priorEnd })),
  ]);
  return period(last, prior);
}

export async function queryGameUsage(
  db: Queryable | undefined,
  source: GameStatSource,
  windows: RollingWindows,
): Promise<GameUsage> {
  const game = GAME_CATALOG[source.gameKey];
  const empty = period(null, null);
  const base: GameUsage = {
    gameKey: source.gameKey,
    title: game.title,
    playUrl: game.href,
    databaseName: source.databaseName,
    binding: source.binding,
    available: false,
    error: null,
    roomsOpened: empty,
    gamesStarted: empty,
    gamesCompleted: empty,
    uniqueRooms: empty,
    uniquePlayers: empty,
    definitions: DEFINITIONS,
    queries: {
      roomsOpened: USAGE_SQL.roomsOpened,
      gamesStarted: source.hasStatus ? USAGE_SQL.gamesStarted : USAGE_SQL.roomsOpened,
      gamesCompleted: source.hasFinishedAt ? USAGE_SQL.gamesCompleted : null,
      uniquePlayers:
        source.players === "account"
          ? USAGE_SQL.uniquePlayersAccount
          : source.players === "name"
            ? USAGE_SQL.uniquePlayersName
            : null,
    },
  };

  if (!db) {
    return { ...base, error: `D1 binding ${source.binding} is not configured` };
  }

  try {
    const roomsOpened = await countWindow(db, USAGE_SQL.roomsOpened, windows);
    const gamesStarted = source.hasStatus
      ? await countWindow(db, USAGE_SQL.gamesStarted, windows)
      : roomsOpened;
    const gamesCompleted = source.hasFinishedAt
      ? await countWindow(db, USAGE_SQL.gamesCompleted, windows)
      : empty;
    const uniquePlayers =
      source.players === "account"
        ? await countWindow(db, USAGE_SQL.uniquePlayersAccount, windows)
        : source.players === "name"
          ? await countWindow(db, USAGE_SQL.uniquePlayersName, windows)
          : empty;

    return {
      ...base,
      available: true,
      roomsOpened,
      gamesStarted,
      gamesCompleted,
      uniqueRooms: roomsOpened,
      uniquePlayers,
    };
  } catch (error) {
    return {
      ...base,
      error: error instanceof Error ? error.message : "Query failed",
    };
  }
}

export interface HubUsage {
  databaseName: "tabledeck-auth";
  binding: "D1_DATABASE";
  available: boolean;
  error: string | null;
  pageViews: PeriodCount;
  signups: PeriodCount;
  sessionsStarted: PeriodCount;
  uniqueSignedInUsers: PeriodCount;
  definitions: Record<string, string>;
  queries: Record<string, string>;
}

async function hubPageViews(db: Queryable, windows: RollingWindows): Promise<PeriodCount> {
  const last = await scalar(db, USAGE_SQL.pageViewsInclusive, [
    hourKey(windows.lastStart),
    hourKey(windows.lastEnd),
  ]);
  const prior = await scalar(db, USAGE_SQL.pageViewsEndExclusive, [
    hourKey(windows.priorStart),
    hourKey(windows.priorEnd),
  ]);
  return period(last, prior);
}

export async function queryHubUsage(
  db: Queryable | undefined,
  windows: RollingWindows,
): Promise<HubUsage> {
  const queries = {
    pageViewsLast7Days: USAGE_SQL.pageViewsInclusive,
    pageViewsPrior7Days: USAGE_SQL.pageViewsEndExclusive,
    signups: USAGE_SQL.signups,
    sessionsStarted: USAGE_SQL.sessionsStarted,
    uniqueSignedInUsers: USAGE_SQL.uniqueSignedInUsers,
  };
  const definitions = {
    pageViews:
      "Human HTML document views on the hub, summed from UsageHourly. The last 7 days include the UTC hour of the window start through the current hour. The prior 7 days stop before that start hour so the boundary hour is not counted twice. Bots, prefetch, and /api requests are not recorded.",
    signups: "User rows created in the window.",
    sessionsStarted: "Session rows created in the window (a sign-in).",
    uniqueSignedInUsers: "Distinct user ids on sessions created in the window.",
  };
  const empty = period(null, null);
  const base: HubUsage = {
    databaseName: "tabledeck-auth",
    binding: "D1_DATABASE",
    available: false,
    error: null,
    pageViews: empty,
    signups: empty,
    sessionsStarted: empty,
    uniqueSignedInUsers: empty,
    definitions,
    queries,
  };

  if (!db) {
    return { ...base, error: "D1 binding D1_DATABASE is not configured" };
  }

  let pageViews = empty;
  let pageViewError: string | null = null;
  try {
    pageViews = await hubPageViews(db, windows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    pageViewError = /no such table/i.test(message)
      ? "UsageHourly is missing. Apply migration 0004_usage_hourly.sql to the tabledeck-auth D1 database."
      : message;
  }

  try {
    const [signups, sessionsStarted, uniqueSignedInUsers] = await Promise.all([
      countWindow(db, USAGE_SQL.signups, windows),
      countWindow(db, USAGE_SQL.sessionsStarted, windows),
      countWindow(db, USAGE_SQL.uniqueSignedInUsers, windows),
    ]);
    return {
      ...base,
      available: true,
      error: pageViewError,
      pageViews,
      signups,
      sessionsStarted,
      uniqueSignedInUsers,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    return {
      ...base,
      error: pageViewError ? `${pageViewError} ${message}` : message,
      pageViews,
    };
  }
}

function addCounts(values: PeriodCount[]): PeriodCount {
  let last = 0;
  let prior = 0;
  let any = false;
  for (const value of values) {
    if (value.last7Days == null && value.prior7Days == null) continue;
    any = true;
    last += value.last7Days ?? 0;
    prior += value.prior7Days ?? 0;
  }
  return any ? period(last, prior) : period(null, null);
}

export interface WeeklyUsageReport {
  generatedAt: string;
  timezone: "UTC";
  endpoint: "https://tabledeck.us/api/stats/weekly";
  last7Days: { start: string; end: string };
  prior7Days: { start: string; end: string };
  hub: HubUsage;
  games: GameUsage[];
  totals: {
    roomsOpened: PeriodCount;
    gamesStarted: PeriodCount;
    gamesCompleted: PeriodCount;
    uniqueRooms: PeriodCount;
    uniquePlayersSummedAcrossGames: PeriodCount;
    note: string;
  };
}

export async function buildWeeklyUsageReport(
  env: Env | undefined,
  now = new Date(),
): Promise<WeeklyUsageReport> {
  const windows = rollingWindows(now);
  const hub = await queryHubUsage(env?.D1_DATABASE, windows);
  const games = await Promise.all(
    GAME_STAT_SOURCES.map((source) =>
      queryGameUsage(env?.[source.binding], source, windows),
    ),
  );
  const available = games.filter((game) => game.available);

  return {
    generatedAt: windows.generatedAt,
    timezone: "UTC",
    endpoint: "https://tabledeck.us/api/stats/weekly",
    last7Days: windows.last7Days,
    prior7Days: windows.prior7Days,
    hub,
    games,
    totals: {
      roomsOpened: addCounts(available.map((game) => game.roomsOpened)),
      gamesStarted: addCounts(available.map((game) => game.gamesStarted)),
      gamesCompleted: addCounts(available.map((game) => game.gamesCompleted)),
      uniqueRooms: addCounts(available.map((game) => game.uniqueRooms)),
      uniquePlayersSummedAcrossGames: addCounts(
        available.map((game) => game.uniquePlayers),
      ),
      note: "Totals add each game's counts. A person who played two games is counted twice in uniquePlayersSummedAcrossGames. gamesCompleted skips games that do not store finishedAt.",
    },
  };
}

export function safeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let index = 0; index < length; index += 1) {
    diff |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return diff === 0;
}

export function bearerAuthorized(header: string | null, token: string): boolean {
  return safeEqual(header ?? "", `Bearer ${token}`);
}

const TRACKED_PATH = /^\/[a-z0-9\-._/~]*$/i;

export function pageViewKey(request: Request): { hour: string; host: string; path: string } | null {
  const url = new URL(request.url);
  let path = url.pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.length > 120) path = path.slice(0, 120);
  if (!TRACKED_PATH.test(path)) return null;
  return {
    hour: hourKey(new Date()),
    host: url.hostname,
    path,
  };
}

export function shouldRecordPageView(request: Request, response: Response): boolean {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return false;
  if (url.pathname === "/logout") return false;
  if (response.status >= 400) return false;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return false;
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return false;
  const purpose = `${request.headers.get("purpose") ?? ""} ${request.headers.get("sec-purpose") ?? ""}`;
  if (purpose.toLowerCase().includes("prefetch")) return false;
  return pageViewKey(request) != null;
}

export async function recordPageView(db: Queryable, request: Request): Promise<void> {
  const key = pageViewKey(request);
  if (!key) return;
  await db
    .prepare(USAGE_SQL.recordPageView)
    .bind(key.hour, key.host, key.path)
    .run();
}
