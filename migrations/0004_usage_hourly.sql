-- Hub page views, bucketed by UTC hour so a weekly report can compare
-- the last 7 days with the prior 7 days without storing one row per hit.
-- Game rows stay in each game's own D1 database; this table is only the hub.

CREATE TABLE "UsageHourly" (
  "hour" TEXT NOT NULL,
  "host" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("hour", "host", "path")
);

CREATE INDEX "UsageHourly_hour_idx" ON "UsageHourly"("hour");
