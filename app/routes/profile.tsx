import type { ReactNode } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/profile";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { CardFanIcon } from "~/components/crests/CardFanIcon";
import { GameCrest } from "~/components/crests/GameCrest";
import { FavoriteGameButton } from "~/components/account/FavoriteGameButton";
import { GAMES } from "~/domain/game-catalog";
import { getAccountDashboardData } from "~/domain/platform.server";
import type { UserTableSummary } from "~/domain/platform-shared";

export function meta() {
  return [{ title: "Profile — Tabledeck" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  if (!user) throw redirect("/login");
  const dashboard = await getAccountDashboardData(context, user.id);
  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...dashboard,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <p
        className="font-serif mb-3"
        style={{
          fontVariant: "small-caps",
          fontSize: "11.5px",
          letterSpacing: "0.3em",
          color: "rgba(26,22,18,0.5)",
        }}
      >
        {title}
      </p>
      {children}
      <hr className="td-gold-rule" />
    </>
  );
}

function TableRow({ table }: { table: UserTableSummary }) {
  return (
    <a
      href={table.tableHref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "6px",
        background: "rgba(26,22,18,0.04)",
        border: "1px solid rgba(26,22,18,0.1)",
        textDecoration: "none",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <GameCrest id={table.gameKey} size={28} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="font-serif font-semibold"
          style={{ fontSize: "14px", color: "#1a1612", fontStyle: "italic" }}
        >
          {table.gameTitle}
        </p>
        <p
          className="font-sans"
          style={{ fontSize: "11.5px", color: "rgba(26,22,18,0.55)" }}
        >
          {table.statusLabel} · {table.seatLabel} · {table.activityLabel}
        </p>
      </div>
      <span
        className="font-sans"
        style={{ fontSize: "11px", color: "#8b6a1e", flexShrink: 0 }}
      >
        {table.canRejoin ? "Rejoin &rarr;" : "Open &rarr;"}
      </span>
    </a>
  );
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user, favoriteGameKeys, activeTables, recentTables } = loaderData;
  const displayName = user.name || user.email;
  const favoriteSet = new Set(favoriteGameKeys);

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

        <Section title="Favorite Games">
          <div className="flex flex-col gap-2 mb-5">
            {GAMES.map((game) => (
              <div
                key={game.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  background: favoriteSet.has(game.id)
                    ? "rgba(201,162,74,0.12)"
                    : "rgba(26,22,18,0.04)",
                  border: favoriteSet.has(game.id)
                    ? "1px solid rgba(201,162,74,0.36)"
                    : "1px solid rgba(26,22,18,0.1)",
                }}
              >
                <a
                  href={game.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    minWidth: 0,
                    textDecoration: "none",
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
                </a>
                <FavoriteGameButton
                  gameKey={game.id}
                  isFavorite={favoriteSet.has(game.id)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Rejoin Active Tables">
          <div className="flex flex-col gap-2 mb-5">
            {activeTables.length > 0 ? (
              activeTables.map((table) => (
                <TableRow key={`${table.gameKey}-${table.tableId}`} table={table} />
              ))
            ) : (
              <p
                className="font-sans mb-5"
                style={{ fontSize: "12px", color: "rgba(26,22,18,0.6)" }}
              >
                Your in-progress tables will appear here once you join a game with your account.
              </p>
            )}
          </div>
        </Section>

        <Section title="Recent Tables">
          <div className="flex flex-col gap-2 mb-5">
            {recentTables.length > 0 ? (
              recentTables.map((table) => (
                <TableRow key={`${table.gameKey}-${table.tableId}`} table={table} />
              ))
            ) : (
              <p
                className="font-sans mb-5"
                style={{ fontSize: "12px", color: "rgba(26,22,18,0.6)" }}
              >
                We will keep a short history of your recent seats so you can get back to the right table quickly.
              </p>
            )}
          </div>
        </Section>

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
