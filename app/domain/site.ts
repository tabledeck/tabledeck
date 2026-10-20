/** Canonical public hosts for Tabledeck.
 *
 * The hub Worker (this repo) serves tabledeck.us and www.tabledeck.us.
 * Each game is a separate Worker. Shared real-time rooms come from
 * @tabledeck/game-room; durable rows live in that game's D1 database.
 */
export const SITE_ORIGIN = "https://tabledeck.us";

export const PUBLIC_HOSTS = [
  {
    host: "tabledeck.us",
    url: "https://tabledeck.us/",
    serves: "Hub: game guides, accounts, and weekly usage stats",
  },
  {
    host: "www.tabledeck.us",
    url: "https://www.tabledeck.us/",
    serves: "Permanent redirect to https://tabledeck.us/",
  },
  {
    host: "skull.tabledeck.us",
    url: "https://skull.tabledeck.us",
    serves: "Skull King",
  },
  {
    host: "kingscrib.tabledeck.us",
    url: "https://kingscrib.tabledeck.us",
    serves: "King's Cribbage",
  },
  {
    host: "battleship.tabledeck.us",
    url: "https://battleship.tabledeck.us",
    serves: "Battleship",
  },
  {
    host: "things.tabledeck.us",
    url: "https://things.tabledeck.us",
    serves: "The Game of Things",
  },
  {
    host: "score.tabledeck.us",
    url: "https://score.tabledeck.us",
    serves: "Scoreboard",
  },
] as const;

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
