import type { Route } from "./+types/_index";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { BtnPrimary } from "~/components/tabledeck/BtnPrimary";
import { BtnSecondary } from "~/components/tabledeck/BtnSecondary";
import { GameCard } from "~/components/tabledeck/GameCard";
import { SkullKingCrest } from "~/components/crests/SkullKingCrest";
import { KingsCribbageCrest } from "~/components/crests/KingsCribbageCrest";
import { BattleshipCrest } from "~/components/crests/BattleshipCrest";
import { GameOfThingsCrest } from "~/components/crests/GameOfThingsCrest";
import { ScoreboardCrest } from "~/components/crests/ScoreboardCrest";
import { CardFanIcon } from "~/components/crests/CardFanIcon";

export function meta() {
  return [
    { title: "Tabledeck — Play Board Games Online with Friends" },
    { name: "description", content: "Free online tabletop games — play Skull King, King's Cribbage, Battleship, Game of Things, and more with friends from anywhere. No download required." },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Tabledeck" },
    { property: "og:title", content: "Tabledeck — Play Board Games Online with Friends" },
    { property: "og:description", content: "Free online tabletop games — play Skull King, King's Cribbage, Battleship, Game of Things, and more with friends from anywhere. No download required." },
    { property: "og:url", content: "https://tabledeck.us" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Tabledeck — Play Board Games Online with Friends" },
    { name: "twitter:description", content: "Free online tabletop games — play Skull King, King's Cribbage, and more with friends." },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: "https://tabledeck.us" },
];

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  return { user: user ? { name: user.name, email: user.email } : null };
}

const GAMES = [
  {
    id: "skull-king",
    title: "Skull King",
    description: "Real-time trick-taking for 2–8 players",
    href: "https://skull.tabledeck.us",
    live: true,
  },
  {
    id: "kings-cribbage",
    title: "King's Cribbage",
    description: "Classic cribbage, played online with friends",
    href: "https://kingscrib.tabledeck.us",
    live: true,
  },
  {
    id: "battleship",
    title: "Battleship",
    description: "Naval strategy — sink the fleet before they sink yours",
    href: "https://battleship.tabledeck.us",
    live: true,
  },
  {
    id: "game-of-things",
    title: "Game of Things",
    description: "The party game of outrageous answers",
    href: "https://things.tabledeck.us",
    live: true,
  },
  {
    id: "scoreboard",
    title: "Scoreboard",
    description: "Live scores for any game — hearts, golf, anything with rounds",
    href: "https://score.tabledeck.us",
    live: true,
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

export default function Index({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(255, 230, 180, 0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%),
          repeating-linear-gradient(92deg, #0c1a2e 0px, #0f1d33 2px, #0d1b30 4px, #101e34 6px),
          #0f1d33
        `,
      }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 pt-5 pb-2 max-w-6xl mx-auto w-full">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <CardFanIcon size={36} />
          <span
            className="font-serif font-semibold italic leading-none"
            style={{
              fontSize: "22px",
              color: "#e8c872",
              textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 0 18px rgba(201,162,74,0.2)",
              letterSpacing: "0.01em",
            }}
          >
            Tabledeck
          </span>
        </div>

        {/* Auth links */}
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <a
                href="/profile"
                className="font-serif text-sm"
                style={{
                  fontVariant: "small-caps",
                  letterSpacing: "0.18em",
                  color: "rgba(244,233,208,0.75)",
                  textDecoration: "none",
                }}
              >
                {user.name || user.email}
              </a>
              <a
                href="/logout"
                className="font-serif text-sm"
                style={{
                  fontVariant: "small-caps",
                  letterSpacing: "0.18em",
                  color: "rgba(244,233,208,0.45)",
                  textDecoration: "none",
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="font-serif text-sm"
                style={{
                  fontVariant: "small-caps",
                  letterSpacing: "0.18em",
                  color: "rgba(244,233,208,0.7)",
                  textDecoration: "none",
                }}
              >
                Login
              </a>
              <BtnPrimary href="/signup">Sign up</BtnPrimary>
            </>
          )}
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="mb-5">
          <CardFanIcon size={72} />
        </div>

        {/* Gold-foil wordmark */}
        <h1
          className="font-serif font-semibold italic leading-none mb-3"
          style={{
            fontSize: "clamp(52px, 8vw, 88px)",
            color: "#e8c872",
            textShadow:
              "0 2px 0 rgba(0,0,0,0.5), 0 0 40px rgba(201,162,74,0.3), 0 0 80px rgba(201,162,74,0.1)",
            letterSpacing: "0.01em",
          }}
        >
          Tabledeck
        </h1>

        {/* Small-caps subtitle */}
        <p
          className="font-serif mb-4"
          style={{
            fontVariant: "small-caps",
            fontWeight: 500,
            fontSize: "13px",
            letterSpacing: "0.42em",
            color: "rgba(244,233,208,0.55)",
          }}
        >
          Tabletop &middot; Played Together
        </p>

        {/* Caveat script flavor line */}
        <p
          className="font-script"
          style={{
            fontSize: "22px",
            color: "rgba(244,233,208,0.65)",
            fontWeight: 500,
          }}
        >
          pull up a chair.
        </p>
      </section>

      {/* ── Game gallery ── */}
      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full max-w-6xl">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              live={game.live}
              href={game.href}
            >
              {/* Card face */}
              <div className="flex flex-col items-center p-6 gap-4">
                {/* Crest */}
                <div
                  className="flex items-center justify-center"
                  style={{ minHeight: "72px" }}
                >
                  <GameCrest id={game.id} size={64} />
                </div>

                {/* Title */}
                <h2
                  className="font-serif font-semibold italic text-center leading-tight"
                  style={{
                    fontSize: "22px",
                    color: "#1a1612",
                    letterSpacing: "0.01em",
                  }}
                >
                  {game.title}
                </h2>

                {/* Description */}
                <p
                  className="font-sans text-center leading-snug"
                  style={{
                    fontSize: "12.5px",
                    color: "rgba(26,22,18,0.65)",
                  }}
                >
                  {game.description}
                </p>

                {/* CTA chip */}
                <div className="mt-auto pt-2">
                  {game.live ? (
                    <span className="td-btn-primary" style={{ fontSize: "11.5px", padding: "7px 16px" }}>
                      Play &rarr;
                    </span>
                  ) : (
                    <span className="td-btn-secondary" style={{ fontSize: "11px", padding: "7px 14px", opacity: 0.7 }}>
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </GameCard>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="text-center py-5 px-4"
        style={{ borderTop: "1px solid rgba(201,162,74,0.12)" }}
      >
        {/* rivet ornament */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} width="6" height="6" viewBox="0 0 6 6" aria-hidden="true">
              <circle cx="3" cy="3" r="2.5" fill="none" stroke="rgba(201,162,74,0.3)" strokeWidth="0.8" />
              <circle cx="3" cy="3" r="1" fill="rgba(201,162,74,0.25)" />
            </svg>
          ))}
        </div>

        <p
          className="font-serif"
          style={{
            fontVariant: "small-caps",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(244,233,208,0.35)",
          }}
        >
          Tabledeck &middot; 2026 &middot; Made for the Table
        </p>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tabledeck",
            url: "https://tabledeck.us",
            description: "Free online tabletop games — play Skull King, King's Cribbage, Battleship, Game of Things, and more with friends from anywhere.",
          }),
        }}
      />
    </div>
  );
}
