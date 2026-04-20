import { redirect } from "react-router";
import type { Route } from "./+types/profile";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { CardFanIcon } from "~/components/crests/CardFanIcon";
import { SkullKingCrest } from "~/components/crests/SkullKingCrest";
import { KingsCribbageCrest } from "~/components/crests/KingsCribbageCrest";
import { BattleshipCrest } from "~/components/crests/BattleshipCrest";
import { GameOfThingsCrest } from "~/components/crests/GameOfThingsCrest";
import { ScoreboardCrest } from "~/components/crests/ScoreboardCrest";

export function meta() {
  return [{ title: "Profile — Tabledeck" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  if (!user) throw redirect("/login");
  return { user: { name: user.name, email: user.email } };
}

const GAMES = [
  {
    id: "skull-king",
    title: "Skull King",
    description: "Real-time trick-taking for 2–8 players",
    href: "https://skull.tabledeck.us",
  },
  {
    id: "kings-cribbage",
    title: "King's Cribbage",
    description: "Classic cribbage, played online with friends",
    href: "https://kingscrib.tabledeck.us",
  },
  {
    id: "battleship",
    title: "Battleship",
    description: "Naval strategy — sink the fleet",
    href: "https://battleship.tabledeck.us",
  },
  {
    id: "game-of-things",
    title: "Game of Things",
    description: "The party game of outrageous answers",
    href: "https://things.tabledeck.us",
  },
  {
    id: "scoreboard",
    title: "Scoreboard",
    description: "Live scores for any game",
    href: "https://score.tabledeck.us",
  },
] as const;

function GameCrest({ id, size }: { id: string; size: number }) {
  if (id === "skull-king") return <SkullKingCrest size={size} />;
  if (id === "kings-cribbage") return <KingsCribbageCrest size={size} />;
  if (id === "battleship") return <BattleshipCrest size={size} />;
  if (id === "game-of-things") return <GameOfThingsCrest size={size} />;
  if (id === "scoreboard") return <ScoreboardCrest size={size} />;
  return null;
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const displayName = user.name || user.email;

  return (
    <div className="td-surface flex flex-col items-center justify-center p-4 py-12">
      {/* Back link */}
      <div className="w-full max-w-md mb-5">
        <a
          href="/"
          className="font-serif"
          style={{
            fontVariant: "small-caps",
            fontSize: "12px",
            letterSpacing: "0.22em",
            color: "rgba(244,233,208,0.45)",
            textDecoration: "none",
          }}
        >
          &larr; Home
        </a>
      </div>

      {/* Parchment profile card */}
      <div className="td-auth-card" style={{ maxWidth: "460px" }}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-1">
          <CardFanIcon size={44} />
          <h1
            className="font-serif font-semibold"
            style={{
              fontSize: "26px",
              fontStyle: "italic",
              color: "#1a1612",
              letterSpacing: "0.01em",
            }}
          >
            {displayName}
          </h1>
          {user.name && (
            <p
              className="font-mono"
              style={{ fontSize: "12px", color: "rgba(26,22,18,0.55)" }}
            >
              {user.email}
            </p>
          )}
        </div>

        <hr className="td-gold-rule" />

        {/* Games section */}
        <p
          className="font-serif mb-3"
          style={{
            fontVariant: "small-caps",
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            color: "rgba(26,22,18,0.5)",
          }}
        >
          Your Games
        </p>

        <div className="flex flex-col gap-2">
          {GAMES.map((game) => (
            <a
              key={game.id}
              href={game.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "6px",
                background: "rgba(26,22,18,0.04)",
                border: "1px solid rgba(26,22,18,0.1)",
                textDecoration: "none",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,162,74,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,162,74,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(26,22,18,0.04)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(26,22,18,0.1)";
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <GameCrest id={game.id} size={28} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="font-serif font-semibold"
                  style={{ fontSize: "14px", color: "#1a1612", fontStyle: "italic" }}
                >
                  {game.title}
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: "11.5px", color: "rgba(26,22,18,0.55)" }}
                >
                  {game.description}
                </p>
              </div>
              <span
                className="font-sans"
                style={{ fontSize: "11px", color: "#8b6a1e", flexShrink: 0 }}
              >
                Play &rarr;
              </span>
            </a>
          ))}
        </div>

        <hr className="td-gold-rule" />

        {/* Sign out */}
        <div className="text-center">
          <a
            href="/logout"
            className="font-serif"
            style={{
              fontVariant: "small-caps",
              fontSize: "12px",
              letterSpacing: "0.22em",
              color: "rgba(26,22,18,0.45)",
              textDecoration: "none",
              borderBottom: "1px dashed rgba(26,22,18,0.25)",
              paddingBottom: "1px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#6b1a21";
              (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "#6b1a21";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(26,22,18,0.45)";
              (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "rgba(26,22,18,0.25)";
            }}
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}
