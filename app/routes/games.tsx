import type { Route } from "./+types/games";
import { GAMES } from "~/domain/game-catalog";
import { gameHowToPath, gameLandingPath } from "~/domain/game-pages";
import { gamesIndexSeo, gamesItemListJsonLd, pageMeta, websiteJsonLd } from "~/domain/seo";
import { getOptionalUserFromContext } from "~/domain/utils/global-context.server";
import { GameCrest } from "~/components/crests/GameCrest";
import { BtnPrimary } from "~/components/tabledeck/BtnPrimary";
import { BtnSecondary } from "~/components/tabledeck/BtnSecondary";
import { SiteChrome } from "~/components/tabledeck/SiteChrome";
import { JsonLd } from "~/components/seo/JsonLd";

export function meta() {
  return pageMeta(gamesIndexSeo());
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getOptionalUserFromContext(context);
  return {
    user: user ? { name: user.name, email: user.email } : null,
  };
}

export default function GamesIndex({ loaderData }: Route.ComponentProps) {
  return (
    <SiteChrome user={loaderData.user}>
      <main id="content" className="w-full max-w-6xl mx-auto px-4 pt-10 pb-16">
        <header className="max-w-3xl mb-10">
          <p
            className="font-serif mb-3"
            style={{
              fontVariant: "small-caps",
              letterSpacing: "0.32em",
              fontSize: "12px",
              color: "rgba(232,200,114,0.75)",
            }}
          >
            The shelf
          </p>
          <h1
            className="font-serif font-semibold italic leading-tight mb-4"
            style={{ fontSize: "clamp(40px, 6vw, 64px)", color: "#f4e9d0" }}
          >
            Online board games to play with friends
          </h1>
          <p
            className="font-sans"
            style={{ fontSize: "17px", lineHeight: 1.6, color: "rgba(244,233,208,0.78)" }}
          >
            Tabledeck is a free set of tables you open in the browser. Pick a game, share the link, and play. Each game below has a short guide and a how-to-play page, plus the live table on its own address.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GAMES.map((game) => (
            <article
              key={game.id}
              className="t-paper"
              style={{
                backgroundColor: "rgba(244,233,208,0.96)",
                borderRadius: 10,
                border: "1px solid rgba(200,185,143,0.6)",
                padding: "22px 20px",
                color: "#1a1612",
              }}
            >
              <div className="flex items-start gap-4">
                <GameCrest id={game.id} size={56} />
                <div>
                  <h2 className="font-serif italic" style={{ fontSize: "28px", margin: "0 0 6px" }}>
                    <a href={gameLandingPath(game.id)} style={{ color: "#1a1612", textDecoration: "none" }}>
                      {game.title}
                    </a>
                  </h2>
                  <p className="font-sans" style={{ fontSize: "15px", lineHeight: 1.5, marginTop: 0 }}>
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <BtnPrimary href={game.href}>Play</BtnPrimary>
                    <BtnSecondary href={gameHowToPath(game.id)}>How to play</BtnSecondary>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={gamesItemListJsonLd()} />
    </SiteChrome>
  );
}
