import { GAMES, type GameKey } from "~/domain/game-catalog";
import {
  gameHowToPath,
  gameLandingPath,
  gamePlayUrl,
  getGamePage,
} from "~/domain/game-pages";
import {
  breadcrumbJsonLd,
  gameApplicationJsonLd,
  howToJsonLd,
} from "~/domain/seo";
import { absoluteUrl } from "~/domain/site";
import { GameCrest } from "~/components/crests/GameCrest";
import { BtnPrimary } from "~/components/tabledeck/BtnPrimary";
import { BtnSecondary } from "~/components/tabledeck/BtnSecondary";
import { SiteChrome, type ChromeUser } from "~/components/tabledeck/SiteChrome";
import { JsonLd } from "./JsonLd";

export function GamePageView({
  mode,
  gameKey,
  user,
}: {
  mode: "landing" | "howto";
  gameKey: GameKey;
  user: ChromeUser | null;
}) {
  const page = getGamePage(gameKey);
  const playUrl = gamePlayUrl(gameKey);
  const crumbs = [
    { name: "Tabledeck", href: "/" },
    { name: "Games", href: "/games" },
    { name: GAMES.find((game) => game.id === gameKey)!.title, href: gameLandingPath(gameKey) },
  ];
  if (mode === "howto") {
    crumbs.push({ name: "How to play", href: gameHowToPath(gameKey) });
  }

  const h1 = mode === "landing" ? page.landingH1 : page.howToH1;
  const jsonLd =
    mode === "landing"
      ? [gameApplicationJsonLd(gameKey), breadcrumbJsonLd(crumbs.map((crumb) => ({ name: crumb.name, url: absoluteUrl(crumb.href) })))]
      : [howToJsonLd(gameKey), breadcrumbJsonLd(crumbs.map((crumb) => ({ name: crumb.name, url: absoluteUrl(crumb.href) })))];

  return (
    <SiteChrome user={user}>
      <main id="content" className="w-full max-w-3xl mx-auto px-4 pt-8 pb-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" style={{ color: "rgba(244,233,208,0.35)" }}>
                      /
                    </span>
                  )}
                  {last ? (
                    <span className="font-sans" style={{ fontSize: "13px", color: "rgba(244,233,208,0.8)" }}>
                      {crumb.name}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="font-sans"
                      style={{ fontSize: "13px", color: "rgba(244,233,208,0.55)", textDecoration: "none" }}
                    >
                      {crumb.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <header className="mb-8">
          <div className="mb-4">
            <GameCrest id={gameKey} size={72} />
          </div>
          <p
            className="font-serif mb-3"
            style={{
              fontVariant: "small-caps",
              letterSpacing: "0.28em",
              fontSize: "12px",
              color: "rgba(232,200,114,0.8)",
            }}
          >
            {page.playersLabel}
          </p>
          <h1
            className="font-serif font-semibold italic leading-tight mb-4"
            style={{ fontSize: "clamp(36px, 6vw, 58px)", color: "#f4e9d0" }}
          >
            {h1}
          </h1>
          <p
            className="font-sans mb-6"
            style={{ fontSize: "17px", lineHeight: 1.55, color: "rgba(244,233,208,0.78)", maxWidth: "40rem" }}
          >
            {page.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            <BtnPrimary href={playUrl}>Play {GAMES.find((game) => game.id === gameKey)!.title}</BtnPrimary>
            {mode === "landing" ? (
              <BtnSecondary href={gameHowToPath(gameKey)}>How to play</BtnSecondary>
            ) : (
              <BtnSecondary href={gameLandingPath(gameKey)}>About this game</BtnSecondary>
            )}
          </div>
        </header>

        <article
          className="t-paper"
          style={{
            backgroundColor: "rgba(244,233,208,0.96)",
            borderRadius: 10,
            border: "1px solid rgba(200,185,143,0.6)",
            boxShadow: "0 10px 22px rgba(0,0,0,0.24)",
            padding: "28px 24px 12px",
            color: "#1a1612",
          }}
        >
          {mode === "landing" ? <LandingBody gameKey={gameKey} /> : <HowToBody gameKey={gameKey} />}
        </article>

        <section aria-labelledby="more-games" className="mt-10">
          <h2
            id="more-games"
            className="font-serif italic mb-3"
            style={{ fontSize: "22px", color: "#e8c872" }}
          >
            More games
          </h2>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {GAMES.filter((game) => game.id !== gameKey).map((game) => (
              <li key={game.id}>
                <a
                  href={gameLandingPath(game.id)}
                  className="font-serif"
                  style={{ color: "rgba(244,233,208,0.8)", textDecoration: "none", fontSize: "18px" }}
                >
                  {game.title}
                </a>
                <span style={{ color: "rgba(244,233,208,0.4)" }}> · </span>
                <a
                  href={game.href}
                  className="font-sans"
                  style={{ color: "rgba(232,200,114,0.8)", fontSize: "13px" }}
                >
                  Play
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
    </SiteChrome>
  );
}

function LandingBody({ gameKey }: { gameKey: GameKey }) {
  const page = getGamePage(gameKey);
  return (
    <>
      {page.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="font-sans" style={{ fontSize: "16px", lineHeight: 1.6, marginTop: 0 }}>
          {paragraph}
        </p>
      ))}
      {page.highlights.map((highlight) => (
        <section key={highlight.title}>
          <h2 className="font-serif italic" style={{ fontSize: "26px", marginBottom: 6 }}>
            {highlight.title}
          </h2>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: 1.6 }}>
            {highlight.body}
          </p>
        </section>
      ))}
      <p className="font-sans" style={{ fontSize: "15px" }}>
        <a href={gameHowToPath(gameKey)} style={{ color: "#8b6a1e" }}>
          Read the full how-to-play
        </a>
      </p>
    </>
  );
}

function HowToBody({ gameKey }: { gameKey: GameKey }) {
  const page = getGamePage(gameKey);
  return (
    <>
      <h2 className="font-serif italic" style={{ fontSize: "28px", marginTop: 0 }}>
        Steps
      </h2>
      <ol className="list-decimal pl-5">
        {page.steps.map((step, index) => (
          <li id={`step-${index + 1}`} key={step.name} className="mb-4">
            <h3 className="font-serif" style={{ fontSize: "22px", margin: "0 0 4px" }}>
              {step.name}
            </h3>
            <p className="font-sans" style={{ fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              {step.text}
            </p>
          </li>
        ))}
      </ol>
      <h2 className="font-serif italic" style={{ fontSize: "28px" }}>
        Scoring
      </h2>
      {page.scoring.map((rule) => (
        <section key={rule.title}>
          <h3 className="font-serif" style={{ fontSize: "22px", marginBottom: 4 }}>
            {rule.title}
          </h3>
          <p className="font-sans" style={{ fontSize: "16px", lineHeight: 1.6 }}>
            {rule.body}
          </p>
        </section>
      ))}
      <h2 className="font-serif italic" style={{ fontSize: "28px" }}>
        Before you sit down
      </h2>
      <ul className="list-disc pl-5">
        {page.notes.map((note) => (
          <li key={note.slice(0, 32)} className="font-sans mb-2" style={{ fontSize: "16px", lineHeight: 1.55 }}>
            {note}
          </li>
        ))}
      </ul>
    </>
  );
}
