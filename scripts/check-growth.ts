import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { PUBLIC_HOSTS } from "../app/domain/site.ts";
import { sitemapEntries, sitemapXml } from "../app/domain/seo.ts";
import {
  GAME_STAT_SOURCES,
  USAGE_SQL,
  hourKey,
  queryGameUsage,
  queryHubUsage,
  rollingWindows,
  sqlStamp,
  type Queryable,
} from "../app/domain/usage-stats.ts";

function asDb(db: DatabaseSync): Queryable {
  return {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          const statement = db.prepare(sql);
          return {
            async first<T>() {
              return (statement.get(...(values as Array<string | number | null>)) as T | undefined) ?? null;
            },
            async run() {
              statement.run(...(values as Array<string | number | null>));
            },
          };
        },
      };
    },
  };
}

const now = new Date("2026-10-20T12:00:00.000Z");
const windows = rollingWindows(now);
assert.equal(sqlStamp(windows.lastStart), "2026-10-13 12:00:00");
assert.equal(sqlStamp(windows.priorStart), "2026-10-06 12:00:00");
assert.equal(hourKey(windows.lastStart), "2026-10-13T12");

const locs = sitemapEntries().map((entry) => entry.loc);
for (const host of PUBLIC_HOSTS) {
  if (host.host === "www.tabledeck.us") continue;
  assert.ok(
    locs.some((loc) => loc.startsWith(host.url.replace(/\/$/, "")) || loc === host.url || loc.startsWith(`https://${host.host}`)),
    `sitemap missing ${host.host}`,
  );
}
assert.ok(locs.includes("https://tabledeck.us/"));
assert.ok(locs.includes("https://tabledeck.us/games"));
assert.ok(locs.includes("https://tabledeck.us/games/skull-king"));
assert.ok(locs.includes("https://tabledeck.us/games/skull-king/how-to-play"));
assert.ok(locs.includes("https://skull.tabledeck.us"));
assert.ok(locs.includes("https://things.tabledeck.us"));
assert.ok(locs.includes("https://score.tabledeck.us"));
const xml = sitemapXml();
assert.ok(xml.includes("<loc>https://kingscrib.tabledeck.us</loc>"));
assert.ok(xml.includes("<loc>https://battleship.tabledeck.us</loc>"));
assert.equal(locs.length, 2 + 5 * 2 + 5);

const game = new DatabaseSync(":memory:");
game.exec(`
  CREATE TABLE "Game" (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'waiting',
    createdAt TEXT NOT NULL,
    finishedAt TEXT
  );
  CREATE TABLE "GamePlayer" (
    id TEXT PRIMARY KEY,
    gameId TEXT NOT NULL,
    userId TEXT,
    guestName TEXT,
    name TEXT
  );
`);
game.exec(`
  INSERT INTO Game (id, status, createdAt, finishedAt) VALUES
    ('room-old', 'finished', '2026-10-01T00:00:00.000Z', '2026-10-01 01:00:00'),
    ('room-prior', 'finished', '2026-10-07 13:00:00', '2026-10-08T15:00:00.000Z'),
    ('room-lobby', 'waiting', '2026-10-14T08:00:00.000Z', NULL),
    ('room-last', 'active', '2026-10-15 09:00:00', NULL),
    ('room-done', 'finished', '2026-10-18T11:00:00.000Z', '2026-10-19 18:30:00');
  INSERT INTO GamePlayer (id, gameId, userId, guestName, name) VALUES
    ('p1', 'room-last', 'user-a', NULL, 'Ada'),
    ('p2', 'room-last', NULL, 'Guest-1', 'Bea'),
    ('p3', 'room-done', 'user-a', NULL, 'Ada'),
    ('p4', 'room-done', NULL, 'Guest-2', 'Cy'),
    ('p5', 'room-prior', 'user-z', NULL, 'Zed'),
    ('p6', 'room-lobby', NULL, 'Guest-1', 'Dee');
`);

