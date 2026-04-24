-- Add hub-level favorites so the main Tabledeck account can keep a persistent
-- shelf of preferred games across subdomains.

CREATE TABLE "FavoriteGame" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "gameKey" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FavoriteGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "FavoriteGame_userId_gameKey_key" ON "FavoriteGame"("userId", "gameKey");
CREATE INDEX "FavoriteGame_userId_idx" ON "FavoriteGame"("userId");
