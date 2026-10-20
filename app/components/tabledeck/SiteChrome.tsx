import type { ReactNode } from "react";
import { GAMES } from "~/domain/game-catalog";
import { gameHowToPath, gameLandingPath } from "~/domain/game-pages";
import { CardFanIcon } from "~/components/crests/CardFanIcon";
import { BtnPrimary } from "./BtnPrimary";

export interface ChromeUser {
  name: string;
  email: string;
}

const navyBackground = `
  radial-gradient(ellipse at 50% 30%, rgba(255, 230, 180, 0.04) 0%, transparent 55%),
  radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%),
  repeating-linear-gradient(92deg, #0c1a2e 0px, #0f1d33 2px, #0d1b30 4px, #101e34 6px),
  #0f1d33
`;

export function SiteChrome({
  user,
  children,
}: {
  user: ChromeUser | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: navyBackground }}>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-amber-100 focus:px-3 focus:py-2 focus:text-stone-900"
      >
        Skip to content
      </a>
      <header className="flex items-center justify-between px-6 pt-5 pb-2 max-w-6xl mx-auto w-full gap-4">
        <a href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <CardFanIcon size={36} />
          <span
            className="font-serif font-semibold italic leading-none"
            style={{
              fontSize: "22px",
              color: "#e8c872",
              textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 0 18px rgba(201,162,74,0.2)",
            }}
          >
            Tabledeck
          </span>
        </a>
        <nav aria-label="Account" className="flex items-center gap-4">
          <a
            href="/games"
            className="font-serif text-sm"
            style={{
              fontVariant: "small-caps",
              letterSpacing: "0.18em",
              color: "rgba(244,233,208,0.75)",
              textDecoration: "none",
            }}
          >
            Games
          </a>
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
      {children}
      <footer
        className="mt-auto text-center py-8 px-4"
        style={{ borderTop: "1px solid rgba(201,162,74,0.12)" }}
      >
        <nav aria-label="Games" className="max-w-3xl mx-auto mb-5">
          <ul
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 list-none p-0 m-0"
          >
            {GAMES.map((game) => (
              <li key={game.id}>
                <a
                  href={gameLandingPath(game.id)}
                  className="font-serif"
                  style={{
                    fontSize: "15px",
                    color: "rgba(244,233,208,0.72)",
                    textDecoration: "none",
                  }}
                >
                  {game.title}
                </a>
                <span style={{ color: "rgba(244,233,208,0.28)" }} aria-hidden="true">
                  {" "}
                  ·{" "}
                </span>
                <a
                  href={gameHowToPath(game.id)}
                  className="font-sans"
                  style={{
                    fontSize: "12px",
                    color: "rgba(244,233,208,0.45)",
                    textDecoration: "none",
                  }}
                >
                  How to play
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p
          className="font-serif"
          style={{
            fontVariant: "small-caps",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(244,233,208,0.35)",
          }}
        >
          Tabledeck · 2026 · Made for the Table
        </p>
      </footer>
    </div>
  );
}
