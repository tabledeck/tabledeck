-- Add account-synced setup presets for game launch flows.
-- Settings are stored as JSON text so each game can own its setup shape.

CREATE TABLE "SetupPreset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "gameKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "settings" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SetupPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SetupPreset_userId_idx" ON "SetupPreset"("userId");
CREATE INDEX "SetupPreset_userId_gameKey_idx" ON "SetupPreset"("userId", "gameKey");
