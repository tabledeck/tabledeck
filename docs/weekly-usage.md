# Weekly usage

Games played are already stored in each game's D1 database when a room is created and, where the game records it, when the room finishes. The hub adds hourly page-view counts in `tabledeck-auth`. One authenticated request reads all of it.

Do not send mail from this app. Point a weekly automation at the endpoint below.

## Endpoint

```
GET https://tabledeck.us/api/stats/weekly
Authorization: Bearer $STATS_API_TOKEN
```

`STATS_API_TOKEN` is a Worker secret on the `tabledeck` Worker (the hub), not a var in `wrangler.jsonc`.

```bash
npx wrangler secret put STATS_API_TOKEN
curl -sS https://tabledeck.us/api/stats/weekly \
  -H "Authorization: Bearer $STATS_API_TOKEN"
```

The response is JSON, `Cache-Control: no-store`. Times are UTC.

- `last7Days` / `prior7Days` are the rolling windows `[now-7d, now)` and `[now-14d, now-7d)`.
- `hub` is the `tabledeck-auth` database (binding `D1_DATABASE`): page views, signups, sessions started, distinct signed-in users.
- `games[]` is one object per game. `roomsOpened` counts `Game` rows created in the window (one row is one room). `gamesStarted` counts those rooms whose `status` is `active` or `finished`. `gamesCompleted` counts rows whose `finishedAt` is in the window. `uniqueRooms` equals `roomsOpened`. `uniquePlayers` is present when the game stores players.
- `totals` sums the games that answered. A person in two games is counted twice. `gamesCompleted` ignores games that do not store `finishedAt`.
- `available: false` means that database could not be read. The HTTP status is still 200 so the rest of the week is usable.

Page views are UTC hour buckets in `UsageHourly`. The latest window includes the start hour through the current hour. The prior window stops before the start hour, so that hour is not counted twice. Crawlers, prefetch, and `/api` requests are not recorded. Page views only cover hosts this Worker serves (`tabledeck.us` after `www` redirects). Subdomain usage is the game rows, not HTML hits.

### What each game stores

| Database | Binding | Started | Completed | Players |
| --- | --- | --- | --- | --- |
| `skull-king` | `SKULL_KING_DB` | `status` in `active`, `finished` | `finishedAt` | user id, else guest name |
| `kings-cribbage` | `KINGS_CRIBBAGE_DB` | same | `finishedAt` | user id, else guest name |
| `battleship` | `BATTLESHIP_DB` | same | `finishedAt` | user id, else guest name |
| `scoreboard` | `SCOREBOARD_DB` | same (`active` is the default) | `finishedAt` | distinct display names |
| `game-of-things` | `GAME_OF_THINGS_DB` | same as rooms opened (no status column) | not stored | not stored |

Scoreboard names can collide. Game of Things keeps the room, host name, and topic only.

## Read it with SQL

Use these when you query D1 directly. Replace the window if you need a fixed range. `datetime('now', '-7 days')` returns `YYYY-MM-DD HH:MM:SS`, which matches the `replace(substr(...))` normalization (ISO strings and SQLite datetimes).

Hub, database name `tabledeck-auth`:

```sql
-- page views, last 7 UTC hours through the current hour
SELECT COALESCE(SUM(views), 0) AS pageViews
FROM "UsageHourly"
WHERE hour >= strftime('%Y-%m-%dT%H', 'now', '-7 days')
  AND hour <= strftime('%Y-%m-%dT%H', 'now');

-- page views, the prior 7 days, ending before the boundary hour
SELECT COALESCE(SUM(views), 0) AS pageViews
FROM "UsageHourly"
WHERE hour >= strftime('%Y-%m-%dT%H', 'now', '-14 days')
  AND hour < strftime('%Y-%m-%dT%H', 'now', '-7 days');

SELECT COUNT(*) AS signups
FROM "User"
WHERE replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');

SELECT COUNT(*) AS sessionsStarted
FROM "Session"
WHERE replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');

SELECT COUNT(DISTINCT userId) AS uniqueSignedInUsers
FROM "Session"
WHERE replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');
```

For the prior 7 days, change `'-7 days'` to `'-14 days'` and `'now'` to `datetime('now', '-7 days')`.

Per game database (`skull-king`, `kings-cribbage`, `battleship`, `scoreboard`):

```sql
SELECT COUNT(*) AS roomsOpened
FROM "Game"
WHERE replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');

SELECT COUNT(*) AS gamesStarted
FROM "Game"
WHERE status IN ('active', 'finished')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');

SELECT COUNT(*) AS gamesCompleted
FROM "Game"
WHERE finishedAt IS NOT NULL
  AND replace(substr(finishedAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(finishedAt, 1, 19), 'T', ' ') < datetime('now');
```

Players on `skull-king`, `kings-cribbage`, and `battleship`:

```sql
SELECT COUNT(DISTINCT CASE
  WHEN gp.userId IS NOT NULL AND trim(gp.userId) != '' THEN 'u:' || gp.userId
  WHEN gp.guestName IS NOT NULL AND trim(gp.guestName) != '' THEN 'g:' || gp.guestName
  ELSE 'p:' || gp.id
END) AS uniquePlayers
FROM "GamePlayer" gp
INNER JOIN "Game" g ON g.id = gp.gameId
WHERE replace(substr(g.createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(g.createdAt, 1, 19), 'T', ' ') < datetime('now');
```

Players on `scoreboard` (display names):

```sql
SELECT COUNT(DISTINCT gp.name) AS uniquePlayers
FROM "GamePlayer" gp
INNER JOIN "Game" g ON g.id = gp.gameId
WHERE replace(substr(g.createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days')
  AND replace(substr(g.createdAt, 1, 19), 'T', ' ') < datetime('now');
```

`game-of-things` only has rooms opened. Use the `roomsOpened` query. There is no `status`, `finishedAt`, or `GamePlayer` table.

```bash
npx wrangler d1 execute tabledeck-auth --remote --command "SELECT COALESCE(SUM(views), 0) AS pageViews FROM UsageHourly WHERE hour >= strftime('%Y-%m-%dT%H', 'now', '-7 days') AND hour <= strftime('%Y-%m-%dT%H', 'now');"
npx wrangler d1 execute skull-king --remote --command "SELECT COUNT(*) AS roomsOpened FROM Game WHERE replace(substr(createdAt, 1, 19), 'T', ' ') >= datetime('now', '-7 days') AND replace(substr(createdAt, 1, 19), 'T', ' ') < datetime('now');"
```

## Setup

1. Apply migrations to the remote hub database so `UsageHourly` exists: `npm run d1:migrate` (database name `tabledeck-auth`).
2. Set the secret: `npx wrangler secret put STATS_API_TOKEN`.
3. Deploy the hub Worker.

Game databases already exist and are bound on the hub. No new game migration is required.

## Search Console

Verify these properties, then submit `https://tabledeck.us/sitemap.xml` on each of them. Google allows one sitemap to list URLs from several verified sites.

- `https://tabledeck.us/`
- `https://www.tabledeck.us/` (redirects to the apex)
- `https://skull.tabledeck.us`
- `https://kingscrib.tabledeck.us`
- `https://battleship.tabledeck.us`
- `https://things.tabledeck.us`
- `https://score.tabledeck.us`

Skull King, King's Cribbage, and Battleship also publish their own `robots.txt` and `sitemap.xml`. The Game of Things and Scoreboard Workers do not, so the hub sitemap is how those homepages are listed. Guides and how-to-play pages live on `https://tabledeck.us/games`.