const skull = GAME_STAT_SOURCES.find((source) => source.gameKey === "skull-king")!;
const skullReport = await queryGameUsage(asDb(game), skull, windows);
assert.equal(skullReport.available, true);
assert.equal(skullReport.roomsOpened.last7Days, 3);
assert.equal(skullReport.roomsOpened.prior7Days, 1);
assert.equal(skullReport.gamesStarted.last7Days, 2);
assert.equal(skullReport.gamesStarted.prior7Days, 1);
assert.equal(skullReport.gamesCompleted.last7Days, 1);
assert.equal(skullReport.gamesCompleted.prior7Days, 1);
assert.equal(skullReport.uniqueRooms.last7Days, 3);
assert.equal(skullReport.uniquePlayers.last7Days, 3);
assert.equal(skullReport.uniquePlayers.prior7Days, 1);

const things = GAME_STAT_SOURCES.find((source) => source.gameKey === "game-of-things")!;
const thingsDb = new DatabaseSync(":memory:");
thingsDb.exec(`CREATE TABLE "Game" (id TEXT PRIMARY KEY, createdAt TEXT NOT NULL);`);
thingsDb.exec(`INSERT INTO Game (id, createdAt) VALUES ('t1', '2026-10-16T00:00:00.000Z');`);
const thingsReport = await queryGameUsage(asDb(thingsDb), things, windows);
assert.equal(thingsReport.roomsOpened.last7Days, 1);
assert.equal(thingsReport.gamesStarted.last7Days, 1);
assert.equal(thingsReport.gamesCompleted.last7Days, null);
assert.equal(thingsReport.uniquePlayers.last7Days, null);

const score = GAME_STAT_SOURCES.find((source) => source.gameKey === "scoreboard")!;
const scoreReport = await queryGameUsage(asDb(game), score, windows);
assert.equal(scoreReport.uniquePlayers.last7Days, 4);

const hub = new DatabaseSync(":memory:");
hub.exec(`
  CREATE TABLE "UsageHourly" (
    hour TEXT NOT NULL,
    host TEXT NOT NULL,
    path TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour, host, path)
  );
  CREATE TABLE "User" (id TEXT PRIMARY KEY, createdAt TEXT NOT NULL);
  CREATE TABLE "Session" (id TEXT PRIMARY KEY, userId TEXT NOT NULL, createdAt TEXT NOT NULL);
`);
const viewDb = asDb(hub);
await viewDb.prepare(USAGE_SQL.recordPageView).bind("2026-10-14T01", "tabledeck.us", "/").run();
await viewDb.prepare(USAGE_SQL.recordPageView).bind("2026-10-14T01", "tabledeck.us", "/").run();
await viewDb.prepare(USAGE_SQL.recordPageView).bind("2026-10-10T01", "tabledeck.us", "/games").run();
await viewDb.prepare(USAGE_SQL.recordPageView).bind("2026-10-01T01", "tabledeck.us", "/").run();
hub.exec(`
  INSERT INTO User (id, createdAt) VALUES
    ('u1', '2026-10-14T00:00:00.000Z'),
    ('u2', '2026-10-08 00:00:00');
  INSERT INTO Session (id, userId, createdAt) VALUES
    ('s1', 'u1', '2026-10-14T01:00:00.000Z'),
    ('s2', 'u1', '2026-10-16T01:00:00.000Z'),
    ('s3', 'u2', '2026-10-09T01:00:00.000Z');
`);
const hubReport = await queryHubUsage(asDb(hub), windows);
assert.equal(hubReport.available, true);
assert.equal(hubReport.pageViews.last7Days, 2);
assert.equal(hubReport.pageViews.prior7Days, 1);
assert.equal(hubReport.signups.last7Days, 1);
assert.equal(hubReport.signups.prior7Days, 1);
assert.equal(hubReport.sessionsStarted.last7Days, 2);
assert.equal(hubReport.uniqueSignedInUsers.last7Days, 1);

const missing = new DatabaseSync(":memory:");
const missingReport = await queryHubUsage(asDb(missing), windows);
assert.equal(missingReport.available, false);
assert.match(missingReport.error ?? "", /UsageHourly|no such table|User/i);

console.log("growth checks ok");
