import type { ReactNode } from "react";
import type { Route } from "./+types/_index";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { BtnSecondary } from "~/components/tabledeck/BtnSecondary";
import { GameCard } from "~/components/tabledeck/GameCard";
import { SiteChrome } from "~/components/tabledeck/SiteChrome";
import { CardFanIcon } from "~/components/crests/CardFanIcon";
import { GameCrest } from "~/components/crests/GameCrest";
import { JsonLd } from "~/components/seo/JsonLd";
import { getAccountDashboardData } from "~/domain/platform.server";
import { gameHowToPath, gameLandingPath } from "~/domain/game-pages";
import {
  gamesItemListJsonLd,
  homeSeo,
  pageMeta,
  websiteJsonLd,
} from "~/domain/seo";
import {
  sortGamesForUser,
  type UserTableSummary,
} from "~/domain/platform-shared";

export function meta() {
  return pageMeta(homeSeo());
}

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
    <SiteChrome user={user}>
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
        <p
          className="font-sans mt-6 max-w-xl"
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "rgba(244,233,208,0.72)",
          }}
        >
          Tabledeck is a free place to play board and card games online with friends.
          Open a table for{" "}
          <a href="/games/skull-king" style={{ color: "#e8c872" }}>Skull King</a>,{" "}
          <a href="/games/kings-cribbage" style={{ color: "#e8c872" }}>King&apos;s Cribbage</a>,{" "}
          <a href="/games/battleship" style={{ color: "#e8c872" }}>Battleship</a>,{" "}
          <a href="/games/game-of-things" style={{ color: "#e8c872" }}>The Game of Things</a>, or a{" "}
          <a href="/games/scoreboard" style={{ color: "#e8c872" }}>shared scoreboard</a>
          , send the link, and sit down in the browser. No download.
        </p>
      </section>

      {/* ── Account layer ── */}
      <main id="content" className="flex-1 flex flex-col items-center px-4 pb-16">
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
        <section aria-labelledby="games-heading" className="w-full max-w-6xl">
          <h2
            id="games-heading"
            className="font-serif text-center mb-5"
            style={{
              fontVariant: "small-caps",
              letterSpacing: "0.28em",
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(244,233,208,0.55)",
            }}
          >
            Play online with friends
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {games.map((game) => (
              <GameCard key={game.id} live={game.live}>
                <div className="flex flex-col items-center p-6 gap-4 h-full">
                  <div
                    className="flex items-center justify-center"
                    style={{ minHeight: "72px" }}
                  >
                    <GameCrest id={game.id} size={64} />
                  </div>
                  <h3
                    className="font-serif font-semibold italic text-center leading-tight"
                    style={{
                      fontSize: "22px",
                      color: "#1a1612",
                      letterSpacing: "0.01em",
                    }}
                  >
                    <a href={gameLandingPath(game.id)} style={{ color: "#1a1612", textDecoration: "none" }}>
                      {game.title}
                    </a>
                  </h3>
                  <p
                    className="font-sans text-center leading-snug"
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(26,22,18,0.65)",
                    }}
                  >
                    {game.description}
                  </p>
                  <div className="mt-auto pt-2 flex flex-col items-center gap-2">
                    <a href={game.href} className="td-btn-primary" style={{ fontSize: "11.5px", padding: "7px 16px" }}>
                      Play
                    </a>
                    <a href={gameHowToPath(game.id)} className="font-sans" style={{ fontSize: "12px", color: "#8b6a1e" }}>
                      How to play
                    </a>
                  </div>
                </div>
              </GameCard>
            ))}
          </div>
        </section>
      </main>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={gamesItemListJsonLd()} />
    </SiteChrome>
  );
}
