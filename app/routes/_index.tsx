import type { ReactNode } from "react";
import type { Route } from "./+types/_index";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { BtnPrimary } from "~/components/tabledeck/BtnPrimary";
import { BtnSecondary } from "~/components/tabledeck/BtnSecondary";
import { GameCard } from "~/components/tabledeck/GameCard";
import { CardFanIcon } from "~/components/crests/CardFanIcon";
import { GameCrest } from "~/components/crests/GameCrest";
import { getAccountDashboardData } from "~/domain/platform.server";
import {
  sortGamesForUser,
  type UserTableSummary,
} from "~/domain/platform-shared";

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
  if (!user) {
    return {
      user: null,
      favoriteGames: [],
      favoriteGameKeys: [],
      activeTables: [],
      recentTables: [],
    };
  }

  const dashboard = await getAccountDashboardData(context, user.id);
  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...dashboard,
  };
}

function DashboardPanel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section
      className="t-paper"
      style={{
        backgroundColor: "rgba(244,233,208,0.96)",
        borderRadius: 10,
        border: "1px solid rgba(200,185,143,0.6)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.24)",
        padding: "18px 18px 16px",
      }}
    >
      <p
        className="font-serif"
        style={{
          fontVariant: "small-caps",
          fontSize: "11px",
          letterSpacing: "0.26em",
          color: "rgba(26,22,18,0.48)",
          marginBottom: 6,
        }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-serif font-semibold"
        style={{
          fontSize: "22px",
          fontStyle: "italic",
          color: "#1a1612",
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function TableLink({ table }: { table: UserTableSummary }) {
  return (
    <a
      href={table.tableHref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 12px",
        borderRadius: 8,
        border: "1px solid rgba(26,22,18,0.1)",
        background: "rgba(255,255,255,0.3)",
        textDecoration: "none",
      }}
    >
      <GameCrest id={table.gameKey} size={28} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="font-serif font-semibold"
          style={{ fontSize: "15px", color: "#1a1612", fontStyle: "italic" }}
        >
          {table.gameTitle}
        </p>
        <p
          className="font-sans"
          style={{ fontSize: "11.5px", color: "rgba(26,22,18,0.6)" }}
        >
          {table.statusLabel} · {table.seatLabel} · {table.activityLabel}
        </p>
      </div>
      <span
        className="font-sans"
        style={{ fontSize: "11px", color: "#8b6a1e", flexShrink: 0 }}
      >
        {table.canRejoin ? "Rejoin ->" : "View ->"}
      </span>
    </a>
  );
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { user, favoriteGames, favoriteGameKeys, activeTables, recentTables } =
    loaderData;
  const games = sortGamesForUser(favoriteGameKeys);

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

      {/* ── Account layer ── */}
      <main className="flex-1 flex flex-col items-center px-4 pb-16">
        {user && (
          <div className="w-full max-w-6xl mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DashboardPanel
              eyebrow="Pick Up Where You Left Off"
              title="Active Tables"
            >
              <div className="flex flex-col gap-2">
                {activeTables.length > 0 ? (
                  activeTables.map((table) => (
                    <TableLink key={`${table.gameKey}-${table.tableId}`} table={table} />
                  ))
                ) : (
                  <p
                    className="font-sans"
                    style={{ fontSize: "13px", color: "rgba(26,22,18,0.64)" }}
                  >
                    Your live tables will show up here once you join a game.
                  </p>
                )}
              </div>
            </DashboardPanel>

            <DashboardPanel eyebrow="Your Shelf" title="Favorite Games">
              {favoriteGames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {favoriteGames.map((game) => (
                    <a
                      key={game.id}
                      href={game.href}
                      className="td-btn-secondary"
                      style={{ fontSize: "11px", padding: "8px 14px" }}
                    >
                      {game.title}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p
                    className="font-sans"
                    style={{ fontSize: "13px", color: "rgba(26,22,18,0.64)" }}
                  >
                    Mark favorites from your profile and they will stay pinned at the top of your deck.
                  </p>
                  <BtnSecondary href="/profile">Manage Favorites</BtnSecondary>
                </div>
              )}
            </DashboardPanel>

            <DashboardPanel eyebrow="Recent Play" title="Recently Played">
              <div className="flex flex-col gap-2">
                {recentTables.length > 0 ? (
                  recentTables.slice(0, 4).map((table) => (
                    <TableLink key={`${table.gameKey}-${table.tableId}`} table={table} />
                  ))
                ) : (
                  <p
                    className="font-sans"
                    style={{ fontSize: "13px", color: "rgba(26,22,18,0.64)" }}
                  >
                    Once you sit at a Tabledeck game, your recent tables will be waiting here for a quick return.
                  </p>
                )}
              </div>
            </DashboardPanel>
          </div>
        )}

        {/* ── Game gallery ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full max-w-6xl">
          {games.map((game) => (
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
